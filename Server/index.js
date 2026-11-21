// Application entry point: creates Express, wires MVC routes, then starts the API.
const express = require("express");
const session = require('express-session');
const { createAuthController } = require("./controllers/authController");
const { createBookingController } = require("./controllers/bookingController");
const { createErrorHandler } = require("./controllers/errorController");
const { createEventController } = require("./controllers/eventController");
const { createSystemController } = require("./controllers/systemController");
const { createUserController } = require("./controllers/userController");
const { createAuthRoutes } = require("./routes/authRoutes");
const { createBookingRoutes } = require("./routes/bookingRoutes");
const { createEventRoutes } = require("./routes/eventRoutes");
const { createSystemRoutes } = require("./routes/systemRoutes");
const { createUserRoutes } = require("./routes/userRoutes");

async function start() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));

  const events = await import("./lib/events.ts");
  const auth = await import("./lib/auth.ts");
  const googleAuth = await import("./lib/googleAuth.ts");
  const { prisma } = await import("./lib/prisma.ts");

  // Controllers receive their dependencies once, keeping route files small and testable.
  // Passport uses this short-lived server session only to protect the OAuth state parameter.
  app.use(session({ secret: process.env.OAUTH_SESSION_SECRET || 'development-only-change-me', resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 10 * 60 * 1000 } }));
  app.use(googleAuth.passport.initialize());

  const authController = createAuthController({ auth, prisma, googleAuth: { configured: googleAuth.googleAuthConfigured, passport: googleAuth.passport, clientUrl: process.env.CLIENT_URL || 'http://localhost:5173' } });
  const bookingController = createBookingController({ events, prisma });
  const userController = createUserController({ auth, prisma });
  const systemController = createSystemController({ prisma });
  const eventController = createEventController({ events, EventCategory: events.EventCategory });

  app.use("/api", createSystemRoutes(systemController));
  app.use("/api", createAuthRoutes(authController));
  app.use("/api", createUserRoutes({ authController, userController, bookingController }));
  app.use("/api", createBookingRoutes({ authController, bookingController }));
  app.use("/api", createEventRoutes(eventController));
  app.use(createErrorHandler({ BookingError: events.BookingError }));

  const port = Number(process.env.PORT || 2222);
  app.listen(port, () => console.log(`BuzzBox API is running on port ${port}`));
}

start().catch((error) => {
  console.error("Unable to start server", error);
  process.exitCode = 1;
});
