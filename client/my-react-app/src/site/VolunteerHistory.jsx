import React from 'react';

const placeholderHistory = [
    { id: 1, name: 'Food Drive', description: 'Community Center', location: 'NYC', skills: 'Gardening', urgency: 'High', date: '2025-06-01', status: 'Completed', hour: 5 },
    { id: 2, name: 'First Aid Training', description: 'Learn basic first aid skills.', location: 'Brooklyn', skills: 'Medical', urgency: 'Medium', date: '2025-05-15', status: 'Upcoming', hour: 3 }
];

const VolunteerHistory = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Volunteer History</h2>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border-b p-2">Event Name</th>
                        <th className="border-b p-2">Description</th>
                        <th className="border-b p-2">Location</th>
                        <th className="border-b p-2">Required Skills</th>
                        <th className="border-b p-2">Urgency</th>
                        <th className="border-b p-2">Date</th>
                        <th className="border-b p-2">Status</th>
                        <th className="border-b p-2">Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {placeholderHistory.map(event => (
                        <tr key={event.id}>
                            <td className="p-2">{event.name}</td>
                            <td className="p-2">{event.description}</td>
                            <td className="p-2">{event.location}</td>
                            <td className="p-2">{event.skills}</td>
                            <td className="p-2">{event.urgency}</td>
                            <td className="p-2">{event.date}</td>
                            <td className="p-2">{event.status}</td>
                            <td className="p-2">{event.hour}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VolunteerHistory;
