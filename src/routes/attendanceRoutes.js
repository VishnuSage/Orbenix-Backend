const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController"); // Adjust the path as necessary

// Route to fetch attendance data for a specific employee
router.get("/attendance/:empId", attendanceController.fetchAttendanceData);

// Route to log attendance for an employee
router.post("/attendance/log", attendanceController.logAttendance);

// Export the router
module.exports = router;