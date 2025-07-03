import { useState } from 'react';
import { FiSearch, FiUserCheck, FiCalendar, FiMapPin, FiClock, FiFilter, FiCheck, FiX } from 'react-icons/fi';

const VolunteerMatchingPage = () => {
  // I will replace this mock data with proper data once the DB and backend have been developed
  const [volunteers, setVolunteers] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      skills: ['First Aid', 'Translation', 'Event Planning'],
      availability: 'Weekends, Weekday evenings',
      location: 'Downtown',
      matchedEvents: [101, 103],
      assigned: false
    },
    {
      id: 2,
      name: 'Maria Garcia',
      skills: ['Cooking', 'Driving', 'Childcare'],
      availability: 'Weekday mornings',
      location: 'Northside',
      matchedEvents: [102],
      assigned: false
    },
    {
      id: 3,
      name: 'James Wilson',
      skills: ['Construction', 'Heavy Lifting', 'First Aid'],
      availability: 'Saturdays only',
      location: 'Eastside',
      matchedEvents: [101, 104],
      assigned: true
    },
  ]);

  const [events, setEvents] = useState([
    {
      id: 101,
      title: 'Food Bank Assistance',
      date: '2023-11-15',
      location: 'Community Center',
      requiredSkills: ['First Aid', 'Event Planning'],
      urgency: 'High',
      volunteersNeeded: 3
    },
    {
      id: 102,
      title: 'Senior Meal Delivery',
      date: '2023-11-18',
      location: 'Various Locations',
      requiredSkills: ['Driving', 'Cooking'],
      urgency: 'Medium',
      volunteersNeeded: 5
    },
    {
      id: 103,
      title: 'Park Cleanup',
      date: '2023-11-20',
      location: 'Central Park',
      requiredSkills: ['Translation', 'Event Planning'],
      urgency: 'Low',
      volunteersNeeded: 2
    },
    {
      id: 104,
      title: 'Shelter Setup',
      date: '2023-11-22',
      location: 'Westside Gym',
      requiredSkills: ['Construction', 'Heavy Lifting'],
      urgency: 'High',
      volunteersNeeded: 4
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    skills: [],
    availability: '',
    location: ''
  });

  // Toggle volunteer assignment
  const toggleAssignment = (volunteerId, eventId) => {
    setVolunteers(volunteers.map(volunteer => {
      if (volunteer.id === volunteerId) {
        const isAssigned = volunteer.matchedEvents.includes(eventId);
        return {
          ...volunteer,
          matchedEvents: isAssigned 
            ? volunteer.matchedEvents.filter(id => id !== eventId)
            : [...volunteer.matchedEvents, eventId]
        };
      }
      return volunteer;
    }));
  };

  // Filter volunteers based on search and filters
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkills = filters.skills.length === 0 || filters.skills.some(skill => volunteer.skills.includes(skill));
    const matchesAvailability = !filters.availability || volunteer.availability.includes(filters.availability);
    const matchesLocation = !filters.location || volunteer.location === filters.location;
    return matchesSearch && matchesSkills && matchesAvailability && matchesLocation;
  });

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Volunteer Matching Dashboard</h1>
      {/* Search and Filter Bar */}
      <div className=" rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search volunteers..." onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} className="pl-10 py-2 w-full border border-gray-300 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <select value={filters.skills} onChange={(e) => setFilters({...filters, skills: e.target.value ? [e.target.value] : []})} className="border border-gray-300 rounded-lg px-3">
              <option value="">All Skills</option>
              <option value="First Aid">First Aid</option>
              <option value="Translation">Translation</option>
              <option value="Cooking">Cooking</option>
              <option value="Driving">Driving</option>
              <option value="Construction">Construction</option>
            </select>
            <select value={filters.availability} onChange={(e) => setFilters({...filters, availability: e.target.value})} className="border border-gray-300 rounded-lg px-3">
              <option value="">Any Availability</option>
              <option value="Weekends">Weekends</option>
              <option value="Weekday">Weekday</option>
              <option value="Evenings">Evenings</option>
            </select>
            <button className="flex items-center gap-1 bg-blue-600 text-white px-3 rounded-lg"><FiFilter /> Filter</button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volunteers Panel */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><FiUserCheck /> Available Volunteers ({filteredVolunteers.length})</h2>
          </div>
          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {filteredVolunteers.map(volunteer => (
              <div key={volunteer.id} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-800">{volunteer.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <FiMapPin className="mr-2" /> {volunteer.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <FiClock className="mr-2" /> {volunteer.availability}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {volunteer.skills.map(skill => (
                      <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Events Panel */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-indigo-600 text-white p-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><FiCalendar /> Events Needing Volunteers ({events.length})</h2>
          </div>
          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {events.map(event => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-800">{event.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.urgency === 'High' ? 'bg-red-100 text-red-800' :
                    event.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {event.urgency} Priority
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <FiMapPin className="mr-2" /> {event.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <FiCalendar className="mr-2" /> {event.date}
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-medium">Volunteers Needed:</span> {event.volunteersNeeded}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.requiredSkills.map(skill => (
                      <span key={skill} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Matching Suggestions Panel */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-green-600 text-white p-4">
            <h2 className="text-xl font-semibold">Matching Suggestions</h2>
          </div>
          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {volunteers.flatMap(volunteer => 
              volunteer.matchedEvents.map(eventId => {
                const event = events.find(e => e.id === eventId);
                return { volunteer, event };
              })
            ).filter(match => match.event).map((match, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{match.volunteer.name}</h3>
                    <p className="text-sm text-gray-600">matched with</p>
                    <h4 className="font-medium text-gray-800">{match.event.title}</h4>
                  </div>
                  <button onClick={() => toggleAssignment(match.volunteer.id, match.event.id)} title={match.volunteer.assigned ? 'Unassign' : 'Assign'}
                    className={`p-2 rounded-full ${match.volunteer.assigned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} hover:bg-green-200 transition`}>
                    {match.volunteer.assigned ? <FiCheck /> : <FiX />}
                  </button>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {match.volunteer.skills.filter(skill => 
                      match.event.requiredSkills.includes(skill)
                    ).map(skill => (
                      <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{skill} ✓</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{Math.floor(Math.random() * 90) + 10}% match</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Confirm All Assignments</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerMatchingPage;