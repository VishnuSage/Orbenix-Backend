// routes/timeRoutes.js

const express = require("express");
const router = express.Router();
const timeController = require("../controllers/timeController");

// Route to clock in
router.post("/clock-in", timeController.clockIn);

// Route to clock out
router.post("/clock-out", timeController.clockOut);

// Route to fetch daily worked hours for a specific date
router.get("/daily-hours/:empId", timeController.calculateDailyHours);

module.exports = router;
