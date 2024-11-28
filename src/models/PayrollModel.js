// PayrollModel.js
const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  empId: { type: String, required: true },
  name: { type: String, required: true },
  month: { type: String, required: true },
  salary: { type: Number, required: true },
  benefits: { type: Number, required: true },
  netPay: { type: Number, required: true },
  deductionsBreakdown: {
    tax: { type: Number, default: 0 },
    healthInsurance: { type: Number, default: 0 },
    retirement: { type: Number, default: 0 },
    loan: { type: Number, default: 0 },
  },
}, { timestamps: true });

const Payroll = mongoose.model('Payroll', payrollSchema);

module.exports = Payroll;