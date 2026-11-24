// Route declarations for authentication endpoints.
const express = require("express");

function createAuthRoutes(controller) {
  const router = express.Router();
  router.post("/auth/signup", controller.signup);
  router.post("/auth/login", controller.login);
  router.get('/auth/google', controller.googleStart);
  router.get('/auth/google/callback', controller.googleCallback);
  router.get("/auth/me", controller.requireUser, controller.me);
  router.post("/auth/logout", controller.logout);
  return router;
}

module.exports = { createAuthRoutes };
