// Auth controller: account creation, login, session lookup, and logout.
const { cookieOptions, parseCookies, requireBodyString } = require("./helpers");

function createAuthController({ auth, prisma, googleAuth }) {
  // Middleware shared by every route that requires a valid session cookie.
  async function requireUser(req, res, next) {
    try {
      const user = await auth.getSessionUser(parseCookies(req.headers.cookie).buzzbox_session);
      if (!user) return res.status(401).json({ error: "Sign in is required." });
      req.user = user;
      return next();
    } catch (error) { return next(error); }
  }

  return {
    requireUser,
    signup: async (req, res, next) => {
      try {
        const name = requireBodyString(req.body?.name, "name", 2, 100);
        const email = auth.normaliseEmail(requireBodyString(req.body?.email, "email", 3, 254));
        const password = requireBodyString(req.body?.password, "password", 8, 256);
        const phone = typeof req.body?.phone === "string" && req.body.phone.trim() ? requireBodyString(req.body.phone, "phone", 5, 30) : null;
        const city = await prisma.city.findFirst({ where: { isActive: true }, orderBy: { name: "asc" } });
        const user = await prisma.user.create({ data: { name, email, phone, handle: auth.createHandle(name), passwordHash: await auth.hashPassword(password), cityId: city?.id }, include: { city: { select: { id: true, name: true, slug: true } } } });
        const session = await auth.createSession(user.id);
        res.cookie("buzzbox_session", session.token, cookieOptions(session.expiresAt));
        res.status(201).json({ user: auth.toPublicUser(user) });
      } catch (error) { next(error); }
    },
    login: async (req, res, next) => {
      try {
        const email = auth.normaliseEmail(requireBodyString(req.body?.email, "email", 3, 254));
        const password = requireBodyString(req.body?.password, "password", 1, 256);
        const user = await prisma.user.findUnique({ where: { email }, include: { city: { select: { id: true, name: true, slug: true } } } });
        if (!user?.passwordHash || !(await auth.verifyPassword(password, user.passwordHash))) return res.status(401).json({ error: "Email or password is incorrect." });
        const session = await auth.createSession(user.id);
        res.cookie("buzzbox_session", session.token, cookieOptions(session.expiresAt));
        return res.json({ user: auth.toPublicUser(user) });
      } catch (error) { return next(error); }
    },
    me: (req, res) => res.json({ user: auth.toPublicUser(req.user) }),
    logout: async (req, res, next) => {
      try {
        await auth.deleteSession(parseCookies(req.headers.cookie).buzzbox_session);
        res.clearCookie("buzzbox_session", cookieOptions(new Date(0)));
        res.status(204).end();
      } catch (error) { next(error); }
    },
    googleStart: (req, res, next) => {
      if (!googleAuth.configured) return res.status(503).json({ error: 'Google sign-in is not configured. Add Google OAuth credentials to Server/.env.' })
      return googleAuth.passport.authenticate('google', { scope: ['openid', 'profile', 'email'], state: true, session: false })(req, res, next)
    },
    googleCallback: (req, res, next) => {
      if (!googleAuth.configured) return res.redirect(`${googleAuth.clientUrl}/login?oauth=unavailable`)
      return googleAuth.passport.authenticate('google', { session: false, failureRedirect: `${googleAuth.clientUrl}/login?oauth=failed` }, async (error, user) => {
        try {
          if (error) return next(error)
          if (!user) return res.redirect(`${googleAuth.clientUrl}/login?oauth=failed`)
          const session = await auth.createSession(user.id)
          res.cookie('buzzbox_session', session.token, cookieOptions(session.expiresAt))
          return res.redirect(`${googleAuth.clientUrl}/explore?oauth=success`)
        } catch (callbackError) { return next(callbackError) }
      })(req, res, next)
    },
  };
}

module.exports = { createAuthController };
