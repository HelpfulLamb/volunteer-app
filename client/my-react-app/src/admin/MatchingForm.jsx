import { useState } from 'react';

const mockVolunteers = [
  { id: 1, name: 'Alice Johnson', skills: ['First Aid', 'Logistics'], availability: 'Weekends' },
  { id: 2, name: 'Bob Smith', skills: ['Cooking', 'Teaching'], availability: 'Weekdays' },
];

const mockEvents = [
  { id: 101, name: 'Community Cleanup', requiredSkills: ['Logistics'], date: '2025-07-04' },
  { id: 102, name: 'Food Drive', requiredSkills: ['Cooking'], date: '2025-07-05' },
];

const mockMatches = [
  { volunteer: 'Alice Johnson', event: 'Community Cleanup' },
  { volunteer: 'Bob Smith', event: 'Food Drive' },
];

export default function VolunteerMatchingForm() {
  const [assignments, setAssignments] = useState([]);
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');

  const handleAssign = (volunteer, event) => {
    setAssignments((prev) => [...prev, { volunteer, event }]);
  };

  const filteredVolunteers = mockVolunteers.filter((v) =>
    v.name.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
    v.skills.some((skill) => skill.toLowerCase().includes(volunteerSearch.toLowerCase()))
  );

  const filteredEvents = mockEvents.filter((e) =>
    e.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
    e.requiredSkills.some((skill) => skill.toLowerCase().includes(eventSearch.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">Volunteer Matching Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Volunteers List */}
        <div className="bg-gray-50 rounded-xl shadow-sm p-4">
          <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
            <span>Available Volunteers</span>
            <input type="text" placeholder="Search" value={volunteerSearch} onChange={(e) => setVolunteerSearch(e.target.value)} className="text-sm border px-2 py-1 rounded-md" />
          </h3>
          <ul className="space-y-3">
            {filteredVolunteers.map((v) => (
              <li key={v.id} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md">
                <p className="text-lg font-semibold">{v.name}</p>
                <p className="text-sm text-gray-500">Skills: {v.skills.join(', ')}</p>
                <p className="text-sm text-gray-500">Availability: {v.availability}</p>
              </li>
            ))}
          </ul>
        </div>
        {/* Events List */}
        <div className="bg-gray-50 rounded-xl shadow-sm p-4">
          <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
            <span>Events Needing Volunteers</span>
            <input type="text" placeholder="Search" value={eventSearch} onChange={(e) => setEventSearch(e.target.value)} className="text-sm border px-2 py-1 rounded-md" />
          </h3>
          <ul className="space-y-3">
            {filteredEvents.map((e) => (
              <li key={e.id} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md">
                <p className="text-lg font-semibold">{e.name}</p>
                <p className="text-sm text-gray-500">Required: {e.requiredSkills.join(', ')}</p>
                <p className="text-sm text-gray-500">Date: {e.date}</p>
              </li>
            ))}
          </ul>
        </div>
        {/* Matching Suggestions */}
        <div className="bg-gray-50 rounded-xl shadow-sm p-4">
          <h3 className="text-xl font-semibold mb-4">Matching Suggestions</h3>
          <ul className="space-y-3">
            {mockMatches.map((match, idx) => (
              <li key={idx} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md flex justify-between items-center">
                <div>
                  <p className="text-base font-medium">{match.volunteer}</p>
                  <p className="text-sm text-gray-500">→ {match.event}</p>
                </div>
                <button onClick={() => handleAssign(match.volunteer, match.event)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Assign</button>
              </li>
            ))}
          </ul>
          {assignments.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-lg mb-2">Confirmed Assignments:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {assignments.map((a, i) => (
                  <li key={i}>✔ {a.volunteer} → {a.event}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
