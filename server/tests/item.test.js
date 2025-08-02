const request = require('supertest');
const app = require('../server.js');
const itemModel = require('../models/itemModel.js');

describe('Item Routes', () => {
  test('should return 200 when getting all skills', async () => {
    const res = await request(app).get('/api/items/skills');
    expect(res.statusCode).toEqual(200);
  });
  test('should return 200 when getting all states', async () => {
    const res = await request(app).get('/api/items/states');
    expect(res.statusCode).toEqual(200);
  });
  test('should return 500 when getAllSkills throws an error', async () => {
    jest.spyOn(itemModel, 'getAllSkills').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).get('/api/items/skills');
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual('Internal Server Error');
  });
  test('should return 500 when getAllStates throws an error', async () => {
    jest.spyOn(itemModel, 'getAllStates').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).get('/api/items/states');
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual('Internal Server Error');
  });
});