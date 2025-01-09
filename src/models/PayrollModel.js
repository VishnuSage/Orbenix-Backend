// PayrollModel.js
const mongoose = require("mongoose");

const loanRequestSchema = new mongoose.Schema(
  {
    loanNumber: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    empId: {
      type: String,
      required: true,
      index: true, // Index for faster querying by empId
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    requestedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const payrollSchema = new mongoose.Schema(
  {
    empId: { type: String, required: true, index: true }, // Add index for faster retrieval by empId
    name: { type: String, required: true },
    month: {
      type: Date, // Change month to Date for easier date comparisons and sorting
      required: true,
      index: true, // Add index for faster retrieval by month
    },
    salary: { type: Number, required: true },
    benefits: { type: Number, required: true },
    netPay: { type: Number, required: true },
    deductionsBreakdown: {
      tax: { type: Number, default: 0 },
      healthInsurance: { type: Number, default: 0 },
      retirement: { type: Number, default: 0 },
      loan: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Create compound index for faster retrieval by empId and month
payrollSchema.index({ empId: 1, month: 1 });

// Create a model for the LoanRequest
const LoanRequest = mongoose.model("LoanRequest", loanRequestSchema);

const Payroll = mongoose.model("Payroll", payrollSchema);

module.exports = { Payroll, LoanRequest };
