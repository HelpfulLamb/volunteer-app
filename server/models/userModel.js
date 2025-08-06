const db = require('../db.js');

exports.findVolById = async (id) => {
    const sql = `
        SELECT u.u_id as id, CONCAT(u.fname, ' ', u.lname) as fullName, c.email, u.role, u.phone, u.preferences, u.address1, u.address2, u.city, u.state, u.zipcode, u.status,
               (SELECT JSON_ARRAYAGG(s.skill) FROM VOLUNTEER_SKILLS vs JOIN SKILLS s ON vs.s_id = s.s_id WHERE vs.u_id = u.u_id) as skills,
               (SELECT JSON_ARRAYAGG(a.available_date) FROM AVAILABILITY a WHERE a.u_id = u.u_id) as availability
        FROM USERPROFILE u
        JOIN USERCREDENTIALS c ON u.u_id = c.u_id
        WHERE u.u_id = ? AND u.role = 'volunteer'
    `;
    const [rows] = await db.query(sql, [id]);
    //console.log(rows[0]);
    return rows[0];
};

exports.getAssignedVol = async (e_id) => {
  const [assigned] = await db.query(`
    SELECT u.* FROM ASSIGNMENT a
    JOIN USERPROFILE u ON u.u_id = a.u_id
    WHERE a.e_id = ?
    `, [e_id]);
  return assigned;
};

exports.getAssignments = async (u_id) => {
  const [assigned] = await db.query(`
    SELECT e.*, CAST(CONCAT(e.event_date, ' ', e.event_start) AS DATETIME) as startTime, CAST(CONCAT(e.event_date, ' ', e.event_end) AS DATETIME) as endTime
    FROM ASSIGNMENT a
    JOIN EVENTDETAILS e ON e.e_id = a.e_id
    WHERE a.u_id = ?
    ORDER BY e.event_date DESC
    `, [u_id]);
  return assigned;
};

