// src/config/multer.js
const multer = require("multer");

const storage = multer.memoryStorage(); // or use diskStorage for saving to disk
const upload = multer({ storage: storage });

module.exports = upload;
