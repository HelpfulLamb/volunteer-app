const db = require('../db.js');

exports.createHistoryEntry = async (historyData) => {
    const { volunteerId, eventId, eventName, eventDate, eventLocation, status } = historyData;
    
    try {
        const [result] = await db.execute(
            'INSERT INTO VOLUNTEERHISTORY (u_id, e_id, e_status, hours_worked, feedback, rating, createdAt, completedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                volunteerId,
                eventId,
                status || 'scheduled',
                0,
                null,
                null,
                new Date(),
                null
            ]
        );
        
        const newEntry = {
            id: result.insertId,
            volunteerId,
            eventId,
            eventName,
            eventDate,
            eventLocation,
            status: status || 'scheduled',
            hoursWorked: 0,
            skillsUsed: [],
            feedback: null,
            rating: null,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        return newEntry;
    } catch (error) {
        console.error('Error creating history entry:', error);
        throw error;
    }
};

exports.getHistoryByVolunteerId = async (volunteerId) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                h.h_id as id,
                h.u_id as volunteerId,
                h.e_id as eventId,
                e.event_name as eventName,
                e.event_description as eventDescription,
                e.event_date as eventDate,
                e.event_location as eventLocation,
                h.e_status as status,
                h.hours_worked as hoursWorked,
                h.feedback,
                h.rating,
                h.createdAt,
                h.completedAt
            FROM VOLUNTEERHISTORY h
            LEFT JOIN EVENTDETAILS e ON h.e_id = e.e_id
            WHERE h.u_id = ?
            ORDER BY h.createdAt DESC
        `, [volunteerId]);
        
        const historyWithSkills = await Promise.all(rows.map(async (row) => {
            const [skillsRows] = await db.execute(`
                SELECT s.skill
                FROM HISTORY_SKILLS_USED hsu
                JOIN SKILLS s ON hsu.s_id = s.s_id
                WHERE hsu.h_id = ?
            `, [row.id]);
            
            return {
                ...row,
                skillsUsed: skillsRows.map(s => s.skill),
                createdAt: row.createdAt.toISOString(),
                completedAt: row.completedAt ? row.completedAt.toISOString() : null
            };
        }));
        
        return historyWithSkills;
    } catch (error) {
        console.error('Error getting history by volunteer ID:', error);
        throw error;
    }
};

exports.getHistoryById = async (id) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                h.h_id as id,
                h.u_id as volunteerId,
                h.e_id as eventId,
                e.event_name as eventName,
                e.event_description as eventDescription,
                e.event_date as eventDate,
                e.event_location as eventLocation,
                h.e_status as status,
                h.hours_worked as hoursWorked,
                h.feedback,
                h.rating,
                h.createdAt,
                h.completedAt
            FROM VOLUNTEERHISTORY h
            LEFT JOIN EVENTDETAILS e ON h.e_id = e.e_id
            WHERE h.h_id = ?
        `, [id]);
        
        if (rows.length === 0) {
            return null;
        }
        
        const history = rows[0];
        
        const [skillsRows] = await db.execute(`
            SELECT s.skill
            FROM HISTORY_SKILLS_USED hsu
            JOIN SKILLS s ON hsu.s_id = s.s_id
            WHERE hsu.h_id = ?
        `, [id]);
        
        return {
            ...history,
            skillsUsed: skillsRows.map(s => s.skill),
            createdAt: history.createdAt.toISOString(),
            completedAt: history.completedAt ? history.completedAt.toISOString() : null
        };
    } catch (error) {
        console.error('Error getting history by ID:', error);
        throw error;
    }
};

exports.updateHistoryEntry = async (id, updateData) => {
    try {
        const allowedFields = ['e_status', 'hours_worked', 'feedback', 'rating', 'completedAt'];
        const updateFields = [];
        const updateValues = [];
        
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key)) {
                updateFields.push(`${key} = ?`);
                updateValues.push(updateData[key]);
            }
        });
        
        if (updateFields.length === 0) {
            return null;
        }
        
        updateValues.push(id);
        
        const [result] = await db.execute(
            `UPDATE VOLUNTEERHISTORY SET ${updateFields.join(', ')} WHERE h_id = ?`,
            updateValues
        );
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        return await this.getHistoryById(id);
    } catch (error) {
        console.error('Error updating history entry:', error);
        throw error;
    }
};

