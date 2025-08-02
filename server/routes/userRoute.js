const express = require('express');
const userController = require('../controllers/userController.js');
const authenticate = require('../utils/AuthMiddleware.js');
const userRouter = express();

userRouter.get('/volunteers', userController.getAllVolunteers);
userRouter.get('/admins', userController.getAllAdmins);
userRouter.get('/volunteers/:id/find', userController.findVolunteerById);
userRouter.get('/admins/:id/find', userController.findAdminById);
userRouter.get('/active-volunteers', userController.getActiveVol);
userRouter.get('/assigned-volunteers', userController.getAssignedVol);
userRouter.post('/login', userController.loginUser);
userRouter.post('/register', userController.registerUser);
userRouter.post('/assignment/:id', userController.assignVolunteer);
userRouter.patch('/status-change/:id', userController.changeActiveStatus);
userRouter.patch('/update-profile/:id', authenticate, userController.updateProfile);
userRouter.delete('/delete-account/:id', userController.deleteUser);

module.exports = {
    userRouter
};