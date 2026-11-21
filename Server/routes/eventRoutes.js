// Route declarations for public event discovery.
const express = require("express");

function createEventRoutes(controller) {
  const router = express.Router();
  router.get("/events", controller.list);
  router.get("/events/featured", controller.featured);
  router.get("/events/:slug", controller.getBySlug);
  return router;
}

module.exports = { createEventRoutes };
