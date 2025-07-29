const { v4: uuidv4 } = require('uuid');
const db = require('../db.js');

// In-memory storage for notifications (replace with database)
const notifications = [
    {
        id: '1',
        volunteerId: 1,
        eventId: 101,
        type: 'event_assignment',
        title: 'New Event Assignment',
        message: 'You have been assigned to Food Bank Assistance event on 2023-11-15',
        status: 'unread',
        createdAt: '2023-11-10T10:00:00Z',
        readAt: null
    },
    {
        id: '2',
        volunteerId: 2,
        eventId: 102,
        type: 'event_reminder',
        title: 'Event Reminder',
        message: 'Reminder: Senior Meal Delivery event is tomorrow at 6827 Cypresswood Dr',
        status: 'read',
        createdAt: '2023-11-17T09:00:00Z',
        readAt: '2023-11-17T10:30:00Z'
    }
];

exports.createNotification = (notificationData) => {
    const { volunteerId, eventId, type, title, message } = notificationData;
    const newNotification = {
        id: uuidv4(),
        volunteerId,
        eventId,
        type,
        title,
        message,
        status: 'unread',
        createdAt: new Date().toISOString(),
        readAt: null
    };
    notifications.push(newNotification);
    return newNotification;
};

exports.getNotificationsByVolunteerId = (volunteerId) => {
  const volNoti = notifications.filter(n => n.volunteerId === volunteerId);
  if(!volNoti){
    return null;
  }
  return volNoti;
};

exports.getNotificationById = (id) => {
  const noti = notifications.find(n => n.id === id);
  if(!noti){
    return null;
  }
  return noti;
};

exports.markNotificationAsRead = (id) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) {
        return null;
    }
    notification.status = 'read';
    notification.readAt = new Date().toISOString();
    return notification;
};

exports.deleteNotification = (id) => {
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) {
        return null;
    }
    return notifications.splice(index, 1)[0];
};

exports.getUnreadNotificationCount = (volunteerId) => {
  const count = notifications.filter(n => n.volunteerId === volunteerId && n.status === 'unread').length;
  return count;
};

exports.getAllNotifications = () => {
    return notifications;
}; 