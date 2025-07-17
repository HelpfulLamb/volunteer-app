const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

// In-memory storage for volunteer history (replace with database in production)
const volunteerHistory = [
    {
        id: '1',
        volunteerId: 1,
        eventId: 101,
        eventName: 'Food Bank Assistance',
        eventDate: '2023-11-15',
        eventLocation: '2020 Hermann Dr, Houston, TX',
        status: 'completed',
        hoursWorked: 4,
        skillsUsed: ['First Aid', 'Event Planning'],
        feedback: 'Great teamwork and organization',
        rating: 5,
        createdAt: '2023-11-15T16:00:00Z',
        completedAt: '2023-11-15T20:00:00Z'
    },
    {
        id: '2',
        volunteerId: 1,
        eventId: 103,
        eventName: 'Park Cleanup',
        eventDate: '2023-11-20',
        eventLocation: 'Central Park, New York, NY',
        status: 'completed',
        hoursWorked: 3,
        skillsUsed: ['Translation', 'Event Planning'],
        feedback: 'Excellent communication skills',
        rating: 4,
        createdAt: '2023-11-20T09:00:00Z',
        completedAt: '2023-11-20T12:00:00Z'
    },
    {
        id: '3',
        volunteerId: 2,
        eventId: 102,
        eventName: 'Senior Meal Delivery',
        eventDate: '2023-11-18',
        eventLocation: '6827 Cypresswood Dr, Spring, TX',
        status: 'completed',
        hoursWorked: 2,
        skillsUsed: ['Driving', 'Cooking'],
        feedback: 'Very reliable and punctual',
        rating: 5,
        createdAt: '2023-11-18T10:00:00Z',
        completedAt: '2023-11-18T12:00:00Z'
    },
    {
        id: '4',
        volunteerId: 3,
        eventId: 104,
        eventName: 'Shelter Setup',
        eventDate: '2023-11-22',
        eventLocation: '20400 Sandstone Cavern Cir, Richmond, TX',
        status: 'scheduled',
        hoursWorked: 0,
        skillsUsed: ['Construction', 'Heavy Lifting'],
        feedback: null,
        rating: null,
        createdAt: '2023-11-10T14:00:00Z',
        completedAt: null
    }
];

exports.createHistoryEntry = (historyData) => {
    const { volunteerId, eventId, eventName, eventDate, eventLocation, status } = historyData;
    const newEntry = {
        id: uuidv4(),
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
    volunteerHistory.push(newEntry);
    return newEntry;
};

exports.getHistoryByVolunteerId = (volunteerId) => {
    return volunteerHistory.filter(h => h.volunteerId === volunteerId);
};

exports.getHistoryById = (id) => {
    return volunteerHistory.find(h => h.id === id);
};

exports.updateHistoryEntry = (id, updateData) => {
    const entry = volunteerHistory.find(h => h.id === id);
    if (!entry) {
        return null;
    }
    
    Object.keys(updateData).forEach(key => {
        if (entry.hasOwnProperty(key)) {
            entry[key] = updateData[key];
        }
    });
    
    return entry;
};

exports.completeEvent = (id, completionData) => {
    const entry = volunteerHistory.find(h => h.id === id);
    if (!entry) {
        return null;
    }
    
    entry.status = 'completed';
    entry.hoursWorked = completionData.hoursWorked || 0;
    entry.skillsUsed = completionData.skillsUsed || [];
    entry.feedback = completionData.feedback || null;
    entry.rating = completionData.rating || null;
    entry.completedAt = new Date().toISOString();
    
    return entry;
};

exports.getVolunteerStats = (volunteerId) => {
    const volunteerEntries = volunteerHistory.filter(h => h.volunteerId === volunteerId);
    const completedEvents = volunteerEntries.filter(h => h.status === 'completed');
    const scheduledEvents = volunteerEntries.filter(h => h.status === 'scheduled');
    
    const totalHours = completedEvents.reduce((sum, event) => sum + event.hoursWorked, 0);
    const averageRating = completedEvents.length > 0 
        ? completedEvents.reduce((sum, event) => sum + (event.rating || 0), 0) / completedEvents.length 
        : 0;
    
    const skillsUsed = [...new Set(completedEvents.flatMap(event => event.skillsUsed))];
    
    return {
        totalEvents: volunteerEntries.length,
        completedEvents: completedEvents.length,
        scheduledEvents: scheduledEvents.length,
        totalHours,
        averageRating: Math.round(averageRating * 10) / 10,
        skillsUsed,
        eventsThisMonth: completedEvents.filter(event => 
            moment(event.eventDate).isSame(moment(), 'month')
        ).length,
        eventsThisYear: completedEvents.filter(event => 
            moment(event.eventDate).isSame(moment(), 'year')
        ).length
    };
};

exports.getTopVolunteers = (limit = 10) => {
    const volunteerStats = {};
    
    // Calculate stats for each volunteer
    volunteerHistory.forEach(entry => {
        if (!volunteerStats[entry.volunteerId]) {
            volunteerStats[entry.volunteerId] = {
                volunteerId: entry.volunteerId,
                totalEvents: 0,
                completedEvents: 0,
                totalHours: 0,
                averageRating: 0,
                ratings: []
            };
        }
        
        volunteerStats[entry.volunteerId].totalEvents++;
        
        if (entry.status === 'completed') {
            volunteerStats[entry.volunteerId].completedEvents++;
            volunteerStats[entry.volunteerId].totalHours += entry.hoursWorked;
            if (entry.rating) {
                volunteerStats[entry.volunteerId].ratings.push(entry.rating);
            }
        }
    });
    
    // Calculate average ratings
    Object.values(volunteerStats).forEach(stats => {
        if (stats.ratings.length > 0) {
            stats.averageRating = stats.ratings.reduce((sum, rating) => sum + rating, 0) / stats.ratings.length;
        }
        delete stats.ratings;
    });
    
    // Sort by total hours and return top volunteers
    return Object.values(volunteerStats)
        .sort((a, b) => b.totalHours - a.totalHours)
        .slice(0, limit);
};

exports.getEventHistory = (eventId) => {
    return volunteerHistory.filter(h => h.eventId === eventId);
};

exports.deleteHistoryEntry = (id) => {
    const index = volunteerHistory.findIndex(h => h.id === id);
    if (index === -1) {
        return null;
    }
    return volunteerHistory.splice(index, 1)[0];
};

exports.getAllHistory = () => {
    return volunteerHistory;
}; 