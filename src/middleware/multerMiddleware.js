// src/middleware/multerMiddleware.js
const upload = require("../config/multer");

// Middleware to handle image upload
exports.uploadImage = upload.single("image"); // 'image' is the name of the form field
