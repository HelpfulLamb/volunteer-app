import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/users/volunteers/1/find');
        if(!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to retrieve user data.`);
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if(loading) return <p>Loading...</p>;
  if(error) return <p>{error}</p>;
  if(!profile) return <p>No Profile Data Found.</p>

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>
        <button onClick={() => navigate("/edit-profile")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Edit Profile</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Address:</strong> {profile.address1}, {profile.city}, {profile.state} {profile.zip}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Volunteer Info</h2>
          <p><strong>Skills:</strong></p>
          <div className="flex flex-wrap gap-2 mt-1">
            {(profile.skills || []).map(skill => (
              <span key={skill} className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
          <p className="mt-4"><strong>Preferences:</strong> {profile.preferences}</p>
        </div>
      </div>
    </div>
  );
}