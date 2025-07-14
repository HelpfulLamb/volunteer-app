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