exports.completeEvent = async (id, completionData) => {
    try {
        const { skillsUsed, feedback, rating, hoursWorked } = completionData;
        
        const [result] = await db.execute(
            'UPDATE VOLUNTEERHISTORY SET e_status = ?, hours_worked = ?, feedback = ?, rating = ?, completedAt = ? WHERE h_id = ?',
            ['completed', hoursWorked || 0, feedback || null, rating || null, new Date(), id]
        );
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        await db.execute('DELETE FROM HISTORY_SKILLS_USED WHERE h_id = ?', [id]);
        
        if (skillsUsed && skillsUsed.length > 0) {
            for (const skill of skillsUsed) {
                let [skillRows] = await db.execute('SELECT s_id FROM SKILLS WHERE skill = ?', [skill]);
                let skillId;
                
                if (skillRows.length === 0) {
                    const [insertResult] = await db.execute('INSERT INTO SKILLS (skill) VALUES (?)', [skill]);
                    skillId = insertResult.insertId;
                } else {
                    skillId = skillRows[0].s_id;
                }
                
                await db.execute('INSERT INTO HISTORY_SKILLS_USED (h_id, s_id) VALUES (?, ?)', [id, skillId]);
            }
        }
        
        return await this.getHistoryById(id);
    } catch (error) {
        console.error('Error completing event:', error);
        throw error;
    }
};

exports.getVolunteerStats = async (volunteerId) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                COUNT(*) as totalEvents,
                SUM(CASE WHEN e_status = 'completed' THEN 1 ELSE 0 END) as completedEvents,
                SUM(CASE WHEN e_status = 'scheduled' THEN 1 ELSE 0 END) as scheduledEvents,
                SUM(CASE WHEN e_status = 'completed' THEN hours_worked ELSE 0 END) as totalHours,
                AVG(CASE WHEN e_status = 'completed' AND rating IS NOT NULL THEN rating ELSE NULL END) as averageRating
            FROM VOLUNTEERHISTORY
            WHERE u_id = ?
        `, [volunteerId]);
        
        const stats = rows[0];
        
        const [skillsRows] = await db.execute(`
            SELECT DISTINCT s.skill
            FROM VOLUNTEERHISTORY h
            JOIN HISTORY_SKILLS_USED hsu ON h.h_id = hsu.h_id
            JOIN SKILLS s ON hsu.s_id = s.s_id
            WHERE h.u_id = ? AND h.e_status = 'completed'
        `, [volunteerId]);
        
        const [monthlyRows] = await db.execute(`
            SELECT COUNT(*) as eventsThisMonth
            FROM VOLUNTEERHISTORY
            WHERE u_id = ? AND e_status = 'completed' 
            AND MONTH(completedAt) = MONTH(CURRENT_DATE()) 
            AND YEAR(completedAt) = YEAR(CURRENT_DATE())
        `, [volunteerId]);
        
        const [yearlyRows] = await db.execute(`
            SELECT COUNT(*) as eventsThisYear
            FROM VOLUNTEERHISTORY
            WHERE u_id = ? AND e_status = 'completed' 
            AND YEAR(completedAt) = YEAR(CURRENT_DATE())
        `, [volunteerId]);
        
        return {
            totalEvents: stats.totalEvents,
            completedEvents: stats.completedEvents,
            scheduledEvents: stats.scheduledEvents,
            totalHours: stats.totalHours || 0,
            averageRating: stats.averageRating ? Math.round(stats.averageRating * 10) / 10 : 0,
            skillsUsed: skillsRows.map(s => s.skill),
            eventsThisMonth: monthlyRows[0].eventsThisMonth,
            eventsThisYear: yearlyRows[0].eventsThisYear
        };
    } catch (error) {
        console.error('Error getting volunteer stats:', error);
        throw error;
    }
};

exports.getTopVolunteers = async (limit = 10) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                u_id as volunteerId,
                COUNT(*) as totalEvents,
                SUM(CASE WHEN e_status = 'completed' THEN 1 ELSE 0 END) as completedEvents,
                SUM(CASE WHEN e_status = 'completed' THEN hours_worked ELSE 0 END) as totalHours,
                AVG(CASE WHEN e_status = 'completed' AND rating IS NOT NULL THEN rating ELSE NULL END) as averageRating
            FROM VOLUNTEERHISTORY
            GROUP BY u_id
            ORDER BY totalHours DESC
            LIMIT ?
        `, [limit]);
        
        return rows.map(row => ({
            ...row,
            averageRating: row.averageRating ? Math.round(row.averageRating * 10) / 10 : 0
        }));
    } catch (error) {
        console.error('Error getting top volunteers:', error);
        throw error;
    }
};

