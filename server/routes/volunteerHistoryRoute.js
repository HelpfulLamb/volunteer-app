const express = require('express');
const volunteerHistoryController = require('../controllers/volunteerHistoryController.js');
const volunteerHistoryRouter = express();

// Get volunteer history by volunteer ID
volunteerHistoryRouter.get('/volunteer/:volunteerId', volunteerHistoryController.getVolunteerHistory);

// Get volunteer statistics
volunteerHistoryRouter.get('/volunteer/:volunteerId/stats', volunteerHistoryController.getVolunteerStats);

// Get a specific history entry by ID
volunteerHistoryRouter.get('/entry/:id', volunteerHistoryController.getHistoryEntryById);

// Create a new history entry
volunteerHistoryRouter.post('/entry', volunteerHistoryController.createHistoryEntry);

// Update a history entry
volunteerHistoryRouter.put('/entry/:id', volunteerHistoryController.updateHistoryEntry);

// Complete an event (mark as completed with details)
volunteerHistoryRouter.patch('/entry/:id/complete', volunteerHistoryController.completeEvent);

// Delete a history entry
volunteerHistoryRouter.delete('/entry/:id', volunteerHistoryController.deleteHistoryEntry);

// Get top volunteers
volunteerHistoryRouter.get('/top-volunteers', volunteerHistoryController.getTopVolunteers);

// Get event history
volunteerHistoryRouter.get('/event/:eventId', volunteerHistoryController.getEventHistory);

// Get all history (admin endpoint)
volunteerHistoryRouter.get('/all', volunteerHistoryController.getAllHistory);

module.exports = {
    volunteerHistoryRouter
}; 