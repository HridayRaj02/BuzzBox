import { randomUUID } from "node:crypto";
import { BookingStatus, EventCategory, EventStatus, EventVisibility, Prisma } from "../generated/prisma/client";
import { prisma } from "./prisma";

export { EventCategory };

export type EventListOptions = {
  cityId?: string;
  category?: EventCategory;
  when?: "tonight" | "weekend" | "all";
  search?: string;
  cursor?: string;
  limit?: number;
};

function matchingCategories(search: string): EventCategory[] {
  const normalizedSearch = search.toLowerCase().replace(/[_\s-]+/g, " ");
  return Object.values(EventCategory).filter((category) =>
    category.toLowerCase().replace(/_/g, " ").includes(normalizedSearch),
  );
}

export type BookingRequestItem = { tierId: string; quantity: number };
export type BookingErrorCode = "INVALID_QUANTITY" | "TIER_UNAVAILABLE" | "MAX_PER_ORDER" | "EVENT_UNAVAILABLE";
export class BookingError extends Error {
  constructor(public readonly code: BookingErrorCode, message: string) { super(message); this.name = "BookingError"; }
}

function dateWindow(when: EventListOptions["when"]): { gte?: Date; lt?: Date } {
  if (!when || when === "all") return {};
  const now = new Date();
  const delhiOffsetMs = 330 * 60 * 1000;
  const localNow = new Date(now.getTime() + delhiOffsetMs);
  const localMidnight = Date.UTC(localNow.getUTCFullYear(), localNow.getUTCMonth(), localNow.getUTCDate());
  const dayStart = new Date(localMidnight - delhiOffsetMs);
  if (when === "tonight") return { gte: now, lt: new Date(dayStart.getTime() + 86400000) };
  const day = localNow.getUTCDay();
  const daysToFriday = (5 - day + 7) % 7;
  const friday = new Date(dayStart.getTime() + daysToFriday * 86400000);
  return { gte: now > friday ? now : friday, lt: new Date(friday.getTime() + 3 * 86400000) };
}

export async function listEvents(options: EventListOptions = {}) {
  const search = options.search?.trim();
  const categoryMatches = search ? matchingCategories(search) : [];
  return prisma.event.findMany({
    where: {
      status: EventStatus.PUBLISHED,
      visibility: EventVisibility.PUBLIC,
      cityId: options.cityId,
      category: options.category,
      startsAt: dateWindow(options.when),
      ...(search ? { OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { name: { contains: search, mode: "insensitive" } } },
        { venue: { name: { contains: search, mode: "insensitive" } } },
        { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
        ...(categoryMatches.length ? [{ category: { in: categoryMatches } }] : []),
      ] } : {}),
    },
    include: { venue: true, city: true, tags: true },
    orderBy: [{ startsAt: "asc" }, { id: "asc" }],
    take: Math.min(Math.max(options.limit ?? 20, 1), 100),
    ...(options.cursor ? { cursor: { id: options.cursor }, skip: 1 } : {}),
  });
}

export function getFeaturedEvents(cityId: string) {
  return prisma.event.findMany({ where: { cityId, isFeatured: true, status: EventStatus.PUBLISHED, visibility: EventVisibility.PUBLIC }, include: { venue: true, city: true, tags: true }, orderBy: { startsAt: "asc" } });
}

export function getEventBySlug(slug: string) {
  return prisma.event.findUnique({ where: { slug }, include: { venue: true, city: true, host: true, artists: { include: { artist: true }, orderBy: { position: "asc" } }, ticketTiers: { where: { isActive: true }, orderBy: { position: "asc" } }, rules: { orderBy: { position: "asc" } }, images: { orderBy: { position: "asc" } }, tags: true } });
}

