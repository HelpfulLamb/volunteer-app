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

    // failure testing
    
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