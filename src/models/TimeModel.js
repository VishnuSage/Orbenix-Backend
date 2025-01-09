const mongoose = require("mongoose");

// Event Schema to hold individual clock in/out events
const EventSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["clockIn", "clockOut"], required: true },
    timestamp: { type: Date, required: true },
  },
  { _id: false }
); // Disable automatic ID generation for events

// Daily Record Schema to hold events for a specific day
const DailyRecordSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true }, // Ensure uniqueness for each day
    events: [EventSchema], // Array to hold clock in/out events for the day
  },
  { timestamps: true }
); // Automatically manage createdAt and updatedAt fields

// Time Schema to hold employee time tracking data
const TimeSchema = new mongoose.Schema(
  {
    empId: { type: String, required: true, unique: true },
    dailyRecords: [DailyRecordSchema], // Array to hold daily records for the employee
  },
  { timestamps: true }
); // Automatically manage createdAt and updatedAt fields

// Create an index on empId for faster lookups
TimeSchema.index({ empId: 1 });

module.exports = mongoose.model("Time", TimeSchema);
