const notificationModel = require('../models/notificationModel');
const NotificationService = require('../services/notificationService');

// Get all notifications for a volunteer
const getNotificationsByVolunteer = async (req, res) => {
    try {
        const { volunteerId } = req.params;
        const notifications = notificationModel.getNotificationsByVolunteerId(parseInt(volunteerId));
        
        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get notifications',
            error: error.message
        });
    }
};

// Get a specific notification by ID
const getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = notificationModel.getNotificationById(id);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error('Error getting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get notification',
            error: error.message
        });
    }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = notificationModel.markNotificationAsRead(id);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: notification,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read',
            error: error.message
        });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = notificationModel.deleteNotification(id);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification',
            error: error.message
        });
    }
};

// Get unread notification count for a volunteer
const getUnreadNotificationCount = async (req, res) => {
    try {
        const { volunteerId } = req.params;
        const count = notificationModel.getUnreadNotificationCount(parseInt(volunteerId));
        
        res.status(200).json({
            success: true,
            data: { count }
        });
    } catch (error) {
        console.error('Error getting unread notification count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get unread notification count',
            error: error.message
        });
    }
};

// Send event assignment notification
const sendEventAssignmentNotification = async (req, res) => {
    try {
        const { volunteerId, eventId } = req.body;
        
        if (!volunteerId || !eventId) {
            return res.status(400).json({
                success: false,
                message: 'Volunteer ID and Event ID are required'
            });
        }
        
        const notification = await NotificationService.sendEventAssignmentNotification(
            parseInt(volunteerId), 
            parseInt(eventId)
        );
        
        res.status(201).json({
            success: true,
            data: notification,
            message: 'Event assignment notification sent successfully'
        });
    } catch (error) {
        console.error('Error sending event assignment notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send event assignment notification',
            error: error.message
        });
    }
};

// Send event reminder notification
const sendEventReminderNotification = async (req, res) => {
    try {
        const { volunteerId, eventId } = req.body;
        
        if (!volunteerId || !eventId) {
            return res.status(400).json({
                success: false,
                message: 'Volunteer ID and Event ID are required'
            });
        }
        
        const notification = await NotificationService.sendEventReminderNotification(
            parseInt(volunteerId), 
            parseInt(eventId)
        );
        
        res.status(201).json({
            success: true,
            data: notification,
            message: 'Event reminder notification sent successfully'
        });
    } catch (error) {
        console.error('Error sending event reminder notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send event reminder notification',
            error: error.message
        });
    }
};

// Send bulk notifications
const sendBulkNotifications = async (req, res) => {
    try {
        const { volunteerIds, eventId, type, title, message } = req.body;
        
        if (!volunteerIds || !Array.isArray(volunteerIds) || !eventId || !type || !title || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: volunteerIds (array), eventId, type, title, message'
            });
        }
        
        const notifications = await NotificationService.sendBulkNotifications(
            volunteerIds.map(id => parseInt(id)),
            parseInt(eventId),
            type,
            title,
            message
        );
        
        res.status(201).json({
            success: true,
            data: notifications,
            message: `Bulk notifications sent successfully to ${notifications.length} volunteers`
        });
    } catch (error) {
        console.error('Error sending bulk notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send bulk notifications',
            error: error.message
        });
    }
};

// Schedule event reminders (admin endpoint)
const scheduleEventReminders = async (req, res) => {
    try {
        await NotificationService.scheduleEventReminders();
        
        res.status(200).json({
            success: true,
            message: 'Event reminders scheduled successfully'
        });
    } catch (error) {
        console.error('Error scheduling event reminders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to schedule event reminders',
            error: error.message
        });
    }
};

module.exports = {
    getNotificationsByVolunteer,
    getNotificationById,
    markNotificationAsRead,
    deleteNotification,
    getUnreadNotificationCount,
    sendEventAssignmentNotification,
    sendEventReminderNotification,
    sendBulkNotifications,
    scheduleEventReminders
}; 