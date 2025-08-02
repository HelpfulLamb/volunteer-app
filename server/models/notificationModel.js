const db = require('../db.js');

exports.createNotification = async ({u_id, e_id, noti_type, title, message, sender_id}) => {
  try {
    const createdAt = new Date();
    const [result] = await db.query(`INSERT INTO NOTIFICATIONS (u_id, e_id, noti_type, title, message, createdAt, sender_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [u_id, e_id, noti_type, title, message, createdAt, sender_id]
    );
    return { n_id: result.insertId, u_id, e_id, noti_type, title, message, status: 'unread', createdAt };
  } catch (error) {
    console.error('createNotification model catch:', error.message);
    throw error;
  }
};

exports.getNotificationsByVolunteerId = async (u_id) => {
  try {
    const [volNoti] = await db.query(`SELECT * FROM NOTIFICATIONS WHERE u_id = ? ORDER BY createdAt DESC`, [u_id]);
    console.log('hello', volNoti);
    return volNoti;
  } catch (error) {
    console.error('getNotificationsByVolunteerId model catch:', error.message);
    throw error;
  }
};

exports.getNotificationById = async (id) => {
  try {
    const [notification] = await db.query(`SELECT * FROM NOTIFICATIONS WHERE n_id = ?`, [id]);
    console.log(notification[0]);
    return notification[0] || null;
  } catch (error) {
    console.error('getNotificationById model catch:', error.message);
    throw error;
  }
};

exports.markNotificationAsRead = async (n_id) => {
  try {
    const readAt = new Date();
    await db.query(`UPDATE NOTIFICATIONS SET status = 'read', readAt = ? WHERE n_id = ?`, [readAt, n_id]);
    const [mark] = await db.query(`SELECT * FROM NOTIFICATIONS WHERE n_id = ?`, [n_id]);
    console.log(mark[0]);
    return mark[0] || null;
  } catch (error) {
    console.error('markNotificationAsRead model catch:', error.message);
    throw error;
  }
};

exports.deleteNotification = async (id) => {
  try {
    const [result] = await db.query(`DELETE FROM NOTIFICATIONS WHERE n_id = ?`, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('deleteNotification model catch:', error.message);
    throw error;
  }
};

exports.getUnreadNotificationCount = async (volunteerId) => {
  try {
    const [unread] = await db.query(`SELECT COUNT(*) as count FROM NOTIFICATIONS WHERE u_id = ? AND status = 'unread'`, [volunteerId]);
    console.log('unread count:', unread[0].count);
    return unread[0].count;
  } catch (error) {
    console.error('getUnreadNotificationCount model catch:', error.message);
    throw error;
  }
};

exports.getAllNotifications = async () => {
  try {
    const [result] = await db.query('SELECT * FROM NOTIFICATIONS');
    console.log(result);
    return result;
  } catch (error) {
    console.error('getAllNotifications model catch:', error.message);
    throw error;
  }
}; 