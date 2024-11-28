// routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

// Routes for employee management
router.get("/", employeeController.getAllEmployees); // Fetch all employees
router.post("/", employeeController.addEmployee); // Add a new employee
router.put("/:empId", employeeController.updateEmployee); // Update an employee
router.delete("/:empId", employeeController.deleteEmployee); // Delete an employee
// Fetch an employee by ID
router.get("/:empId", employeeController.fetchEmployeeById); // Fetch employee by ID

// Update employee profile
router.put("/profile/:empId", employeeController.updateEmployeeProfile); // Update employee profile

// Fetch employee by email or phone
router.get("/", employeeController.fetchEmployeeByEmailOrPhone); // Fetch employee by email or phone

// Fetch user roles
router.get("/:empId/roles", employeeController.fetchUserRoles); // Fetch user roles

module.exports = router;
