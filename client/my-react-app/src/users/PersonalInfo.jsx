import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PersonalInfoSection() {
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    skills: [],
    preferences: '',
    availability: [''],
  });

  const today = new Date();
  const navigate = useNavigate();
  const { user } = useAuth();

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    if(digits.length >= 4 && digits.length <= 6){
      return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    } else if(digits.length > 6){
      return `(${digits.slice(0,3)}) ${digits.slice(3,6)} - ${digits.slice(6,10)}`;
    }
    return digits;
  };

  const handleChange = (field, value) => {
    if(field === 'phone'){
      const formatted = formatPhone(value);
      setFormData({ ...formData, [field]: formatted});
      return;
    }
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
    if(user.role === 'volunteer'){
        if(formData.skills.length === 0) newErrors.skills = 'At least one skill is required.';
        formData.availability.forEach(date => {
            if(new Date(date) < today.setHours(0,0,0,0)) {
                newErrors.availability = 'All availability dates must be upcoming.';
            }
        });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length == 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log('Save button clicked, form submitting...');
    if(!validateForm()) {
      //console.log('Validation failed:', errors);
      return;
    };
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const submissionData = { ...formData, phone: cleanPhone };
    try {
      const response = await fetch(`/api/users/update-profile/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(submissionData),
      });
      if(!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}. Failed to update event.`);
      }
      navigate('/profile');
    } catch (error) {
      setErrors(error.message);
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/items/states');
        if(!response.ok){
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch states.`);
        }
        const data = await response.json();
        //console.log(data)
        setStates(data);
      } catch (error) {
        setErrors(error.message);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/items/skills');
        if(!response.ok){
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch skills.`);
        }
        const data = await response.json();
        //console.log(data);
        setSkills(data);
      } catch (error) {
        setErrors(error.message);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(user.role === 'admin' ? `/api/users/admins/${user.id}/find` : `/api/users/volunteers/${user.id}/find`);
        if(!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch profile.`);
        }
        const data = await response.json();
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: formatPhone(data.phone) || '',
          address1: data.address1 || '',
          address2: data.address2 || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zip || '',
          skills: data.skills || [],
          preferences: data.preferences || '',
          availability: data.availability && data.availability.length > 0 ? data.availability : [''],
        });
      } catch (error) {
        setErrors(error.message);
      }
    };
    if(user?.id) fetchProfile();
  }, [user]);

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
      {/* Personal User Info For All */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">Personal Information</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name*</label>
            <input type="text" maxLength={50} required value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
              {errors.fullName && <p className='text-red-600 text-sm'>{errors.fullName}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phone*</label>
            <input type="tel" maxLength={16} required value={formData.phone} onChange={e => handleChange('phone', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
              {errors.phone && <p className='text-red-600 text-sm'>{errors.phone}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 ">Address Line 1*</label>
            <input type="text" maxLength={100} required value={formData.address1} onChange={e => handleChange('address1', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
              {errors.address1 && <p className='text-red-600 text-sm'>{errors.address1}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
            <input type="text" maxLength={100} value={formData.address2} onChange={e => handleChange('address2', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">City*</label>
              <input type="text" maxLength={100} required value={formData.city} onChange={e => handleChange('city', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
              {errors.city && <p className='text-red-600 text-sm'>{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">State*</label>
              <select required value={states.state_code} onChange={e => handleChange('state', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm">
                {states.map((state) => (
                  <option key={state.state_code} value={state.state_code}>{state.state_name}</option>
                ))}
              </select>
              {errors.state && <p className='text-red-600 text-sm'>{errors.state}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Zip Code*</label>
              <input type="text" maxLength={5} placeholder="e.g. 12345" pattern="\d{5,9}" required value={formData.zip} onChange={e => handleChange('zip', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
              {errors.zip && <p className='text-red-600 text-sm'>{errors.zip}</p>}
            </div>
          </div>
        </div>
      </section>
      {/* Volunteer Info Section */}
      {user?.role === 'volunteer' && (
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
                  {skills.map((skill) => (
                    <option key={skill.s_id} value={skill.s_id}>{skill.skill}</option>
                  ))}
              </select>
              <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple options</p>
              {errors.skills && <p className='text-red-600 text-sm'>{errors.skills}</p>}
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
                {errors.availability && <p className='text-red-600 text-sm'>{errors.availability}</p>}
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