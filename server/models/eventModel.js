
const events = [
    {
      id: 101,
      event_name: 'Food Bank Assistance',
      event_description: 'Help distribute food to those in need.',
      event_location: 'Community Center',
      event_skills: ['First Aid', 'Event Planning'],
      event_urgency: 'High',
      event_date: '2023-11-15'
    },
    {
      id: 102,
      event_name: 'Senior Meal Delivery',
      event_description: 'Help distribute food to the elderly in need.',
      event_location: 'Various Houston Locations',
      event_skills: ['Driving', 'Cooking'],
      event_urgency: 'Medium',
      event_date: '2023-11-18'
    },
    {
      id: 103,
      event_name: 'Park Cleanup',
      event_description: 'Help keep the city parks clean and beautiful.',
      event_location: 'Central Park',
      event_skills: ['Translation', 'Event Planning'],
      event_urgency: 'Low',
      event_date: '2023-11-20'
    },
    {
      id: 104,
      event_name: 'Shelter Setup',
      event_description: 'Help build homes for animals in need',
      event_location: 'Westside Gym',
      event_skills: ['Construction', 'Heavy Lifting'],
      event_urgency: 'High',
      event_date: '2023-11-22'
    },
];
let eventIdCounter = 1;

exports.createEvent = (eventData) => {
    const {event_name, event_description, event_location, event_skills, event_urgency, event_date} = eventData;
    const newEvent = {
        id: eventIdCounter++,
        event_name,
        event_description,
        event_location,
        event_skills,
        event_urgency,
        event_date
    };
    events.push(newEvent);
    return newEvent.id;
};

exports.getAllEvents = () => {
    return events;
};

exports.findEventById = (id) => {
    const event = events.find(e => e.id === id);
    if(!event) {
        return null;
    }
    return event;
};

exports.updateEvent = (id, updatedEvent) => {
    //console.log('Inside model with id: ' + id);
    //console.log(events);
    // replace with DB lookup once DB is in place
    const event = events.find(e => e.id === id);
    //console.log('event variable: ' + event);
    if(!event){
        return null;
    }
    Object.keys(updatedEvent).forEach(key => {
        if(event.hasOwnProperty(key)) {
            event[key] = updatedEvent[key];
        }
    });
    return event;
};

exports.deleteEvent = (id) => {
    // replace with DB lookup once DB is in place
    const index = events.findIndex(e => e.id === id);
    if(index === -1) {
        return null;
    }
    const deleted = events.splice(index, 1);
    return deleted[0];
};