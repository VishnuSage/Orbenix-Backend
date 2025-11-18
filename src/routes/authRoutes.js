// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { validateRegister, validateLogin, validatePasswordReset, validateUpdatePassword } = require("../middleware/validation");
const auditLogger = require("../middleware/auditLogger");

// Define your routes
router.post("/register", validateRegister, auditLogger('register'), authController.register);
router.post("/login", validateLogin, auditLogger('login'), authController.login);
router.post('/password-reset', validatePasswordReset, auditLogger('password-reset'), authController.passwordReset);
router.post("/update-password", validateUpdatePassword, auditLogger('update-password'), authController.updatePassword);

module.exports = router;
