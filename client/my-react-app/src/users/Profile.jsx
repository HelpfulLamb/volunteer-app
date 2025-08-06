import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

function getVolunteerBadge(event, historyEntry){
  const now = new Date();
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  if(!historyEntry) return null;
  if(!historyEntry.clock_in_time && now < start) return 'Upcoming';
  if(historyEntry.clock_in_time && historyEntry.clock_out_time) return 'Attended';
  if(!historyEntry.clock_in_time && now > end) return 'Missed';
  if(historyEntry.clock_in_time && !historyEntry.clock_out_time) return 'In Progress';
  return null;
}

function EventCard({ event, clockedIn, hasHistory, historyEntry, onClockToggle }) {
  const badge = getVolunteerBadge(event, historyEntry);
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2,'0');
    const isAM = hours < 12;
    const period = isAM ? 'A.M.' : 'P.M.';
    hours = hours % 12 || 12;
    return `${date.toLocaleDateString()} ${hours}:${minutes} ${period}`;
  };
  return(
    <div className='bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div className='p-6'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='text-xl font-bold text-gray-800'>{event.event_name}</h3>
          {badge && (
            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">{badge}</span>
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
          {(() => {
            const now = new Date();
            const start = new Date(event.startTime);
            const end = new Date(event.endTime);
            if(!hasHistory || historyEntry?.status === 'completed') return null;
            if(!clockedIn && now >= start && now <= end){
              return(
                <button onClick={onClockToggle} className='hover:cursor-pointer hover:bg-blue-600 bg-blue-500 text-white rounded-lg px-3 py-1'>Clock In</button>
              );
            }
            if(clockedIn){
              return(
                <button onClick={onClockToggle} className='hover:cursor-pointer hover:bg-red-600 bg-red-500 text-white rounded-lg px-3 py-1'>Clock Out</button>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const [profile, setProfile] = useState([]);
  const [assignment, setAssignment] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(user.role === 'admin' ? `/api/users/admins/${user.id}/find` : `/api/users/volunteers/${user.id}/find`);
        if(!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to retrieve user data.`);
        }
        const data = await response.json();
        //console.log('Profile.jsx:', data);
        setProfile(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchUpcomingAssignments = async () => {
      try {
        const response = await fetch(`/api/users/volunteers/assigned-events/${user.id}`);
        if(!response.ok){
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch user assignments.`);
        }
        const data = await response.json();
        console.log('Assignments:', data.assignments);
        setAssignment(data.assignments);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUpcomingAssignments();
  }, []);

  const fetchHistory = async () => {
    if(user?.role === 'volunteer'){
      try {
        const response = await fetch(`/api/volunteer-history/volunteer/${user.id}`);
        if(!response.ok){
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch history.`);
        }
        const data = await response.json();
        console.log('history:', data.data);
        setHistory(data.data);
      } catch (error) {
        setError(error.message);
      }
    }
    return null;
  };
  useEffect(() => {
    if(user.id){
      fetchHistory();
    }
  }, [user.id]);

  const handleDelete = async (id) => {
    try {
        const response = await fetch(`/api/users/delete-account/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}. Failed to delete account.`);
        }
        logout();
        navigate('/');
    } catch (error) {
        setError(error.message);
    }
  };

  const handleStatusChange = async (id) => {
    try {
      let activity = "";
      if(profile.status === 'Active'){
        activity = 'Inactive';
      }
      if(profile.status === 'Inactive'){
        activity = 'Active'
      }
      const response = await fetch(`/api/users/status-change/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: activity }),
      })
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}. Failed to update profile status.`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClockToggle = async (eventId, clockedIn) => {
    console.log('handleClockToggle event id:', eventId);
    const route = clockedIn ? 'clock-out' : 'clock-in';
    console.log('route:', route);
    try {
      const response = await fetch(`/api/volunteer-history/${route}/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ e_id: eventId}),
      });
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}. Failed to ${route}`);
      }
      await fetchHistory();
    } catch (error) {
      setError(error.message);
    }
  };
  
  const formatPhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if(digits.length > 6){
      return `(${digits.slice(0,3)}) ${digits.slice(3,6)} - ${digits.slice(6,10)}`;
    }
  };

  if(loading) return <p className='text-xl text-indigo-500 text-center mt-4 animate-pulse'>Loading...</p>
  if(error) return <p>Error: {error}</p>;
  if(!profile) return <p>No Profile Data Found.</p>
  //console.log(profile.status)

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        <div className="flex items-center border-b pb-4 mb-6 gap-1">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold">{profile.fullName}</h1>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
          {user?.role === 'volunteer' && (
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm ml-auto" onClick={() => handleStatusChange(user.id)}>Change Status</button>
          )}
          <button onClick={() => navigate("/edit-profile")} className={`${user?.role === 'admin' ? 'ml-auto': ''} bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm`}>Edit Profile</button>
          <button onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">Delete Profile</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {formatPhone(profile.phone)}</p>
            <p><strong>Address:</strong> {profile.address1}, {profile.city}, {profile.state} {profile.zipcode}</p>
          </div>
          {user?.role === 'volunteer' && (
              <div>
                  <h2 className="text-lg font-semibold mb-2">Volunteer Info</h2>
                  <div>
                    <p><strong>Status:</strong> {profile.status}</p>
                  </div>
                  <p className='mt-2'><strong>Skills:</strong></p>
                  <div className="flex flex-wrap gap-2 mt-1">
                      {(profile.skills || []).map(skill => (
                      <span key={skill} className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                          {skill}
                      </span>
                      ))}
                  </div>
                  <p className="mt-4"><strong>Preferences:</strong> {profile.preferences === '' ? 'None' : profile.preferences}</p>
                  <p className='mt-4'><strong>Availability:</strong> {profile.availability}</p>
              </div>
          )}
        </div>
      </div>
      {user?.role === 'volunteer' && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 mt-8">Upcoming Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignment.map(event => {
              const matchingHistory = history.find(h => h.e_id === event.e_id);
              console.log('matchingHistory:', matchingHistory);
              const clockedIn = matchingHistory?.clock_in_time && !matchingHistory?.clock_out_time;
              const hasHistory = !!matchingHistory;
              return (
                <EventCard key={event.e_id} event={event} clockedIn={clockedIn} hasHistory={hasHistory} historyEntry={matchingHistory} onClockToggle={() => handleClockToggle(event.e_id, clockedIn)} />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}