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
    const res = await request(app).get('/api/notifications/volunteer/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true)
  });
  test('should retrieve a specific notification', async () => {
    const res = await request(app).get('/api/notifications/retrieve-notification/2');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      id: "2",
      volunteerId: 2,
      eventId: 102,
      type: 'event_reminder',
      title: 'Event Reminder',
      message: 'Reminder: Senior Meal Delivery event is tomorrow at 6827 Cypresswood Dr',
      status: 'read',
      createdAt: '2023-11-17T09:00:00Z',
      readAt: '2023-11-17T10:30:00Z'
    });
  });
  test('should retrieve the unread count for a volunteer', async () => {
    const res = await request(app).get('/api/notifications/volunteer/2/unread-count');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.count).toBeGreaterThanOrEqual(0);
  });
  test('should send an event assignment notification', async () => {
    jest.spyOn(userModel, 'findVolById').mockReturnValue({
      id: 1, 
      email: 'alex.johnson@example.com'
    });
    jest.spyOn(eventModel, 'findEventById').mockReturnValue({
      id: 101,
      event_name: 'Food Bank Assistance',
      event_date: '2023-11-15',
      event_location: '2020 Hermann Dr, Houston, TX'
    });
    jest.spyOn(notificationModel, 'createNotification').mockImplementation(data => ({
      ...data,
      id: 'mock-id-1',
      status: 'unread',
      createdAt: new Date().toISOString(),
      readAt: null
    }));
    jest.spyOn(notiService, 'sendEmail').mockResolvedValue({
      messageId: 'test-email-id'
    });
    const res = await request(app).post('/api/notifications/send/assignment').send({
      volunteerId: 1,
      eventId: 101
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Event assignment notification sent successfully');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toMatchObject({
      volunteerId: 1,
      eventId: 101,
      type: 'event_assignment',
      status: 'unread'
    });
  });
  test('should send an event reminder notification', async () => {
    jest.spyOn(userModel, 'findVolById').mockReturnValue({
      id: 1, 
      email: 'alex.johnson@example.com'
    });
    jest.spyOn(eventModel, 'findEventById').mockReturnValue({
      id: 101,
      event_name: 'Food Bank Assistance',
      event_date: '2023-11-15',
      event_location: '2020 Hermann Dr, Houston, TX'
    });
    jest.spyOn(notificationModel, 'createNotification').mockImplementation(data => ({
      ...data,
      id: 'mock-id-1',
      status: 'unread',
      createdAt: new Date().toISOString(),
      readAt: null
    }));
    jest.spyOn(notiService, 'sendEmail').mockResolvedValue({
      messageId: 'test-email-id'
    });
    const res = await request(app).post('/api/notifications/send/reminder').send({
      volunteerId: 1,
      eventId: 101
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Event reminder notification sent successfully');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toMatchObject({
      volunteerId: 1,
      eventId: 101,
      type: 'event_reminder',
      status: 'unread'
    });
  });
  test('should send a bulk notification', async () => {
    const mockVolunteers = {
      1: { id: 1, email: 'vol1@example.com' },
      2: { id: 2, email: 'vol2@example.com' },
      3: { id: 3, email: 'vol3@example.com' }
    };
    jest.spyOn(userModel, 'findVolById').mockImplementation(id => mockVolunteers[id] || null);
    jest.spyOn(notificationModel, 'createNotification').mockImplementation(data => ({
      ...data,
      id: 'mock-id-' + data.volunteerId,
      status: 'unread',
      createdAt: new Date().toISOString(),
      readAt: null
    }));
    jest.spyOn(notiService, 'sendEmail').mockResolvedValue();
    const res = await request(app).post('/api/notifications/send/bulk').send({
      volunteerIds: [1,2,3],
      eventId: 103,
      type: 'event_reminder',
      title: 'Park Cleanup',
      message: 'Bulk notification for event reminder.'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Bulk notifications sent successfully to 3 volunteers');
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0]).toHaveProperty('volunteerId',1);
    expect(res.body.data[1]).toHaveProperty('volunteerId',2);
    expect(res.body.data[2]).toHaveProperty('volunteerId',3);
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
    const res = await request(app).patch('/api/notifications/mark-notification/1/read');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Notification marked as read');
    expect(res.body.data).toMatchObject({
      status: 'read',
      readAt: expect.any(String)
    });
  });
  test('should delete a notification', async () => {
    const res = await request(app).delete('/api/notifications/delete-notification/2');
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
    const res = await request(app).get('/api/notifications/volunteer/1');
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