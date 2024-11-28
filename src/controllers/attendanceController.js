const AttendanceModel = require("../models/AttendanceModel"); // Adjust the path as necessary

// Fetch attendance data for a specific employee
exports.fetchAttendanceData = async (req, res) => {
  const { empId } = req.params;

  try {
    const attendanceData = await AttendanceModel.find({ empId });
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];

    // Check if the employee is absent for today
    const todayEntry = attendanceData.find(
      (entry) => entry.date.toISOString().split("T")[0] === formattedToday
    );

    // If no entry exists for today, log absence
    if (!todayEntry) {
      const absenceEntry = await logAbsence(empId); // Log absence if no entry exists for today
      if (!absenceEntry) {
        console.error("Failed to log absence for employee:", empId);
      }
    }

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance data:", error); // Log the error for debugging
    res.status(500).json({ message: "Error fetching attendance data", error });
  }
};

// Log absence for an employee
exports.logAbsence = async (empId) => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // Get today's date

  try {
    // Check if the absence already exists for today
    const existingAbsence = await AttendanceModel.findOne({
      empId,
      date: formattedDate,
      status: "absent",
    });

    if (existingAbsence) {
      console.log(`Absence already logged for employee ${empId} on ${formattedDate}`);
      return existingAbsence; // Return existing absence entry
    }

    // Create a new attendance entry marking the employee as absent
    const attendanceEntry = await AttendanceModel.findOneAndUpdate(
      { empId, date: formattedDate },
      { status: "absent" },
      { new: true, upsert: true } // Create if it doesn't exist
    );

    return attendanceEntry;
  } catch (error) {
    console.error("Error marking absent:", error);
    throw new Error("Error marking absent"); // Rethrow error for further handling
  }
};

// Fetch attendance data for all employees (optional enhancement)
exports.fetchAllAttendanceData = async (req, res) => {
  try {
    const attendanceData = await AttendanceModel.find();
    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching all attendance data:", error);
    res.status(500).json({ message: "Error fetching all attendance data", error });
  }
};