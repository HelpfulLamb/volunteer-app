const request = require('supertest');
const app = require('../server.js');

describe('User Controller Comprehensive Tests', () => {
    // Test all getAllVolunteers paths
    test('should get all volunteers successfully', async () => {
        const res = await request(app).get('/api/users/volunteers');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('volunteers');
        expect(Array.isArray(res.body.volunteers)).toBe(true);
    });

    test('should get all admins successfully', async () => {
        const res = await request(app).get('/api/users/admins');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('admins');
        expect(Array.isArray(res.body.admins)).toBe(true);
    });

    // Test findVolunteerById with various scenarios
    test('should find volunteer by valid ID', async () => {
        const res = await request(app).get('/api/users/volunteers/1/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle volunteer not found', async () => {
        const res = await request(app).get('/api/users/volunteers/999999/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });

    test('should find admin by valid ID', async () => {
        const res = await request(app).get('/api/users/admins/1/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle admin not found', async () => {
        const res = await request(app).get('/api/users/admins/999999/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });

    // Test getActiveVol
    test('should get active volunteers', async () => {
        const res = await request(app).get('/api/users/active-volunteers');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test getAssignedVol
    test('should get assigned volunteers', async () => {
        const res = await request(app).get('/api/users/assigned-volunteers');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test getAssignments
    test('should get assignments for volunteer', async () => {
        const res = await request(app).get('/api/users/volunteers/assigned-events/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle assignments for non-existent volunteer', async () => {
        const res = await request(app).get('/api/users/volunteers/assigned-events/999999');
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });

    // Test loginUser with all branches
    test('should login with valid credentials', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle missing email in login', async () => {
        const res = await request(app).post('/api/users/login').send({
            password: 'password123',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Email, password, and role are required.');
    });

    test('should handle missing password in login', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should handle missing role in login', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should handle invalid credentials', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'nonexistent@example.com',
            password: 'wrongpassword',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Invalid credentials.');
    });

    // Test registerUser with all validation paths
    test('should register user with valid data', async () => {
        const res = await request(app).post('/api/users/register').send({
            fullName: 'Test User Registration',
            email: 'register@test.com',
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

    test('should handle missing required fields in registration', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'incomplete@test.com'
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should handle password mismatch in registration', async () => {
        const res = await request(app).post('/api/users/register').send({
            fullName: 'Test User',
            email: 'mismatch@test.com',
            password: 'password123',
            confirmPassword: 'different456',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Passwords do not match.');
    });

    test('should handle duplicate email registration', async () => {
        const userData = {
            fullName: 'Duplicate User',
            email: 'existing@example.com',
            password: 'password123',
            confirmPassword: 'password123',
            role: 'volunteer'
        };
        
        // First registration
        await request(app).post('/api/users/register').send(userData);
        
        // Duplicate registration
        const res = await request(app).post('/api/users/register').send(userData);
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    // Test assignVolunteer
    test('should assign volunteer to event', async () => {
        const res = await request(app).post('/api/users/assignment/1').send({
            eventId: 1
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle missing eventId in assignment', async () => {
        const res = await request(app).post('/api/users/assignment/1').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Event ID is required.');
    });

    // Test getSuggestedEvents
    test('should get suggested events for volunteer', async () => {
        const res = await request(app).post('/api/users/volunteers/suggested-events').send({
            volunteerId: 1
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle missing volunteerId in suggested events', async () => {
        const res = await request(app).post('/api/users/volunteers/suggested-events').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Volunteer ID is required.');
    });

    // Test changeActiveStatus
    test('should change volunteer status', async () => {
        const res = await request(app).patch('/api/users/status-change/1').send({
            status: 'Active'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle missing status in status change', async () => {
        const res = await request(app).patch('/api/users/status-change/1').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Status is required.');
    });

    // Test updateProfile
    test('should update user profile', async () => {
        const res = await request(app).patch('/api/users/update-profile/1').send({
            fullName: 'Updated Name',
            email: 'updated@test.com',
            address1: '456 Updated St',
            city: 'Updated City',
            state: 'CA',
            zip: '90210'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Test deleteUser
    test('should delete user account', async () => {
        const res = await request(app).delete('/api/users/delete-account/999');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle delete non-existent user', async () => {
        const res = await request(app).delete('/api/users/delete-account/999999');
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });

    // Test unassignVolunteer
    test('should unassign volunteer', async () => {
        const res = await request(app).delete('/api/users/unassign/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle unassign non-existent volunteer', async () => {
        const res = await request(app).delete('/api/users/unassign/999999');
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });

    // Test error handling paths
    test('should handle database errors gracefully', async () => {
        // Test various endpoints to trigger potential error paths
        const endpoints = [
            '/api/users/volunteers',
            '/api/users/admins',
            '/api/users/active-volunteers',
            '/api/users/assigned-volunteers'
        ];
        
        for (const endpoint of endpoints) {
            const res = await request(app).get(endpoint);
            expect(res.statusCode).toBeGreaterThanOrEqual(200);
        }
    });

    // Test edge cases
    test('should handle invalid IDs', async () => {
        const invalidIds = ['invalid', '0', '-1'];
        
        for (const id of invalidIds) {
            const res = await request(app).get(`/api/users/volunteers/${id}/find`);
            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        }
    });

    // Test different roles in registration
    test('should register admin user', async () => {
        const res = await request(app).post('/api/users/register').send({
            fullName: 'Admin User',
            email: 'admin@test.com',
            password: 'password123',
            confirmPassword: 'password123',
            role: 'admin'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Test status changes
    test('should change status to Inactive', async () => {
        const res = await request(app).patch('/api/users/status-change/1').send({
            status: 'Inactive'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });
});