export async function getRelatedEvents(eventId: string, limit = 4) {
  const current = await prisma.event.findUnique({ where: { id: eventId }, select: { category: true, cityId: true } });
  if (!current) return [];
  return prisma.event.findMany({ where: { id: { not: eventId }, category: current.category, cityId: current.cityId, status: EventStatus.PUBLISHED, visibility: EventVisibility.PUBLIC }, include: { venue: true, city: true, tags: true }, orderBy: { startsAt: "asc" }, take: Math.max(0, limit) });
}

export async function toggleSaveEvent(userId: string, eventId: string, saved = true) {
  if (saved) return prisma.savedEvent.upsert({ where: { userId_eventId: { userId, eventId } }, update: {}, create: { userId, eventId } });
  await prisma.savedEvent.deleteMany({ where: { userId, eventId } });
  return null;
}

export function getSavedEvents(userId: string) {
  return prisma.savedEvent.findMany({ where: { userId }, include: { event: { include: { venue: true, city: true, tags: true } } }, orderBy: { createdAt: "desc" } });
}

export async function joinWaitlist(userId: string, eventId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.waitlistEntry.findUnique({ where: { userId_eventId: { userId, eventId } } });
    if (existing) return existing;
    const last = await tx.waitlistEntry.aggregate({ where: { eventId }, _max: { position: true } });
    return tx.waitlistEntry.create({ data: { userId, eventId, position: (last._max.position ?? 0) + 1 } });
  });
}

export async function releaseWaitlist(userId: string, eventId: string) {
  await prisma.waitlistEntry.updateMany({ where: { userId, eventId, status: { in: ["ACTIVE", "OFFERED"] } }, data: { status: "RELEASED" } });
}

export async function createBooking(userId: string, eventId: string, items: BookingRequestItem[]) {
  if (items.length === 0 || items.some((item) => !Number.isInteger(item.quantity) || item.quantity <= 0)) throw new BookingError("INVALID_QUANTITY", "Each booking item needs a positive whole-number quantity.");
  const quantitiesByTier = new Map<string, number>();
  for (const item of items) quantitiesByTier.set(item.tierId, (quantitiesByTier.get(item.tierId) ?? 0) + item.quantity);
  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({ where: { id: eventId }, select: { status: true, visibility: true } });
    if (!event || event.status !== EventStatus.PUBLISHED || event.visibility !== EventVisibility.PUBLIC) throw new BookingError("EVENT_UNAVAILABLE", "This event is not available for booking.");
    let totalAmount = 0;
    const purchaseItems: { tierId: string; quantity: number; unitPrice: number }[] = [];
    for (const [tierId, quantity] of quantitiesByTier) {
      const tier = await tx.ticketTier.findFirst({ where: { id: tierId, eventId, isActive: true } });
      if (!tier) throw new BookingError("TIER_UNAVAILABLE", "This ticket tier is not available for the event.");
      if (quantity > tier.maxPerOrder) throw new BookingError("MAX_PER_ORDER", `This ticket tier allows at most ${tier.maxPerOrder} tickets per order.`);
      const updated = await tx.ticketTier.updateMany({ where: { id: tier.id, sold: { lte: tier.quantity - quantity } }, data: { sold: { increment: quantity } } });
      if (updated.count !== 1) throw new BookingError("TIER_UNAVAILABLE", "There are not enough tickets left in this tier.");
      totalAmount += tier.price * quantity;
      purchaseItems.push({ tierId: tier.id, quantity, unitPrice: tier.price });
    }
    const booking = await tx.booking.create({ data: { reference: `BB-${randomUUID().slice(0, 8).toUpperCase()}`, qrToken: randomUUID(), userId, eventId, totalAmount, status: BookingStatus.PENDING, items: { create: purchaseItems } }, include: { items: true } });
    const activeTiers = await tx.ticketTier.findMany({ where: { eventId, isActive: true }, select: { quantity: true, sold: true } });
    if (activeTiers.length > 0 && activeTiers.every((tier) => tier.sold >= tier.quantity)) await tx.event.update({ where: { id: eventId }, data: { status: EventStatus.SOLD_OUT } });
    return booking;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
