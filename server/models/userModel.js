const db = require('../db.js');

const volunteers = [
    {
      id: 1,
      fullName: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      password: 'password123',
      role: 'volunteer',
      phone: '2037370249',
      skills: ['First Aid', 'Translation', 'Event Planning'],
      preferences: 'Weekends, Weekday evenings',
      address1: '3509 Elgin St',
      address2: '',
      city: 'Houston',
      state: 'TX',
      zip: '77004',
      availability: [],
      assigned: false
    },
    {
      id: 2,
      fullName: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      password: 'password123',
      role: 'volunteer',
      phone: '9142582744',
      skills: ['Cooking', 'Driving', 'Childcare'],
      preferences: '',
      address1: '4301 Crane St',
      address2: '',
      city: 'Houston',
      state: 'TX',
      zip: '77206',
      availability: ['2025-07-26'],
      assigned: false
    },
    {
        id: 3,
        fullName: 'Alice Grimes',
        email: 'alice.grimes@example.com',
        password: 'password123',
        role: 'volunteer',
        phone: '7865640987',
        skills: ['Patient', 'Driving', 'IT', 'Designer', 'Communication'],
        preferences: 'Weekdays Only',
        address1: '252 Schermerhorn St',
        address2: '',
        city: 'Brooklyn',
        state: 'NY',
        zip: '11217',
        availability: [],
        assigned: false
    },
    {
        id: 4,
        fullName: 'Bob Ross',
        email: 'bob.ross@example.com',
        password: 'password123',
        role: 'volunteer',
        phone: '1877342203',
        skills: ['Communication', 'Patient', 'Driving', 'Designer'],
        preferences: 'Weekends, Weekdays',
        address1: '555 S Lamar St',
        address2: '',
        city: 'Dallas',
        state: 'TX',
        zip: '75202',
        availability: [],
        assigned: false
    }
];

const admins = [
    {
      id: 5,
      fullName: 'James Wilson',
      email: 'james.wilson@example.com',
      password: 'adminpassword',
      role: 'admin',
      phone: '1234567890',
      address1: '768 5th Ave',
      address2: '',
      city: 'New York',
      state: 'NY',
      zip: '10019'
    }
];

let userIdCounter = 6; // Start counter from the next available ID

exports.findVolById = (id) => {
    const volunteer = volunteers.find(v => v.id === id);
    if(!volunteer) {
        return null;
    }
    return volunteer;
};

exports.findAdminById = (id) => {
    const admin = admins.find(a => a.id === id);
    if(!admin) {
        return null;
    }
    return admin;
};

exports.findUserByEmail = (email, role) => {
    if(role === 'admin'){
        return admins.find(user => user.email === email);
    } else {
        return volunteers.find(user => user.email === email);
    }
};

exports.createUser = (userData) => {
    const { email, password, role } = userData;
    const newUser = {
        id: userIdCounter++,
        fullName: '', // Assuming username is used as name
        email: email,
        password: password,
        role: role || 'volunteer', // Default role to volunteer if not specified
        phone: '',
        skills: [], // New users start with no skills
        preferences: '',
        availability: [], // New users start with no availability
        address1: '', // New users start with no location
        address2: '',
        city: '',
        state: '',
        zip: '',
        assigned: false
    };
    if(role === 'admin'){
        admins.push(newUser);
    } else {
        volunteers.push(newUser);
    }
    return newUser;
};

exports.getAllVolunteers = () => {
    return volunteers;
};

exports.getAllAdmins = () => {
    return admins;
};

exports.updateProfile = (id, updatedProfile, role) => {
    const userList = role === 'admin' ? admins : volunteers;
    const user = userList.find(u => u.id === id);
    if(!user){
        return null;
    }
    Object.keys(updatedProfile).forEach(key => {
        if(user.hasOwnProperty(key)) {
            user[key] = updatedProfile[key];
        }
    });
    return user;
};

exports.deleteUser = (id) => {
    const index = volunteers.findIndex(v => v.id === id);
    if(index === -1) {
        return null;
    }
    const deleted = volunteers.splice(index, 1);
    return deleted[0];
};