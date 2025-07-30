const db = require('../db.js');

exports.createEvent = async (eventData) => {
    const {event_name, event_description, event_location, event_skills, event_urgency, event_date} = eventData;
    //console.log('data to create new event:',eventData);
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      // insert event
      const [result] = await connection.query(`INSERT INTO EVENTDETAILS (event_name, event_description, event_location, event_urgency, event_date) VALUES (?, ?, ?, ?, ?)`,
        [event_name, event_description, event_location, event_urgency, event_date]
      );
      const eventId = result.insertId;
      //console.log('event id:', eventId);
      // insert skills
      for(const skillId of event_skills){
        //console.log('skill id:', skillId.s_id);
        await connection.query(`INSERT INTO EVENT_SKILLS (e_id, s_id) VALUES (?, ?)`,
          [eventId, skillId.s_id]
        );
      }
      await connection.commit();
      return eventId;
    } catch (error) {
      console.error('createEvent model catch:', error.message);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
};

exports.getAllEvents = async () => {
  const [events] = await db.query(`
    SELECT e.e_id as id, e.event_name, e.event_description, e.event_location, e.event_urgency, e.event_date,
    (SELECT JSON_ARRAYAGG(s.skill) FROM EVENT_SKILLS es JOIN SKILLS s ON es.s_id = s.s_id WHERE es.e_id = e.e_id) as event_skills
    FROM EVENTDETAILS e;
    `);
  console.log(events);
  return events;
};

exports.findEventById = async (id) => {
  const [event] = await db.query(`
    SELECT e.e_id as id, e.event_name, e.event_description, e.event_location, e.event_urgency, e.event_date,
    (SELECT JSON_ARRAYAGG(s.skill) FROM EVENT_SKILLS es JOIN SKILLS s ON es.s_id = s.s_id WHERE es.e_id = e.e_id) as event_skills
    FROM EVENTDETAILS e
    WHERE e.e_id = ?
    `, [id]);
  console.log(event[0])
  return event[0];
};

exports.updateEvent = async (id, updatedEvent) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const allowedFields = ['event_name', 'event_description', 'event_location', 'event_urgency', 'event_date'];
    const updates = [];
    const values = [];
    for(const key of allowedFields){
      if(updatedEvent.hasOwnProperty(key)){
        updates.push(`${key} = ?`);
        values.push(updatedEvent[key]);
      }
    }
    if(updates.length === 0){
      throw new Error('No valid fields provided for update.');
    }
    const query = `UPDATE EVENTDETAILS SET ${updates.join(', ')} WHERE e_id = ?`;
    values.push(id);
    await connection.query(query, values);
    // updating skills
    if(updatedEvent.event_skills){
      await connection.query(`DELETE FROM EVENT_SKILLS WHERE e_id = ?`, [id]);
      for(const skill of updatedEvent.event_skills){
        const s_id = skill?.s_id;
        if(!s_id) continue;
        await connection.query(`INSERT INTO EVENT_SKILLS (e_id, s_id) VALUES (?, ?)`, [id, s_id]);
      }
    }
    await connection.commit();
    return {success: true};
  } catch (error) {
    await connection.rollback();
    console.error('updateEvent model catch:', error.message);
    throw error;
  } finally {
    connection.release();
  }
};

exports.deleteEvent = async (id) => {
  try {
    const [result] = await db.query(`DELETE FROM EVENTDETAILS WHERE e_id = ?`, [id]);
    return result;
  } catch (error) {
    console.error('deleteEvent model catch:', error.message);
    throw error;
  }
};