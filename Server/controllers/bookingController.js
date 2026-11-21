// Authenticated event actions: saves, waitlist entries, and reservations.
const { publicEvent } = require("./helpers");

function createBookingController({ events, prisma }) {
  return {
    listSaved: async (req, res, next) => {
      try { res.json((await events.getSavedEvents(req.user.id)).map((entry) => publicEvent(entry.event))); } catch (error) { next(error); }
    },
    save: async (req, res, next) => {
      try { await events.toggleSaveEvent(req.user.id, req.params.eventId, true); res.status(204).end(); } catch (error) { next(error); }
    },
    unsave: async (req, res, next) => {
      try { await events.toggleSaveEvent(req.user.id, req.params.eventId, false); res.status(204).end(); } catch (error) { next(error); }
    },
    listWaitlist: async (req, res, next) => {
      try {
        res.json(await prisma.waitlistEntry.findMany({ where: { userId: req.user.id, status: { in: ["ACTIVE", "OFFERED"] } }, include: { event: { include: { venue: true, city: true, tags: true } } }, orderBy: { createdAt: "desc" } }));
      } catch (error) { next(error); }
    },
    joinWaitlist: async (req, res, next) => {
      try { res.status(201).json(await events.joinWaitlist(req.user.id, req.params.eventId)); } catch (error) { next(error); }
    },
    leaveWaitlist: async (req, res, next) => {
      try { await events.releaseWaitlist(req.user.id, req.params.eventId); res.status(204).end(); } catch (error) { next(error); }
    },
    create: async (req, res, next) => {
      try {
        if (!Array.isArray(req.body?.items) || req.body.items.length > 10 || req.body.items.some((item) => !item || typeof item.tierId !== "string" || !Number.isInteger(item.quantity))) {
          return res.status(400).json({ error: "items must be an array of ticket-tier quantities." });
        }
        const booking = await events.createBooking(req.user.id, req.params.eventId, req.body.items);
        return res.status(201).json({ booking });
      } catch (error) { return next(error); }
    },
    list: async (req, res, next) => {
      try {
        res.json(await prisma.booking.findMany({ where: { userId: req.user.id }, include: { event: { include: { venue: true, city: true } }, items: { include: { tier: true } } }, orderBy: { createdAt: "desc" } }));
      } catch (error) { next(error); }
    },
  };
}

module.exports = { createBookingController };
