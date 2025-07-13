import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EventTable({ eventInformation, onDelete }) {
  const navigate = useNavigate();
  if(!eventInformation || !Array.isArray(eventInformation)) {
    return <div>No Event data is available!</div>
  }
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
          {eventInformation.map((event) => (
            <tr key={event.id}>
              <td className="p-2">{event.event_name}</td>
              <td className="p-2">{event.event_date}</td>
              <td className="p-2">{event.event_location}</td>
              <td className="p-2 space-x-2">
                <button className="text-blue-600 hover:underline" onClick={() => navigate(`/edit-event/${event.id}`)}>Edit</button>
                <button className="text-red-600 hover:underline" onClick={() => onDelete(event.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState({error: '', success: ''});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // retrieve all the events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if(!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch events.`);
        }
        const data = await response.json();
        console.log(data.events);
        setEvents(data.events);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
        const response = await fetch(`/api/events/delete-event/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}. Failed to delete event.`);
        }
        navigate('/events-list');
    } catch (error) {
        setMessage({error: 'An error occurred while trying to delete an event. Please try again.', success: ''});
        setError(error.message);
    }
  };

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error: {error}</div>;

  return (
    <EventTable eventInformation={events} onDelete={handleDelete} />
  );
}