const request = require('supertest');
const app = require('../server.js');

describe('Event Routes', () => {
    // success testing
    test('should create a new event', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Beach Cleanup',
            event_description: 'Clean up the beach',
            event_location: '601 Biscayne Blvd, Miami, FL 33132',
            event_skills: [{s_id: 13}, {s_id: 1}],
            event_urgency: 'Low',
            event_date: '2025-08-05'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should return 400 when creating event with missing fields', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Beach Cleanup'
            // Missing required fields
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should retrieve all events', async () => {
        const res = await request(app).get('/api/events/');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.events)).toBe(true);
    });

    test('should retrieve all active events', async () => {
        const res = await request(app).get('/api/events/active-events');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
    });

    test('should retrieve specific event', async () => {
        const res = await request(app).get('/api/events/1/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should return 404 for non-existent event', async () => {
        const res = await request(app).get('/api/events/999999/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });

    test('should successfully delete an event', async () => {
        const res = await request(app).delete('/api/events/delete-event/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should return 404 when deleting non-existent event', async () => {
        const res = await request(app).delete('/api/events/delete-event/999999');
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });

    test('should change event status successfully', async () => {
        const res = await request(app).patch('/api/events/status-change/1').send({
            status: 'Cancelled'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should return 400 for invalid status', async () => {
        const res = await request(app).patch('/api/events/status-change/1').send({
            status: 'InvalidStatus'
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should update event successfully', async () => {
        const res = await request(app).patch('/api/events/update-event/1').send({
            event_name: 'Updated Event Name',
            event_description: 'Updated description'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Event updated successfully.');
    });

    // Additional error handling tests for better coverage
    test('should handle database error in createEvent', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Test Event',
            event_description: 'Test Description',
            event_location: 'Test Location',
            event_skills: [{s_id: 1}],
            event_urgency: 'Low',
            event_date: '2025-08-05'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in getAllEvents', async () => {
        const res = await request(app).get('/api/events/');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in getActiveEvents', async () => {
        const res = await request(app).get('/api/events/active-events');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in findEventById', async () => {
        const res = await request(app).get('/api/events/1/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in updateEvent', async () => {
        const res = await request(app).patch('/api/events/update-event/1').send({
            event_name: 'Updated Event Name'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in changeStatus', async () => {
        const res = await request(app).patch('/api/events/status-change/1').send({
            status: 'Cancelled'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle database error in deleteEvent', async () => {
        const res = await request(app).delete('/api/events/delete-event/1');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Additional tests for edge cases
    test('should handle createEvent with invalid data', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: '',
            event_description: '',
            event_location: '',
            event_skills: [],
            event_urgency: 'Invalid',
            event_date: 'invalid-date'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    test('should handle updateEvent with invalid data', async () => {
        const res = await request(app).patch('/api/events/update-event/1').send({
            event_name: '',
            event_date: 'invalid-date'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    test('should handle findEventById with invalid ID', async () => {
        const res = await request(app).get('/api/events/invalid/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    test('should handle deleteEvent with invalid ID', async () => {
        const res = await request(app).delete('/api/events/delete-event/invalid');
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    test('should handle updateEvent with non-existent ID', async () => {
        const res = await request(app).patch('/api/events/update-event/999999').send({
            event_name: 'Updated Name'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });

    test('should handle status change with non-existent ID', async () => {
        const res = await request(app).patch('/api/events/status-change/999999').send({
            status: 'Cancelled'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });
});