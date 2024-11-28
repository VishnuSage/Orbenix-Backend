const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AuthModel = require("../models/AuthModel");
const EmployeeModel = require("../models/EmployeeModel"); // Import EmployeeModel
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

// Registration method
exports.register = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Check if the employee exists
    const employee = await EmployeeModel.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if user is already registered
    const existingUser = await AuthModel.findOne({
      $or: [{ email: employee.email }, { phone: employee.phone }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User  already registered" });
    }

    // Create a User record with a hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new AuthModel({
      empId: employee.empId,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      password: hashedPassword,
      roles: employee.roles,
    });
    await user.save();

    res.status(201).json({ message: "Registration successful." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// Login user
exports.login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Find the user (use toLowerCase for email)
    const user = await AuthModel.findOne({
      $or: [{ email: emailOrPhone.toLowerCase() }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // Use the comparePassword method from the model
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        empId: user.empId,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log("Sending login response:", { token, user });
    res.status(200).json({
      data: {
        token, // JWT Token
        user: {
          empId: user.empId,
          email: user.email,
          phone: user.phone,
          roles: user.roles,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Password reset method
exports.passwordReset = async (req, res) => {
  const { emailOrPhone, newPassword } = req.body;

  try {
    // Find the user by email or phone
    const user = await AuthModel.findOne({
      $or: [{ email: emailOrPhone.toLowerCase() }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password directly
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

// Update password method
exports.updatePassword = async (req, res) => {
  const { empId, currentPassword, newPassword } = req.body;

  try {
    const user = await AuthModel.findOne({ empId });

    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // Use the comparePassword method from the model
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash the new password before saving
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save(); // This will trigger the pre-save hook to hash the password

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
};
