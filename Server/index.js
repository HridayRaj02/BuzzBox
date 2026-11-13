const express = require("express")

const app = express();

function singleQueryValue(value) {
  return typeof value === "string" ? value : undefined;
}

function parseLimit(value) {
  if (value === undefined) return undefined;
  if (!/^\d+$/.test(value)) return null;
  const limit = Number(value);
  return limit >= 1 && limit <= 100 ? limit : null;
}

async function start() {
  const { EventCategory, listEvents } = await import("./lib/events.ts");

  app.get("/api/events", async (req, res, next) => {
    const search = singleQueryValue(req.query.search);
    const cityId = singleQueryValue(req.query.cityId);
    const category = singleQueryValue(req.query.category);
    const when = singleQueryValue(req.query.when);
    const cursor = singleQueryValue(req.query.cursor);
    const limit = parseLimit(singleQueryValue(req.query.limit));

    if (limit === null) return res.status(400).json({ error: "limit must be an integer between 1 and 100" });
    if (category && !Object.values(EventCategory).includes(category)) return res.status(400).json({ error: "category must be a valid event category" });
    if (when && !["tonight", "weekend", "all"].includes(when)) return res.status(400).json({ error: "when must be tonight, weekend, or all" });

    try {
      const events = await listEvents({ search, cityId, category, when, cursor, limit });
      return res.json(events);
    } catch (error) {
      return next(error);
    }
  });

  app.listen(2222, () => {
    console.log("Server is running on port 2222");
  });
}

start().catch((error) => {
  console.error("Unable to start server", error);
  process.exitCode = 1;
});


