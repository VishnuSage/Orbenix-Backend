// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const AuthModel = require("../models/AuthModel");
// require("dotenv").config({
//   path: require("path").resolve(__dirname, "../../.env"),
// });

// const addSuperAdmin = async () => {
//   try {
//     console.log("MongoDB URI:", process.env.MONGODB_URI);
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // Check if super admin already exists
//     const existingUser = await AuthModel.findOne({
//       email: "superadmin@example.com".toLowerCase()
//     });

//     if (existingUser) {
//       console.log("Super admin already exists. Skipping creation.");
//       return;
//     }

//     // Create AuthModel instance
//     const superAdmin = new AuthModel({
//       empId: "EMP000",
//       name: "Super Admin",
//       email: "superadmin@example.com".toLowerCase(),
//       phone: "1234567890",
//       password: "Paradox007", // Plain text password
//       roles: ["superAdmin"],
//     });

//     // This will trigger the pre-save hook to hash the password
//     await superAdmin.save();

//     console.log("Super Admin added to auth table successfully!");
//   } catch (error) {
//     console.error("Error adding super admin:", error);
//   } finally {
//     await mongoose.disconnect();
//   }
// };

// addSuperAdmin();