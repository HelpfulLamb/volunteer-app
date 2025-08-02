import { act, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const [profile, setProfile] = useState([]);
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

  if(loading) return <p>Loading...</p>;
  if(error) return <p>Error: {error}</p>;
  if(!profile) return <p>No Profile Data Found.</p>
  //console.log(profile.status)

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <div className="flex items-center border-b pb-4 mb-6 gap-1">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold">{profile.fullName}</h1>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm ml-auto" onClick={() => handleStatusChange(user.id)}>Change Status</button>
        <button onClick={() => navigate("/edit-profile")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Edit Profile</button>
        <button onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">Delete Profile</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
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
                <p className="mt-4"><strong>Preferences:</strong> {profile.preferences}</p>
            </div>
        )}
      </div>
    </div>
  );
}