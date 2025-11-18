const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const multerMiddleware = require("../middleware/multerMiddleware");
const { validateEmpIdParam, validateProfileUpdate } = require("../middleware/profileValidation");
const auditLogger = require("../middleware/auditLogger");

// Route to fetch employee profile by ID
router.get("/:empId", profileController.fetchEmployeeProfile);

// Route to upload profile image
router.post(
  "/:empId/profile-image",
  validateEmpIdParam,
  auditLogger('upload-profile-image'),
  multerMiddleware.uploadImage,
  profileController.uploadProfileImage
);

// Route to update employee profile
router.put("/:empId", validateEmpIdParam, validateProfileUpdate, auditLogger('update-profile'), profileController.updateEmployeeProfile);

module.exports = router;
