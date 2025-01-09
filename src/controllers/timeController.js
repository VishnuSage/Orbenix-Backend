const Time = require("../models/TimeModel");
const Employee = require("../models/EmployeeModel");
const AttendanceModel = require("../models/AttendanceModel");

exports.clockIn = async (req, res) => {
  const { empId } = req.body;
  const today = new Date();
  console.log("Received clock-in request:", { empId, today }); // Log the request

  try {
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    console.log("Employee found:", employee); // Log the employee details

    // --- Time Table Update ---
    let entry = await Time.findOne({ empId });
    console.log("Time entry found:", entry); // Log the Time entry

    if (!entry) {
      entry = new Time({
        empId,
        dailyRecords: [{ date: today, events: [] }],
      });
      await entry.save();
      console.log("New Time entry created:", entry); // Log the new entry
    }

    // Find or create daily record in Time table
    let dailyRecordIndex = entry.dailyRecords.findIndex((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getDate() === today.getDate() &&
        recordDate.getMonth() === today.getMonth() &&
        recordDate.getFullYear() === today.getFullYear()
      );
    });

    console.log("Daily record index:", dailyRecordIndex); // Log the index

    if (dailyRecordIndex === -1) {
      entry.dailyRecords.push({ date: today, events: [] });
      await entry.save();
      dailyRecordIndex = entry.dailyRecords.length - 1;
      console.log("New daily record added:", entry); // Log the updated entry
    }

    let dailyRecord = entry.dailyRecords[dailyRecordIndex];
    const clockInTime = new Date();
    console.log("Clock-in time:", clockInTime); // Log the clock-in time

    // Check for active clock-in
    const hasActiveClockIn =
      dailyRecord.events.length > 0 &&
      dailyRecord.events[dailyRecord.events.length - 1].type === "clockIn" &&
      !dailyRecord.events[dailyRecord.events.length - 1].clockedOut;

    if (hasActiveClockIn) {
      return res.status(400).json({ message: "You are already clocked in." });
    }

    dailyRecord.events.push({
      type: "clockIn",
      timestamp: clockInTime,
      clockedOut: false,
    });

    await entry.save();
    console.log("Clock-in event added:", entry); // Log the entry after clock-in

    // --- Attendance Table Update ---
    let attendanceEntry = await AttendanceModel.findOne({ empId });
    console.log("Attendance entry found:", attendanceEntry); // Log the attendance entry

    if (!attendanceEntry) {
      attendanceEntry = new AttendanceModel({
        empId,
        name: employee.name,
        dailyRecords: [{ date: today, status: "present" }],
      });
      await attendanceEntry.save();
      console.log("New Attendance entry created:", attendanceEntry); // Log the new entry
    } else {
      let attendanceRecordIndex = attendanceEntry.dailyRecords.findIndex(
        (record) => {
          const recordDate = new Date(record.date);
          return (
            recordDate.getDate() === today.getDate() &&
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === today.getFullYear()
          );
        }
      );

      console.log("Attendance record index:", attendanceRecordIndex); // Log the index

      if (attendanceRecordIndex === -1) {
        attendanceEntry.dailyRecords.push({ date: today, status: "present" });
      } else {
        attendanceEntry.dailyRecords[attendanceRecordIndex].status = "present";
      }

      await attendanceEntry.save();
      console.log("Attendance entry updated:", attendanceEntry); // Log the updated entry
    }

    res.status(200).json({
      message: "Clock in successful.",
      clockInTime: clockInTime.toISOString(), // Send the clock-in time as a string
      entry: entry, // Send the updated Time entry
      attendanceEntry: attendanceEntry, // Send the updated Attendance entry
    });
  } catch (error) {
    console.error("Error during clock-in:", error); // Log any errors
    return res.status(500).json({ message: "An error occurred.", error });
  }
};

exports.clockOut = async (req, res) => {
  const { empId } = req.body;
  const today = new Date();

  try {
    // Find the employee entry
    const entry = await Time.findOne({ empId });
    if (!entry) {
      return res.status(400).json({ message: "No clock-in/out data found." });
    }

    // Find today's daily record
    let dailyRecordIndex = entry.dailyRecords.findIndex((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getDate() === today.getDate() &&
        recordDate.getMonth() === today.getMonth() &&
        recordDate.getFullYear() === today.getFullYear()
      );
    });

    if (dailyRecordIndex === -1) {
      return res.status(400).json({ message: "No active clock-in found." });
    }

    // Proceed with clocking out
    const clockOutTime = new Date();

    // Check if the last event is a clock-in
    let dailyRecord = entry.dailyRecords[dailyRecordIndex];
    if (dailyRecord.events.length > 0) {
      const lastEvent = dailyRecord.events[dailyRecord.events.length - 1];
      if (lastEvent.type !== "clockIn") {
        return res.status(400).json({ message: "You need to clock in first." });
      }
    }

    // Find the most recent clock-in event that is NOT already clocked out
    let clockInIndex = dailyRecord.events.findIndex(
      (event) => event.type === "clockIn" && !event.clockedOut
    );

    if (clockInIndex !== -1) {
      // Update the `clockedOut` status of the most recent clock-in event
      dailyRecord.events[clockInIndex].clockedOut = true;
    } else {
      // If no active clock-in is found, return an error
      return res.status(400).json({ message: "No active clock-in found." });
    }

    // Add clock-out event to the existing daily record
    dailyRecord.events.push({ type: "clockOut", timestamp: clockOutTime });
    console.log("Added clock-out event:", {
      type: "clockOut",
      timestamp: clockOutTime,
    });

    // Save the entry
    await entry.save();

    // Return comprehensive response
    res.status(200).json({
      entry,
      clockOutTime: clockOutTime.toISOString(),
      message: "Successfully clocked out.",
    });
  } catch (error) {
    console.error("Error during clock out:", error);
    res.status(500).json({ message: "Error during clock out." });
  }
};

