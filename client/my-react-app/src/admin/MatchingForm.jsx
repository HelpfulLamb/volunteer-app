import { useEffect, useState } from 'react';
import { FiSearch, FiUserCheck, FiCalendar, FiMapPin, FiClock, FiCheck, FiX } from 'react-icons/fi';

const VolunteerMatchingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    skills: [],
    availability: '',
    location: ''
  });
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAndMatch = async () => {
        try {
            // fetching all the volunteers
            const volRes = await fetch('/api/users/volunteers');
            if(!volRes.ok) {
                throw new Error(`HTTP Error! Status: ${volRes.status}. Failed to fetch volunteers.`);
            }
            const volData = await volRes.json();
            // fetching all the events
            const eventRes = await fetch('/api/events');
            if(!eventRes.ok) {
                throw new Error(`HTTP Error! Status: ${eventRes.status}. Failed to fetch events.`);
            }
            const eventData = await eventRes.json();
            setVolunteers(volData.volunteers);
            setEvents(eventData.events);
            // pass the data over to be matched
            const matchRes = await fetch('/api/matching/suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ volunteers: volData.volunteers, events: eventData.events }),
            });
            if(!matchRes.ok) {
                throw new Error(`HTTP Error! Status: ${matchRes.status}. Failed to get matching suggestions.`);
            }
            const matchData = await matchRes.json();
            console.log("Matched Volunteers:", matchData.volunteers);
            setVolunteers(matchData.volunteers);
            setEvents(matchData.events);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    fetchDataAndMatch();
  }, []);

  // Toggle volunteer assignment
  const toggleAssignment = (volunteerId, eventId) => {
    setVolunteers(volunteers.map(volunteer => {
      if (volunteer.id === volunteerId) {
        const isAssigned = volunteer.matchedEvents.some(match => match.id === eventId);
        return {
          ...volunteer,
          matchedEvents: isAssigned 
            ? volunteer.matchedEvents.filter(match => match.id !== eventId)
            : [...volunteer.matchedEvents, { id:eventId }]
        };
      }
      return volunteer;
    }));
  };

  // Filter volunteers based on search and filters
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkills = filters.skills.length === 0 || filters.skills.some(skill => volunteer.skills.includes(skill));
    const matchesAvailability = !filters.availability || volunteer.availability.includes(filters.availability);
    const matchesLocation = !filters.location || volunteer.location === filters.location;
    return matchesSearch && matchesSkills && matchesAvailability && matchesLocation;
  });

  if(loading) return <p>Loading...</p>;
  if(error) return <p>Error: {error}</p>;

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
            <select value={filters.skills[0] || ""} onChange={(e) => setFilters({...filters, skills: e.target.value ? [e.target.value] : []})} className="border border-gray-300 rounded-lg px-3">
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
                  <h3 className="font-bold text-lg text-gray-800">{volunteer.fullName}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <FiMapPin className="mr-2" /> {`${volunteer.address1}, ${volunteer.city}, ${volunteer.state} ${volunteer.zip}`}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <FiClock className="mr-2" /> {volunteer.availability.length === 0 ? volunteer.preferences : volunteer.availability}
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
                  <h3 className="font-bold text-lg text-gray-800">{event.event_name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.event_urgency === 'High' ? 'bg-red-100 text-red-800' :
                    event.event_urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {event.event_urgency} Priority
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <FiMapPin className="mr-2" /> {event.event_location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <FiCalendar className="mr-2" /> {event.event_date}
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-medium">Volunteers Needed:</span> {event.volunteersNeeded}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.event_skills.map(skill => (
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
              volunteer.matchedEvents.map(match => {
                const event = events.find(e => e.id === match.id);
                return { volunteer, event, distanceInMeters: match.distanceInMeters, isOutsideRange: match.isOutsideRange };
              })
            ).filter(match => match.event).map((match, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{match.volunteer.fullName}</h3>
                    <p className="text-sm text-gray-600">matched with: <strong>{match.event.event_name}</strong></p>
                    <p className='text-sm text-gray-600 mt-1'>
                        Distance: {(match.distanceInMeters / 1609.34).toFixed(1)} miles
                        {match.isOutsideRange && (
                            <span className='text-red-500 text-xs ml-2'>(outside preferred range)</span>
                        )}
                    </p>
                  </div>
                  <button onClick={() => toggleAssignment(match.volunteer.id, match.event.id)} title={match.volunteer.assigned ? 'Unassign' : 'Assign'}
                    className={`p-2 rounded-full ${match.volunteer.assigned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} hover:bg-green-200 transition`}>
                    {match.volunteer.assigned ? <FiCheck /> : <FiX />}
                  </button>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {match.volunteer.skills.filter(skill => 
                      match.event.event_skills.includes(skill)
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