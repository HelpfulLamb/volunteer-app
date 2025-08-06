const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const userModel = require('../models/userModel.js');
const eventModel = require('../models/eventModel.js');
const { getMatchingSuggestions } = require('../utils/matchLogic.js');
const NotificationService = require('../services/notificationService.js');

exports.getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await userModel.getAllVolunteers();
        res.status(200).json({volunteers});
    } catch (error) {
        //console.error('getAllVolunteers controller catch:', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.getActiveVol = async (req, res) => {
  try {
    const volunteers = await userModel.getActiveVol();
    res.status(200).json({ volunteers });
  } catch (error) {
    //console.error('getActiveVol controller catch:', error.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await userModel.getAllAdmins();
        res.status(200).json({admins});
    } catch (error) {
        //console.error('getAllAdmins controller catch:', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.findVolunteerById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const volFound = await userModel.findVolById(id);
        if(!volFound) {
            return res.status(404).json({message: 'Volunteer not found.'});
        }
        res.status(200).json(volFound);
    } catch (error) {
        //console.error('findVolunteerById controller catch:', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.getAssignedVol = async (req, res) => {
  const {e_id} = req.body;
  try {
    const vol = await userModel.getAssignedVol(e_id);
    if(!vol){
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json(vol);
  } catch (error) {
    console.error('getAssignedVol controller catch:', error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

exports.getAssignments = async (req, res) => {
  const u_id = req.params.id;
  //console.log(u_id);
  try {
    const assignments = await userModel.getAssignments(u_id);
    res.status(200).json({assignments});
  } catch (error) {
    console.error('getAssignments controller catch:', error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

exports.findAdminById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const adminFound = await userModel.findAdminById(id);
        if(!adminFound) {
            return res.status(404).json({message: 'Admin not found.'});
        }
        res.status(200).json(adminFound);
    } catch (error) {
        //console.error('findAdminById controller catch:', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.loginUser = async (req, res) => {
    const { email, password, role } = req.body;
    if(!email || !password || !role){
      return res.status(400).json({message: 'Email, password, and role are required.'});
    }

    try {
        const user = await userModel.findUserByEmail(email, role);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials. User with that email does not exist.' });
        }

        // If user exists, then compare passwords.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials. Wrong password.' });
        }

        const token = jwt.sign({ id: user.u_id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token, user: { id: user.u_id, email: user.email, role: user.role }, message: 'Login successful.' });

    } catch (error) {
        //console.error('Login error:', error.message);
        res.status(500).send('Server error');
    }
};

exports.registerUser = async (req, res) => {
    const { email, password, confirmPassword, role } = req.body;

    if (!email || !password || !confirmPassword || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    try {
        const existingUser = await userModel.findUserByEmail(email, role);
        console.log(existingUser);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.createUser({ email, password: hashPassword, role });

        const token = jwt.sign(
            {id: newUser.id, role: newUser.role},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.status(201).json({
            message: 'Registration successful.',
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            },
            token
        });
    } catch (error) {
        //console.error('registerUser catch:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.updateProfile = async (req, res) => {
    const id = parseInt(req.params.id);
    const role = req.user.role;
    const updateData = req.body;
    try {
        const updatedProfile = await userModel.updateProfile(id, updateData, role);
        if(!updatedProfile) {
            return res.status(404).json({message: 'User not found.'});
        }
        res.status(200).json({message: 'Profile updated successfully', profile: updatedProfile});
    } catch (error) {
        console.error('updateProfile controller catch:', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const deletedUser = await userModel.deleteUser(id);
        if(!deletedUser) {
            return res.status(404).json({message: 'User not found.'});
        }
        res.status(200).json({message: 'User account deleted successfully.'});
    } catch (error) {
        //console.error('deleteUser controller catch:', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.changeActiveStatus = async (req, res) => {
  const id = parseInt(req.params.id);
  const activeStatus = req.body.status;
  try {
    const change = await userModel.changeActiveStatus(id, activeStatus);
    if(!change){
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({message: 'User status changed successfully.'});
  } catch (error) {
    console.error('changeActiveStatus controller catch:', error.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

exports.assignVolunteer = async (req, res) => {
  const id = parseInt(req.params.id);
  const eventId = req.body.e_id;
  try {
    const assign = await userModel.assignVolunteer(id, eventId);
    if(!assign){
      return res.status(404).json({message: 'User or event not found'});
    }
    await NotificationService.sendEventAssignmentNotification(id, eventId);
    res.status(201).json({message: 'Assignment successfully logged.'});
  } catch (error) {
    console.error('assignVolunteer controller catch:', error.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

exports.unassignVolunteer = async (req, res) => {
  const id = parseInt(req.params.id);
  const eventId = req.body.e_id;
  try {
    const unassign = await userModel.unassignVolunteer(id, eventId);
    if(!unassign){
      return res.status(404).json({message: 'Unassignment has failed.'});
    }
    await NotificationService.sendEventUnassignmentNotification(id, eventId);
    res.status(200).json({message: 'Unassignment successfully executed'});
  } catch (error) {
    console.error('unassignVolunteer controller catch:', error.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

exports.getSuggestedEvents = async (req, res) => {
  const volunteerId = req.body.u_id;
  try {
    const volunteer = await userModel.findVolById(volunteerId);
    console.log([volunteer]);
    if(!volunteer){
      return res.status(404).json({message: 'User not found'});
    }
    const events = await eventModel.getActiveEvents();
    if(!events || events.length === 0){
      return res.status(404).json({message: 'No active events found'});
    }
    const suggestions = await getMatchingSuggestions([volunteer], events);
    if(!suggestions || suggestions.length === 0){
      return res.status(404).json({message: 'No matching suggestions found'});
    }
    const topMatches = suggestions[0].matchedEvents.filter(e => !e.isOutsideRange).sort((a,b) => a.distanceInMeters - b.distanceInMeters).slice(0,5);
    res.status(200).json(topMatches)
  } catch (error) {
    console.error('getSuggestedEvents controller catch:', error.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
};