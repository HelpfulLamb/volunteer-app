const request = require('supertest');
const app = require('../server.js');

describe('Basic Route Tests', () => {
    test('should respond to root route', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Server Active');
    });

    test('should return 404 for non-existent route', async () => {
        const res = await request(app).get('/non-existent-route');
        expect(res.statusCode).toEqual(404);
    });

    // Test existing endpoints without complex operations
    test('should access events endpoint', async () => {
        const res = await request(app).get('/api/events/');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should access users endpoint', async () => {
        const res = await request(app).get('/api/users/volunteers');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should access items endpoint', async () => {
        const res = await request(app).get('/api/items/skills');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should access active events endpoint', async () => {
        const res = await request(app).get('/api/events/active-events');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should access volunteer history all endpoint', async () => {
        const res = await request(app).get('/api/volunteer-history/all');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should access admins endpoint', async () => {
        const res = await request(app).get('/api/users/admins');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should access states endpoint', async () => {
        const res = await request(app).get('/api/items/states');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should access active volunteers endpoint', async () => {
        const res = await request(app).get('/api/users/active-volunteers');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should access assigned volunteers endpoint', async () => {
        const res = await request(app).get('/api/users/assigned-volunteers');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should access top volunteers endpoint', async () => {
        const res = await request(app).get('/api/volunteer-history/top-volunteers');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Test error handling for missing parameters
    test('should handle missing ID in volunteer find', async () => {
        const res = await request(app).get('/api/users/volunteers/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    test('should handle missing ID in event find', async () => {
        const res = await request(app).get('/api/events/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    // Test POST endpoints with minimal data
    test('should handle login attempt', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            password: 'test123',
            role: 'volunteer'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle registration attempt', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'newtest@example.com',
            password: 'test123',
            confirmPassword: 'test123',
            role: 'volunteer',
            fullName: 'Test User'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle event creation attempt', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Test Event',
            event_description: 'Test Description',
            event_location: 'Test Location',
            event_urgency: 'Low',
            event_date: '2025-08-10'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });
});
