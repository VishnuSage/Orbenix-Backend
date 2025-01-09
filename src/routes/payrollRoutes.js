// payrollRoutes.js
const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");

// Routes for payroll management
router.get("/", payrollController.getAllPayrolls); // Get all payrolls
router.get("/:empId", payrollController.getEmployeePayroll); // Get payroll by employee ID
router.post("/", payrollController.createPayroll); // Create a new payroll
router.put("/:_id", payrollController.updatePayroll); // Update a payroll
router.delete("/:_id", payrollController.deletePayroll); // Delete a payroll
router.post('/loan-requests', payrollController.addLoanRequest);
router.patch('/loan-requests/:loanNumber/approve', payrollController.approveLoanRequest);
router.patch('/loan-requests/:loanNumber/reject', payrollController.rejectLoanRequest);
router.get('/loan-requests', payrollController.fetchAllLoanRequests); // Fetch all loan requests
router.get('/loan-requests/by-emp', payrollController.fetchLoanRequestsByEmpId); // Fetch loan requests by empId

module.exports = router;
