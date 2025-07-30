const itemModel = require('../models/itemModel.js');

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await itemModel.getAllSkills();
    res.status(200).json(skills);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

exports.getAllStates = async (req, res) => {
  try {
    const states = await itemModel.getAllStates();
    res.status(200).json(states);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};