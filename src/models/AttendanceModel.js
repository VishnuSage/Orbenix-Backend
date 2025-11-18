const mongoose = require("mongoose");

// Leave Request Schema (with unique leaveRequestId)
const leaveRequestSchema = new mongoose.Schema({
  leaveRequestId: {
    type: String, // Use String for better readability and flexibility
    required: true,
    unique: true, // Ensure each leave request has a unique ID
  },
  type: {
    type: String,
    enum: ["Casual Leave", "Sick Leave", "Emergency Leave", "Others"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

// Daily Record Schema (remains the same)
const dailyRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true, // Ensures that a daily record can only be created once per day
  },
  status: {
    type: String,
    enum: ["present", "absent"], // Only present or absent
    required: true,
  },
});

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    unique: true, // Ensures that an employee entry exists only once
  },
  name: {
    type: String,
    required: true,
  },
  leaveRequests: [leaveRequestSchema], // Array to hold leave requests for the employee
  monthlyLeaveCount: {
    type: Map,
    of: Number,
    default: new Map(), // Format: { "YYYY-MM": count }
  },
  totalLeavesThisMonth: {
    type: Number,
    default: 0,
  },
  dailyRecords: [dailyRecordSchema], // Array to hold daily records for the employee
});


const AttendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = AttendanceModel;
