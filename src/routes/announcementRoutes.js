// routes/announcementRoutes.js
const express = require("express");
const {
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  removeAnnouncement,
} = require("../controllers/announcementController");

const router = express.Router();

// Route to fetch all announcements
router.get("/", getAnnouncements);

// Route to add a new announcement
router.post("/", addAnnouncement);

// Route to update an announcement
router.put("/:id", updateAnnouncement);

// Route to delete an announcement
router.delete("/:id", removeAnnouncement);

module.exports = router;