const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  type: { type: String, enum: ["clockIn", "clockOut"], required: true },
  timestamp: { type: Date, required: true },
});

const DailyRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  events: [EventSchema], // Array to hold clock in/out events for the day
});

const TimeSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  dailyRecords: [DailyRecordSchema], // Array to hold daily records for the employee
});

module.exports = mongoose.model("Time", TimeSchema);
