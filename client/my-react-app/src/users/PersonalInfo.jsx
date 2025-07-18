import { useState } from 'react';

export default function PersonalInfoSection({ user = { role: 'volunteer' }, initialData = {}, onSubmit, mode = 'create' }) {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address1: initialData.address1 || '',
    address2: initialData.address2 || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zip: initialData.zip || '',
    skills: initialData.skills || [],
    preferences: initialData.preferences || '',
    availability: initialData.availability || [],
  });

  const today = new Date();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAvailability = (index, newValue) => {
    const updated = [...formData.availability];
    updated[index] = newValue;
    handleChange('availability', updated);
  };

  const validateForm = () => {
    const newErrors = {};
    if(!formData.fullName.trim()) newErrors.fullName = 'Name is required.';
    if(!formData.email.trim()) newErrors.email = 'Email is required.';
    if(!formData.phone.trim()) newErrors.phone = 'Phone is required.';
    if(!formData.address1.trim()) newErrors.address1 = 'Street address is required.';
    if(!formData.city.trim()) newErrors.city = 'City is required.';
    if(!formData.state.trim()) newErrors.state = 'State is required.';
    if(!formData.zip.trim()) newErrors.zip = 'Zip is required.';
    if(formData.skills.length === 0) newErrors.skills = 'At least one skill is required.';
    const selectedDate = new Date(formData.availability);
    if(selectedDate < today.setHours(0,0,0,0)) {
        newErrors.availability = 'Availability dates must be upcoming dates.';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!validateForm()) return;
    if(mode === 'edit') {
        onSubmit(formData);
    } else {
        try {
            
        } catch (error) {
            
        }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
      {/* Personal User Info For All */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">Personal Information</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" maxLength={50} required value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" maxLength={10} required value={formData.phone} onChange={e => handleChange('phone', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 ">Address Line 1</label>
            <input type="text" maxLength={100} required value={formData.address1} onChange={e => handleChange('address1', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
            <input type="text" maxLength={100} value={formData.address2} onChange={e => handleChange('address2', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <input type="text" maxLength={100} required value={formData.city} onChange={e => handleChange('city', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">State</label>
              <select required value={formData.state} onChange={e => handleChange('state', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm">
                <option value="">Select State</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Zip Code</label>
              <input type="text" placeholder="e.g. 12345" pattern="\d{5,9}" required value={formData.zip} onChange={e => handleChange('zip', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
            </div>
          </div>
        </div>
      </section>
      {/* Volunteer Info Section */}
      {user.role === 'volunteer' && (
        <section className="pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">Volunteer Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Skills (Select multiple)</label>
              <select multiple required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                onChange={e => {
                  const selected = [...e.target.selectedOptions].map(opt => opt.value);
                  handleChange('skills', selected);
                }}>
                <option value="First Aid">First Aid</option>
                <option value="Event Setup">Event Setup</option>
                <option value="Translation">Translation</option>
                <option value="Cooking">Cooking</option>
                <option value="Driving">Driving</option>
                <option value="Teaching">Teaching</option>
              </select>
              <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple options</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Preferences</label>
              <textarea rows="3" value={formData.preferences} onChange={e => handleChange('preferences', e.target.value)} placeholder="Tell us about your volunteering preferences..." 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Availability</label>
              <div className="space-y-2">
                {formData.availability.map((date, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input type="date" value={date} onChange={e => updateAvailability(index, e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
                    {formData.availability.length > 1 && (
                      <button type="button" onClick={() => handleChange('availability', formData.availability.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700">Remove</button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => handleChange('availability', [...formData.availability, ''])} className="mt-2 px-3 py-1 text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200">
                + Add Availability Date
              </button>
            </div>
          </div>
        </section>
      )}
      <div className="flex justify-end">
        <button type="submit" className="px-6 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">Save Profile</button>
      </div>
    </form>
  );
}