const request = require('supertest');
const app = require('../server.js');
const historyModel = require('../models/volunteerHistoryModel.js');

describe('History Routes', () => {
  // success testing
  test('should fetch a specific volunteers history', async () => {
    const res = await request(app).get('/api/volunteer-history/volunteer/4');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
  test('should return specific history', async () => {
    const res = await request(app).get('/api/volunteer-history/entry/3');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      "id": "3",
      "volunteerId": 2,
      "eventId": 102,
      "eventName": "Senior Meal Delivery",
      "eventDate": "2023-11-18",
      "eventLocation": "6827 Cypresswood Dr, Spring, TX",
      "status": "completed",
      "hoursWorked": 2,
      "skillsUsed": ["Driving", "Cooking"],
      "feedback": "Very reliable and punctual",
      "rating": 5,
      "createdAt": "2023-11-18T10:00:00Z",
      "completedAt": "2023-11-18T12:00:00Z"
    });
  });
  test('should return volunteer statistics', async () => {
    const res = await request(app).get('/api/volunteer-history/volunteer/2/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('stats');
    expect(res.body.data).toMatchObject({
      "volunteer": {
        "id": 2,
        "skills": [
          "Cooking",
          "Driving",
          "Patient"
        ],
        "location": "4301 Crane St, Houston, TX 77206"
      },
      "stats": {
        "totalEvents": 1,
        "completedEvents": 1,
        "scheduledEvents": 0,
        "totalHours": 2,
        "averageRating": 5,
        "skillsUsed": [
          "Driving",
          "Cooking",
        ],
        "eventsThisMonth": 0,
        "eventsThisYear": 0
      }
    });
  });
  test('should return top volunteers', async () => {
    const res = await request(app).get('/api/volunteer-history/top-volunteers');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
  test('should return specific event history', async () => {
    const res = await request(app).get('/api/volunteer-history/event/4');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toMatchObject([]);
  });
  test('should return all history', async () => {
    const res = await request(app).get('/api/volunteer-history/all');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
  test('should create a new history entry', async () => {
    const res = await request(app).post('/api/volunteer-history/create-entry').send({
      volunteerId: 2,
      eventId: 104,
      eventName: 'Shelter Setup',
      eventDate: '2023-11-22',
      eventLocation: '20400 Sandstone Cavern Cir, Richmond, TX 77407',
      status: 'scheduled'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('History entry created successfully');
    expect(res.body.data).toMatchObject({
      "id": expect.any(String),
      "volunteerId": 2,
      "eventId": 104,
      "eventName": "Shelter Setup",
      "eventDate": "2023-11-22",
      "eventLocation": "20400 Sandstone Cavern Cir, Richmond, TX 77407",
      "status": "scheduled",
      "hoursWorked": 0,
      "skillsUsed": [],
      "feedback": null,
      "rating": null,
      "createdAt": expect.any(String),
      "completedAt": null
    });
  });
  test('should update a history entry', async () => {
    const res = await request(app).patch('/api/volunteer-history/update-entry/2').send({
      rating: 2,
      feedback: 'Poor communication skills'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('History entry updated successfully');
    expect(res.body.data).toMatchObject({
      "id": "2",
      "volunteerId": 1,
      "eventId": 103,
      "eventName": "Park Cleanup",
      "eventDescription": "Help keep the city parks clean and beautiful.",
      "eventDate": "2023-11-20",
      "eventLocation": "Central Park, New York, NY",
      "status": "completed",
      "hoursWorked": 3,
      "skillsUsed": [
        "Translation",
        "Event Planning"
      ],
      "urgency": "Low",
      "feedback": "Poor communication skills",
      "rating": 2,
      "createdAt": "2023-11-20T09:00:00Z",
      "completedAt": expect.any(String)
    });
  });
  test('should mark an event as complete', async () => {
    const res = await request(app).patch('/api/volunteer-history/mark-entry/4/complete').send({
      hoursWorked: 3,
      skillsUsed: ['Communication', 'Heavy Lifting', 'Construction', 'Patient'],
      feedback: 'Excellent work assisting others',
      rating: 5
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Event completed successfully');
    expect(res.body.data).toMatchObject({
      "id": "4",
      "volunteerId": 3,
      "eventId": 104,
      "eventName": "Shelter Setup",
      "eventDate": "2023-11-22",
      "eventLocation": "20400 Sandstone Cavern Cir, Richmond, TX",
      "status": "completed",
      "hoursWorked": 3,
      "skillsUsed": [
        "Communication",
        "Heavy Lifting",
        "Construction",
        "Patient"
      ],
      "feedback": "Excellent work assisting others",
      "rating": 5,
      "createdAt": "2023-11-10T14:00:00Z",
      "completedAt": expect.any(String)
    });
  });
  test('should delete a history entry', async () => {
    const res = await request(app).delete('/api/volunteer-history/delete-entry/4');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('History entry deleted successfully');
  });

  // failure testing
  test('should return 404 when fetching history of non-existent volutneer', async () => {
    const res = await request(app).get('/api/volunteer-history/volunteer/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('User not found');
  });
  test('should return 404 when fetching non-existent history', async () => {
    const res = await request(app).get('/api/volunteer-history/entry/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('History entry not found');
  });
  test('should return 400 when creating new entry with a missing field', async () => {
    const res = await request(app).post('/api/volunteer-history/create-entry').send({
      eventName: 'Shelter Setup',
      eventDate: '2023-11-22'
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('All required fields must be provided: volunteerId, eventId, eventName, eventDate, eventLocation');
  });
  test('should return 404 when updating a non-existent entry', async () => {
    const res = await request(app).patch('/api/volunteer-history/update-entry/999').send({
      rating: 5
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('History entry not found');
  });
  test('should return 400 when missing worked hours when marking an event as complete', async () => {
    const res = await request(app).patch('/api/volunteer-history/mark-entry/4/complete').send({
      skillsUsed: ['Communication', 'Heavy Lifting', 'Construction', 'Patient'],
      feedback: 'Excellent work assisting others',
      rating: 5
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Hours worked is required');
  });
  test('should return 404 when marking as complete a non-existent entry', async () => {
    const res = await request(app).patch('/api/volunteer-history/mark-entry/999/complete').send({
      hoursWorked: 4,
      skillsUsed: ['Communication', 'Heavy Lifting', 'Construction', 'Patient'],
      feedback: 'Excellent work assisting others',
      rating: 5
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('History entry not found');
  });
  test('should return 404 when fetching a non-existent volunteers stats', async () => {
    const res = await request(app).get('/api/volunteer-history/volunteer/999/stats');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('User not found');
  });
  test('should return 404 when fetching a non-existent events history', async () => {
    const res = await request(app).get('/api/volunteer-history/event/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Event not found');
  });
  test('should return 404 when deleting a non-existent entry', async () => {
    const res = await request(app).delete('/api/volunteer-history/delete-entry/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('History entry not found');
  });

  // internal server error
  test('should return 500 when getHistoryByVolunteerId throws an error', async () => {
    jest.spyOn(historyModel, 'getHistoryByVolunteerId').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).get('/api/volunteer-history/volunteer/4');
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to get volunteer history');
  });
  test('should return 500 when getHistoryById throws an error', async () => {
    jest.spyOn(historyModel, 'getHistoryById').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).get('/api/volunteer-history/entry/1');
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to get history entry');
  });
  test('should return 500 when createHistoryEntry throws an error', async () => {
    jest.spyOn(historyModel, 'createHistoryEntry').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).post('/api/volunteer-history/create-entry').send({
      volunteerId: 2,
      eventId: 104,
      eventName: 'Shelter Setup',
      eventDate: '2023-11-22',
      eventLocation: '20400 Sandstone Cavern Cir, Richmond, TX 77407',
      status: 'scheduled'
    });
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to create history entry');
  });
  test('should return 500 when updateHistoryEntry throws an error', async () => {
    jest.spyOn(historyModel, 'updateHistoryEntry').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).patch('/api/volunteer-history/update-entry/2').send({
      rating: 3
    });
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to update history entry');
  });
  test('should return 500 when completeEvent throws an error', async () => {
    jest.spyOn(historyModel, 'completeEvent').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).patch('/api/volunteer-history/mark-entry/4/complete').send({
      hoursWorked: 3,
      skillsUsed: ['Communication', 'Heavy Lifting', 'Construction', 'Patient'],
      feedback: 'Excellent work assisting others',
      rating: 5
    });
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to complete event');
  });
  test('should return 500 when getVolunteerStats throws an error', async () => {
    jest.spyOn(historyModel, 'getVolunteerStats').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).get('/api/volunteer-history/volunteer/4/stats');
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to get volunteer stats');
  });
  test('should return 500 when getTopVolunteers throws an error', async () => {
    jest.spyOn(historyModel, 'getTopVolunteers').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).get('/api/volunteer-history/top-volunteers');
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to get top volunteers');
  });
  test('should return 500 when getEventHistory throws an error', async () => {
    jest.spyOn(historyModel, 'getEventHistory').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).get('/api/volunteer-history/event/4');
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to get event history');
  });
  test('should return 500 when deleteHistoryEntry throws an error', async () => {
    jest.spyOn(historyModel, 'deleteHistoryEntry').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).delete('/api/volunteer-history/delete-entry/2');
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to delete history entry');
  });
  test('should return 500 when getAllHistory throws an error', async () => {
    jest.spyOn(historyModel, 'getAllHistory').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).get('/api/volunteer-history/all');
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to get all history');
  });
});