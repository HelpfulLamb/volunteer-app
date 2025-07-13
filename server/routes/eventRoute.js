const express = require('express');
const eventController = require('../controllers/eventController.js');
const eventRouter = express();

eventRouter.post('/create-event', eventController.createEvent);
eventRouter.get('/', eventController.getAllEvents);
eventRouter.get('/:id/find', eventController.findEventById);
eventRouter.patch('/update-event/:id', eventController.updateEvent);
eventRouter.delete('/delete-event/:id', eventController.deleteEvent);

module.exports = {
    eventRouter
};