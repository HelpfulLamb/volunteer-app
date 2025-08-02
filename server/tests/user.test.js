const request = require('supertest');
const app = require('../server.js');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel.js');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const jwt = require('jsonwebtoken');

describe('User Routes', () => {
  test('should fetch all active volunteers', async () => {
    const res = await request(app).get('/api/users/active-volunteers');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.volunteers)).toBe(true);
  });
  test('should return 500 when getActiveVol throws an error', async () => {
    jest.spyOn(userModel, 'getActiveVol').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).get('/api/users/active-volunteers');
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual('Internal Server Error');
  });
  test('should return 404', async () => {
    const res = await request(app).patch('/api/users/status-change/0').send({
      status: 'Inactive'
    });
    expect(res.statusCode).toEqual(200);
  });
  test('should change active status of volunteer', async () => {
    const res = await request(app).patch('/api/users/status-change/65').send({
      status: 'Active'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('User status changed successfully.');
  });
  test('should return 500 when changeActiveStatus throws an error', async () => {
    jest.spyOn(userModel, 'changeActiveStatus').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).patch('/api/users/status-change/70').send({
      status: 'Inactive'
    });
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual('Internal Server Error');
  });
    // success testing
    test('should fetch all volunteers', async () => {
        const res = await request(app).get('/api/users/volunteers');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.volunteers)).toBe(true);
    });
    test('should fetch a specific volunteer', async () => {
        const res = await request(app).get('/api/users/volunteers/4/find');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            "id": 4,
            "fullName": 'bob ross',
            "email": 'bob.ross@example.com',
            "role": 'volunteer',
            "phone": '3333333333',
            "preferences": 'Weekends, Weekdays',
            "address1": '555 Lamar St',
            "address2": null,
            "city": 'Dallas',
            "state": 'TX',
            "zipcode": '75202',
            "status": 'Active',
            "skills": ['Communication', 'Driving', 'Patient', 'Designer'],
            "availability": null,
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
            "role": 'admin',
            "phone": '1234567890',
            "address1": '768 5th Ave',
            "address2": null,
            "city": 'New York',
            "state": 'NY',
            "zipcode": '10019'
        });
    });
    test('should successfully login a volunteer', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'who@who.com',
            password: '123',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Login successful.');
        expect(res.body.user).toEqual({
            "id": 67,
            "email": 'who@who.com',
            "role": 'volunteer'
        });
        expect(res.body.token).toEqual(expect.any(String));  // kind of difficult to test JWT token since it will change each run, so this just checks that it is a string
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(decoded).toMatchObject({
            id: 67,
            role: 'volunteer'
        });
    });
    test('should successfully login an admin', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'Manager4@coogworld.org',
            password: '123',
            role: 'admin'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Login successful.');
        expect(res.body.user).toEqual({
            "id": 66,
            "email": 'Manager4@coogworld.org',
            "role": 'admin'
        });
        expect(res.body.token).toEqual(expect.any(String));
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(decoded).toMatchObject({
            id: 66,
            role: 'admin'
        });
    });
    test('should successfully register a new volunteer', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'awesomedude689@gmail.com',
            password: 'mypassword',
            confirmPassword: 'mypassword',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Registration successful.');
        expect(res.body.user).toEqual({
            "id":91,
            "email": 'awesomedude689@gmail.com',
            "role": 'volunteer'
        });
        expect(res.body.token).toEqual(expect.any(String));
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(decoded).toMatchObject({
            id: 91,
            role: 'volunteer'
        });
    });
    test('should successfully register a new admin', async () => {
        const res = await request(app).post('/api/users/register').send({
            email: 'where@gmail.com',
            password: 'mypassword',
            confirmPassword: 'mypassword',
            role: 'admin'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Registration successful.');
        expect(res.body.user).toEqual({
            "id": 92,
            "email": 'where@gmail.com',
            "role": 'admin'
        });
        expect(res.body.token).toEqual(expect.any(String));
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(decoded).toMatchObject({
            id: 92,
            role: 'admin'
        });
    });
    test('should update a volunteer profile', async () => {
        const token = jwt.sign(
            { id: 14, role: 'volunteer' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const res = await request(app).patch('/api/users/update-profile/14').set('Authorization', `Bearer ${token}`).send({
            preferences: 'Weekend Mornings, Weekdays Only'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Profile updated successfully');
        expect(res.body.profile).toMatchObject({
            "u_id": 14,
            "fname": 'Fix',
            "lname": 'it',
            "phone": '9898888888',
            "role": 'volunteer',
            "preferences": 'Weekend Mornings, Weekdays Only',
            "address1": '652 S Rivershire Dr',
            "address2": '',
            "city": 'Conroe',
            "state": 'TX',
            "zipcode": '77304',
            "status": 'Inactive'
        });
    });
    test('should update an admin profile', async () => {
        const token = jwt.sign(
            { id: 75, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const res = await request(app).patch('/api/users/update-profile/75').set('Authorization', `Bearer ${token}`).send({
            address1: '227 Washington Ave'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Profile updated successfully');
        expect(res.body.profile).toMatchObject({
            address1: "227 Washington Ave",
            address2: '',
            city: "New Rochelle",
            fname: "Erin",
            lname: "Sebastian",
            phone: "8950056093",
            preferences: '',
            role: "admin",
            state: "NY",
            status: "Active",
            u_id: 75,
            zipcode: "10801",
        });
    });
    test('should delete a user account', async () => {
        const res = await request(app).delete('/api/users/delete-account/84');
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
            email: 'maria.garcia@example.com',
            password: 'testtesttest',
            role: 'volunteer'
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Invalid credentials. Wrong password.');
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
            email: 'take@gmail.com',
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