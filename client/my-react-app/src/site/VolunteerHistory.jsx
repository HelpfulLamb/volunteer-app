import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const VolunteerHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
            <th className="border-b p-2">Hours</th>
          </tr>
        </thead>
        <tbody>
          {history.map(event => (
            <tr key={event.id}>
              <td className="p-2">{event.eventName}</td>
              <td className="p-2">{event.eventDescription}</td>
              <td className="p-2">{event.eventLocation}</td>
              <td className="p-2">{event.skillsUsed.join(', ')}</td>
              <td className="p-2">{event.urgency}</td>
              <td className="p-2">{event.eventDate}</td>
              <td className="p-2">{event.status}</td>
              <td className="p-2">{event.hoursWorked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerHistory;