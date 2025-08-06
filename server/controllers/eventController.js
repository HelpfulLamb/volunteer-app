const eventModel = require('../models/eventModel.js');
const NotificationService = require('../services/notificationService.js');
const userModel = require('../models/userModel.js');

exports.createEvent = async (req, res) => {
    const {event_name, event_description, event_location, event_skills, event_urgency, event_date, event_start, event_end} = req.body;
    const unsafeCharacters = /[`@{}[\];<>:"\\]/;
    if(unsafeCharacters.test(event_name) || unsafeCharacters.test(event_description) || unsafeCharacters.test(event_location)){
      return res.status(400).json({message: 'Invalid characters found.'});
    }
    if(!event_name || !event_description || !event_location || !event_skills || !event_urgency || !event_date || !event_start || !event_end) {
        return res.status(400).json({message: 'All fields are required! Something is missing.'});
    }
    try {
        const event = await eventModel.createEvent({event_name, event_description, event_location, event_skills, event_urgency, event_date, event_start, event_end});
        const allVol = await userModel.getAllVolunteers();
        await NotificationService.sendBulkNotifications(
          allVol.map(v => v.id),
          event,
          'general',
          'New Upcoming Event',
          `A new event "${event_name}" has been created for ${event_date} from ${event_start} to ${event_end}.`
        );
        res.status(201).json({event, message: 'New event created successfully.'});
    } catch (error) {
      console.error('createEvent controller catch:', error.message);
      res.status(500).json({message: "Internal Server Error"});
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await eventModel.getAllEvents();
        res.status(200).json({ events });
    } catch (error) {
      //console.error(error.message);
      res.status(500).json({message: "Internal Server Error"});
    }
};

exports.getActiveEvents = async (req, res) => {
    try {
        const events = await eventModel.getActiveEvents();
        res.status(200).json({ events });
    } catch (error) {
      //console.error(error.message);
      res.status(500).json({message: "Internal Server Error"});
    }
};

exports.findEventById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const eventFound = await eventModel.findEventById(id);
    if(!eventFound) {
      return res.status(404).json({message: "Event not found."});
    }
    res.status(200).json(eventFound);
  } catch (error) {
    //console.error('findEventById controller catch:', error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

exports.updateEvent = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log('update:', id);
  const updateData = req.body;
  try {
    const updatedEvent = await eventModel.updateEvent(id, updateData);
    console.log(updatedEvent);
    if(!updatedEvent){
      return res.status(404).json({message: "Event not Found."});
    }
    const assignedVol = await userModel.getAssignedVol(id);
    console.log('assigned:', assignedVol);
    if(assignedVol && assignedVol.length > 0){
      await NotificationService.sendBulkNotifications(
        assignedVol.map(v => v.u_id),
        id,
        'update',
        'Event Update',
        `The event "${updatedEvent.event_name}" has been updated. Please review the new details.`
      );
    }
    res.status(200).json({message: "Event updated successfully.", event: updatedEvent});
  } catch (error) {
    console.error('updateEvent controller catch:', error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

exports.deleteEvent = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedEvent = await eventModel.deleteEvent(id);
    if(!deletedEvent){
      return res.status(404).json({message: "Event not Found."});
    }
    res.status(200).json({message: "Event deleted successfully."});
  } catch (error) {
    //console.error('deleteEvent controller catch:', error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

exports.changeStatus = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const eventStatus = req.body.event_status;
  console.log(eventStatus);
  try {
    const change = await eventModel.changeStatus(id, eventStatus);
    if(!change){
      return res.status(404).json({message: 'Event not found.'});
    }
    console.log(change);
    const event = await eventModel.findEventById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found after status update.' });
    }
    const allVol = await userModel.getAllVolunteers();
    await NotificationService.sendBulkNotifications(
      allVol.map(v => v.id),
      event.id,
      'update',
      'Event Has Been Cancelled',
      `The upcoming event "${event.event_name}" taking place on ${event.event_date} has been cancelled.`
    );
    res.status(200).json({message: 'Event status changed successfully.'});
  } catch (error) {
    console.error('changeStatus controller catch:', error.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
};