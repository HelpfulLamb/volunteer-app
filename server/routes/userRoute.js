const express = require('express');
const userController = require('../controllers/userController.js');
const userRouter = express();

userRouter.get('/volunteers', userController.getAllVolunteers);
userRouter.get('/volunteers/:id/find', userController.findVolunteerById);

module.exports = {
    userRouter
};