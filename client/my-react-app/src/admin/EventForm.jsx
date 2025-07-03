import { useState } from 'react';

export default function EventManagementForm({ initialData = {}, onSubmit, mode = 'create' }) {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    eventName: initialData.eventName || '',
    description: initialData.description || '',
    location: initialData.location || '',
    requiredSkills: initialData.requiredSkills || [],
    urgency: initialData.urgency || '',
    eventDate: initialData.eventDate || '',
  });

  const skillsOptions = [
    'First Aid', 'Cooking', 'Teaching', 'Logistics', 
    'Crowd Control', 'Communication', 'Multilingual Skills', 'Photography',
    'IT', 'Driving'
  ];
  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => {
      const updated = prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill];
      return { ...prev, requiredSkills: updated };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if(!formData.eventName.trim()) newErrors.eventName = 'Event name is required.';
    if(!formData.description.trim()) newErrors.description = 'Description is required.';
    if(!formData.location.trim()) newErrors.location = 'Location is required.';
    if(!formData.requiredSkills.length === 0) newErrors.requiredSkills = 'Select at least one skill.';
    if(!formData.urgency) newErrors.urgency = 'Urgency level is required.';
    if(!formData.eventDate) {
      newErrors.eventDate = 'Event date is required.';
    } else {
      const today = new Date();
      const selectedDate = new Date(formData.eventDate);
      if(selectedDate < today.setHours(0, 0, 0, 0)){
        newErrors.eventDate = 'Event date must be an upcoming date.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(validateForm()){
      console.log('Submitting form:', formData);
      onSubmit(formData)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold">{mode === 'edit' ? 'Edit Event' : 'Create Event'}</h2>
      <div>
        <label className="font-medium">Event Name*</label>
        <input type="text" name="eventName" maxLength={100} value={formData.eventName} onChange={handleChange} required placeholder="e.g., Community Cleanup"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
        {errors.eventName && <p className='text-red-600 text-sm'>{errors.eventName}</p>}
      </div>
      <div>
        <label className="font-medium">Description*</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Describe the event details"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
          {errors.description && <p className='text-red-600 text-sm'>{errors.description}</p>}
      </div>
      <div>
        <label className="font-medium">Location*</label>
        <textarea name="location" value={formData.location} onChange={handleChange} required placeholder="Event address or general location"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
          {errors.location && <p className='text-red-600 text-sm'>{errors.location}</p>}
      </div>
      <div>
        <label className="font-medium">Required Skills*</label>
        <div className="flex flex-wrap gap-2">
          {skillsOptions.map((skill) => (
            <button type="button" key={skill} onClick={() => handleSkillToggle(skill)}
              className={`px-3 py-1 rounded-full border ${
                formData.requiredSkills.includes(skill)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}>
              {skill}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="font-medium">Urgency*</label>
        <select name="urgency" value={formData.urgency} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded-lg" >
          <option value="">Select urgency</option>
          {urgencyLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="font-medium">Event Date*</label>
        <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded-lg" />
          {errors.eventDate && <p className='text-red-600 text-sm'>{errors.eventDate}</p>}
      </div>
      <div className="flex gap-4 pt-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" >{mode === 'edit' ? 'Update Event' : 'Create Event'}</button>
      </div>
    </form>
  );
}