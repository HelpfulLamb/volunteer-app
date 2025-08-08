import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function EventManagementForm({  onSubmit, mode = 'create' }) {
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
    event_start: '',
    event_end: '',
  });
  const [newSkill, setNewSkill] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state || {};

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
        setMessage({error: 'An error occurred while trying to fetch the skills.', success: ''});
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
      const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2,'0');
        const minutes = String(date.getMinutes()).padStart(2,'0');
        return `${hours}:${minutes}`;
      };
      setFormData({
        id: initialData.id || '',
        event_name: initialData.event_name || '',
        event_description: initialData.event_description || '',
        event_location: initialData.event_location || '',
        event_skills: mappedSkills,
        event_urgency: initialData.event_urgency || '',
        event_date: initialData.event_date?.slice(0,10) || '',
        event_start: initialData.startTime ? formatTime(initialData.startTime) : '',
        event_end: initialData.endTime ? formatTime(initialData.endTime) : '',
      });
    }
  }, [initialData, mode, skills]);

  const handleAddSkill = async (name) => {
    setNewSkill(false);
    try {
      const response = await fetch('/api/items/add-skill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skill: name }),
      });
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}. Failed to add new skill.`);
      }
      setSkills(prev => [...prev, { skill: name }]);
    } catch (error) {
      setMessage({error: 'An error occurred while trying to add a new skill.', success: ''});
    }
  };

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
    const allowedSpecialCharacters = /^[\w\s#\$%\-+!(),'.?]*$/;
    if(!allowedSpecialCharacters.test(formData.event_name)){
      newErrors.event_name = 'Event name contains invalid characters.';
    }
    if(!allowedSpecialCharacters.test(formData.event_description)){
      newErrors.event_description = 'Event description contains invalid characters.';
    }
    if(!allowedSpecialCharacters.test(formData.event_location)){
      newErrors.event_location = 'Event location contains invalid characters.';
    }
    if(!formData.event_name.trim()) newErrors.event_name = 'Event name is required.';
    if(!formData.event_description.trim()) newErrors.event_description = 'Description is required.';
    if(!formData.event_location.trim()) newErrors.event_location = 'Address or General Location is required.';
    if(formData.event_skills.length === 0) newErrors.event_skills = 'Select at least one skill.';
    if(!formData.event_urgency) newErrors.event_urgency = 'Urgency level is required.';
    if(!formData.event_date) {
      newErrors.event_date = 'Event date is required.';
    } else if(!formData.event_start) {
      newErrors.event_date = 'Start time must be provided to validate date.';
    } else {
      const selectedDate = new Date(`${formData.event_date}T${formData.event_start}`);
      const now = new Date();
      if(selectedDate <= now){
        newErrors.event_date = 'Event must be scheduled for an upcoming date and time.';
      }
    }
    if(!formData.event_start){
      newErrors.event_start = 'Event start time is required.';
    }
    if(!formData.event_end){
      newErrors.event_end = 'Event end time is required.';
    }
    if(formData.event_start && formData.event_end){
      const selectedStart = new Date(`${formData.event_date}T${formData.event_start}`);
      const selectedEnd = new Date(`${formData.event_date}T${formData.event_end}`);
      if(selectedStart >= selectedEnd){
        newErrors.event_start = 'Event must start before the end time.';
        newErrors.event_end = 'Event must end after the start time.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm()) return;
    if(mode === 'edit') {
      setMessage({success: 'Event updated successfully.', error: ''});
      setTimeout(() => {
        setMessage({ success: '', error: '' });
        onSubmit(formData);
        navigate('/events-list');
      }, 500);
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
            event_start: data.event_start || '',
            event_end: data.event_end || '',
          });
          setTimeout(() => {
            setMessage({ success: '', error: '' });
          }, 2000);
        } else {
          setMessage({error: 'Failed to create new event.', success: ''});
          setTimeout(() => {
            setMessage({ success: '', error: '' });
          }, 2000);
        }
      } catch (error) {
        setErrors(error.message);
        setMessage({error: 'An error occurred while trying to create an event, please try again.', success: ''});
      }
    }
  };

  if(loading) return <p className='text-xl text-indigo-500 text-center mt-4 animate-pulse'>Loading...</p>
  if(message.error) return <div>Error: {message.error}</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl space-y-6" noValidate>
      <h2 className="text-2xl font-bold pb-2 border-b border-gray-200 mb-2">{mode === 'edit' ? 'Edit Event' : 'Create Event'}</h2>
      <p className='text-red-400 text-right text-xs mb-2'>* Required</p>
      <div>
        <label className="font-medium">Event Name*</label>
        <input type="text" name="event_name" maxLength={100} value={formData.event_name} onChange={handleChange} placeholder="e.g., Community Cleanup"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
        {errors.event_name && <p className='text-red-600 text-sm'>{errors.event_name}</p>}
      </div>
      <div>
        <label className="font-medium">Description*</label>
        <textarea name="event_description" maxLength={500} value={formData.event_description} onChange={handleChange} placeholder="Describe the event details"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
          {errors.event_description && <p className='text-red-600 text-sm'>{errors.event_description}</p>}
      </div>
      <div>
        <label className="font-medium">Location*</label>
        <textarea name="event_location" value={formData.event_location} onChange={handleChange} placeholder="Event address or general location"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
          {errors.event_location && <p className='text-red-600 text-sm'>{errors.event_location}</p>}
      </div>
      <div>
        <label className="font-medium">Required Skills*</label>
        <div className="flex flex-wrap gap-2">
          <button type='button' onClick={() => setNewSkill(prev => !prev)} className='px-3 py-1 rounded-full border bg-blue-400 text-white hover:bg-blue-500 hover:cursor-pointer'>+Add Skill</button>
          {newSkill && (
            <>
              <label className='block mt-2'>New Skill</label>
              <input type="text" value={newSkillInput} onChange={(e) => setNewSkillInput(e.target.value)} className='border px-2 py-1 rounded-full' />
              <button type='button' onClick={() => handleAddSkill(newSkillInput)} className='mt-2 bg-green-400 text-white px-3 py-1 rounded-full hover:bg-green-500 hover:cursor-pointer'>Submit Skill</button>
              <button type='button' onClick={() => setNewSkill(prev => !prev)} className='mt-2 bg-red-400 text-white px-3 py-1 rounded-full hover:bg-red-500 hover:cursor-pointer'>Cancel</button>
            </>
          )}
          {skills.map((skill) => (
            <button type="button" key={skill.s_id} onClick={() => handleSkillToggle(skill)}
              className={`px-3 py-1 rounded-full border hover:cursor-pointer ${
                formData.event_skills.some(s => s.s_id === skill.s_id)
                  ? 'bg-blue-600 text-white hover:bg-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-300'
              }`}>
              {skill.skill}
            </button>
          ))}
        </div>
        {errors.event_skills && <p className='text-red-600 text-sm'>{errors.event_skills}</p>}
      </div>
      <div>
        <label className="font-medium">Urgency*</label>
        <select name="event_urgency" value={formData.event_urgency} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg" >
          <option value="">Select urgency</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.event_urgency && <p className='text-red-600 text-sm'>{errors.event_urgency}</p>}
      </div>
      <div>
        <label className="font-medium">Event Date*</label>
        <input type="date" name="event_date" min={minDate} value={formData.event_date} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
        {errors.event_date && <p className='text-red-600 text-sm'>{errors.event_date}</p>}
      </div>
      <div>
        <label className='font-medium'>Start Time*</label>
        <input type="time" name='event_start' value={formData.event_start} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
        {errors.event_start && <p className='text-red-600 text-sm'>{errors.event_start}</p>}
      </div>
      <div>
        <label className='font-medium'>End Time*</label>
        <input type="time" name='event_end' value={formData.event_end} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
        {errors.event_end && <p className='text-red-600 text-sm'>{errors.event_end}</p>}
      </div>
      <div className="flex gap-4 pt-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{mode === 'edit' ? 'Update Event' : 'Create Event'}</button>
        {message.success && <p className='text-green-600 font-medium'>{message.success}</p>}
        {message.error && <p className='text-red-600 font-medium'>{message.error}</p>}
        {mode === 'edit' && (
          <button type='button' onClick={() => navigate('/events-list')} className='ml-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'>Cancel</button>
        )}
      </div>
    </form>
  );
}