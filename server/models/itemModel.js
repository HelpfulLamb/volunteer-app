const db = require('../db.js');

exports.getAllSkills = async () => {
  const [result] = await db.query('SELECT * FROM SKILLS');
  return result;
};

exports.getAllStates = async () => {
  const [states] = await db.query('SELECT * FROM STATES');
  return states;
};