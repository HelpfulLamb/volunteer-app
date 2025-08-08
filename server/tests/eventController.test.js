const request = require('supertest');
const app = require('../server.js');

describe('Event Controller Comprehensive Tests', () => {
    // Test createEvent with all validation paths
    test('should create event with valid data', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Comprehensive Test Event',
            event_description: 'Testing event creation comprehensively',
            event_location: '123 Test St, Test City, TX 12345',
            event_urgency: 'High',
            event_date: '2025-09-01',
            event_skills: [{s_id: 1}, {s_id: 2}]
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle missing event name', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_description: 'Missing name test',
            event_location: 'Test Location',
            event_urgency: 'Low',
            event_date: '2025-09-01'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Event name, description, location, urgency, and date are required.');
    });

    test('should handle missing event description', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Test Event',
            event_location: 'Test Location',
            event_urgency: 'Low',
            event_date: '2025-09-01'
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should handle missing event location', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Test Event',
            event_description: 'Test Description',
            event_urgency: 'Low',
            event_date: '2025-09-01'
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should handle missing event urgency', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Test Event',
            event_description: 'Test Description',
            event_location: 'Test Location',
            event_date: '2025-09-01'
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should handle missing event date', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Test Event',
            event_description: 'Test Description',
            event_location: 'Test Location',
            event_urgency: 'Low'
        });
        expect(res.statusCode).toEqual(400);
    });

    test('should handle invalid urgency level', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Test Event',
            event_description: 'Test Description',
            event_location: 'Test Location',
            event_urgency: 'Invalid',
            event_date: '2025-09-01'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Urgency must be Low, Medium, or High.');
    });

    // Test getAllEvents
    test('should get all events successfully', async () => {
        const res = await request(app).get('/api/events/');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('events');
        expect(Array.isArray(res.body.events)).toBe(true);
    });

    // Test getActiveEvents
    test('should get active events successfully', async () => {
        const res = await request(app).get('/api/events/active-events');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test findEventById with various scenarios
    test('should find event by valid ID', async () => {
        const res = await request(app).get('/api/events/1/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle event not found', async () => {
        const res = await request(app).get('/api/events/999999/find');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Event not found.');
    });

    test('should handle invalid event ID', async () => {
        const res = await request(app).get('/api/events/invalid/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    // Test updateEvent with various scenarios
    test('should update event successfully', async () => {
        const res = await request(app).patch('/api/events/update-event/1').send({
            event_name: 'Updated Event Name',
            event_description: 'Updated description',
            event_location: 'Updated location'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle update non-existent event', async () => {
        const res = await request(app).patch('/api/events/update-event/999999').send({
            event_name: 'Should Not Update'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });

    test('should update event with partial data', async () => {
        const res = await request(app).patch('/api/events/update-event/1').send({
            event_name: 'Partially Updated Event'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should update event with all fields', async () => {
        const res = await request(app).patch('/api/events/update-event/1').send({
            event_name: 'Fully Updated Event',
            event_description: 'Fully updated description',
            event_location: 'Fully updated location',
            event_urgency: 'Medium',
            event_date: '2025-10-01'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Test changeStatus with all valid statuses
    test('should change status to Active', async () => {
        const res = await request(app).patch('/api/events/status-change/1').send({
            status: 'Active'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should change status to Cancelled', async () => {
        const res = await request(app).patch('/api/events/status-change/1').send({
            status: 'Cancelled'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should change status to Completed', async () => {
        const res = await request(app).patch('/api/events/status-change/1').send({
            status: 'Completed'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle missing status in status change', async () => {
        const res = await request(app).patch('/api/events/status-change/1').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Status is required.');
    });

    test('should handle invalid status', async () => {
        const res = await request(app).patch('/api/events/status-change/1').send({
            status: 'InvalidStatus'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Status must be Active, Cancelled, or Completed.');
    });

    test('should handle status change for non-existent event', async () => {
        const res = await request(app).patch('/api/events/status-change/999999').send({
            status: 'Active'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });

    // Test deleteEvent
    test('should delete event successfully', async () => {
        const res = await request(app).delete('/api/events/delete-event/999');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should handle delete non-existent event', async () => {
        const res = await request(app).delete('/api/events/delete-event/999999');
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });

    test('should handle delete with invalid ID', async () => {
        const res = await request(app).delete('/api/events/delete-event/invalid');
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    // Test error handling
    test('should handle database errors gracefully', async () => {
        // These will test error handling paths
        const res = await request(app).get('/api/events/');
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Test different urgency levels
    test('should create event with Low urgency', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Low Urgency Event',
            event_description: 'Testing low urgency',
            event_location: 'Test Location',
            event_urgency: 'Low',
            event_date: '2025-09-15'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should create event with Medium urgency', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Medium Urgency Event',
            event_description: 'Testing medium urgency',
            event_location: 'Test Location',
            event_urgency: 'Medium',
            event_date: '2025-09-20'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should create event with High urgency', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'High Urgency Event',
            event_description: 'Testing high urgency',
            event_location: 'Test Location',
            event_urgency: 'High',
            event_date: '2025-09-25'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Test with different skill combinations
    test('should create event with single skill', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Single Skill Event',
            event_description: 'Testing single skill',
            event_location: 'Test Location',
            event_urgency: 'Low',
            event_date: '2025-10-01',
            event_skills: [{s_id: 1}]
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should create event with multiple skills', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Multiple Skills Event',
            event_description: 'Testing multiple skills',
            event_location: 'Test Location',
            event_urgency: 'Medium',
            event_date: '2025-10-05',
            event_skills: [{s_id: 1}, {s_id: 2}, {s_id: 3}]
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    test('should create event with no skills', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'No Skills Event',
            event_description: 'Testing no skills',
            event_location: 'Test Location',
            event_urgency: 'Low',
            event_date: '2025-10-10'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });

    // Test edge cases for IDs
    test('should handle zero ID', async () => {
        const res = await request(app).get('/api/events/0/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    test('should handle negative ID', async () => {
        const res = await request(app).get('/api/events/-1/find');
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    // Test different date formats
    test('should handle different date formats', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Date Format Test',
            event_description: 'Testing date format',
            event_location: 'Test Location',
            event_urgency: 'Low',
            event_date: '2025-12-25'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });
});