exports.getEventHistory = async (eventId) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                h.h_id as id,
                h.u_id as volunteerId,
                h.e_id as eventId,
                e.event_name as eventName,
                e.event_description as eventDescription,
                e.event_date as eventDate,
                e.event_location as eventLocation,
                h.e_status as status,
                h.hours_worked as hoursWorked,
                h.feedback,
                h.rating,
                h.createdAt,
                h.completedAt
            FROM VOLUNTEERHISTORY h
            LEFT JOIN EVENTDETAILS e ON h.e_id = e.e_id
            WHERE h.e_id = ?
            ORDER BY h.createdAt DESC
        `, [eventId]);
        
        const historyWithSkills = await Promise.all(rows.map(async (row) => {
            const [skillsRows] = await db.execute(`
                SELECT s.skill
                FROM HISTORY_SKILLS_USED hsu
                JOIN SKILLS s ON hsu.s_id = s.s_id
                WHERE hsu.h_id = ?
            `, [row.id]);
            
            return {
                ...row,
                skillsUsed: skillsRows.map(s => s.skill),
                createdAt: row.createdAt.toISOString(),
                completedAt: row.completedAt ? row.completedAt.toISOString() : null
            };
        }));
        
        return historyWithSkills;
    } catch (error) {
        console.error('Error getting event history:', error);
        throw error;
    }
};

exports.deleteHistoryEntry = async (id) => {
    try {
        const history = await this.getHistoryById(id);
        if (!history) {
            return null;
        }
        
        await db.execute('DELETE FROM HISTORY_SKILLS_USED WHERE h_id = ?', [id]);
        
        const [result] = await db.execute('DELETE FROM VOLUNTEERHISTORY WHERE h_id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        return history;
    } catch (error) {
        console.error('Error deleting history entry:', error);
        throw error;
    }
};

exports.getAllHistory = async () => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                h.h_id as id,
                h.u_id as volunteerId,
                h.e_id as eventId,
                e.event_name as eventName,
                e.event_description as eventDescription,
                e.event_date as eventDate,
                e.event_location as eventLocation,
                h.e_status as status,
                h.hours_worked as hoursWorked,
                h.feedback,
                h.rating,
                h.createdAt,
                h.completedAt
            FROM VOLUNTEERHISTORY h
            LEFT JOIN EVENTDETAILS e ON h.e_id = e.e_id
            ORDER BY h.createdAt DESC
        `);
        

        const historyWithSkills = await Promise.all(rows.map(async (row) => {
            const [skillsRows] = await db.execute(`
                SELECT s.skill
                FROM HISTORY_SKILLS_USED hsu
                JOIN SKILLS s ON hsu.s_id = s.s_id
                WHERE hsu.h_id = ?
            `, [row.id]);
            
            return {
                ...row,
                skillsUsed: skillsRows.map(s => s.skill),
                createdAt: row.createdAt.toISOString(),
                completedAt: row.completedAt ? row.completedAt.toISOString() : null
            };
        }));
        
        return historyWithSkills;
    } catch (error) {
        console.error('Error getting all history:', error);
        throw error;
    }
}; 