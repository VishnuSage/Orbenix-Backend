// payrollRoutes.js
const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");

// Routes for payroll management
router.get("/", payrollController.getAllPayrolls); // Get all payrolls
router.get("/:empId", payrollController.getEmployeePayroll); // Get payroll by employee ID
router.post("/", payrollController.createPayroll); // Create a new payroll
router.put("/:id", payrollController.updatePayroll); // Update a payroll
router.delete("/:id", payrollController.deletePayroll); // Delete a payroll

module.exports = router;