exports.calculateDailyHours = async (req, res) => {
  const { empId } = req.params;
  const { date } = req.query;
  console.log("Received calculateDailyHours request:", { empId, date }); // Log the request parameters
  const specifiedDate = new Date(date);
  specifiedDate.setHours(0, 0, 0, 0); // Set time to midnight

  try {
    // Fetch the employee's Time entry
    const entry = await Time.findOne({ empId });
    if (!entry) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Find the daily record (compare only the date part)
    const dailyRecord = entry.dailyRecords.find(
      (record) =>
        record.date.getFullYear() === specifiedDate.getFullYear() &&
        record.date.getMonth() === specifiedDate.getMonth() &&
        record.date.getDate() === specifiedDate.getDate()
    );

    if (!dailyRecord) {
      return res.status(404).json({
        message: "No clock-in/out data found for the specified date.",
        totalHours: 0,
        status: "absent", //  Default to absent if no record found
      });
    }

    // Calculate total hours
    let totalHours = 0;
    let isCurrentlyClocked = false;
    let lastClockIn = null;

    for (let i = 0; i < dailyRecord.events.length; i++) {
      const event = dailyRecord.events[i];
      if (event.type === "clockIn") {
        lastClockIn = new Date(event.timestamp);
        isCurrentlyClocked = true;
      } else if (event.type === "clockOut" && lastClockIn) {
        const clockOut = new Date(event.timestamp);
        totalHours += (clockOut - lastClockIn) / (1000 * 60 * 60);
        isCurrentlyClocked = false;
        lastClockIn = null;
      }
    }

    // Handle missing clock-out event: Calculate until now
    if (isCurrentlyClocked && lastClockIn) {
      const now = new Date();
      totalHours += (now - lastClockIn) / (1000 * 60 * 60);
    }

    // Get attendance status from AttendanceModel
    // Use the date from the dailyRecord instead of specifiedDate
    const attendance = await AttendanceModel.findOne({
      empId,
      "dailyRecords.date": dailyRecord.date, // Use the date from the Time record
    });

    let status = "absent"; // Default to absent
    if (attendance && attendance.dailyRecords.length > 0) {
      const dailyAttendance = attendance.dailyRecords.find(
        (record) =>
          new Date(record.date).getDate() === dailyRecord.date.getDate() && // Use dailyRecord.date for comparison
          new Date(record.date).getMonth() === dailyRecord.date.getMonth() &&
          new Date(record.date).getFullYear() === dailyRecord.date.getFullYear()
      );
      if (dailyAttendance) {
        status = dailyAttendance.status; // Get the status from the Attendance record
      }
    }

    res.status(200).json({
      totalHours,
      isCurrentlyClocked,
      status,
      events: dailyRecord.events,
    });
  } catch (error) {
    console.error("Error calculating daily hours:", error);
    res.status(500).json({ message: "Error calculating daily hours." });
  }
};

exports.calculateMonthlyHours = async (req, res) => {
  const { empId } = req.params;
  const { month, year } = req.query; // Expecting month and year as query parameters

  try {
    const entry = await Time.findOne({ empId });
    if (!entry) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const totalHours = entry.dailyRecords.reduce((acc, record) => {
      const recordDate = new Date(record.date);
      if (
        recordDate.getMonth() + 1 === parseInt(month) &&
        recordDate.getFullYear() === parseInt(year)
      ) {
        let dailyTotal = 0;
        const events = record.events;

        for (let i = 0; i < events.length; i++) {
          if (events[i].type === "clockIn") {
            const clockIn = new Date(events[i].timestamp);
            if (events[i + 1] && events[i + 1].type === "clockOut") {
              const clockOut = new Date(events[i + 1].timestamp);
              dailyTotal += (clockOut - clockIn) / (1000 * 60 * 60);
            } else {
              // If no clock-out, count hours till now
              const now = new Date();
              dailyTotal += (now - clockIn) / (1000 * 60 * 60);
            }
          }
        }
        return acc + dailyTotal;
      }
      return acc;
    }, 0);

    res.status(200).json({
      totalHours,
      month,
      year,
      empId,
    });
  } catch (error) {
    console.error("Error calculating monthly hours:", error);
    res.status(500).json({ message: "Error calculating monthly hours." });
  }
};

