const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "API works", version: "1.0.0" });
});

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);
router.get("/check-username/:username", authController.checkUsername);

module.exports = router;
