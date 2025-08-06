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
volunteerHistoryRouter.post('/create-entry', volunteerHistoryController.createHistoryEntry);

// Update a history entry
volunteerHistoryRouter.patch('/update-entry/:id', volunteerHistoryController.updateHistoryEntry);

// volunteer clock in for event
volunteerHistoryRouter.patch('/clock-in/:id', volunteerHistoryController.clockInVol);

// volunteer clock out for event
volunteerHistoryRouter.patch('/clock-out/:id', volunteerHistoryController.clockOutVol);

// Complete an event (mark as completed with details)
volunteerHistoryRouter.patch('/mark-entry/:id/complete', volunteerHistoryController.completeEvent);

// Delete a history entry
volunteerHistoryRouter.delete('/delete-entry/:id', volunteerHistoryController.deleteHistoryEntry);

// Get top volunteers
volunteerHistoryRouter.get('/top-volunteers', volunteerHistoryController.getTopVolunteers);

// Get event history
volunteerHistoryRouter.get('/event/:eventId', volunteerHistoryController.getEventHistory);

// Get all history (admin endpoint)
volunteerHistoryRouter.get('/all', volunteerHistoryController.getAllHistory);

module.exports = {
    volunteerHistoryRouter
}; 