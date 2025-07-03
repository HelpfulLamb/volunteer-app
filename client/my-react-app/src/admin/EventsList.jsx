import { useNavigate } from "react-router-dom";

export default function EventsList() {
  const navigate = useNavigate();
  // Placeholder events
  const events = [
    { id: 1, name: 'Food Drive', date: '2025-07-15', location: 'Community Center' },
    { id: 2, name: 'First Aid Workshop', date: '2025-07-20', location: 'Health Pavilion' },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Events List</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Name</th>
            <th className="border-b p-2">Date</th>
            <th className="border-b p-2">Location</th>
            <th className="border-b p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td className="p-2">{event.name}</td>
              <td className="p-2">{event.date}</td>
              <td className="p-2">{event.location}</td>
              <td className="p-2 space-x-2">
                <button className="text-blue-600 hover:underline" onClick={() => navigate(`/edit-event/${event.id}`)}>Edit</button>
                <button className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
