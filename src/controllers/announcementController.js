// controllers/announcementController.js
const Announcement = require("../models/AnnouncementModel");

// Fetch all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new announcement
exports.addAnnouncement = async (req, res) => {
  const { text, category } = req.body;
  const newAnnouncement = new Announcement({ text, category });

  try {
    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing announcement
exports.updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { text, category } = req.body;

  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { text, category, date: Date.now() },
      { new: true }
    );
    if (!updatedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove an announcement
exports.removeAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(204).json(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};