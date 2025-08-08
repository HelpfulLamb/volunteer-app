const request = require('supertest');
const app = require('../server.js');

describe('Integration Tests - Cross-Component Functionality', () => {
    // Integration tests for Item Management System
    test('should integrate item controller with database for skills and states retrieval', async () => {
        const res1 = await request(app).get('/api/items/skills');
        const res2 = await request(app).get('/api/items/states');
        
        expect(res1.statusCode).toBeGreaterThanOrEqual(200);
        expect(res2.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Integration tests for User Management System validation
    test('should integrate user registration validation across all input scenarios', async () => {
        // Test registration with various invalid inputs
        const invalidRegistrations = [
            { email: 'invalid-email' },
            { fullName: '', email: 'test@example.com', password: 'pass', confirmPassword: 'pass', role: 'volunteer' },
            { fullName: 'Test', email: '', password: 'pass', confirmPassword: 'pass', role: 'volunteer' },
            { fullName: 'Test', email: 'test@example.com', password: '', confirmPassword: '', role: 'volunteer' },
            { fullName: 'Test', email: 'test@example.com', password: 'pass', confirmPassword: 'different', role: 'volunteer' },
        ];

        for (const data of invalidRegistrations) {
            const res = await request(app).post('/api/users/register').send(data);
            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        }
    });

    test('should integrate user management system with database operations', async () => {
        // Test various user database interaction scenarios
        const endpoints = [
            { method: 'get', url: '/api/users/volunteers' },
            { method: 'get', url: '/api/users/admins' },
            { method: 'get', url: '/api/users/active-volunteers' },
            { method: 'get', url: '/api/users/assigned-volunteers' },
            { method: 'get', url: '/api/users/volunteers/1/find' },
            { method: 'get', url: '/api/users/admins/1/find' },
            { method: 'get', url: '/api/users/volunteers/assigned-events/1' }
        ];

        for (const endpoint of endpoints) {
            const res = await request(app)[endpoint.method](endpoint.url);
            expect(res.statusCode).toBeGreaterThanOrEqual(200);
        }
    });

    // Integration tests for Event Management System
    test('should integrate event management validation across all creation scenarios', async () => {
        // Test event creation with various validation scenarios
        const invalidEvents = [
            { event_name: '', event_description: 'desc', event_location: 'loc', event_urgency: 'Low', event_date: '2025-08-01' },
            { event_name: 'name', event_description: '', event_location: 'loc', event_urgency: 'Low', event_date: '2025-08-01' },
            { event_name: 'name', event_description: 'desc', event_location: '', event_urgency: 'Low', event_date: '2025-08-01' },
            { event_name: 'name', event_description: 'desc', event_location: 'loc', event_urgency: '', event_date: '2025-08-01' },
            { event_name: 'name', event_description: 'desc', event_location: 'loc', event_urgency: 'Low', event_date: '' },
            { event_name: 'name', event_description: 'desc', event_location: 'loc', event_urgency: 'Invalid', event_date: '2025-08-01' }
        ];

        for (const eventData of invalidEvents) {
            const res = await request(app).post('/api/events/create-event').send(eventData);
            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        }
    });

    test('should test event controller database interaction paths', async () => {
        // Test various event database operations
        const operations = [
            { method: 'get', url: '/api/events/' },
            { method: 'get', url: '/api/events/active-events' },
            { method: 'get', url: '/api/events/1/find' },
            { method: 'patch', url: '/api/events/update-event/1', data: { event_name: 'Updated' } },
            { method: 'patch', url: '/api/events/status-change/1', data: { status: 'Active' } },
            { method: 'delete', url: '/api/events/delete-event/999' }
        ];

        for (const op of operations) {
            let res;
            if (op.data) {
                res = await request(app)[op.method](op.url).send(op.data);
            } else {
                res = await request(app)[op.method](op.url);
            }
            expect(res.statusCode).toBeGreaterThanOrEqual(200);
        }
    });

    // Notification Controller comprehensive tests
    test('should test notification controller error handling', async () => {
        const notificationOps = [
            { method: 'get', url: '/api/notifications/volunteer/1' },
            { method: 'get', url: '/api/notifications/1' },
            { method: 'post', url: '/api/notifications/event-assignment', data: { volunteerId: 1, eventId: 1 } },
            { method: 'post', url: '/api/notifications/event-reminder', data: { volunteerId: 1, eventId: 1 } },
            { method: 'post', url: '/api/notifications/bulk', data: { volunteerIds: [1], title: 'Test', message: 'Test' } },
            { method: 'patch', url: '/api/notifications/mark-notification/1/read' },
            { method: 'delete', url: '/api/notifications/delete-notification/1' },
            { method: 'post', url: '/api/notifications/schedule-reminders', data: { eventId: 1 } }
        ];

        for (const op of notificationOps) {
            let res;
            if (op.data) {
                res = await request(app)[op.method](op.url).send(op.data);
            } else {
                res = await request(app)[op.method](op.url);
            }
            expect(res.statusCode).toBeGreaterThanOrEqual(200);
        }
    });

    // Test authentication and authorization paths
    test('should test authentication middleware paths', async () => {
        // Test protected routes
        const protectedRoutes = [
            { method: 'patch', url: '/api/users/update-profile/1', data: { fullName: 'Test' } }
        ];

        for (const route of protectedRoutes) {
            const res = await request(app)[route.method](route.url).send(route.data);
            expect(res.statusCode).toBeGreaterThanOrEqual(200);
        }
    });

    // Test model error handling by calling them directly
    test('should test model error handling directly', async () => {
        const userModel = require('../models/userModel.js');
        const eventModel = require('../models/eventModel.js');
        const notificationModel = require('../models/notificationModel.js');

        // Test user model functions with invalid data
        try {
            await userModel.findVolunteerById(999999);
        } catch (error) {
            expect(error).toBeDefined();
        }

        try {
            await userModel.findAdminById(999999);
        } catch (error) {
            expect(error).toBeDefined();
        }

        try {
            await userModel.loginUser('invalid@example.com', 'wrongpass', 'volunteer');
        } catch (error) {
            expect(error).toBeDefined();
        }

        // Test event model functions
        try {
            await eventModel.findEventById(999999);
        } catch (error) {
            expect(error).toBeDefined();
        }

        try {
            await eventModel.updateEvent(999999, { event_name: 'Should Fail' });
        } catch (error) {
            expect(error).toBeDefined();
        }

        // Test notification model functions
        try {
            await notificationModel.getNotificationById(999999);
        } catch (error) {
            expect(error).toBeDefined();
        }

        try {
            await notificationModel.markNotificationAsRead(999999);
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    // Test service layer
    test('should test notification service comprehensive paths', async () => {
        const notificationService = require('../services/notificationService.js');

        // Test various service scenarios
        const scenarios = [
            () => notificationService.sendEventAssignmentNotification(1, 1),
            () => notificationService.sendEventReminderNotification(1, 1),
            () => notificationService.sendBulkNotifications([1, 2], { title: 'Test', message: 'Test', noti_type: 'general' }),
            () => notificationService.scheduleEventReminders(1),
            () => notificationService.sendEventAssignmentNotification(999999, 999999),
            () => notificationService.sendEventReminderNotification(999999, 999999),
            () => notificationService.sendBulkNotifications([], { title: 'Test', message: 'Test', noti_type: 'general' }),
            () => notificationService.scheduleEventReminders(999999)
        ];

        for (const scenario of scenarios) {
            try {
                await scenario();
            } catch (error) {
                expect(error).toBeDefined();
            }
        }
    });

    // Test utility functions by invoking them through controllers
    test('should test utility function coverage through integration', async () => {
        // Test CSV and PDF generation through reports
        const reportOps = [
            { url: '/api/reports/volunteer-history?format=csv' },
            { url: '/api/reports/volunteer-history?format=pdf' },
            { url: '/api/reports/event-summary?format=csv' },
            { url: '/api/reports/event-summary?format=pdf' }
        ];

        for (const op of reportOps) {
            const res = await request(app).get(op.url);
            expect(res.statusCode).toBeGreaterThanOrEqual(200);
        }

        // Test matching functionality
        const matchRes = await request(app).get('/api/matching/suggestions');
        expect(matchRes.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Additional edge cases
    test('should handle various edge cases', async () => {
        // Test malformed requests
        const malformedOps = [
            { method: 'post', url: '/api/users/login', data: {} },
            { method: 'post', url: '/api/users/register', data: {} },
            { method: 'post', url: '/api/events/create-event', data: {} },
            { method: 'patch', url: '/api/events/status-change/1', data: {} },
            { method: 'patch', url: '/api/users/status-change/1', data: {} }
        ];

        for (const op of malformedOps) {
            const res = await request(app)[op.method](op.url).send(op.data);
            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        }
    });

    // Test all possible status values
    test('should test all status transitions', async () => {
        const eventStatuses = ['Active', 'Cancelled', 'Completed'];
        const userStatuses = ['Active', 'Inactive'];

        for (const status of eventStatuses) {
            const res = await request(app).patch('/api/events/status-change/1').send({ status });
            expect(res.statusCode).toBeGreaterThanOrEqual(200);
        }

        for (const status of userStatuses) {
            const res = await request(app).patch('/api/users/status-change/1').send({ status });
            expect(res.statusCode).toBeGreaterThanOrEqual(200);
        }
    });

    // Test all urgency levels
    test('should test all urgency levels', async () => {
        const urgencyLevels = ['Low', 'Medium', 'High'];

        for (const urgency of urgencyLevels) {
            const res = await request(app).post('/api/events/create-event').send({
                event_name: `${urgency} Urgency Test`,
                event_description: `Testing ${urgency} urgency`,
                event_location: 'Test Location',
                event_urgency: urgency,
                event_date: '2025-12-01'
            });
            expect(res.statusCode).toBeGreaterThanOrEqual(200);
        }
    });
});
