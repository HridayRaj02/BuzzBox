// Public discovery controller: lists and reads published events.
const { parseLimit, publicEvent, singleQueryValue } = require("./helpers");

function createEventController({ events, EventCategory }) {
  return {
    list: async (req, res, next) => {
      const search = singleQueryValue(req.query.search);
      const cityId = singleQueryValue(req.query.cityId);
      const category = singleQueryValue(req.query.category);
      const when = singleQueryValue(req.query.when);
      const cursor = singleQueryValue(req.query.cursor);
      const limit = parseLimit(singleQueryValue(req.query.limit));
      if (limit === null) return res.status(400).json({ error: "limit must be an integer between 1 and 100" });
      if (category && !Object.values(EventCategory).includes(category)) return res.status(400).json({ error: "category must be a valid event category" });
      if (when && !["tonight", "weekend", "all"].includes(when)) return res.status(400).json({ error: "when must be tonight, weekend, or all" });
      try { res.json((await events.listEvents({ search, cityId, category, when, cursor, limit })).map(publicEvent)); } catch (error) { next(error); }
    },
    featured: async (req, res, next) => {
      const cityId = singleQueryValue(req.query.cityId);
      if (!cityId) return res.status(400).json({ error: "cityId is required" });
      try { res.json((await events.getFeaturedEvents(cityId)).map(publicEvent)); } catch (error) { next(error); }
    },
    getBySlug: async (req, res, next) => {
      try {
        const event = await events.getEventBySlug(req.params.slug);
        if (!event) return res.status(404).json({ error: "Event not found." });
        return res.json(publicEvent(event));
      } catch (error) { return next(error); }
    },
  };
}

module.exports = { createEventController };
