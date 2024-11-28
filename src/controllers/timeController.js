const Time = require("../models/TimeModel"); // Ensure the model is imported correctly

// Clock in function
const Employee = require("../models/EmployeeModel"); // Import Employee model

exports.clockIn = async (req, res) => {
  const { empId } = req.body; // Assume empId is sent in the request body
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the start of the day

  try {
    // Find the employee's name based on empId
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Mark attendance as present in the AttendanceModel
    const attendanceEntry = await AttendanceModel.findOneAndUpdate(
      { empId, date: today.toISOString().split("T")[0] }, // Match by employee ID and today's date
      { status: "present" }, // Only set the status to present
      { new: true, upsert: true } // Create if it doesn't exist
    );

    // Find the employee entry in Time collection
    let entry = await Time.findOne({ empId });
    if (!entry) {
      // Create a new entry if it doesn't exist
      entry = new Time({ empId, dailyRecords: [] });
    }

    // Check for existing daily record for today
    let dailyRecord = entry.dailyRecords.find(
      (record) => record.date.getTime() === today.getTime()
    );

    if (!dailyRecord) {
      // Create a new daily record if it doesn't exist
      dailyRecord = { date: today, events: [] };
      entry.dailyRecords.push(dailyRecord);
    }

    // Check if already clocked in
    const lastEvent = dailyRecord.events[dailyRecord.events.length - 1];
    if (lastEvent && lastEvent.type === "clockIn") {
      return res.status(400).json({ message: "Already clocked in." });
    }

    // Add clock-in event
    dailyRecord.events.push({ type: "clockIn", timestamp: new Date() });

    await entry.save(); // Save the Time entry
    res.status(200).json({ entry, attendanceEntry }); // Return both entries
  } catch (error) {
    console.error("Error during clock in:", error);
    res.status(500).json({ message: "Error during clock in." });
  }
};

// Clock out function
exports.clockOut = async (req, res) => {
  const { empId } = req.body; // Assume empId is sent in the request body
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the start of the day

  // Find the employee entry
  const entry = await Time.findOne({ empId });
  if (!entry) {
    return res.status(400).json({ message: "No clock-in/out data found." });
  }

  // Find the existing daily record for today
  const dailyRecord = entry.dailyRecords.find(
    (record) => record.date.getTime() === today.getTime()
  );
  if (!dailyRecord) {
    return res.status(400).json({ message: "No active clock-in found." });
  }

  // Check if the last event is a clock-in
  const lastEvent = dailyRecord.events[dailyRecord.events.length - 1];
  if (!lastEvent || lastEvent.type !== "clockIn") {
    return res
      .status(400)
      .json({ message: "You must clock in before clocking out." });
  }

  // Add clock-out event
  dailyRecord.events.push({ type: "clockOut", timestamp: new Date() });
  await entry.save();
  res.status(200).json(entry);
};

// Calculate daily hours
exports.calculateDailyHours = async (req, res) => {
  const { empId } = req.params; // Get employee ID from the request parameters
  const { date } = req.query; // Get the date from the query parameters
  const specifiedDate = new Date(date);
  specifiedDate.setHours(0, 0, 0, 0); // Set to the start of the specified date

  // Fetch the employee entry
  const entry = await Time.findOne({ empId });
  if (!entry) {
    return res.status(404).json({ message: "Employee not found." });
  }

  // Find the daily record for the specified date
  const dailyRecord = entry.dailyRecords.find(
    (record) => record.date.getTime() === specifiedDate.getTime()
  );
  if (!dailyRecord) {
    return res
      .status(404)
      .json({ message: "No clock-in/out data found for the specified date." });
  }

  let totalHours = 0;
  const events = dailyRecord.events;

  for (let i = 0; i < events.length; i += 2) {
    if (events[i].type === "clockIn" && events[i + 1]) {
      const clockIn = new Date(events[i].timestamp);
      const clockOut = new Date(events[i + 1].timestamp);
      totalHours += (clockOut - clockIn) / (1000 * 60 * 60); // Convert milliseconds to hours
    }
  }

  res.status(200).json({ totalHours });
};
