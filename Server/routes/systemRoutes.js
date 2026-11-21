// Route declarations for health and city endpoints.
const express = require("express");

function createSystemRoutes(controller) {
  const router = express.Router();
  router.get("/health", controller.health);
  router.get("/cities", controller.listCities);
  return router;
}

module.exports = { createSystemRoutes };
