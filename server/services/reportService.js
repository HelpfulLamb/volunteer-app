const db = require('../db.js');

exports.getVolunteerParticipationData = async () => {
  const [rows] = await db.query(`
    SELECT u.u_id, CONCAT(u.fname, ' ', u.lname) as fullName, e.event_name, h.status, h.hours_worked
    FROM VOLUNTEERHISTORY h
    JOIN USERPROFILE u ON h.u_id = u.u_id
    JOIN EVENTDETAILS e ON h.e_id = e.e_id
    ORDER BY u.u_id, e.event_date
    `);
    return rows;
};

exports.getEventData = async () => {
  const [rows] = await db.query(`
    SELECT e.e_id, e.event_name, e.event_description, e.event_location, e.event_urgency, e.event_date, e.event_status,
    (SELECT JSON_ARRAYAGG(s.skill) FROM EVENT_SKILLS es JOIN SKILLS s ON es.s_id = s.s_id WHERE es.e_id = e.e_id) as event_skills
    FROM EVENTDETAILS e
    ORDER BY e.event_date DESC
    `);
    return rows;
};