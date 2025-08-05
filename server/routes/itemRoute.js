const express = require('express');
const itemController = require('../controllers/itemController.js');
const itemRouter = express();

itemRouter.post('/add-skill', itemController.createSkill);
itemRouter.get('/skills', itemController.getAllSkills);
itemRouter.get('/states', itemController.getAllStates);
// skillRouter.get('/:id/find', skillController.findSkillById);
// skillRouter.patch('/update-skill/:id', skillController.updateSkill);
// skillRouter.delete('/delete-skill/:id', skillController.deleteSkill);

module.exports = {
  itemRouter
};