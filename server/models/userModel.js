const volunteers = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'AlexJohnson@gmail.com',
      password: 'AlexTheJohnson',
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
      skills: ['Cooking', 'Driving', 'Childcare'],
      availability: 'Weekday mornings',
      location: '4301 Crane St, Houston, TX',
      assigned: false
    },
    {
      id: 3,
      name: 'James Wilson',
      skills: ['Construction', 'Heavy Lifting', 'First Aid'],
      availability: 'Saturdays only',
      location: '768 5th Ave, New York, NY',
      assigned: true
    },
    {
        id: 4,
        name: 'Alice Grimes',
        skills: ['Patient', 'Driving', 'IT', 'Designer', 'Communication'],
        availability: 'Weekends',
        location: '252 Schermerhorn St, Brooklyn, NY',
        assigned: false
    },
    {
        id: 5,
        name: 'Bob Ross',
        skills: ['Logistics', 'Driving'],
        availability: 'Weekdays',
        location: '555 S Lamar St, Dallas, TX',
        assigned: false
    }
];

exports.findVolById = (id) => {
    const volunteer = volunteers.find(v => v.id === id);
    if(!volunteer) {
        return null;
    }
    return volunteer;
};

exports.getAllVolunteers = () => {
    return volunteers;
};