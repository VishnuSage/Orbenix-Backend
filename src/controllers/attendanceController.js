const AttendanceModel = require("../models/AttendanceModel");
const Employee = require("../models/EmployeeModel");
const { v4: uuidv4 } = require('uuid'); 

// Helper function to get monthly leave count
const getMonthlyLeaveCount = async (empId) => {
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  const attendance = await AttendanceModel.findOne({ empId });
  if (!attendance) return 0;

  return attendance.monthlyLeaveCount.get(currentMonth) || 0;
};

// Helper function to update monthly leave count
const updateMonthlyLeaveCount = async (empId, increment = true) => {
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  const attendance = await AttendanceModel.findOne({ empId });
  if (!attendance) return;

  const currentCount = attendance.monthlyLeaveCount.get(currentMonth) || 0;
  attendance.monthlyLeaveCount.set(
    currentMonth,
    increment ? currentCount + 1 : currentCount - 1
  );
  attendance.totalLeavesThisMonth =
    attendance.monthlyLeaveCount.get(currentMonth);

  await attendance.save();
};

// Mark absent for employees who haven't clocked in
const markAbsentForDay = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Get all employees
    const employees = await Employee.find();

    for (const employee of employees) {
      // Check if attendance record exists for today
      const attendanceRecord = await AttendanceModel.findOne({
        empId: employee.empId,
        "dailyRecords.date": today, // Check if a record for today exists in dailyRecords
      });

      // If no record exists, mark as absent
      if (!attendanceRecord) {
        await AttendanceModel.findOneAndUpdate(
          { empId: employee.empId }, // Update the existing attendance document
          { $push: { dailyRecords: { date: today, status: "absent" } } }, // Add a new daily record for the employee
          { new: true } // Return the updated document
        );
      }
    }
  } catch (error) {
    console.error("Error in markAbsentForDay:", error);
  }
};

// Fetch attendance data for all employees
exports.fetchAllAttendanceData = async (req, res) => {
  try {
    const attendanceData = await AttendanceModel.find();
    if (!attendanceData || attendanceData.length === 0) {
      return res.status(200).json({
        message: "No attendance data found for any employee.",
        data: [] 
      });
    }
    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching all attendance data:", error);
    res
      .status(500)
      .json({ message: "Error fetching all attendance data", error });
  }
};

// Fetch attendance data for a specific employee
exports.fetchAttendanceData = async (req, res) => {
  const { empId } = req.params; // Get empId from request parameters

  try {
    const attendanceData = await AttendanceModel.findOne({ empId });

    if (!attendanceData) {
      return res.status(200).json({ 
        message: "No attendance data found for this employee yet.",
        data: {} 
      });
    }

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance data for employee:", error);
    res.status(500).json({ message: "Error fetching attendance data", error });
  }
};

// Add a leave request for an employee
exports.addLeaveRequest = async (req, res) => {
  const { empId } = req.params;
  const { type, startDate, endDate, reason } = req.body;

  try {
    const attendanceEntry = await AttendanceModel.findOne({ empId });

    if (!attendanceEntry) {
      return res.status(404).json({ message: "Employee not found " });
    }

    // Calculate number of days in the leave request
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Get current monthly leave count
    const currentLeaveCount = await getMonthlyLeaveCount(empId);

    // Check if adding this leave would exceed the monthly limit
    if (currentLeaveCount + daysDifference > 5) {
      return res.status(400).json({
        message: "Leave request exceeds monthly limit of 5 days",
        currentLeaveCount,
        requestedDays: daysDifference,
        remainingDays: 5 - currentLeaveCount,
      });
    }

    // Generate a unique leaveRequestId
    const leaveRequestId = uuidv4(); // Ensure you have imported uuid

    // Push the new leave request into the leaveRequests array
    attendanceEntry.leaveRequests.push({
      leaveRequestId, // Include the unique ID
      type,
      startDate,
      endDate,
      status: "Pending",
      reason,
    });

    await attendanceEntry.save();

    res.status(201).json({
      message: "Leave request added successfully",
      attendanceEntry,
      leaveDetails: {
        currentLeaveCount,
        requestedDays: daysDifference,
        remainingDays: 5 - (currentLeaveCount + daysDifference),
      },
    });
  } catch (error) {
    console.error("Error adding leave request:", error);
    res.status(500).json({ message: "Error adding leave request", error });
  }
};

