const db = require('../db.js');

exports.getVolunteerParticipationDataPDF = async () => {
  const [rows] = await db.query(`
    SELECT u.u_id, CONCAT(u.fname, ' ', u.lname) as fullName, c.email, u.phone, e.event_name, e.event_date, e.event_urgency, h.status, h.hours_worked,
    CAST((SELECT JSON_ARRAYAGG(s.skill) FROM VOLUNTEER_SKILLS vs JOIN SKILLS s ON vs.s_id = s.s_id WHERE vs.u_id = u.u_id) AS JSON) AS skills
    FROM VOLUNTEERHISTORY h
    JOIN USERPROFILE u ON h.u_id = u.u_id
    JOIN EVENTDETAILS e ON h.e_id = e.e_id
    JOIN usercredentials c ON c.u_id = u.u_id
    ORDER BY u.u_id, e.event_date
    `);
    const grouped = {};
    rows.forEach(row => {
      //console.log('Raw skills:', rows[0].skills);
      if(!grouped[row.u_id]){
        grouped[row.u_id] = {
          u_id: row.u_id,
          fullName: row.fullName,
          email: row.email,
          phone: row.phone,
          skills: row.skills,
          events: []
        };
      }
      grouped[row.u_id].events.push({
        event_name: row.event_name,
        event_date: row.event_date,
        event_urgency: row.event_urgency,
        status: row.status,
        hours_worked: row.hours_worked
      });
    });
    return Object.values(grouped);
};

exports.getVolunteerParticipationDataCSV = async () => {
  const [rows] = await db.query(`
    SELECT u.u_id, CONCAT(u.fname, ' ', u.lname) as fullName, c.email, u.phone, e.event_name, e.event_date, e.event_urgency, h.status, h.hours_worked,
    (SELECT JSON_ARRAYAGG(s.skill) FROM VOLUNTEER_SKILLS vs JOIN SKILLS s ON vs.s_id = s.s_id WHERE vs.u_id = u.u_id) as skills
    FROM VOLUNTEERHISTORY h
    JOIN USERPROFILE u ON h.u_id = u.u_id
    JOIN EVENTDETAILS e ON h.e_id = e.e_id
    JOIN usercredentials c ON c.u_id = u.u_id
    ORDER BY u.u_id, e.event_date
    `);
    return rows;
};

exports.getEventDataPDF = async () => {
  const [rows] = await db.query(`
    SELECT 
      e.e_id,
      e.event_name,
      e.event_description,
      e.event_location,
      e.event_urgency,
      e.event_date,
      e.event_status,
      u.u_id,
      CONCAT(u.fname, ' ', u.lname) AS fullName,
      c.email
    FROM EVENTDETAILS e
    LEFT JOIN ASSIGNMENT a ON e.e_id = a.e_id
    LEFT JOIN USERPROFILE u ON a.u_id = u.u_id
    LEFT JOIN USERCREDENTIALS c ON u.u_id = c.u_id
    ORDER BY e.event_date DESC
    `);
    const eventsById = {};
    rows.forEach(row => {
      if(!eventsById[row.e_id]){
        eventsById[row.e_id] = {
          e_id: row.e_id,
          event_name: row.event_name,
          event_description: row.event_description,
          event_location: row.event_location,
          event_urgency: row.event_urgency,
          event_date: row.event_date,
          event_status: row.event_status,
          volunteers: []
        };
      }
      if(row.u_id){
        eventsById[row.e_id].volunteers.push({
          name: row.fullName,
          email: row.email
        });
      }
    });
    return Object.values(eventsById);
};

exports.getEventDataCSV = async () => {
  const [rows] = await db.query(`
    SELECT 
      e.e_id,
      e.event_name,
      e.event_description,
      e.event_location,
      e.event_urgency,
      e.event_date,
      e.event_status,
      u.u_id,
      CONCAT(u.fname, ' ', u.lname) AS fullName,
      c.email
    FROM EVENTDETAILS e
    LEFT JOIN ASSIGNMENT a ON e.e_id = a.e_id
    LEFT JOIN USERPROFILE u ON a.u_id = u.u_id
    LEFT JOIN USERCREDENTIALS c ON u.u_id = c.u_id
    ORDER BY e.event_date DESC
    `);
    return rows;
};