exports.findAdminById = async (id) => {
    const sql = `
        SELECT u.u_id as id, CONCAT(u.fname, ' ', u.lname) as fullName, c.email, u.role, u.phone, u.address1, u.address2, u.city, u.state, u.zipcode
        FROM USERPROFILE u
        JOIN USERCREDENTIALS c ON u.u_id = c.u_id
        WHERE u.u_id = ? AND u.role = 'admin'
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
};

exports.findUserByEmail = async (email, role) => {
    const sql = `
        SELECT u.u_id, u.role, c.email, c.password
        FROM USERPROFILE u
        JOIN USERCREDENTIALS c ON u.u_id = c.u_id
        WHERE c.email = ? AND u.role = ?
    `;
    const [rows] = await db.query(sql, [email, role]);
    return rows[0];
};

exports.createUser = async (userData) => {
    const { email, password, role } = userData;
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const [userProfileResult] = await connection.query('INSERT INTO USERPROFILE (role) VALUES (?)', [role]);
        const userId = userProfileResult.insertId;
        await connection.query('INSERT INTO USERCREDENTIALS (u_id, email, password) VALUES (?, ?, ?)', [userId, email, password]);
        await connection.commit();
        return { id: userId, email, role };
    } catch (error) {
        await connection.rollback();
        //console.error('createUser model catch:', error.message);
        throw error;
    } finally {
        connection.release();
    }
};

exports.getAllVolunteers = async () => {
    const sql = `
        SELECT u.u_id as id, CONCAT(u.fname, ' ', u.lname) as fullName, c.email, u.role, u.phone, u.preferences, u.address1, u.address2, u.city, u.state, u.zipcode, u.status,
               (SELECT JSON_ARRAYAGG(s.skill) FROM VOLUNTEER_SKILLS vs JOIN SKILLS s ON vs.s_id = s.s_id WHERE vs.u_id = u.u_id) as skills,
               (SELECT JSON_ARRAYAGG(a.available_date) FROM AVAILABILITY a WHERE a.u_id = u.u_id) as availability
        FROM USERPROFILE u
        JOIN USERCREDENTIALS c ON u.u_id = c.u_id
        WHERE u.role = 'volunteer'
    `;
    const [rows] = await db.query(sql);
    return rows;
};

exports.getActiveVol = async () => {
  const [volunteers] = await db.query(`
    SELECT u.u_id as id, CONCAT(u.fname, ' ', u.lname) as fullName, c.email, u.role, u.phone, u.preferences, u.address1, u.address2, u.city, u.state, u.zipcode, u.status,
    (SELECT JSON_ARRAYAGG(s.skill) FROM VOLUNTEER_SKILLS vs JOIN SKILLS s ON vs.s_id = s.s_id WHERE vs.u_id = u.u_id) as skills,
    (SELECT JSON_ARRAYAGG(a.available_date) FROM AVAILABILITY a WHERE a.u_id = u.u_id) as availability
    FROM USERPROFILE u
    JOIN USERCREDENTIALS c ON u.u_id = c.u_id
    WHERE u.role = 'volunteer' AND u.status = 'Active';
    `);
  //console.log(volunteers);
  return volunteers;
};

exports.getAllAdmins = async () => {
    const sql = `
        SELECT u.u_id as id, CONCAT(u.fname, ' ', u.lname) as fullName, c.email, u.role, u.phone, u.address1, u.address2, u.city, u.state, u.zipcode
        FROM USERPROFILE u
        JOIN USERCREDENTIALS c ON u.u_id = c.u_id
        WHERE u.role = 'admin'
    `;
    const [rows] = await db.query(sql);
    return rows;
};

exports.updateProfile = async (id, updatedProfile, role) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const allowedFields = ['fullName', 'phone', 'address1', 'address2', 'city', 'state', 'zipcode', 'preferences'];
        const updates = [];
        const values = [];
        for(const key of allowedFields){
          if(updatedProfile.hasOwnProperty(key)){
            if(key === 'fullName'){
              const [fname, lname] = updatedProfile.fullName.split(' ');
              updates.push('fname = ?', 'lname = ?');
              values.push(fname, lname);
              continue;
            }
            updates.push(`${key} = ?`);
            values.push(updatedProfile[key]);
          }
        }
        if(updates.length === 0){
          throw new Error('No valid fields provided for update.');
        }
        const query = `UPDATE USERPROFILE SET ${updates.join(', ')} WHERE u_id = ?`;
        values.push(id);
        await connection.query(query, values);
        // updating volunteer skills
        if (role === 'volunteer') {
          const { skills, availability } = updatedProfile;
          if(updatedProfile.skills){
            //console.log('user id:', id);
            //console.log('skill id: ', skills);
            await connection.query('DELETE FROM VOLUNTEER_SKILLS WHERE u_id = ?', [id]);
            if (skills && skills.length > 0) {
                const skillPairs = skills.map(skillId => [id, skillId]);
                const skillsQuery = 'INSERT INTO VOLUNTEER_SKILLS (u_id, s_id) VALUES ?';
                await connection.query(skillsQuery, [skillPairs]);
            }
          }
          if(updatedProfile.availability){
            //console.log(availability);
            await connection.query('DELETE FROM AVAILABILITY WHERE u_id = ?', [id]);
            const validDates = availability.filter(date => typeof date === 'string' && date.trim() !== '').map(date => [id, date]);
            if (validDates.length > 0) {
                const availabilityQuery = 'INSERT INTO AVAILABILITY (u_id, available_date) VALUES ?';
                await connection.query(availabilityQuery, [validDates]);
            }
          }
        }
        await connection.commit();
        const [rows] = await connection.query('SELECT * FROM USERPROFILE WHERE u_id = ?', [id]);
        return rows[0];
    } catch (error) {
        await connection.rollback();
        console.error('updateProfile model catch:', error.message);
        throw error;
    } finally {
        connection.release();
    }
};

exports.deleteUser = async (id) => {
    const [result] = await db.query('DELETE FROM USERPROFILE WHERE u_id = ?', [id]);
    return result.affectedRows > 0;
};

exports.changeActiveStatus = async (id, change) => {
  try {
    const [user] = await db.query(`UPDATE USERPROFILE SET status = ? WHERE u_id = ?`, [change, id]);
    return user;
  } catch (error) {
    console.error('changeActiveStatus model catch:', error.message);
    throw error;
  }
};

exports.assignVolunteer = async (id, eventId) => {
  try {
    const [assign] = await db.query(`INSERT INTO ASSIGNMENT (u_id, e_id) VALUES (?, ?)`, [id, eventId]);
    await db.query(`INSERT INTO VOLUNTEERHISTORY (u_id, e_id) VALUES (?, ?)`, [id, eventId]);
    return assign;
  } catch (error) {
    console.error('assignVolunteer model catch:', error.message);
    throw error;
  }
};

exports.unassignVolunteer = async (id, eventId) => {
  try {
    const [result] = await db.query(`DELETE FROM ASSIGNMENT WHERE u_id = ? AND e_id = ?`, [id, eventId]);
    await db.query(`DELETE FROM VOLUNTEERHISTORY WHERE u_id = ? AND e_id = ?`, [id, eventId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('unassignVolunteer model catch:', error.message);
    throw error;
  }
};