exports.fetchAllEmployeesTime = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query; // Get date range from query parameters
    const today = new Date();
    const currentMonth = today.getMonth();

    // Fetch time and attendance data
    const timeEntries = await Time.find();
    const attendanceEntries = await AttendanceModel.find();

    // Fetch employee details
    const employees = await Employee.find();
    const employeeMap = {};
    employees.forEach((employee) => {
      employeeMap[employee.empId] = employee.name; // Create a map of empId to employee name
    });

    // Create a map to store aggregated attendance data for each employee
    const aggregatedAttendance = {};

    // Convert fromDate and toDate to Date objects for comparison
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    // Set hours to 0 for accurate date comparison
    if (from) from.setHours(0, 0, 0, 0);
    if (to) to.setHours(0, 0, 0, 0); // Set to the start of the day for comparison

    // Iterate through timeEntries to calculate hours worked
    timeEntries.forEach((entry) => {
      const { empId, dailyRecords } = entry;
      // Only calculate hours worked for each employee *once* per day
      dailyRecords.forEach((record) => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0); // Set hours to 0 for accurate comparison

        // Check if the record falls within the requested date range
        const isWithinDateRange =
          (from && to && recordDate >= from && recordDate <= to) || // General range
          (from && !to && recordDate.toDateString() === from.toDateString()) || // Include records from fromDate
          (!from && to && recordDate.toDateString() === to.toDateString()) || // Include records up to toDate
          (!from && !to && recordDate.getMonth() === currentMonth) || // Current month if no range is provided
          (from &&
            to &&
            from.toDateString() === to.toDateString() &&
            recordDate.toDateString() === from.toDateString()); // Exact date match

        if (isWithinDateRange) {
          // Calculate hours for the record
          let dailyTotal = 0;
          let lastClockIn = null;

          record.events.forEach((event, index) => {
            if (event.type === "clockIn") {
              lastClockIn = new Date(event.timestamp);
            } else if (event.type === "clockOut" && lastClockIn) {
              const clockOut = new Date(event.timestamp);
              dailyTotal += (clockOut - lastClockIn) / (1000 * 60 * 60); // Calculate hours in decimal form
              lastClockIn = null; // Reset lastClockIn after clocking out
            } else if (
              event.type === "clockIn" &&
              index === record.events.length - 1
            ) {
              // Employee is currently clocked in
              // Calculate time from lastClockIn to now
              const now = new Date();
              dailyTotal += (now - lastClockIn) / (1000 * 60 * 60);
              lastClockIn = null;
            }
          });

          // Store hours worked for the employee
          aggregatedAttendance[empId] = aggregatedAttendance[empId] || {
            empId,
            name: employeeMap[empId] || "Unknown", // Add employee name
            totalHoursWorked: 0,
            daysPresent: 0,
            daysAbsent: 0,
          };
          aggregatedAttendance[empId].totalHoursWorked += dailyTotal; // Add hours worked only for this day
        }
      });
    });

    // Iterate through attendanceEntries to calculate days present and absent
    attendanceEntries.forEach((attendance) => {
      const { empId, dailyRecords } = attendance;
      dailyRecords.forEach((record) => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0); // Set hours to 0 for accurate comparison

        // Check if the record falls within the requested date range
        const isWithinDateRange =
          (from && to && recordDate >= from && recordDate <= to) || // General range
          (from && !to && recordDate.toDateString() === from.toDateString()) || // Include records from fromDate
          (!from && to && recordDate.toDateString() === to.toDateString()) || // Include records up to toDate
          (!from && !to && recordDate.getMonth() === currentMonth) || // Current month if no range is provided
          (from &&
            to &&
            from.toDateString() === to.toDateString() &&
            recordDate.toDateString() === from.toDateString()); // Exact date match

        if (isWithinDateRange) {
          aggregatedAttendance[empId] = aggregatedAttendance[empId] || {
            empId,
            name: employeeMap[empId] || "Unknown", // Add employee name
            totalHoursWorked: 0,
            daysPresent: 0,
            daysAbsent: 0,
          };
          if (record.status === "present") {
            aggregatedAttendance[empId].daysPresent += 1; // Increment days present
          } else {
            aggregatedAttendance[empId].daysAbsent += 1; // Increment days absent
          }
        }
      });
    });

    // Convert aggregatedAttendance object to an array for response
    const result = Object.values(aggregatedAttendance);

    // Send the response
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching employee time data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
