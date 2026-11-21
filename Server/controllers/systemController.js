// Lightweight public endpoints used for health checks and city selection.
function createSystemController({ prisma }) {
  return {
    health: async (_req, res) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: "ok" });
      } catch {
        res.status(503).json({ status: "unavailable", error: "Database is not reachable." });
      }
    },
    listCities: async (_req, res, next) => {
      try {
        res.json(await prisma.city.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }));
      } catch (error) { next(error); }
    },
  };
}

module.exports = { createSystemController };
