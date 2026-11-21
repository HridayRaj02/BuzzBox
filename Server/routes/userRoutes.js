// Route declarations for the currently signed-in user's profile data.
const express = require("express");

function createUserRoutes({ authController, userController, bookingController }) {
  const router = express.Router();
  router.patch("/me", authController.requireUser, userController.update);
  router.get("/me/saved-events", authController.requireUser, bookingController.listSaved);
  router.get("/me/waitlist", authController.requireUser, bookingController.listWaitlist);
  router.get("/me/bookings", authController.requireUser, bookingController.list);
  return router;
}

module.exports = { createUserRoutes };
