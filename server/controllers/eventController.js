const eventModel = require('../models/eventModel.js');

exports.createEvent = async (req, res) => {
    const {event_name, event_description, event_location, event_skills, event_urgency, event_date} = req.body;
    if(!event_name || !event_description || !event_location || !event_skills || !event_urgency || !event_date) {
        return res.status(400).json({message: 'All fields are required! Something is missing.'});
    }
    try {
        await eventModel.createEvent({event_name, event_description, event_location, event_skills, event_urgency, event_date});
        res.status(201).json({message: 'New event created successfully.'});
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
      console.error(error.message);
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
    console.error('findEventById controller catch:', error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

exports.updateEvent = async (req, res) => {
  const id = parseInt(req.params.id);
  const updateData = req.body;
  try {
    const updatedEvent = await eventModel.updateEvent(id, updateData);
    if(!updatedEvent){
      return res.status(404).json({message: "Event not Found."});
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
    console.error('deleteEvent controller catch:', error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};