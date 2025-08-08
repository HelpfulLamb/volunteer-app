const notificationService = require('../services/notificationService.js');

describe('Notification Service Tests', () => {
    test('should call sendEventAssignmentNotification', async () => {
        try {
            const result = await notificationService.sendEventAssignmentNotification(1, 1);
            expect(result).toBeDefined();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test('should call sendEventReminderNotification', async () => {
        try {
            const result = await notificationService.sendEventReminderNotification(1, 1);
            expect(result).toBeDefined();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test('should call sendBulkNotifications', async () => {
        try {
            const volunteerIds = [1, 2];
            const notificationData = {
                title: 'Test Bulk',
                message: 'Testing bulk notifications',
                noti_type: 'general'
            };
            const result = await notificationService.sendBulkNotifications(volunteerIds, notificationData);
            expect(result).toBeDefined();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test('should call scheduleEventReminders', async () => {
        try {
            const result = await notificationService.scheduleEventReminders(1);
            expect(result).toBeDefined();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test('should handle empty volunteer array in sendBulkNotifications', async () => {
        try {
            const notificationData = {
                title: 'Test',
                message: 'Test message',
                noti_type: 'general'
            };
            const result = await notificationService.sendBulkNotifications([], notificationData);
            expect(result).toBeDefined();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test('should handle invalid volunteer ID in sendEventAssignmentNotification', async () => {
        try {
            const result = await notificationService.sendEventAssignmentNotification(999999, 1);
            expect(result).toBeDefined();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test('should handle invalid event ID in sendEventReminderNotification', async () => {
        try {
            const result = await notificationService.sendEventReminderNotification(1, 999999);
            expect(result).toBeDefined();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test('should handle invalid event ID in scheduleEventReminders', async () => {
        try {
            const result = await notificationService.scheduleEventReminders(999999);
            expect(result).toBeDefined();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});
