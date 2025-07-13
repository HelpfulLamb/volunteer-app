const eventModel = require('../models/eventModel.js');

exports.createEvent = (req, res) => {
    const {event_name, event_description, event_location, event_skills, event_urgency, event_date} = req.body;
    if(!event_name || !event_description || !event_location || !event_skills || !event_urgency || !event_date) {
        return res.status(400).json({message: 'All fields are required! Something is missing.'});
    }
    try {
        eventModel.createEvent({event_name, event_description, event_location, event_skills, event_urgency, event_date});
        res.status(201).json({message: 'New event created successfully.'});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
        //console.error(error.message);
    }
};

exports.getAllEvents = (req, res) => {
    try {
        const events = eventModel.getAllEvents();
        res.status(200).json({events});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
        //console.error(error.message);
    }
};

exports.findEventById = (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const eventFound = eventModel.findEventById(id);
        if(!eventFound) {
            return res.status(404).json({message: "Event not found."});
        }
        res.status(200).json(eventFound);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
        //console.error(error.message);
    }
};

exports.updateEvent = (req, res) => {
    const id = parseInt(req.params.id);
    //console.log('Current id being passed through: ' + id);
    const updateData = req.body;
    try {
        const updatedEvent = eventModel.updateEvent(id, updateData);
        if(!updatedEvent){
            return res.status(404).json({message: "Event not Found."});
        }
        res.status(200).json({message: "Event updated successfully.", event: updatedEvent});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
        //console.error(error.message);
    }
};

exports.deleteEvent = (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const deletedEvent = eventModel.deleteEvent(id);
        if(!deletedEvent){
            return res.status(404).json({message: "Event not Found."});
        }
        res.status(200).json({message: "Event deleted successfully."});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
        //console.error(error.message);
    }
};