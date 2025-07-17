const nodemailer = require('nodemailer');
const moment = require('moment');
const notificationModel = require('../models/notificationModel');
const userModel = require('../models/userModel');
const eventModel = require('../models/eventModel');

// Email transporter configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

class NotificationService {
    // Send event assignment notification
    static async sendEventAssignmentNotification(volunteerId, eventId) {
        try {
            const volunteer = userModel.findVolById(volunteerId);
            const event = eventModel.findEventById(eventId);
            
            if (!volunteer || !event) {
                throw new Error('Volunteer or event not found');
            }

            const title = 'New Event Assignment';
            const message = `You have been assigned to "${event.event_name}" event on ${event.event_date}. Location: ${event.event_location}`;
            
            // Create notification record
            const notification = notificationModel.createNotification({
                volunteerId,
                eventId,
                type: 'event_assignment',
                title,
                message
            });

            // Send email notification
            await this.sendEmail(volunteer.name, title, message);
            
            return notification;
        } catch (error) {
            console.error('Error sending event assignment notification:', error);
            throw error;
        }
    }

    // Send event reminder notification
    static async sendEventReminderNotification(volunteerId, eventId) {
        try {
            const volunteer = userModel.findVolById(volunteerId);
            const event = eventModel.findEventById(eventId);
            
            if (!volunteer || !event) {
                throw new Error('Volunteer or event not found');
            }

            const title = 'Event Reminder';
            const message = `Reminder: "${event.event_name}" event is tomorrow at ${event.event_location}`;
            
            // Create notification record
            const notification = notificationModel.createNotification({
                volunteerId,
                eventId,
                type: 'event_reminder',
                title,
                message
            });

            // Send email notification
            await this.sendEmail(volunteer.name, title, message);
            
            return notification;
        } catch (error) {
            console.error('Error sending event reminder notification:', error);
            throw error;
        }
    }

    // Send event update notification
    static async sendEventUpdateNotification(volunteerId, eventId, updateDetails) {
        try {
            const volunteer = userModel.findVolById(volunteerId);
            const event = eventModel.findEventById(eventId);
            
            if (!volunteer || !event) {
                throw new Error('Volunteer or event not found');
            }

            const title = 'Event Update';
            const message = `The "${event.event_name}" event has been updated: ${updateDetails}`;
            
            // Create notification record
            const notification = notificationModel.createNotification({
                volunteerId,
                eventId,
                type: 'event_update',
                title,
                message
            });

            // Send email notification
            await this.sendEmail(volunteer.name, title, message);
            
            return notification;
        } catch (error) {
            console.error('Error sending event update notification:', error);
            throw error;
        }
    }

    // Send email using nodemailer
    static async sendEmail(recipientName, subject, message) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'your-email@gmail.com',
                to: `${recipientName.toLowerCase().replace(' ', '.')}@example.com`, // Mock email
                subject: `Volunteer App - ${subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2c3e50;">Volunteer App Notification</h2>
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                            <h3 style="color: #34495e;">${subject}</h3>
                            <p style="color: #555; line-height: 1.6;">${message}</p>
                        </div>
                        <p style="color: #7f8c8d; font-size: 12px; margin-top: 20px;">
                            This is an automated message from the Volunteer App.
                        </p>
                    </div>
                `
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    // Send bulk notifications to multiple volunteers
    static async sendBulkNotifications(volunteerIds, eventId, type, title, message) {
        try {
            const notifications = [];
            const emailPromises = [];

            for (const volunteerId of volunteerIds) {
                const volunteer = userModel.findVolById(volunteerId);
                if (volunteer) {
                    // Create notification record
                    const notification = notificationModel.createNotification({
                        volunteerId,
                        eventId,
                        type,
                        title,
                        message
                    });
                    notifications.push(notification);

                    // Send email notification
                    emailPromises.push(this.sendEmail(volunteer.name, title, message));
                }
            }

            // Send all emails in parallel
            await Promise.all(emailPromises);
            
            return notifications;
        } catch (error) {
            console.error('Error sending bulk notifications:', error);
            throw error;
        }
    }

    // Schedule reminder notifications for upcoming events
    static async scheduleEventReminders() {
        try {
            const events = eventModel.getAllEvents();
            const today = moment();
            const tomorrow = moment().add(1, 'day');

            for (const event of events) {
                const eventDate = moment(event.event_date);
                
                // Send reminders for events happening tomorrow
                if (eventDate.isSame(tomorrow, 'day')) {
                    // Get volunteers assigned to this event (mock data for now)
                    const assignedVolunteers = [1, 2]; // This would come from match data
                    
                    for (const volunteerId of assignedVolunteers) {
                        await this.sendEventReminderNotification(volunteerId, event.id);
                    }
                }
            }
        } catch (error) {
            console.error('Error scheduling event reminders:', error);
            throw error;
        }
    }
}

module.exports = NotificationService; 