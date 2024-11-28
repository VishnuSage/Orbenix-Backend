const { Performance, Training } = require("../models/PerformanceModel");
const Employee = require("../models/EmployeeModel");

// Fetch all performance data
exports.fetchPerformanceData = async (req, res) => {
  try {
    const performanceData = await Performance.find();
    res.status(200).json(performanceData);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch performance data",
      error: error.message,
    });
  }
};

exports.fetchTrainingData = async (req, res) => {
  try {
    const trainingData = await Training.find();
    console.log("Fetched training data:", trainingData); // Log the fetched data
    res.status(200).json(trainingData);
  } catch (error) {
    console.error("Error fetching training data:", error); // Log the error
    res
      .status(500)
      .json({ message: "Failed to fetch training data", error: error.message });
  }
};

// Fetch all employees
exports.fetchEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}, "empId name");
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch employees", error: error.message });
  }
};

// Add performance data
exports.addPerformanceData = async (req, res) => {
  try {
    const newPerformance = new Performance(req.body);
    const savedPerformance = await newPerformance.save();
    res.status(201).json(savedPerformance);
  } catch (error) {
    res.status(400).json({
      message: "Failed to add performance data",
      error: error.message,
    });
  }
};

// Update performance data
exports.updatePerformanceData = async (req, res) => {
  try {
    const { empId, month } = req.body;
    const updatedPerformance = await Performance.findOneAndUpdate(
      { empId, month },
      req.body,
      { new: true }
    );
    if (!updatedPerformance) {
      return res.status(404).json({ message: "Performance data not found" });
    }
    res.status(200).json(updatedPerformance);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update performance data",
      error: error.message,
    });
  }
};

// Delete performance data
exports.deletePerformanceData = async (req, res) => {
  try {
    const { empId, month } = req.params;
    const deletedPerformance = await Performance.findOneAndDelete({
      empId,
      month,
    });
    if (!deletedPerformance) {
      return res.status(404).json({ message: "Performance data not found" });
    }
    res.status(200).json({ message: "Performance data deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete performance data",
      error: error.message,
    });
  }
};

// Add training details
exports.addTrainingDetails = async (req, res) => {
  try {
    // Validate required fields
    const { date, time, duration, location, description, instructor } =
      req.body;
    if (
      !date ||
      !time ||
      !duration ||
      !location ||
      !description ||
      !instructor
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const nextTrainingId = await Training.getNextTrainingId(); // Get the next sequential trainingId
    const newTraining = new Training({
      ...req.body,
      trainingId: nextTrainingId,
    }); // Assign the next trainingId
    const savedTraining = await newTraining.save();
    res.status(201).json(savedTraining);
  } catch (error) {
    res.status(400).json({
      message: "Failed to add training details",
      error: error.message,
    });
  }
};

// Update training details
exports.updateTrainingDetails = async (req, res) => {
  try {
    const { trainingId } = req.params; // Change to trainingId

    // Validate that trainingId is provided
    if (!trainingId) {
      return res.status(400).json({ message: "Training ID is required." });
    }

    // Validate required fields in the request body
    const { date, time, duration, location, description, instructor } =
      req.body;
    if (
      !date ||
      !time ||
      !duration ||
      !location ||
      !description ||
      !instructor
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Optionally validate the format of date and time here

    const updatedTraining = await Training.findOneAndUpdate(
      { trainingId }, // Change to trainingId
      req.body,
      {
        new: true,
        runValidators: true, // Ensures that the update adheres to the model's validation rules
      }
    );

    // Check if the training details were found and updated
    if (!updatedTraining) {
      return res.status(404).json({ message: "Training details not found." });
    }

    res.status(200).json(updatedTraining);
  } catch (error) {
    // Differentiate between client and server errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error occurred.",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Failed to update training details.",
      error: error.message,
    });
  }
};

// Delete training details
exports.deleteTrainingDetails = async (req, res) => {
  const { trainingId } = req.params; // Get trainingId from request parameters
  console.log("Received request to delete training with ID:", trainingId); // Log the received trainingId

  try {
    // Check if the training exists before attempting to delete
    const existingTraining = await Training.findOne({ trainingId }); // Convert to Number
    console.log("Existing Training Details:", existingTraining); // Log the existing training details

    if (!existingTraining) {
      console.log(`Training details not found for ID: ${trainingId}`); // Log if no training details found
      return res.status(404).json({ message: "Training details not found" });
    }

    // Proceed to delete the training details
    const deletedTraining = await Training.findOneAndDelete({ trainingId }); // Convert to Number
    console.log(`Successfully deleted training details for ID: ${trainingId}`); // Log successful deletion
    res.status(200).json({ message: "Training details deleted successfully" });
  } catch (error) {
    console.error("Error deleting training details:", error); // Log the error
    res.status(500).json({
      message: "Failed to delete training details",
      error: error.message,
    });
  }
};

// Fetch performance data by employee ID
exports.fetchPerformanceByEmployee = async (req, res) => {
  try {
    const { empId } = req.params;
    const performanceData = await Performance.find({ empId });

    if (!performanceData || performanceData.length === 0) {
      return res
        .status(404)
        .json({ message: "No performance data found for this employee" });
    }

    res.status(200).json(performanceData);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch performance data",
      error: error.message,
    });
  }
};
