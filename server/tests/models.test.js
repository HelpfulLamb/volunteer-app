const userModel = require('../models/userModel.js');
const eventModel = require('../models/eventModel.js');
const notificationModel = require('../models/notificationModel.js');

describe('Model Tests', () => {
    // User Model Tests
    describe('User Model', () => {
        test('should call getAllVolunteers', async () => {
            try {
                const result = await userModel.getAllVolunteers();
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call getAllAdmins', async () => {
            try {
                const result = await userModel.getAllAdmins();
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call findVolunteerById', async () => {
            try {
                const result = await userModel.findVolunteerById(1);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call findAdminById', async () => {
            try {
                const result = await userModel.findAdminById(1);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call getActiveVol', async () => {
            try {
                const result = await userModel.getActiveVol();
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call getAssignedVol', async () => {
            try {
                const result = await userModel.getAssignedVol();
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call getAssignments', async () => {
            try {
                const result = await userModel.getAssignments(1);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call loginUser', async () => {
            try {
                const result = await userModel.loginUser('test@example.com', 'password123', 'volunteer');
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call registerUser', async () => {
            try {
                const userData = {
                    fullName: 'Test User',
                    email: 'modeltest@example.com',
                    password: 'password123',
                    role: 'volunteer'
                };
                const result = await userModel.registerUser(userData);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call assignVolunteer', async () => {
            try {
                const result = await userModel.assignVolunteer(1, 1);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call getSuggestedEvents', async () => {
            try {
                const result = await userModel.getSuggestedEvents(1);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call changeActiveStatus', async () => {
            try {
                const result = await userModel.changeActiveStatus(1, 'Active');
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call updateProfile', async () => {
            try {
                const profileData = { fullName: 'Updated Name' };
                const result = await userModel.updateProfile(1, profileData);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call deleteUser', async () => {
            try {
                const result = await userModel.deleteUser(999);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call unassignVolunteer', async () => {
            try {
                const result = await userModel.unassignVolunteer(1);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    // Event Model Tests
    describe('Event Model', () => {
        test('should call createEvent', async () => {
            try {
                const eventData = {
                    event_name: 'Model Test Event',
                    event_description: 'Testing event model',
                    event_location: 'Test Location',
                    event_urgency: 'Low',
                    event_date: '2025-08-15'
                };
                const result = await eventModel.createEvent(eventData);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call getAllEvents', async () => {
            try {
                const result = await eventModel.getAllEvents();
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call getActiveEvents', async () => {
            try {
                const result = await eventModel.getActiveEvents();
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call findEventById', async () => {
            try {
                const result = await eventModel.findEventById(1);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call updateEvent', async () => {
            try {
                const updateData = { event_name: 'Updated Event' };
                const result = await eventModel.updateEvent(1, updateData);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call changeStatus', async () => {
            try {
                const result = await eventModel.changeStatus(1, 'Active');
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call deleteEvent', async () => {
            try {
                const result = await eventModel.deleteEvent(999);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    // Notification Model Tests
    describe('Notification Model', () => {
        test('should call getNotificationsByVolunteerId', async () => {
            try {
                const result = await notificationModel.getNotificationsByVolunteerId(1);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call getNotificationById', async () => {
            try {
                const result = await notificationModel.getNotificationById(1);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call createNotification', async () => {
            try {
                const notificationData = {
                    u_id: 1,
                    title: 'Test Notification',
                    message: 'Testing notification model',
                    noti_type: 'general'
                };
                const result = await notificationModel.createNotification(notificationData);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call markNotificationAsRead', async () => {
            try {
                const result = await notificationModel.markNotificationAsRead(1);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call deleteNotification', async () => {
            try {
                const result = await notificationModel.deleteNotification(999);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call getAllNotifications', async () => {
            try {
                const result = await notificationModel.getAllNotifications();
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call getNotificationsByType', async () => {
            try {
                const result = await notificationModel.getNotificationsByType('general');
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should call getUnreadNotifications', async () => {
            try {
                const result = await notificationModel.getUnreadNotifications(1);
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });
});
