const express = require('express');
const notificationController = require('../controllers/notificationController.js');
const notificationRouter = express();

// Get all notifications for a volunteer
notificationRouter.get('/volunteer/:volunteerId', notificationController.getNotificationsByVolunteer);

// Get a specific notification by ID
notificationRouter.get('/:id', notificationController.getNotificationById);

// Mark notification as read
notificationRouter.patch('/:id/read', notificationController.markNotificationAsRead);

// Delete a notification
notificationRouter.delete('/:id', notificationController.deleteNotification);

// Get unread notification count for a volunteer
notificationRouter.get('/volunteer/:volunteerId/unread-count', notificationController.getUnreadNotificationCount);

// Send event assignment notification
notificationRouter.post('/send/assignment', notificationController.sendEventAssignmentNotification);

// Send event reminder notification
notificationRouter.post('/send/reminder', notificationController.sendEventReminderNotification);

// Send bulk notifications
notificationRouter.post('/send/bulk', notificationController.sendBulkNotifications);

// Schedule event reminders (admin endpoint)
notificationRouter.post('/schedule/reminders', notificationController.scheduleEventReminders);

module.exports = {
    notificationRouter
}; 