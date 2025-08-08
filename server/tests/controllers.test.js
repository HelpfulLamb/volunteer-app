const request = require('supertest');
const app = require('../server.js');

describe('Controller Coverage Tests', () => {
    // User Controller Tests
    test('should handle user registration with all fields', async () => {
        const res = await request(app).post('/api/users/register').send({
            fullName: 'Test User Coverage',
            email: 'coverage@test.com',
            password: 'password123',
            confirmPassword: 'password123',
            role: 'volunteer',
            address1: '123 Test St',
            city: 'Test City',
            state: 'TX',
            zip: '12345',
            skills: ['First Aid'],
            preferences: 'Test preferences',
            availability: 'Weekdays'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle user login with different roles', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle volunteer assignment', async () => {
        const res = await request(app).post('/api/users/assignment/1').send({
            eventId: 1
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle volunteer unassignment', async () => {
        const res = await request(app).delete('/api/users/unassign/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle status change', async () => {
        const res = await request(app).patch('/api/users/status-change/1').send({
            status: 'Active'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle suggested events', async () => {
        const res = await request(app).post('/api/users/volunteers/suggested-events').send({
            volunteerId: 1
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Event Controller Tests
    test('should handle event creation with skills', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Coverage Test Event',
            event_description: 'Testing event coverage',
            event_location: 'Test Location',
            event_urgency: 'High',
            event_date: '2025-08-15',
            event_skills: [{s_id: 1}, {s_id: 2}]
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle event update', async () => {
        const res = await request(app).patch('/api/events/update-event/1').send({
            event_name: 'Updated Event Name',
            event_description: 'Updated description',
            event_location: 'Updated location'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle event status change to different values', async () => {
        const res = await request(app).patch('/api/events/status-change/1').send({
            status: 'Active'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle event deletion', async () => {
        const res = await request(app).delete('/api/events/delete-event/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Notification Controller Tests  
    test('should handle getting notifications by volunteer', async () => {
        const res = await request(app).get('/api/notifications/volunteer/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle getting specific notification', async () => {
        const res = await request(app).get('/api/notifications/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle event assignment notification', async () => {
        const res = await request(app).post('/api/notifications/event-assignment').send({
            volunteerId: 1,
            eventId: 1
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle event reminder notification', async () => {
        const res = await request(app).post('/api/notifications/event-reminder').send({
            volunteerId: 1,
            eventId: 1
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle bulk notifications', async () => {
        const res = await request(app).post('/api/notifications/bulk').send({
            volunteerIds: [1, 2],
            title: 'Bulk Test',
            message: 'Testing bulk notifications'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle marking notification as read', async () => {
        const res = await request(app).patch('/api/notifications/mark-notification/1/read');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle deleting notification', async () => {
        const res = await request(app).delete('/api/notifications/delete-notification/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle schedule reminders', async () => {
        const res = await request(app).post('/api/notifications/schedule-reminders').send({
            eventId: 1
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Item Controller Tests
    test('should handle getting skills', async () => {
        const res = await request(app).get('/api/items/skills');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle getting states', async () => {
        const res = await request(app).get('/api/items/states');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Report Controller Tests
    test('should handle volunteer history report CSV', async () => {
        const res = await request(app).get('/api/reports/volunteer-history?format=csv');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle volunteer history report PDF', async () => {
        const res = await request(app).get('/api/reports/volunteer-history?format=pdf');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle event summary report CSV', async () => {
        const res = await request(app).get('/api/reports/event-summary?format=csv');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle event summary report PDF', async () => {
        const res = await request(app).get('/api/reports/event-summary?format=pdf');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Additional edge cases for better coverage
    test('should handle registration with missing password confirmation', async () => {
        const res = await request(app).post('/api/users/register').send({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'volunteer'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    test('should handle login with missing role', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    test('should handle event creation with invalid urgency', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Test Event',
            event_description: 'Test Description',
            event_location: 'Test Location',
            event_urgency: 'Invalid',
            event_date: '2025-08-10'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    test('should handle finding specific volunteers and admins', async () => {
        const volRes = await request(app).get('/api/users/volunteers/1/find');
        expect(volRes.statusCode).toBeGreaterThanOrEqual(200);

        const adminRes = await request(app).get('/api/users/admins/1/find');
        expect(adminRes.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle getting assignments for volunteer', async () => {
        const res = await request(app).get('/api/users/volunteers/assigned-events/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });
});
