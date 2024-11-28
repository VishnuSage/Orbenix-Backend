// routes/NotificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');

// Route to fetch all notifications
router.get('/', notificationController.getNotifications);

// Route to create a new notification
router.post('/', notificationController.createNotification);

// Route to delete a notification by ID
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;