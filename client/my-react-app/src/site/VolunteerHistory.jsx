import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const VolunteerHistory = () => {
  const [history, setHistory] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const enrichedHistory = history.map(entry => {
    const matchingEvent = events.find(e => e.id === entry.e_id);
    return { ...entry, skills: matchingEvent ? matchingEvent.event_skills?.join(', ') : 'N/A'};
  });

  // console.log("Merged:", enrichedHistory.map(e => ({
  //     id: e.id,
  //     event_id: e.e_id,
  //     skills: e.skills
  //  })));

  useEffect(() => {
    const fecthHistory = async () => {
      try {
        const response = await fetch(`/api/volunteer-history/volunteer/${user.id}`);
        if(!response.ok){
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch volunteer history.`);
        }
        const { data: historyData } = await response.json();
        setHistory(historyData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fecthHistory();
  }, []);

  //console.log("Sample History Entry:", history[0]);

  useEffect(() => {
    const fecthEvents = async () => {
      try {
        const response = await fetch(`/api/events`);
        if(!response.ok){
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
    fecthEvents();
  }, []);

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Volunteer History</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Event Name</th>
            <th className="border-b p-2">Description</th>
            <th className="border-b p-2">Location</th>
            <th className="border-b p-2">Required Skills</th>
            <th className="border-b p-2">Urgency</th>
            <th className="border-b p-2">Date</th>
            <th className="border-b p-2">Status</th>
            <th className="border-b p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {enrichedHistory.map(event => (
            <tr key={event.id}>
              <td className="p-2">{event.event_name}</td>
              <td className="p-2">{event.event_description}</td>
              <td className="p-2">{event.event_location}</td>
              <td className="p-2">{event.skills}</td>
              <td className="p-2">{event.event_urgency}</td>
              <td className="p-2">{formatDate(event.event_date)}</td>
              <td className="p-2">{event.status}</td>
              <td className="p-2">{`${Math.floor(event.hours_worked / 60)} hr ${event.hours_worked % 60} min`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerHistory;