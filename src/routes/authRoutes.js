// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const jwtMiddleware = require("../middleware/jwtMiddleware");

// Define your routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/password-reset', authController.passwordReset);
router.post("/update-password", authController.updatePassword);

module.exports = router;
