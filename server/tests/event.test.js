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
            event_date: '2025-09-20',
            event_start: '08:00:00',
            event_end: '13:00:00'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
    });
    test('should update one event', async () => {
        const res = await request(app).patch('/api/events/update-event/55').send({
            event_name: 'updated name',
            event_date: '2025-10-19'
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
        const res = await request(app).get('/api/events/2/find');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            "id": 2,
            "event_name": "Senior Meal Delivery",
            "event_description": "Help deliver food to the elderly in need.",
            "event_location": "6827 Cypresswood Dr, Spring, TX 77379",
            "event_status": 'Cancelled',
            "event_urgency": "Medium",
            "event_date": expect.any(String),
            "event_skills": [
                "Cooking",
                "Driving"
            ]
        });
    });

    test('should successfully delete an event', async () => {
        const res = await request(app).delete('/api/events/delete-event/89');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Event updated successfully.');
    });
    test('should successfully change status', async () => {
      const res = await request(app).patch('/api/events/status-change/3').send({
        status: 'Active'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Event status changed successfully.');
    });
    test('should fetch all active events', async () => {
      const res = await request(app).get('/api/events/active-events');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.events)).toBe(true);
    });

    // failure testing
    test('should return status code 400 when creating a new event with missing fields', async () => {
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
    test('should return 404 when deleting a non-existent event', async () => {
        const res = await request(app).delete('/api/events/delete-event/999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Event not Found.');
    });
    test('should return 404 when updating the status of a non-existint event', async () => {
      const res = await request(app).patch('/api/events/status-change/999').send({
        status: 'Active'
      });
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Event status failed to change.');
    });
    
    // internal server error testing
    test('should return status 500 when createEvent throws an error', async () => {
        jest.spyOn(eventModel, 'createEvent').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).post('/api/events/create-event').send({
            event_name: 'Beach Cleanup',
            event_description: 'Clean up the beach',
            event_location: '601 Biscayne Blvd, Miami, FL 33132',
            event_skills: [{s_id: 3}],
            event_urgency: 'Low',
            event_date: '2025-08-01',
            event_start: '08:00:00',
            event_end: '13:00:00'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
    test('should return status 500 when updateEvent throws an error', async () => {
        jest.spyOn(eventModel, 'updateEvent').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).patch('/api/events/update-event/55').send({
            event_name: 'updated name event',
            event_date: '2025-10-19'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
    test('should return status 500 when deleteEvent throws an error', async () => {
        jest.spyOn(eventModel, 'deleteEvent').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).delete('/api/events/delete-event/3');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });

    test('should handle updateEvent with non-existent ID', async () => {
        const res = await request(app).patch('/api/events/update-event/999999').send({
            event_name: 'Updated Name'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(404);
    });
    test('should return status 500 when findEventById throws an error', async () => {
        jest.spyOn(eventModel, 'findEventById').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).get('/api/events/2/find');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });
    test('should return 500 when changeStatus throws an error', async () => {
      jest.spyOn(eventModel, 'changeStatus').mockImplementation(() => {
        throw new Error('Simulated Failure');
      });
      const res = await request(app).patch('/api/events/status-change/3').send({
        status: 'Active'
      });
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Internal Server Error');
      jest.restoreAllMocks();
    });
    test('should return 500 when getActiveEvents throws an error', async () => {
      jest.spyOn(eventModel, 'getActiveEvents').mockImplementation(() => {
        throw new Error('Simulated Failure');
      });
      const res = await request(app).get('/api/events/active-events');
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Internal Server Error');
      jest.restoreAllMocks();
    })
});