const express = require('express');
const userController = require('../controllers/userController.js');
const userRouter = express();

userRouter.get('/volunteers', userController.getAllVolunteers);

module.exports = {
    userRouter
};