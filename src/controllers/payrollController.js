// payrollController.js
const Payroll = require('../models/PayrollModel');

// Fetch all payroll records
exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find();
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payrolls', error });
  }
};

// Fetch payroll by employee ID
exports.getEmployeePayroll = async (req, res) => {
  const { empId } = req.params;
  try {
    const payrolls = await Payroll.find({ empId });
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee payroll', error });
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
    res.status(500).json({ message: 'Error creating payroll', error });
  }
};

// Update a payroll record
exports.updatePayroll = async (req, res) => {
  const { id } = req.params;
  const payrollData = req.body;
  try {
    const updatedPayroll = await Payroll.findByIdAndUpdate(id, payrollData, { new: true });
    if (!updatedPayroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    res.status(200).json(updatedPayroll);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payroll', error });
  }
};

// Delete a payroll record
exports.deletePayroll = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPayroll = await Payroll.findByIdAndDelete(id);
    if (!deletedPayroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    res.status(200).json({ message: 'Payroll deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payroll', error });
  }
};