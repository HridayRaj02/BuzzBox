import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { BookingError, createBooking, getEventBySlug, toggleSaveEvent } from "./events";
import { prisma } from "./prisma";

const originals: (() => void)[] = [];
function replace(target: object, key: string, value: unknown) {
  const object = target as Record<string, unknown>;
  const original = object[key];
  object[key] = value;
  originals.push(() => { object[key] = original; });
}

afterEach(() => { while (originals.length) originals.pop()?.(); });

test("getEventBySlug returns null for an unknown slug", async () => {
  replace(prisma.event, "findUnique", async () => null);
  assert.equal(await getEventBySlug("missing-event"), null);
});

test("createBooking rejects quantities beyond tier availability", async () => {
  const tier = { id: "tier-1", eventId: "event-1", isActive: true, maxPerOrder: 6, quantity: 2, sold: 2, price: 1000 };
  const tx = {
    event: { findUnique: async () => ({ status: "PUBLISHED", visibility: "PUBLIC" }) },
    ticketTier: { findFirst: async () => tier, updateMany: async () => ({ count: 0 }) },
  };
  replace(prisma, "$transaction", async (callback: (value: unknown) => Promise<unknown>) => callback(tx));
  await assert.rejects(createBooking("user-1", "event-1", [{ tierId: "tier-1", quantity: 1 }]), (error: unknown) => error instanceof BookingError && error.code === "TIER_UNAVAILABLE");
});

test("toggleSaveEvent is idempotent when saving an already saved event", async () => {
  const saved = new Set<string>();
  replace(prisma.savedEvent, "upsert", async ({ where }: { where: { userId_eventId: { userId: string; eventId: string } } }) => {
    const key = `${where.userId_eventId.userId}:${where.userId_eventId.eventId}`;
    saved.add(key);
    return { userId: where.userId_eventId.userId, eventId: where.userId_eventId.eventId };
  });
  await toggleSaveEvent("user-1", "event-1");
  await toggleSaveEvent("user-1", "event-1");
  assert.equal(saved.size, 1);
});
