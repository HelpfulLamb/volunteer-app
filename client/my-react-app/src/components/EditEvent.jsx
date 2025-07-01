import { useParams, useNavigate } from 'react-router-dom';
import EventManagementForm from '../admin/EventForm';

// Temporary mock event data, I will replace with real DB fetch later
const mockEvents = [
  {
    id: 1,
    eventName: 'Community Cleanup',
    description: 'Cleaning up local parks',
    location: 'City Park',
    requiredSkills: ['Logistics', 'Communication'],
    urgency: 'High',
    eventDate: '2025-07-15',
  },
  {
    id: 2,
    eventName: 'Food Drive',
    description: 'Distributing food to families',
    location: 'Downtown Center',
    requiredSkills: ['Driving', 'Cooking'],
    urgency: 'Medium',
    eventDate: '2025-07-22',
  },
];

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const eventToEdit = mockEvents.find((e) => e.id === parseInt(id));

  if (!eventToEdit) return <p className="p-4">Event not found.</p>;

  const handleUpdate = (updatedData) => {
    console.log('Updated event:', updatedData);
    // I will replace this with a PUT once the backend is complete
    navigate('/events-list');
  };

  return (
    <EventManagementForm initialData={eventToEdit} onSubmit={handleUpdate} mode="edit" />
  );
}
