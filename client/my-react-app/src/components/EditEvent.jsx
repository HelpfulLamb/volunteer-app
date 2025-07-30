import { useParams, useNavigate } from 'react-router-dom';
import EventManagementForm from '../admin/EventForm';
import { useState, useEffect } from 'react';

export default function EditEvent() {
  const [message, setMessage] = useState({error: '', success: ''});
  const [eventToEdit, setEventToEdit] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        //console.log(id);
        const response = await fetch(`/api/events/${id}/find`);
        if(!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to locate event.`);
        }
        const data = await response.json();
        //console.log(data);
        setEventToEdit(data);
      } catch (error) {
        setMessage({error: 'An error occurred while trying to fetch the event. Please try again.', success: ''});
        setError(error.message);
      }
    };
    fetchEvent();
  }, [id]);
  
  if(error) return <p className="p-4 text-red-600">{error}</p>
  if(!eventToEdit) return <p className="p-4">Loading event...</p>;

  const handleUpdate = async (updatedData) => {
    try {
        const response = await fetch(`/api/events/update-event/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        if(!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}. Failed to update event.`);
        }
        navigate('/events-list');
    } catch (error) {
        setMessage({error: 'An error occurred while trying to update the event. Please try again.', success: ''});
    }
  };

  return (
    <EventManagementForm initialData={eventToEdit} onSubmit={handleUpdate} mode="edit" />
  );
}
