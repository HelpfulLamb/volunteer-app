const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
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

exports.getAllAdmins = (req, res) => {
    try {
        const admins = userModel.getAllAdmins();
        res.status(200).json({admins});
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

exports.findAdminById = (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const adminFound = userModel.findAdminById(id);
        if(!adminFound) {
            return res.status(404).json({message: 'Admin not found.'});
        }
        res.status(200).json(adminFound);
    } catch (error) {
        //console.error(error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.loginUser = (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    try {
        const user = userModel.findUserByEmail(email, role);

        if (!user || !(bcrypt.compare(password, user.password)) || user.role !== role) {
            return res.status(401).json({ message: 'Invalid credentials or role.' });
        }

        const token = jwt.sign(
            {id: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        //console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
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
        const existingUser = userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = userModel.createUser({ email, password: hashPassword, role });

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
        //console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.updateProfile = (req, res) => {
    const id = parseInt(req.params.id);
    const role = req.user.role;
    const updateData = req.body;
    try {
        const updatedProfile = userModel.updateProfile(id, updateData, role);
        if(!updatedProfile) {
            return res.status(404).json({message: 'User not found.'});
        }
        res.status(200).json({message: 'Profile updated successfully', profile: updatedProfile});
    } catch (error) {
        //console.error(error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const deletedUser = userModel.deleteUser(id);
        if(!deletedUser) {
            return res.status(404).json({message: 'User not found.'});
        }
        res.status(200).json({message: 'User account deleted successfully.'});
    } catch (error) {
        //console.error(error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};