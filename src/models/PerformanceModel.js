const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: true,
      index: true, // Index for faster searches
    },
    month: {
      type: String,
      required: true,
    },
    performance: {
      type: Number,
      required: true,
      min: 0, // Minimum value
      max: 100, // Maximum value
    },
    target: {
      type: Number,
      default: 100,
      min: 0, // Minimum value
    },
  },
  { timestamps: true }
);

const trainingSchema = new mongoose.Schema({
  trainingId: {
    type: Number,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
  },
});

// Static method to get the next trainingId
trainingSchema.statics.getNextTrainingId = async function () {
  const lastTraining = await this.findOne().sort({ trainingId: -1 }).exec();
  if (!lastTraining) {
    return 1; // Start from 1 if no records exist
  }
  return lastTraining.trainingId + 1; // Increment the last trainingId
};

const Performance = mongoose.model("Performance", performanceSchema);
const Training = mongoose.model("Training", trainingSchema);

module.exports = { Performance, Training };
