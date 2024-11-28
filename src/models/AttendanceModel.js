const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
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

const attendanceSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    unique: true, // Ensures that attendance can only be logged once per day per employee
  },
  status: {
    type: String,
    enum: ["present", "absent"], // Only present or absent
    required: true,
  },
  leaveRequests: [leaveRequestSchema], // Array to hold leave requests for the employee
});

// Ensure that attendance can only be logged once per day per employee
attendanceSchema.index({ empId: 1, date: 1 }, { unique: true });

const AttendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = AttendanceModel;