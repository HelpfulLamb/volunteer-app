import { useState } from 'react';

// placeholder data which I will replace once DB gets created.
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

  const handleAssign = (volunteer, event) => {
    setAssignments((prev) => [...prev, { volunteer, event }]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">Volunteer Matching Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Volunteers List */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4">Available Volunteers</h3>
          <ul className="space-y-3">
            {mockVolunteers.map((v) => (
              <li key={v.id} className="border rounded-md p-3">
                <p className="font-medium">{v.name}</p>
                <p className="text-sm text-gray-600">Skills: {v.skills.join(', ')}</p>
                <p className="text-sm text-gray-600">Availability: {v.availability}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4">Events Needing Volunteers</h3>
          <ul className="space-y-3">
            {mockEvents.map((e) => (
              <li key={e.id} className="border rounded-md p-3">
                <p className="font-medium">{e.name}</p>
                <p className="text-sm text-gray-600">Required: {e.requiredSkills.join(', ')}</p>
                <p className="text-sm text-gray-600">Date: {e.date}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Matching Suggestions */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4">Matching Suggestions</h3>
          <ul className="space-y-3">
            {mockMatches.map((match, idx) => (
              <li key={idx} className="border rounded-md p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{match.volunteer}</p>
                  <p className="text-sm text-gray-600">→ {match.event}</p>
                </div>
                <button onClick={() => handleAssign(match.volunteer, match.event)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" >
                  Assign
                </button>
              </li>
            ))}
          </ul>

          {/* Assigned confirmation list */}
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