// Fetch all leave requests for a specific employee
exports.fetchLeaveRequests = async (req, res) => {
  const { empId } = req.params;

  try {
    const attendanceEntry = await AttendanceModel.findOne({ empId });

    if (!attendanceEntry) {
      // If no attendance entry exists, return a 200 status with an empty array and a message
      return res.status(200).json({ 
        message: "No leave requests found for this employee.",
        leaveRequests: [], // Return an empty array 
        leaveDetails: {
          currentLeaveCount: 0, // Set currentLeaveCount to 0 if no attendance found
          remainingDays: 5 // Set remainingDays to 5 (assuming this is your default value)
        }
      });
    }

    // Get current monthly leave count
    const currentLeaveCount = await getMonthlyLeaveCount(empId);

    res.status(200).json({
      leaveRequests: attendanceEntry.leaveRequests,
      leaveDetails: {
        currentLeaveCount,
        remainingDays: 5 - currentLeaveCount,
      },
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ message: "Error fetching leave requests", error });
  }
};

// Approve a leave request
exports.approveLeaveRequest = async (req, res) => {
  const { leaveRequestId, empId } = req.params;
  console.log(
    "Received request to approve leave with ID:",
    leaveRequestId,
    "for empId:",
    empId
  );

  try {
    const attendanceEntry = await AttendanceModel.findOne({ empId });
    console.log("Found attendanceEntry:", attendanceEntry);

    if (!attendanceEntry) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const updatedAttendanceEntry = await AttendanceModel.findOneAndUpdate(
      {
        _id: attendanceEntry._id,
        "leaveRequests.leaveRequestId": leaveRequestId,
      },
      { $set: { "leaveRequests.$.status": "Approved" } },
      { new: true } // Return the updated document
    );

    console.log("Updated attendanceEntry:", updatedAttendanceEntry);

    if (!updatedAttendanceEntry) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Calculate leave days
    const leaveRequest = updatedAttendanceEntry.leaveRequests.find(
      (request) => request.leaveRequestId === leaveRequestId
    );

    const start = new Date(leaveRequest.startDate);
    const end = new Date(leaveRequest.endDate);
    const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    res.status(200).json({
      message: "Leave request approved successfully",
      leaveRequest,
      daysApproved: daysDifference,
    });
  } catch (error) {
    console.error("Error approving leave request:", error);
    res.status(500).json({ message: "Error approving leave request", error });
  }
};

// Reject a leave request
exports.rejectLeaveRequest = async (req, res) => {
  const { leaveRequestId, empId } = req.params;

  try {
    const attendanceEntry = await AttendanceModel.findOne({ empId });
    if (!attendanceEntry) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const leaveRequest = attendanceEntry.leaveRequests.find(
      (request) => request .leaveRequestId === leaveRequestId
    );
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leaveRequest.status = "Rejected";
    await attendanceEntry.save();

    res.status(200).json({
      message: "Leave request rejected successfully",
      leaveRequest,
    });
  } catch (error) {
    console.error("Error rejecting leave request:", error);
    res.status(500).json({ message: "Error rejecting leave request", error });
  }
};

exports.fetchAllLeaveRequests = async (req, res) => {
  try {
    // Fetch all attendance records
    const attendanceRecords = await AttendanceModel.find();

    console.log("Fetched attendance records:", attendanceRecords); // Log fetched records

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(200).json({
        message: "No leave requests found.",
        data: [], 
      });
    }

    // Create an empty array to store all leave requests
    const allLeaveRequests = [];

    // Iterate over each attendance record
    for (const record of attendanceRecords) {
      // Add all leave requests from the current record to the allLeaveRequests array
      allLeaveRequests.push(...record.leaveRequests); // Use the spread operator here
    }

    console.log("All leave requests:", allLeaveRequests); // Log all leave requests

    // Return all leave requests
    res.status(200).json({
      message: "All leave requests fetched successfully.",
      data: allLeaveRequests,
    });
  } catch (error) {
    console.error("Error fetching all leave requests:", error);
    res.status(500).json({ message: "Error fetching all leave requests", error });
  }
};

// Schedule the markAbsentForDay function to run at the end of each day
const scheduleAbsenceMarking = () => {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 0, 0);

  const timeUntilEndOfDay = endOfDay - now;

  setTimeout(async () => {
    await markAbsentForDay();
    // Schedule next run
    scheduleAbsenceMarking();
  }, timeUntilEndOfDay);
};

// Start the scheduling when the server starts
scheduleAbsenceMarking();