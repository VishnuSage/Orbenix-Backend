const Employee = require("../models/EmployeeModel"); // Import Employee model
const cloudinary = require("../config/cloudinary");

exports.fetchEmployeeProfile = async (req, res, next) => {
  try {
    const { empId } = req.params;
    const employee = await Employee.findOne({ empId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee); // Return employee data as profile
  } catch (error) {
    next(error);
  }
};

// Upload image to Cloudinary and update employee profileImage
exports.uploadProfileImage = async (req, res) => {
  try {
    const file = req.file; // Access the uploaded file
    const { empId } = req.params;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        })
        .end(file.buffer); // Send the buffer to Cloudinary
    });

    // Update employee's profileImage field in MongoDB
    const updatedEmployee = await Employee.findOneAndUpdate(
      { empId },
      { profileImage: result.secure_url }, // Store the Cloudinary URL
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Respond with the uploaded image URL
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee profile
exports.updateEmployeeProfile = async (req, res, next) => {
  const { empId } = req.params;
  const profileData = req.body;

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { empId },
      profileData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    next(error);
  }
};
