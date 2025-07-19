const volunteers = [
    {
      id: 1,
      name: 'Alex Johnson',
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
      assigned: false
    },
    {
      id: 2,
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      password: 'password123',
      role: 'volunteer',
      skills: ['Cooking', 'Driving', 'Childcare'],
      availability: 'Weekday mornings',
      location: '4301 Crane St, Houston, TX',
      assigned: false
    },
    {
      id: 3,
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      password: 'adminpassword',
      role: 'admin',
      skills: ['Construction', 'Heavy Lifting', 'First Aid'],
      availability: 'Saturdays only',
      location: '768 5th Ave, New York, NY',
      assigned: true
    },
    {
        id: 4,
        name: 'Alice Grimes',
        email: 'alice.grimes@example.com',
        password: 'password123',
        role: 'volunteer',
        skills: ['Patient', 'Driving', 'IT', 'Designer', 'Communication'],
        availability: 'Weekends',
        location: '252 Schermerhorn St, Brooklyn, NY',
        assigned: false
    },
    {
        id: 5,
        name: 'Bob Ross',
        email: 'bob.ross@example.com',
        password: 'password123',
        role: 'volunteer',
        availability: 'Weekdays',
        location: '555 S Lamar St, Dallas, TX',
        assigned: false
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

exports.findUserByEmail = (email) => {
    return volunteers.find(user => user.email === email);
};

exports.createUser = (userData) => {
    const { username, email, password, role } = userData;
    const newUser = {
        id: userIdCounter++,
        name, // Assuming username is used as name
        email: username,
        password,
        role: role || 'volunteer', // Default role to volunteer if not specified
        phone,
        skills: [], // New users start with no skills
        availability: '', // New users start with no availability
        location: '', // New users start with no location
        assigned: false
    };
    volunteers.push(newUser);
    return newUser;
};

exports.getAllVolunteers = () => {
    return volunteers;
};