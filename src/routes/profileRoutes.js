const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const multerMiddleware = require("../middleware/multerMiddleware");

// Route to fetch employee profile by ID
router.get("/:empId", profileController.fetchEmployeeProfile);

// Route to upload profile image
router.post(
  "/:empId/profile-image",
  multerMiddleware.uploadImage,
  profileController.uploadProfileImage
);

// Route to update employee profile
router.put("/:empId", profileController.updateEmployeeProfile);

module.exports = router;
