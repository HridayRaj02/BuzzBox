import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { BookingError, createBooking, getEventBySlug, listEvents, toggleSaveEvent } from "./events";
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

async function captureListOptions(options: Parameters<typeof listEvents>[0] = {}) {
  let query: Record<string, unknown> | undefined;
  replace(prisma.event, "findMany", async (value: Record<string, unknown>) => {
    query = value;
    return [];
  });
  await listEvents(options);
  return query!;
}

test("listEvents searches title, description, city, venue, and tags case-insensitively", async () => {
  const query = await captureListOptions({ search: "  conCert  " });
  const where = query.where as { OR: Array<Record<string, unknown>> };
  assert.deepEqual(where.OR, [
    { title: { contains: "conCert", mode: "insensitive" } },
    { description: { contains: "conCert", mode: "insensitive" } },
    { city: { name: { contains: "conCert", mode: "insensitive" } } },
    { venue: { name: { contains: "conCert", mode: "insensitive" } } },
    { tags: { some: { name: { contains: "conCert", mode: "insensitive" } } } },
  ]);
});

test("listEvents matches partial category labels", async () => {
  const query = await captureListOptions({ search: "live" });
  const where = query.where as { OR: Array<Record<string, unknown>> };
  assert.deepEqual(where.OR.at(-1), { category: { in: ["LIVE_SHOWS"] } });
});

test("listEvents omits search conditions for an empty query", async () => {
  const query = await captureListOptions({ search: "   " });
  const where = query.where as Record<string, unknown>;
  assert.equal("OR" in where, false);
  assert.equal(where.status, "PUBLISHED");
  assert.equal(where.visibility, "PUBLIC");
});

test("listEvents returns no events when the search has no matches", async () => {
  replace(prisma.event, "findMany", async () => []);
  assert.deepEqual(await listEvents({ search: "not-a-real-event" }), []);
});

test("listEvents keeps filters and cursor pagination when searching", async () => {
  const query = await captureListOptions({ search: "del", cityId: "city-1", limit: 25, cursor: "event-1", when: "all" });
  const where = query.where as Record<string, unknown>;
  assert.equal(where.cityId, "city-1");
  assert.equal(query.take, 25);
  assert.deepEqual(query.cursor, { id: "event-1" });
  assert.equal(query.skip, 1);
});
