import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PersonalInfoSection() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({success: '', error: ''});
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
    zipcode: '',
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

  const handleSkillToggle = (skill) => {
    const updatedSkills = formData.skills.includes(skill.s_id) ? formData.skills.filter(id => id !== skill.s_id) : [...formData.skills, skill.s_id];
    handleChange('skills', updatedSkills);
  };

  const updateAvailability = (index, newValue) => {
    const updated = [...formData.availability];
    updated[index] = newValue;
    handleChange('availability', updated);
  };

  const validateForm = () => {
    const newErrors = {};
    const lettersAndSpace = /^[A-Za-z\s]+$/;
    const lettersSpacesNumbers = /^[A-Za-z0-9\s]+$/;
    const zipNumbers = /^\d{5}$/;
    if(!lettersAndSpace.test(formData.fullName)){
      newErrors.fullName = 'Name contains invalid characters.';
    }
    if(!lettersSpacesNumbers.test(formData.address1)){
      newErrors.address1 = 'Address1 contains invalid characters.'
    }
    if(formData.address2.trim() && !lettersSpacesNumbers.test(formData.address2)){
      newErrors.address2 = 'Address2 contains invalid characters.';
    }
    if(!lettersAndSpace.test(formData.city)){
      newErrors.city = 'City contains invalid characters.';
    }
    if(!zipNumbers.test(formData.zipcode)){
      newErrors.zipcode = 'Zipcode contains invalid characters.';
    }
    if(!formData.fullName.trim()) newErrors.fullName = 'Name is required.';
    if(!formData.phone.trim()) newErrors.phone = 'Phone is required.';
    if(!formData.address1.trim()) newErrors.address1 = 'Street address is required.';
    if(!formData.city.trim()) newErrors.city = 'City is required.';
    if(!formData.state.trim()) newErrors.state = 'State is required.';
    if(!formData.zipcode.trim()) newErrors.zipcode = 'Zipcode is required.';
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
    console.log('Save button clicked, form submitting...');
    if(!validateForm()) {
      console.log('Validation failed:', errors);
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
      setMessage({success: 'Profile Successfully Updated.', error: ''});
      setTimeout(() => {
        setMessage({success: '', error: ''});
        navigate('/profile');
      }, 1000);
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
        //console.log('raw skills from profile:', data.skills);
        const matchSkillId = (data.skills || []).map(skillName => {
          const match = skills.find(s => s.skill === skillName);
          return match ? match.s_id : null;
        }).filter(id => id !== null);
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: formatPhone(data.phone) || '',
          address1: data.address1 || '',
          address2: data.address2 || '',
          city: data.city || '',
          state: data.state || '',
          zipcode: data.zipcode || '',
          skills: matchSkillId,
          preferences: data.preferences || '',
          availability: data.availability && data.availability.length > 0 ? data.availability : [''],
        });
        //console.log('mapped skills to id:', matchSkillId);
      } catch (error) {
        setErrors(error.message);
      }
    };
    if(user?.id && skills.length > 0) fetchProfile();
  }, [user, skills]);
  // console.log('formData.skills:', formData.skills);
  // console.log('skills:', skills);

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md" noValidate>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
      {/* Personal User Info For All */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 pb-2 border-b border-gray-200">Personal Information</h2>
        <p className='text-right text-xs text-red-400'>* Required</p>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name*</label>
            <input type="text" maxLength={50} value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
              {errors.fullName && <p className='text-red-600 text-sm'>{errors.fullName}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phone*</label>
            <input type="tel" maxLength={16} value={formData.phone} onChange={e => handleChange('phone', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
              {errors.phone && <p className='text-red-600 text-sm'>{errors.phone}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 ">Address Line 1*</label>
            <input type="text" maxLength={100} value={formData.address1} onChange={e => handleChange('address1', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
              {errors.address1 && <p className='text-red-600 text-sm'>{errors.address1}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
            <input type="text" maxLength={100} value={formData.address2} onChange={e => handleChange('address2', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
            {errors.address2 && <p className='text-red-600 text-sm'>{errors.address2}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">City*</label>
              <input type="text" maxLength={100} value={formData.city} onChange={e => handleChange('city', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
              {errors.city && <p className='text-red-600 text-sm'>{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">State*</label>
              <select value={formData.state} onChange={e => handleChange('state', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm">
                <option value="">---</option>
                {states.map((state) => (
                  <option key={state.state_code} value={state.state_code}>{state.state_name}</option>
                ))}
              </select>
              {errors.state && <p className='text-red-600 text-sm'>{errors.state}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Zip Code*</label>
              <input type="text" maxLength={5} placeholder="e.g. 12345" pattern="\d{5,9}" value={formData.zipcode} onChange={e => handleChange('zipcode', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
              {errors.zipcode && <p className='text-red-600 text-sm'>{errors.zipcode}</p>}
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
              <label className='text-sm font-medium text-gray-700'>Skills (Click to select multiple)</label>
              <div className='flex flex-wrap gap-2 mt-1'>
                {skills.map((skill) => (
                  <button type='button' key={skill.s_id} onClick={() => handleSkillToggle(skill)} className={`px-3 py-1 rounded-full border transition ${formData.skills.includes(skill.s_id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>{skill.skill}</button>
                ))}
              </div>
              {errors.skills && <p className='text-red-600 text-sm'>{errors.skills}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Preferences (Optional)</label>
              <textarea rows="3" value={formData.preferences} onChange={e => handleChange('preferences', e.target.value)} placeholder="Tell us about your volunteering preferences..." 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Availability (Optional)</label>
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
        {message.success && <p className='text-green-600 font-medium mr-auto'>{message.success} </p>}
        {message.error && <p className='text-red-600 font-medium mr-auto'>{message.error} </p>}
        <button type="submit" className="px-6 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">Save Profile</button>
        <button type='button' onClick={() => navigate('/profile')} className='ml-1 px-6 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700'>Cancel</button>
      </div>
    </form>
  );
}