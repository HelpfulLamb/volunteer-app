import { useState, useEffect } from 'react';

export default function EventManagementForm({ initialData = {}, onSubmit, mode = 'create' }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({error: '', success: ''});
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    event_name: '',
    event_description: '',
    event_location: '',
    event_skills: [],
    event_urgency: '',
    event_date: '',
  });

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
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    if(mode === 'edit' && initialData && Object.keys(initialData).length > 0){
      //console.log("Initial skills in edit:", initialData.event_skills);
      const mappedSkills = (initialData.event_skills || []).map(skillName => {
        const match = skills.find(s => s.skill === skillName);
        return match ? { s_id: match.s_id } : null;
      }).filter(id => id !== null);
      setFormData({
        id: initialData.id || '',
        event_name: initialData.event_name || '',
        event_description: initialData.event_description || '',
        event_location: initialData.event_location || '',
        event_skills: mappedSkills,
        event_urgency: initialData.event_urgency || '',
        event_date: initialData.event_date?.slice(0,10) || ''
      });
      //console.log('mapped skills to id:', mappedSkills);
    }
  }, [initialData, mode, skills]);

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => {
      const exists = prev.event_skills.some(s => s.s_id === skill.s_id);
      const updated = exists ? prev.event_skills.filter(s => s.s_id !== skill.s_id) : [...prev.event_skills, {s_id: skill.s_id}];
      return { ...prev, event_skills: updated };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if(!formData.event_name.trim()) newErrors.event_name = 'Event name is required.';
    if(!formData.event_description.trim()) newErrors.event_description = 'Description is required.';
    if(!formData.event_location.trim()) newErrors.event_location = 'Location is required.';
    if(formData.event_skills.length === 0) newErrors.event_skills = 'Select at least one skill.';
    if(!formData.event_urgency) newErrors.event_urgency = 'Urgency level is required.';
    if(!formData.event_date) {
      newErrors.event_date = 'Event date is required.';
    } else {
      const selectedDate = new Date(formData.event_date);
      // fix this logic.
      if(selectedDate < today.setHours(0, 0, 0, 0)){
        newErrors.event_date = 'Event date must be an upcoming date.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm()) return;
    if(mode === 'edit') {
      onSubmit(formData);
    } else {
      try {
        const response = await fetch('/api/events/create-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if(response.ok) {
          setMessage({success: 'Event created successfully.', error: ''});
          setFormData({
            event_name: data.event_name || '',
            event_description: data.event_description || '',
            event_location: data.event_location || '',
            event_skills: data.event_skills || [],
            event_urgency: data.event_urgency || '',
            event_date: data.event_date || '',
          });
        } else {
          setMessage({error: 'Failed to create new event.', success: ''});
        }
      } catch (error) {
        setErrors(error.message);
        setMessage({error: 'An error occurred while trying to create an event, please try again.', success: ''});
      }
    }
  };

  if(loading) return <div>Loading...</div>;
  if(message.error) return <div>Error: {message.error}</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold">{mode === 'edit' ? 'Edit Event' : 'Create Event'}</h2>
      <div>
        <label className="font-medium">Event Name*</label>
        <input type="text" name="event_name" maxLength={100} value={formData.event_name} onChange={handleChange} required placeholder="e.g., Community Cleanup"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
        {errors.event_name && <p className='text-red-600 text-sm'>{errors.event_name}</p>}
      </div>
      <div>
        <label className="font-medium">Description*</label>
        <textarea name="event_description" value={formData.event_description} onChange={handleChange} required placeholder="Describe the event details"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
          {errors.event_description && <p className='text-red-600 text-sm'>{errors.event_description}</p>}
      </div>
      <div>
        <label className="font-medium">Location*</label>
        <textarea name="event_location" value={formData.event_location} onChange={handleChange} required placeholder="Event address or general location"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
          {errors.event_location && <p className='text-red-600 text-sm'>{errors.event_location}</p>}
      </div>
      <div>
        <label className="font-medium">Required Skills*</label>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button type="button" key={skill.s_id} onClick={() => handleSkillToggle(skill)}
              className={`px-3 py-1 rounded-full border ${
                formData.event_skills.some(s => s.s_id === skill.s_id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}>
              {skill.skill}
            </button>
          ))}
        </div>
        {errors.event_skills && <p className='text-red-600 text-sm'>{errors.event_skills}</p>}
      </div>
      <div>
        <label className="font-medium">Urgency*</label>
        <select name="event_urgency" value={formData.event_urgency} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded-lg" >
          <option value="">Select urgency</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div>
        <label className="font-medium">Event Date*</label>
        <input type="date" name="event_date" min={minDate} value={formData.event_date} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
          {errors.event_date && <p className='text-red-600 text-sm'>{errors.event_date}</p>}
      </div>
      <div className="flex gap-4 pt-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" >{mode === 'edit' ? 'Update Event' : 'Create Event'}</button>
      </div>
    </form>
  );
}