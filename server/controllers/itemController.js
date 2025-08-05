const itemModel = require('../models/itemModel.js');

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await itemModel.getAllSkills();
    res.status(200).json(skills);
  } catch (error) {
    console.error('getAllSkills controller catch:', error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

exports.getAllStates = async (req, res) => {
  try {
    const states = await itemModel.getAllStates();
    res.status(200).json(states);
  } catch (error) {
    console.error('getAllStates controller catch:', error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

exports.createSkill = async (req, res) => {
  const skill = req.body.skill;
  console.log(skill);
  try {
    const result = await itemModel.createSkill(skill);
    if(!result){
      return res.status(404).json({message: 'Unable to create new skill.'});
    }
    res.status(201).json({message: 'New skill added'});
  } catch (error) {
    console.error('createSkill controller catch:', error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};