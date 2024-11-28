// models/AnnouncementModel.js
const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Policy Updates", "Events", "Important Dates"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Announcement = mongoose.model("Announcement", AnnouncementSchema);

module.exports = Announcement;