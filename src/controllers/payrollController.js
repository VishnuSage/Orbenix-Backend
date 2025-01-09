// payrollController.js
const Payroll = require("../models/PayrollModel");
const { LoanRequest } = require("../models/PayrollModel");

// Fetch all payroll records
exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find();
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payrolls", error });
  }
};

// Fetch payroll by employee ID
exports.getEmployeePayroll = async (req, res) => {
  const { empId } = req.params;
  try {
    const payrolls = await Payroll.find({ empId });
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee payroll", error });
  }
};

// Create a new payroll record
exports.createPayroll = async (req, res) => {
  const payrollData = req.body;
  try {
    const payroll = new Payroll(payrollData);
    await payroll.save();
    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: "Error creating payroll", error });
  }
};

// Update a payroll record
exports.updatePayroll = async (req, res) => {
  const { _id } = req.params;
  const payrollData = req.body;
  try {
    const updatedPayroll = await Payroll.findByIdAndUpdate(_id, payrollData, {
      new: true,
    });
    if (!updatedPayroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }
    res.status(200).json(updatedPayroll);
  } catch (error) {
    res.status(500).json({ message: "Error updating payroll", error });
  }
};

// Delete a payroll record
exports.deletePayroll = async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedPayroll = await Payroll.findByIdAndDelete(_id);
    if (!deletedPayroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }
    res.status(200).json({ message: "Payroll deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payroll", error });
  }
};

  // Fetch all loan requests
  exports.fetchAllLoanRequests = async (req, res) => {
    try {
      const loanRequests = await LoanRequest.find(); // Fetch all loan requests
      if (!loanRequests || loanRequests.length === 0) {
        return res.status(404).json({ message: "No loan requests found" });
      }
      res.status(200).json(loanRequests);
    } catch (error) {
      console.error("Error fetching loan requests:", error.message, error.stack); // Log the error with stack trace
      res.status(500).json({ message: "Error fetching loan requests", error: error.message });
    }
  };


  // Fetch loan requests by employee ID
  exports.fetchLoanRequestsByEmpId = async (req, res) => {
    const { empId } = req.query;
    try {
      const loanRequests = await LoanRequest.find({ empId });
      res.status(200).json(loanRequests);
    } catch (error) {
      console.error("Error fetching loan requests:", error); // Log the error
      res.status(500).json({ message: "Error fetching loan requests", error: error.message });
    }
  };

const generateShortLoanNumber = () => {
  const timestamp = Date.now().toString(36);
  const randomNum = Math.floor(Math.random() * 10000).toString(36);
  return `LN-${timestamp}-${randomNum}`;
};

exports.addLoanRequest = async (req, res) => {
  try {
    const newLoanRequest = new LoanRequest({
      ...req.body,
      loanNumber: generateShortLoanNumber(), // Generate loan number here
    });
    await newLoanRequest.save();
    res.status(201).json(newLoanRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to approve a loan request
exports.approveLoanRequest = async (req, res) => {
  try {
    const loanRequest = await LoanRequest.findOne({ loanNumber: req.params.loanNumber });
    if (!loanRequest) return res.status(404).json({ message: "Loan request not found" });

    loanRequest.status = 'Approved'; // Change to uppercase
    await loanRequest.save();
    res.json(loanRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to reject a loan request
exports.rejectLoanRequest = async (req, res) => {
  try {
    const loanRequest = await LoanRequest.findOne({ loanNumber: req.params.loanNumber });
    if (!loanRequest) return res.status(404).json({ message: "Loan request not found" });

    loanRequest.status = 'Rejected'; // Change to uppercase
    await loanRequest.save();
    res.json(loanRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
