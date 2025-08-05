const notificationModel = require('../models/notificationModel');
const NotificationService = require('../services/notificationService');
const userModel = require('../models/userModel.js');

// Get all notifications for a volunteer
const getNotificationsByVolunteer = async (req, res) => {
    try {
        const { volunteerId } = req.params;
        const id = parseInt(volunteerId);
        const volunteer = await userModel.findVolById(id);
        const admin = await userModel.findAdminById(id);
        if(!volunteer && !admin){
          return res.status(404).json({message: 'User not found.'});
        }
        const notifications = await notificationModel.getNotificationsByVolunteerId(parseInt(volunteerId));
        
        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('getNotificationsByVolunteer controller catch:', error.message);
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
        const notification = await notificationModel.getNotificationById(id);
        
        if (!notification) {
            return res.status(404).json({message: 'Notification not found'});
        }
        
        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error('getNotificationById controller catch:', error.message);
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
        //console.log(id);
        const notification = await notificationModel.markNotificationAsRead(id);
        
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
        console.error('markNotificationAsRead controller catch:', error.message);
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
        const notification = await notificationModel.deleteNotification(id);
        
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
        console.error('deleteNotification controller catch:', error.message);
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
        const count = await notificationModel.getUnreadNotificationCount(parseInt(volunteerId));
        
        res.status(200).json({
            success: true,
            data: { count }
        });
    } catch (error) {
        console.error('getUnreadNotificationCount controller catch:', error.message);
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
        console.error('sendEventAssignmentNotification controller catch:', error.message);
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
        console.error('sendEventReminderNotification controller catch:', error.message);
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
        console.error('sendBulkNotifications controller catch:', error.message);
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
        console.error('scheduleEventReminders controller catch:', error.message);
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