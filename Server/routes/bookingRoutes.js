// Route declarations for saved events, waitlists, and ticket reservations.
const express = require("express");

function createBookingRoutes({ authController, bookingController }) {
  const router = express.Router();
  router.put("/events/:eventId/saved", authController.requireUser, bookingController.save);
  router.delete("/events/:eventId/saved", authController.requireUser, bookingController.unsave);
  router.post("/events/:eventId/waitlist", authController.requireUser, bookingController.joinWaitlist);
  router.delete("/events/:eventId/waitlist", authController.requireUser, bookingController.leaveWaitlist);
  router.post("/events/:eventId/bookings", authController.requireUser, bookingController.create);
  return router;
}

module.exports = { createBookingRoutes };
