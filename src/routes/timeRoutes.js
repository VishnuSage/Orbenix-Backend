const express = require("express");
const router = express.Router();
const timeController = require("../controllers/timeController");

// Employee time tracking routes
router.post("/clock-in", timeController.clockIn);
router.post("/clock-out", timeController.clockOut);
router.get("/daily-hours/:empId", timeController.calculateDailyHours);
router.get("/monthly-hours/:empId", timeController.calculateMonthlyHours);

// Admin routes
router.get("/all-employees", timeController.fetchAllEmployeesTime);

module.exports = router;
