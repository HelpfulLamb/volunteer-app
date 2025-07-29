const db = require('../db.js');
const bcrypt = require('bcrypt');

exports.findVolById = async (id) => {
    const sql = `
        SELECT u.u_id as id, CONCAT(u.fname, ' ', u.lname) as fullName, c.email, u.role, u.phone, u.preferences, u.address1, u.address2, u.city, u.state, u.zipcode as zip, u.assigned,
               (SELECT JSON_ARRAYAGG(s.skill) FROM VOLUNTEER_SKILLS vs JOIN SKILLS s ON vs.s_id = s.s_id WHERE vs.u_id = u.u_id) as skills,
               (SELECT JSON_ARRAYAGG(a.available_date) FROM AVAILABILITY a WHERE a.u_id = u.u_id) as availability
        FROM USERPROFILE u
        JOIN USERCREDENTIALS c ON u.u_id = c.u_id
        WHERE u.u_id = ? AND u.role = 'volunteer'
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
};

exports.findAdminById = async (id) => {
    const sql = `
        SELECT u.u_id as id, CONCAT(u.fname, ' ', u.lname) as fullName, c.email, u.role, u.phone, u.address1, u.address2, u.city, u.state, u.zipcode as zip
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
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.query('INSERT INTO USERCREDENTIALS (u_id, email, password) VALUES (?, ?, ?)', [userId, email, hashedPassword]);
        await connection.commit();
        return { id: userId, email, role };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.getAllVolunteers = async () => {
    const sql = `
        SELECT u.u_id as id, CONCAT(u.fname, ' ', u.lname) as fullName, c.email, u.role, u.phone, u.preferences, u.address1, u.address2, u.city, u.state, u.zipcode as zip, u.assigned,
               (SELECT JSON_ARRAYAGG(s.skill) FROM VOLUNTEER_SKILLS vs JOIN SKILLS s ON vs.s_id = s.s_id WHERE vs.u_id = u.u_id) as skills,
               (SELECT JSON_ARRAYAGG(a.available_date) FROM AVAILABILITY a WHERE a.u_id = u.u_id) as availability
        FROM USERPROFILE u
        JOIN USERCREDENTIALS c ON u.u_id = c.u_id
        WHERE u.role = 'volunteer'
    `;
    const [rows] = await db.query(sql);
    return rows;
};

exports.getAllAdmins = async () => {
    const sql = `
        SELECT u.u_id as id, CONCAT(u.fname, ' ', u.lname) as fullName, c.email, u.role, u.phone, u.address1, u.address2, u.city, u.state, u.zipcode as zip
        FROM USERPROFILE u
        JOIN USERCREDENTIALS c ON u.u_id = c.u_id
        WHERE u.role = 'admin'
    `;
    const [rows] = await db.query(sql);
    return rows;
};

exports.updateProfile = async (id, updatedProfile, role) => {
    const { fullName, phone, address1, address2, city, state, zip, skills, preferences, availability } = updatedProfile;
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const [fname, lname] = fullName.split(' ');
        await connection.query(
            'UPDATE USERPROFILE SET fname = ?, lname = ?, phone = ?, preferences = ?, address1 = ?, address2 = ?, city = ?, state = ?, zipcode = ? WHERE u_id = ?',
            [fname, lname, phone, preferences, address1, address2, city, state, zip, id]
        );

        if (role === 'volunteer') {
            await connection.query('DELETE FROM VOLUNTEER_SKILLS WHERE u_id = ?', [id]);
            if (skills && skills.length > 0) {
                const skillsQuery = 'INSERT INTO VOLUNTEER_SKILLS (u_id, s_id) SELECT ?, s_id FROM SKILLS WHERE skill IN (?)';
                await connection.query(skillsQuery, [id, skills]);
            }

            await connection.query('DELETE FROM AVAILABILITY WHERE u_id = ?', [id]);
            if (availability && availability.length > 0) {
                const availabilityQuery = 'INSERT INTO AVAILABILITY (u_id, available_date) VALUES ?';
                const availabilityValues = availability.map(date => [id, date]);
                await connection.query(availabilityQuery, [availabilityValues]);
            }
        }
        await connection.commit();
        const [rows] = await connection.query('SELECT * FROM USERPROFILE WHERE u_id = ?', [id]);
        return rows[0];
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.deleteUser = async (id) => {
    const [result] = await db.query('DELETE FROM USERPROFILE WHERE u_id = ?', [id]);
    return result.affectedRows > 0;
};