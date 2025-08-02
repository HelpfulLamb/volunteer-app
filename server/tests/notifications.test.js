const request = require('supertest');
const app = require('../server.js');
const moment = require('moment');
const notiService = require('../services/notificationService.js');
const userModel = require('../models/userModel.js');
const eventModel = require('../models/eventModel.js');
const notificationModel = require('../models/notificationModel.js');

describe('Notification Routes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // success testing
  test('should fetch a notification for a volunteer', async () => {
    const res = await request(app).get('/api/notifications/volunteer/2');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true)
  });
  test('should retrieve a specific notification', async () => {
    const res = await request(app).get('/api/notifications/retrieve-notification/3');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      n_id: 3,
      u_id: 2,
      e_id: null,
      noti_type: 'general',
      title: 'New Upcoming Event',
      message: 'A new event "undefined" has been created for undefined.',
      status: 'read',
      createdAt: '2025-08-01T22:25:34.000Z',
      readAt: expect.any(String),
      sender_id: null
    });
  });
  test('should retrieve the unread count for a volunteer', async () => {
    const res = await request(app).get('/api/notifications/volunteer/2/unread-count');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.count).toBeGreaterThanOrEqual(0);
  });
  test('should send an event assignment notification', async () => {
    const res = await request(app).post('/api/notifications/send/assignment').send({
      volunteerId: 4,
      eventId: 3
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Event assignment notification sent successfully');
    expect(res.body.data).toMatchObject({
      "createdAt": expect.any(String), 
      "e_id": 3, 
      "message": "You have been assigned to \"Park Cleanup\" event on Sun Oct 19 2025 00:00:00 GMT-0500 (Central Daylight Time). Location: Central Park, New York, NY", 
      "n_id": expect.any(Number), 
      "noti_type": "assignment", 
      "status": "unread", 
      "title": "New Event Assignment", 
      "u_id": 4
    });
  });
  test('should send an event reminder notification', async () => {
    const res = await request(app).post('/api/notifications/send/reminder').send({
      volunteerId: 65,
      eventId: 4
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Event reminder notification sent successfully');
    expect(res.body.data).toMatchObject({
      "createdAt": expect.any(String),
      "message": "Reminder: \"updated name event\" event is tomorrow at 20400 Sandstone Cavern Cir, Richmond, TX 77407", 
      "n_id": expect.any(Number),
      "status": "unread", 
      "title": "Event Reminder", 
    });
  });
  test('should send a bulk notification', async () => {
    
    const res = await request(app).post('/api/notifications/send/bulk').send({
      volunteerIds: [3,4,65],
      eventId: 3,
      type: 'reminder',
      title: 'Park Cleanup',
      message: 'Bulk notification for event reminder.'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Bulk notifications sent successfully to 2 volunteers');
    expect(res.body.data).toHaveLength(2);
  });
  test('should schedule event reminders', async () => {
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
    jest.spyOn(eventModel, 'getAllEvents').mockReturnValue([
      { id: 101, event_date: tomorrow }
    ]);
    const mockSendReminder = jest.spyOn(notiService, 'sendEventReminderNotification').mockResolvedValue();
    const res = await request(app).post('/api/notifications/schedule/reminders');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Event reminders scheduled successfully');
    expect(mockSendReminder).toHaveBeenCalledTimes(2);
    expect(mockSendReminder).toHaveBeenCalledWith(1, 101);
    expect(mockSendReminder).toHaveBeenCalledWith(2, 101);
  });
  test('should mark a notification as read', async () => {
    const res = await request(app).patch('/api/notifications/mark-notification/179/read');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Notification marked as read');
    expect(res.body.data).toMatchObject({
      status: 'read',
      readAt: expect.any(String)
    });
  });
  test('should delete a notification', async () => {
    const res = await request(app).delete('/api/notifications/delete-notification/188');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Notification deleted successfully');
  });

  // failure testing
  test('should return 404 when fetching notifications for a non-existent volunteer', async () => {
    const res = await request(app).get('/api/notifications/volunteer/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('User not found.');
  });
  test('should return 404 when fetching a non-existent notification', async () => {
    const res = await request(app).get('/api/notifications/retrieve-notification/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Notification not found');
  });
  test('should return 400 when fields are missing for assignment notifications', async () => {
    const res = await request(app).post('/api/notifications/send/assignment').send({
      volunteerId: 3
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Volunteer ID and Event ID are required');
  });
  test('should return 400 when fields are missing for event reminder notifications', async () => {
    const res = await request(app).post('/api/notifications/send/reminder').send({
      eventId: 104
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Volunteer ID and Event ID are required');
  });
  test('should return 400 when fields are missing for bulk notifications', async () => {
    const res = await request(app).post('/api/notifications/send/bulk').send({
      type: 'event_reminder',
      message: 'test bulk notification'
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('All fields are required: volunteerIds (array), eventId, type, title, message');
  });
  test('should return 404 when marking a non-existent notification as read', async () => {
    const res = await request(app).patch('/api/notifications/mark-notification/999/read');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Notification not found');
  });
  test('should return 404 when deleting a non-existent notification', async () => {
    const res = await request(app).delete('/api/notifications/delete-notification/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Notification not found');
  });

  // // internal server error
  test('should return 500 when getNotificationsByVolunteerId throws an error', async () => {
    jest.spyOn(notificationModel, 'getNotificationsByVolunteerId').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).get('/api/notifications/volunteer/65');
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to get notifications');
  });
  test('should return 500 when sendEventAssignmentNotification throws an error', async () => {
    jest.spyOn(notiService, 'sendEventAssignmentNotification').mockRejectedValue(new Error('Simulated Failure'));
    const res = await request(app).post('/api/notifications/send/assignment').send({
      volunteerId: 1,
      eventId: 101
    });
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to send event assignment notification');
  });
  test('should return 500 when sendEventReminderNotification throws an error', async () => {
    jest.spyOn(notiService, 'sendEventReminderNotification').mockRejectedValue(new Error('Simulated Failure'));
    const res = await request(app).post('/api/notifications/send/reminder').send({
      volunteerId: 1,
      eventId: 101
    });
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to send event reminder notification');
  });
  test('should return 500 when sendBulkNotifications throws an error', async () => {
    jest.spyOn(notiService, 'sendBulkNotifications').mockRejectedValue(new Error('Simulated Failure'));
    const res = await request(app).post('/api/notifications/send/bulk').send({
      volunteerIds: [1,2,3],
      eventId: 103,
      type: 'event_reminder',
      title: 'Park Cleanup',
      message: 'Bulk notification for event reminder.'
    });
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to send bulk notifications');
  });
  test('should return 500 when scheduleEventReminders throws an error', async () => {
    jest.spyOn(notiService, 'scheduleEventReminders').mockRejectedValue(new Error('Simulated Failure'));
    const res = await request(app).post('/api/notifications/schedule/reminders');
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to schedule event reminders');
  });
  test('should return 500 when markNotificationAsRead throws an error', async () => {
    jest.spyOn(notificationModel, 'markNotificationAsRead').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).patch('/api/notifications/mark-notification/1/read');
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to mark notification as read');
  });
  test('should return 500 when deleteNotification throws an error', async () => {
    jest.spyOn(notificationModel, 'deleteNotification').mockImplementation(() => {
      throw new Error('Simulated Failure');
    });
    const res = await request(app).delete('/api/notifications/delete-notification/1');
    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Failed to delete notification');
  });
});