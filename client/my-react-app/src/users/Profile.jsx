import { Link } from 'react-router-dom';

export default function UserProfile() {
  // I will replace this mock data with proper information once the DB has been created and backend routes are in place
  const profileData = {
    name: 'David Morillon',
    email: 'dmorill2@cougarnet.uh.edu',
    phone: '(123) 456-7890',
    address: '123 Lane Dr',
    city: 'Conroe',
    state: 'TX',
    zip: '77304',
    skills: ['First Aid', 'Event Planning', 'Photography'],
    preferences: ['Outdoor Events', 'Weekends'],
  };
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center space-x-4">
          {/* <img src={user.profilePicture || ''} alt="Profile" className="w-20 h-20 rounded-full object-cover" /> */}
          <div>
            <h1 className="text-2xl font-bold">{profileData.name}</h1>
            <p className="text-gray-600">{profileData.email}</p>
          </div>
        </div>
        <Link to="/edit-profile" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Edit Profile</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
          <p><strong>Phone:</strong> {profileData.phone}</p>
          <p><strong>Address:</strong> {profileData.address}, {profileData.city}, {profileData.state} {profileData.zip}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Volunteer Info</h2>
          <p><strong>Skills:</strong></p>
          <div className="flex flex-wrap gap-2 mt-1">
            {profileData.skills.map(skill => (
              <span key={skill} className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
          <p className="mt-4"><strong>Preferences:</strong></p>
          <ul className="list-disc list-inside text-sm mt-1 text-gray-700">
            {profileData.preferences.map((pref, idx) => (
              <li key={idx}>{pref}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}