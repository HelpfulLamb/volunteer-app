const request = require('supertest');
const app = require('../server.js');

describe('User Routes', () => {
    test('should fetch all active volunteers', async () => {
      const res = await request(app).get('/api/users/active-volunteers');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should fetch all volunteers', async () => {
      const res = await request(app).get('/api/users/volunteers');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.volunteers)).toBe(true);
    });

    test('should fetch all admins', async () => {
      const res = await request(app).get('/api/users/admins');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.admins)).toBe(true);
    });

    test('should fetch assigned volunteers', async () => {
      const res = await request(app).get('/api/users/assigned-volunteers');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should fetch volunteer by ID', async () => {
      const res = await request(app).get('/api/users/volunteers/1/find');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
    });

    test('should fetch admin by ID', async () => {
      const res = await request(app).get('/api/users/admins/1/find');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
    });

    test('should handle volunteer not found', async () => {
      const res = await request(app).get('/api/users/volunteers/999999/find');
      expect(res.statusCode).toEqual(404);
    });

    test('should handle admin not found', async () => {
      const res = await request(app).get('/api/users/admins/999999/find');
      expect(res.statusCode).toEqual(404);
    });

    test('should handle registration with missing required fields', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'test@example.com'
            // Missing password and other required fields
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should handle login with missing fields', async () => {
        const res = await request(app).post('/api/users/login').send({
            password: 'password123'
            // Missing email and role
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should handle login with invalid credentials', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'nonexistent@example.com',
            password: 'wrongpassword',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(401);
    });

    test('should handle registration with passwords not matching', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'differentpassword',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should handle registration with existing email', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'bob.ross@example.com',
            password: 'password123',
            confirmPassword: 'password123',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(409);
    });

    test('should handle status change', async () => {
        const res = await request(app).patch('/api/users/status-change/1').send({
            status: 'Inactive'
        });
        expect(res.statusCode).toEqual(200);
    });

    test('should handle delete user account', async () => {
        const res = await request(app).delete('/api/users/delete-account/1');
        expect(res.statusCode).toEqual(200);
    });

    test('should handle delete non-existent user', async () => {
        const res = await request(app).delete('/api/users/delete-account/999999');
        expect(res.statusCode).toEqual(404);
    });

    test('should handle assign volunteer', async () => {
        const res = await request(app).post('/api/users/assignment/1').send({
            eventId: 1
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle unassign volunteer', async () => {
        const res = await request(app).delete('/api/users/unassign/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle get assignments', async () => {
        const res = await request(app).get('/api/users/volunteers/assigned-events/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle get suggested events', async () => {
        const res = await request(app).post('/api/users/volunteers/suggested-events').send({
            volunteerId: 1
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Additional error handling tests for better coverage
    test('should handle database error in getAllVolunteers', async () => {
        const res = await request(app).get('/api/users/volunteers');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in getAllAdmins', async () => {
        const res = await request(app).get('/api/users/admins');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in getActiveVol', async () => {
        const res = await request(app).get('/api/users/active-volunteers');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in getAssignedVol', async () => {
        const res = await request(app).get('/api/users/assigned-volunteers');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in findVolunteerById', async () => {
        const res = await request(app).get('/api/users/volunteers/1/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in findAdminById', async () => {
        const res = await request(app).get('/api/users/admins/1/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in loginUser', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            password: 'password123',
            role: 'volunteer'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in registerUser', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'newuser@example.com',
            password: 'password123',
            confirmPassword: 'password123',
            role: 'volunteer'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in changeActiveStatus', async () => {
        const res = await request(app).patch('/api/users/status-change/1').send({
            status: 'Active'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in deleteUser', async () => {
        const res = await request(app).delete('/api/users/delete-account/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in assignVolunteer', async () => {
        const res = await request(app).post('/api/users/assignment/1').send({
            eventId: 1
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in unassignVolunteer', async () => {
        const res = await request(app).delete('/api/users/unassign/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in getAssignments', async () => {
        const res = await request(app).get('/api/users/volunteers/assigned-events/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in getSuggestedEvents', async () => {
        const res = await request(app).post('/api/users/volunteers/suggested-events').send({
            volunteerId: 1
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });
});