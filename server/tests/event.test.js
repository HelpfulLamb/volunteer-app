const request = require('supertest');
const app = require('../server.js');
const eventModel = require('../models/eventModel.js');

describe('Event Routes', () => {
    // success testing
    test('should create a new event', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Beach Cleanup',
            event_description: 'Clean up the beach',
            event_location: 'Miami',
            event_skills: ['Friendly'],
            event_urgency: 'Low',
            event_date: '2025-08-01'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('New event created successfully.');
    });
    test('should update one event', async () => {
        const res = await request(app).patch('/api/events/update-event/104').send({
            event_name: 'updated name event',
            event_date: '2025-10-19'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Event updated successfully.');
    });
    test('should fetach all events', async () => {
        const res = await request(app).get('/api/events/');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.events)).toBe(true);
    });
    test('should retrieve specific event', async () => {
        const res = await request(app).get('/api/events/102/find');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            "id": 102,
            "event_name": "Senior Meal Delivery",
            "event_description": "Help distribute food to the elderly in need.",
            "event_location": "Various Houston Locations",
            "event_skills": [
                "Driving",
                "Cooking"
            ],
            "event_urgency": "Medium",
            "event_date": "2023-11-18"
        });
    });
    test('should successfully delete an event', async () => {
        const res = await request(app).delete('/api/events/delete-event/101');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Event deleted successfully.');
    });

    // failure testing
    test('should return status code 400 when creating a new event with missing fields', async () => {
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Storm Cleanup',
            event_description: 'Help clean up local damages caused by storms.',
            event_urgency: 'High',
            event_date: '2025-07-12'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('All fields are required! Something is missing.');
    });
    test('should return 404 when updating a non-existent event', async () => {
        const res = await request(app).patch('/api/events/update-event/999').send({
            event_name: 'updated name event',
            event_date: '2025-10-19'
        });
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Event not Found.');
    });
    test('should return 404 when retrieving a non-existent event', async () => {
        const res = await request(app).get('/api/events/999/find');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Event not found.');
    });
    test('should return 404 when deleting a non-existent event', async () => {
        const res = await request(app).delete('/api/events/delete-event/999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Event not Found.');
    });
    
    // internal server error testing
    test('should return status 500 when createEvent throws an error', async () => {
        jest.spyOn(eventModel, 'createEvent').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Beach Cleanup',
            event_description: 'Clean up the beach',
            event_location: 'Miami',
            event_skills: ['Friendly'],
            event_urgency: 'Low',
            event_date: '2025-08-01'
        });
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });
    test('should return status 500 when updateEvent throws an error', async () => {
        jest.spyOn(eventModel, 'updateEvent').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).patch('/api/events/update-event/102').send({
            event_name: 'updated name event',
            event_date: '2025-10-19'
        });
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });
    test('should return status 500 when deleteEvent throws an error', async () => {
        jest.spyOn(eventModel, 'deleteEvent').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).delete('/api/events/delete-event/103');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });
    test('should return status 500 when getAllEvents throws an error', async () => {
        jest.spyOn(eventModel, 'getAllEvents').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).get('/api/events/');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
    });
    test('should return status 500 when findEventById throws an error', async () => {
        jest.spyOn(eventModel, 'findEventById').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).get('/api/events/102/find');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
    });
});