import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ConfirmModal from "../components/ConfirmModal";

function EventTable({ eventInformation, onDelete, message }) {
  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  });
  const navigate = useNavigate();
  if(!eventInformation || !Array.isArray(eventInformation)) {
    return <div>No Event data is available!</div>
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Events List</h1>
      {message.error && <p className="text-red-600">{message.error}</p>}
      {message.success && <p className="text-green-600">{message.success}</p>}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Name</th>
            <th className="border-b p-2">Date</th>
            <th className="border-b p-2">Location</th>
            <th className="border-b p-2">Status</th>
            <th className="border-b p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {eventInformation.map((event) => (
            <tr key={event.id}>
              <td className="p-2">{event.event_name}</td>
              <td className="p-2">{formatDate(event.event_date)}</td>
              <td className="p-2">{event.event_location}</td>
              <td className="p-2 space-x-2">
                {event.event_status === 'Active' ? 'Active' : 'Cancelled'}
              </td>
              <td className="p-2 space-x-2">
                <button className="text-blue-600 hover:underline" onClick={() => navigate(`/edit-event/${event.id}`, {state: event})}>Edit</button>
                <button className="text-red-600 hover:underline" onClick={() => setModal({
                  open: true,
                  title: 'Delete Event',
                  message: `Are you sure you want to delete "${event.event_name}"?`,
                  onConfirm: async () => {
                    setModal({ ...modal, open: false });
                    await onDelete(event.id);
                  }
                })}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmModal isOpen={modal.open} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onCancel={() => setModal({ ...modal, open: false })} />
    </div>
  );
}

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState({error: '', success: ''});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
        //console.log('event deleted');
        setMessage({success: 'Event Successfully Deleted.', error: ''});
        setEvents(prev => prev.filter(event => event.id !== id));
        setTimeout(() => {
          setMessage({ success: '', error: '' });
        }, 1000);
    } catch (error) {
        setMessage({error: 'An error occurred while trying to delete an event. Please try again.', success: ''});
        setError(error.message);
    }
  };

  if(loading) return <p className='text-xl text-indigo-500 text-center mt-4 animate-pulse'>Loading...</p>
  if(error) return <div>Error: {error}</div>;

  return (
    <>
      <EventTable eventInformation={events} onDelete={handleDelete} message={message} />
    </>
  );
}