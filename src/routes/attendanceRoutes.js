const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController"); 
const { validateEmpIdParam, validateLeaveRequest, validateLeaveRequestId } = require("../middleware/attendanceValidation");
const auditLogger = require("../middleware/auditLogger");

// Route to fetch attendance data for a specific employee
router.get("/:empId", attendanceController.fetchAttendanceData);

// Route to fetch attendance data for all employees
router.get("/", attendanceController.fetchAllAttendanceData);

// Route to add a leave request for a specific employee
router.post("/:empId/leave", validateLeaveRequest, auditLogger('add-leave-request'), attendanceController.addLeaveRequest);

// Route to fetch all leave requests for a specific employee
router.get("/:empId/leave", attendanceController.fetchLeaveRequests);

// Route to approve a leave request
router.patch("/:empId/leave/:leaveRequestId/approve", validateLeaveRequestId, auditLogger('approve-leave-request'), attendanceController.approveLeaveRequest);

// Route to reject a leave request
router.patch("/:empId/leave/:leaveRequestId/reject", validateLeaveRequestId, auditLogger('reject-leave-request'), attendanceController.rejectLeaveRequest);

// Route to fetch all leave requests (Changed)
router.get("/all-leave-requests", attendanceController.fetchAllLeaveRequests); 

// Export the router
module.exports = router;