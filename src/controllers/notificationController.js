// controllers/NotificationController.js
const Notification = require('../models/NotificationModel');

// Fetch all notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create a new notification
exports.createNotification = async (req, res) => {
  const { text, type } = req.body;

  try {
    const notification = new Notification({ text, type });
    await notification.save();
    return res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return res.status(400).json({ message: 'Bad request' });
  }
};

// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    return res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};