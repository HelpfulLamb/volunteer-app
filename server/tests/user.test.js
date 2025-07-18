const request = require('supertest');
const app = require('../server.js');
const userModel = require('../models/userModel.js');

describe('User Routes', () => {
    // success testing
    test('should fetch all volunteers', async () => {
        const res = await request(app).get('/api/users/volunteers');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.volunteers)).toBe(true);
    });
    test('should fetch a specific volunteer', async () => {
        const res = await request(app).get('/api/users/volunteers/1/find');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            "id": 1,
            "name": 'Alex Johnson',
            "skills": ['First Aid', 'Translation', 'Event Planning'],
            "availability": 'Weekends, Weekday evenings',
            "location": '3509 Elgin St, Houston, TX',
            "assigned": false
        });
    });

    // failure testing
    test('should return status 404 when fetching a non-existent volunteer', async () => {
        const res = await request(app).get('/api/users/volunteers/999/find');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Volunteer not found.');
    });
    
    // internal server error testing
    test('should return status 500 when getAllVolunteers throws an error', async () => {
        jest.spyOn(userModel, 'getAllVolunteers').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).get('/api/users/volunteers');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
    });
});