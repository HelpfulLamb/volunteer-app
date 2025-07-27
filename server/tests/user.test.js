const request = require('supertest');
const app = require('../server.js');
const userModel = require('../models/userModel.js');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const jwt = require('jsonwebtoken');

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
            "fullName": 'Alex Johnson',
            "email": 'alex.johnson@example.com',
            "password": 'password123',
            "role": 'volunteer',
            "phone": '2037370249',
            "skills": ['First Aid', 'Translation', 'Event Planning'],
            "preferences": 'Weekends, Weekday evenings',
            "address1": '3509 Elgin St',
            "address2": '',
            "city": 'Houston',
            "state": 'TX',
            "zip": '77004',
            "availability": [],
            "assigned": false
        });
    });
    test('should fetch all admins', async () => {
        const res = await request(app).get('/api/users/admins');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.admins)).toBe(true);
    });
    test('should fetch a specific admin', async () => {
        const res = await request(app).get('/api/users/admins/5/find');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            "id": 5,
            "fullName": 'James Wilson',
            "email": 'james.wilson@example.com',
            "password": 'adminpassword',
            "role": 'admin',
            "phone": '1234567890',
            "address1": '768 5th Ave',
            "address2": '',
            "city": 'New York',
            "state": 'NY',
            "zip": '10019'
        });
    });
    test('should successfully login a volunteer', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'alex.johnson@example.com',
            password: 'password123',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Login successful.');
        expect(res.body.user).toEqual({
            "id": 1,
            "email": 'alex.johnson@example.com',
            "role": 'volunteer'
        });
        expect(res.body.token).toEqual(expect.any(String));  // kind of difficult to test JWT token since it will change each run, so this just checks that it is a string
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(decoded).toMatchObject({
            id: 1,
            role: 'volunteer'
        });
    });
    test('should successfully login an admin', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'james.wilson@example.com',
            password: 'adminpassword',
            role: 'admin'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Login successful.');
        expect(res.body.user).toEqual({
            "id": 5,
            "email": 'james.wilson@example.com',
            "role": 'admin'
        });
        expect(res.body.token).toEqual(expect.any(String));
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(decoded).toMatchObject({
            id: 5,
            role: 'admin'
        });
    });
    test('should successfully register a new volunteer', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'awesomedude790@gmail.com',
            password: 'mypassword',
            confirmPassword: 'mypassword',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Registration successful.');
        expect(res.body.user).toEqual({
            "id": 6,
            "email": 'awesomedude790@gmail.com',
            "role": 'volunteer'
        });
        expect(res.body.token).toEqual(expect.any(String));
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(decoded).toMatchObject({
            id: 6,
            role: 'volunteer'
        });
    });
    test('should successfully register a new admin', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'dmo12@gmail.com',
            password: 'mypassword',
            confirmPassword: 'mypassword',
            role: 'admin'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Registration successful.');
        expect(res.body.user).toEqual({
            "id": 7,
            "email": 'dmo12@gmail.com',
            "role": 'admin'
        });
        expect(res.body.token).toEqual(expect.any(String));
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(decoded).toMatchObject({
            id: 7,
            role: 'admin'
        });
    });
    test('should update a volunteer profile', async () => {
        const token = jwt.sign(
            { id: 1, role: 'volunteer' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const res = await request(app).patch('/api/users/update-profile/1').set('Authorization', `Bearer ${token}`).send({
            fullName: 'Johnson Alex',
            address1: '652 S Rivershire Dr'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Profile updated successfully');
        expect(res.body.profile).toMatchObject({
            id: 1,
            fullName: 'Johnson Alex',
            address1: '652 S Rivershire Dr'
        });
    });
    test('should update an admin profile', async () => {
        const token = jwt.sign(
            { id: 5, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const res = await request(app).patch('/api/users/update-profile/5').set('Authorization', `Bearer ${token}`).send({
            fullName: 'Wilson James'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Profile updated successfully');
        expect(res.body.profile).toMatchObject({
            id: 5,
            fullName: 'Wilson James'
        });
    });
    test('should delete a user account', async () => {
        const res = await request(app).delete('/api/users/delete-account/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User account deleted successfully.');
    });

    // failure testing
    test('should return status 404 when fetching a non-existent volunteer', async () => {
        const res = await request(app).get('/api/users/volunteers/999/find');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Volunteer not found.');
    });
    test('should return status 404 when fetching a non-existent admin', async () => {
        const res = await request(app).get('/api/users/admins/999/find');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Admin not found.');
    });
    test('should return status 400 when missing a field during login', async () => {
        const res = await request(app).post('/api/users/login').send({
            password: 'password123',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Email, password, and role are required.');
    });
    test('should return status 401 for invalid login credentials', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'alex.johnson@example.com',
            password: 'testtesttest',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Invalid credentials or role.');
    });
    test('should return status 400 when missing a field during registration', async () => {
        const res = await request(app).post('/api/users/register').send({
            password: 'mypassword',
            confirmPassword: 'mypassword',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('All fields are required.');
    });
    test('should return status 400 when passwords do not match', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'jj@yahoo.com',
            password: 'mypassword',
            confirmPassword: 'yourpassword',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Passwords do not match.');
    });
    test('should return status 409 when a registering a new account using an email already in use', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'bob.ross@example.com',
            password: 'mypassword',
            confirmPassword: 'mypassword',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(409);
        expect(res.body.message).toEqual('User with this email already exists.');
    });
    test('should return status 404 when updating a non-existent user', async () => {
        const token = jwt.sign(
            { id: 999, role: 'volunteer' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const res = await request(app).patch('/api/users/update-profile/999').set('Authorization', `Bearer ${token}`).send({
            fullName: 'Harry Potter'
        });
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('User not found.');
    });
    test('should return status 404 when deleting a non-existent user', async () => {
        const res = await request(app).delete('/api/users/delete-account/999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('User not found.');
    });
    
    // internal server error testing
    test('should return status 500 when getAllVolunteers throws an error', async () => {
        jest.spyOn(userModel, 'getAllVolunteers').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).get('/api/users/volunteers');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });
    test('should return status 500 when getAllAdmins throws an error', async () => {
        jest.spyOn(userModel, 'getAllAdmins').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).get('/api/users/admins');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });
    test('should return status 500 when findVolById throws an error', async () => {
        jest.spyOn(userModel, 'findVolById').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).get('/api/users/volunteers/2/find');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });
    test('should return status 500 when findAdminById throws an error', async () => {
        jest.spyOn(userModel, 'findAdminById').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).get('/api/users/admins/5/find');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });
    test('should return status 500 when createUser throws an error', async () => {
        jest.spyOn(userModel, 'createUser').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).post('/api/users/register').send({
            email: 'dmo11@gmail.com',
            password: 'mypassword',
            confirmPassword: 'mypassword',
            role: 'admin'
        });
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });
    test('should return status 500 when updateProfile throws an error', async () => {
        jest.spyOn(userModel, 'updateProfile').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const token = jwt.sign(
            { id: 3, role: 'volunteer' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const res = await request(app).patch('/api/users/update-profile/3').set('Authorization', `Bearer ${token}`).send({
            fullName: 'Harry Potter'
        });
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });
    test('should return status 500 when deleteUser throws an error', async () => {
        jest.spyOn(userModel, 'deleteUser').mockImplementation(() => {
            throw new Error('Simulated Failure');
        });
        const res = await request(app).delete('/api/users/delete-account/3');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
        jest.restoreAllMocks();
    });
});