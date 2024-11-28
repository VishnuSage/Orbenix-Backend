// models/EmployeeModel.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    emergencyContactName: {
      type: String,
      required: true,
    },
    emergencyContactRelationship: {
      type: String,
      required: true,
    },
    emergencyContactPhone: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      default: ["employee"], // Default role can be set here
    },
    profileImage: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
