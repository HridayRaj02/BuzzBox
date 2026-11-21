// Profile controller: updates only user-owned settings and identity fields.
const { parseStringList, requireBodyString } = require("./helpers");

function createUserController({ auth, prisma }) {
  return {
    update: async (req, res, next) => {
      try {
        const data = {};
        if (req.body.name !== undefined) data.name = requireBodyString(req.body.name, "name", 2, 100);
        if (req.body.handle !== undefined) data.handle = requireBodyString(req.body.handle, "handle", 3, 32).toLowerCase().replace(/[^a-z0-9-]/g, "");
        if (req.body.cityId !== undefined) {
          if (req.body.cityId !== null && typeof req.body.cityId !== "string") throw Object.assign(new Error("cityId must be a string or null."), { status: 400 });
          data.cityId = req.body.cityId;
        }
        if (req.body.favouriteGenres !== undefined) data.favouriteGenres = parseStringList(req.body.favouriteGenres, "favouriteGenres");
        if (req.body.cityPreferences !== undefined) data.cityPreferences = parseStringList(req.body.cityPreferences, "cityPreferences");
        if (req.body.notifications !== undefined) {
          for (const key of ["whatsappDrops", "radarAlerts", "waitlistOffers"]) {
            if (req.body.notifications[key] === undefined) continue;
            if (typeof req.body.notifications[key] !== "boolean") throw Object.assign(new Error(`${key} must be true or false.`), { status: 400 });
            data[key] = req.body.notifications[key];
          }
        }
        if (!Object.keys(data).length) return res.status(400).json({ error: "No supported updates were provided." });
        const user = await prisma.user.update({ where: { id: req.user.id }, data, include: { city: { select: { id: true, name: true, slug: true } } } });
        return res.json({ user: auth.toPublicUser(user) });
      } catch (error) { return next(error); }
    },
  };
}

module.exports = { createUserController };
