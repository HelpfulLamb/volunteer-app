const userModel = require('../models/userModel.js');

exports.getAllVolunteers = (req, res) => {
    try {
        const volunteers = userModel.getAllVolunteers();
        res.status(200).json({volunteers});
    } catch (error) {
        //console.error(error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.findVolunteerById = (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const volFound = userModel.findVolById(id);
        if(!volFound) {
            return res.status(404).json({message: 'Volunteer not found.'});
        }
        res.status(200).json(volFound);
    } catch (error) {
        //console.error(error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};