import { useEffect, useState } from "react";

function VolunteerTable({ volInformation }) {
  if(!volInformation || !Array.isArray(volInformation)) {
    return <div>No Volunteer data is available!</div>
  }

  const formatAddress = (address1, city, state, zipcode) => {
    const parts = [address1, city, state, zipcode].filter(part => part && part.trim() !== '');
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Volunteer List</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Name</th>
            <th className="border-b p-2">Skills</th>
            <th className="border-b p-2">Address</th>
            <th className="border-b p-2">Status</th>
            <th className="border-b p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {volInformation.map((vol) => (
            <tr key={vol.id}>
              <td className="p-2">{vol.fullName}</td>
              <td className="p-2">{vol.skills}</td>
              <td className="p-2">{formatAddress(vol.address1, vol.city, vol.state, vol.zipcode)}</td>
              <td className="p-2 space-x-2">
                {vol.status === 'Active' ? 'Active' : 'Inactive'}
              </td>
              <td className="p-2 space-x-2">
                <button className="text-blue-600 hover:underline">Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function VolunteersList() {
  const [volunteer, setVolunteer] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // retrieve all the events
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/users/volunteers');
        if(!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch volunteers.`);
        }
        const data = await response.json();
        console.log(data.volunteers);
        setVolunteer(data.volunteers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, []);

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error: {error}</div>;

  return (
    <>
      <VolunteerTable volInformation={volunteer} />
    </>
  );
}