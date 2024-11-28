// controllers/employeeController.js
const Employee = require("../models/EmployeeModel");

// Function to generate the next empId
const generateEmpId = async () => {
  const lastEmployee = await Employee.findOne().sort({ empId: -1 }).exec();

  if (!lastEmployee) {
    return "EMP001"; // Starting point for first employee
  }

  const lastEmpId = lastEmployee.empId; // e.g., EMP001
  const lastNum = parseInt(lastEmpId.substring(3)); // Extract numeric part (001)
  const newNum = lastNum + 1; // Increment
  const newEmpId = `EMP${String(newNum).padStart(3, "0")}`; // Format to EMPXXX

  return newEmpId;
};

// Fetch all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

// Add a new employee
exports.addEmployee = async (req, res) => {
  try {
    const empId = await generateEmpId(); // Generate new empId
    const newEmployee = new Employee({
      empId, // Use the generated empId
      ...req.body,
      profileImage: null,
    });
    const savedEmployee = await newEmployee.save(); // This is where data is saved
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("Error adding employee:", error); // Log the error
    res.status(400).json({ message: "Error adding employee", error });
  }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
  const { empId } = req.params;
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { empId },
      req.body,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: "Error updating employee", error });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  const { empId } = req.params;
  try {
    const deletedEmployee = await Employee.findOneAndDelete({ empId });
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};

// Fetch an employee by ID
exports.fetchEmployeeById = async (req, res) => {
  const { empId } = req.params;
  try {
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee profile
exports.updateEmployeeProfile = async (req, res) => {
  const { empId } = req.params;
  const profileData = req.body;

  try {
    const updatedProfile = await Employee.findOneAndUpdate(
      { empId },
      profileData,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch employee by email or phone
exports.fetchEmployeeByEmailOrPhone = async (req, res) => {
  const { emailOrPhone } = req.query; // Assuming emailOrPhone can be email or phone
  try {
    const employee = await Employee.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch user roles (assuming roles are part of the employee document)
exports.fetchUserRoles = async (req, res) => {
  const { empId } = req.params;
  try {
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ roles: employee.roles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
