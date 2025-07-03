import { useState } from 'react';

export default function PersonalInfoSection({ user = { role: 'volunteer' } }) {
  const [formData, setFormData] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    skills: [],
    preferences: '',
    availability: [],
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAvailability = (index, newValue) => {
    const updated = [...formData.availability];
    updated[index] = newValue;
    handleChange('availability', updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving profile:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
      {/* Personal User Info For All */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">Personal Information</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" maxLength={50} required value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
            <input type="text" maxLength={100} required value={formData.address1} onChange={e => handleChange('address1', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
            <input type="text" maxLength={100} value={formData.address2} onChange={e => handleChange('address2', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" maxLength={100} required value={formData.city} onChange={e => handleChange('city', e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select required value={formData.state} onChange={e => handleChange('state', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select State</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
              <input type="text" placeholder="12345" pattern="\d{5,9}" required value={formData.zip} onChange={e => handleChange('zip', e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>
      </section>
      {/* Volunteer Info Section */}
      {user.role === 'volunteer' && (
        <section className="mb-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">Volunteer Information</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Select multiple)</label>
              <select multiple required
                onChange={e => {
                  const selected = [...e.target.selectedOptions].map(opt => opt.value);
                  handleChange('skills', selected);
                }} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-32">
                <option value="First Aid">First Aid</option>
                <option value="Event Setup">Event Setup</option>
                <option value="Translation">Translation</option>
                <option value="Cooking">Cooking</option>
                <option value="Driving">Driving</option>
                <option value="Teaching">Teaching</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple options</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferences</label>
              <textarea rows="3" value={formData.preferences} onChange={e => handleChange('preferences', e.target.value)} placeholder="Tell us about your volunteering preferences..." 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <div className="space-y-2">
                {formData.availability.map((date, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input type="date" value={date} onChange={e => updateAvailability(index, e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    {formData.availability.length > 1 && (
                      <button type="button" onClick={() => handleChange('availability', formData.availability.filter((_, i) => i !== index))}className="text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => handleChange('availability', [...formData.availability, ''])} 
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Add Availability Date
              </button>
            </div>
          </div>
        </section>
      )}
      <div className="flex justify-end">
        <button type="submit" className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Save Profile
        </button>
      </div>
    </form>
  );
}