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

exports.loginUser = (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    try {
        const user = userModel.findUserByEmail(email);

        if (!user || user.password !== password || user.role !== role) {
            return res.status(401).json({ message: 'Invalid credentials or role.' });
        }

        // In a real application, you would generate a token here (e.g., JWT)
        // For this mock, we'll return basic user info
        res.status(200).json({
            message: 'Login successful.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.registerUser = (req, res) => {
    const { username, email, password, confirmPassword, role } = req.body;

    if (!username || !email || !password || !confirmPassword || !role) {
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

        const newUser = userModel.createUser({ username, email, password, role });

        res.status(201).json({
            message: 'Registration successful.',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};