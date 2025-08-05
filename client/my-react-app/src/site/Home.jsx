import { useMemo, useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import image from './volunteer-placeholder.jpg';

const now = new Date();

function categorizeEvents(events) {
  //console.log('categorizeEvents:', events);
  //console.log('start time:', events[0]?.startTime);
  //console.log('end time:', events[0]?.endTime);
  return {
    ongoing: events.filter(
      (e) => now >= new Date(e.startTime) && now <= new Date(e.endTime)
    ),
    upcoming: events.filter((e) => new Date(e.startTime) > now),
    past: events.filter(
      (e) =>
        new Date(e.endTime) < now &&
        now - new Date(e.endTime) <= 10 * 24 * 60 * 60 * 1000 // within 10 days
    ),
  };
}

function getBadge(event) {
  //console.log('get badge:', event);
  //console.log('start time', event.startTime);
  //console.log('end time', event.endTime);
  const now = new Date();
  if (now >= new Date(event.startTime) && now <= new Date(event.endTime)) return "Live Now";
  if (new Date(event.startTime) > now) return "Upcoming";
  if (new Date(event.endTime) < now) return "Completed";
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const { user } = useAuth();

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/api/users/volunteers/assigned-events/${user.id}`);
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch assignments.`);
      }
      const data = await response.json();
      setAssignments(data.assignments);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if(!response.ok){
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch events.`);
        }
        const data = await response.json();
        //console.log(data.events);
        setEvents(data.events);
        if(user?.role === 'volunteer'){
          fetchAssignments();
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchEvents();
  }, []);
  
  const updateEventStatus = (eventId, newStatus) => {
    setEvents(prevEvents => prevEvents.map(e => e.id === eventId ? { ...e, event_status: newStatus} : e));
  };

  const { ongoing, upcoming, past } = useMemo(() => categorizeEvents(events), [events]);
  //console.log('ongoing', ongoing);
  //console.log('upcoming', upcoming);
  //console.log('past', past);

  if(error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <OngoingEventsSlider events={ongoing} />
      <EventsSection title="Upcoming Events" events={upcoming} badgeColor="bg-blue-100 text-blue-800" assignments={assignments} setAssignments={setAssignments} fetchAssignments={fetchAssignments} updateEventStatus={updateEventStatus} />
      <EventsSection title="Past Events (Last 10 Days)" events={past} badgeColor="bg-gray-300 text-gray-800" />
    </div>
  );
}

function OngoingEventsSlider({ events }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (events.length === 0) return null;

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2,'0');
    const isAM = hours < 12;
    const period = isAM ? 'A.M.' : 'P.M.';
    hours = hours % 12 || 12;
    return `${date.toLocaleDateString()} ${hours}:${minutes} ${period}`;
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % events.length);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [events.length]);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Live & Ongoing Events</h2>
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <div className="flex transition-transform duration-700 ease-in-out" style={{transform: `translateX(-${currentSlide * 100}%)`, width: `${events.length * 100}%`}}>
          {events.map(event => (
            <div key={event.id} className="flex-shrink-0 w-full">
              <div className="relative h-96">
                <img src={image} alt={event.event_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-8 text-white">
                  <div>
                    <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">Live Now</div>
                    <h3 className="text-3xl font-bold mb-2">{event.event_name}</h3>
                    <p className="text-lg mb-3">{event.event_description}</p>
                    <div className="flex items-center text-white/90 mb-2">
                      <FaMapMarkerAlt className='mx-1' />
                      {event.event_location}
                    </div>
                    <div className="flex items-center text-white/90">
                      <FaClock className='mx-1' />
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {events.map((_, index) => (
            <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/80'} focus:outline-none`} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EventsSection({ title, events, badgeColor, assignments = [], setAssignments, fetchAssignments, updateEventStatus }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} badgeColor={badgeColor} assignments={assignments} setAssignments={setAssignments} fetchAssignments={fetchAssignments} updateEventStatus={updateEventStatus} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">No {title.toLowerCase()} to display</p>
        </div>
      )}
    </section>
  );
}

function EventCard({ event, badgeColor, assignments, setAssignments, fetchAssignments, updateEventStatus }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAssigned = useMemo(() => {
    return assignments.some(a => a.e_id === event.id);
  }, [assignments, event.id]);
  const { user } = useAuth();
  const isCancelled = event.event_status === 'Cancelled';

  const handleStatusChange = async () => {
    try {
      console.log('we are in');
      setLoading(true);
      const response = await fetch(`/api/events/status-change/${event.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_status: 'Cancelled' }),
      });
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}. Failed to update event status.`);
      }
      updateEventStatus(event.id, 'Cancelled');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async (id) => {
    try {
      setLoading(true);
      const url = isAssigned ? `/api/users/unassign/${id}` : `/api/users/assignment/${id}`;
      const method = isAssigned ? 'DELETE' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({e_id: event.id}),
      });
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}. Failed to assign event.`);
      }
      await fetchAssignments();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  //console.log('badge color:', badgeColor);
  const badge = getBadge(event);
  //console.log('badge:', badge);
  const isPast = badge === "Completed";
  //console.log('is past:', isPast);
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2,'0');
    const isAM = hours < 12;
    const period = isAM ? 'A.M.' : 'P.M.';
    hours = hours % 12 || 12;
    return `${date.toLocaleDateString()} ${hours}:${minutes} ${period}`;
  };
  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${isPast ? 'opacity-80' : ''}`}>
      <img src={image} alt={event.event_name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{event.event_name}</h3>
          {isCancelled ? (
            <span className='text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium'>Cancelled</span>
          ) : (badge && (
            <span className={`text-xs ${badgeColor} px-3 py-1 rounded-full font-medium`}>{badge}</span>
          )
        )}
        </div>
        <p className="text-gray-600 mb-4">{event.event_description}</p>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start">
            <FaMapMarkerAlt className='my-1 mx-2' />
            <span>{event.event_location}</span>
          </div>
          <div className="flex items-start">
            <FaClock className='my-1 mx-2' />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
          {user?.role === 'admin' && !isPast && !isCancelled && (
            <button onClick={handleStatusChange} className='text-gray-600 rounded-full px-2 py-1 bg-red-300 mt-2 hover:cursor-pointer hover:bg-red-400 hover:text-white'>Cancel Event</button>
          )}
          {isAssigned && !isCancelled && (
            <span className="mr-55 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium mt-1">Attending</span>
          )}
          {user?.role === 'volunteer' && !isPast && !isCancelled && (
            <button onClick={() => handleAttendance(user.id)} className={`text-gray-600 rounded-full px-2 py-1 mt-2 hover:cursor-pointer ${isAssigned ? 'bg-red-300 hvoer:bg-red-400 hover:text-white' : 'bg-green-300 hover:bg-green-400 hover:text-white'}`}>{isAssigned ? 'Cancel Assignment' : 'Attend'}</button>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}