import { useState, useEffect } from 'react';

const placeholderNotifications = [
  {id: 1, subject: "Event Assignment", message: "You've been assigned to 'Beach Cleanup'.", timestamp: "2025-07-01 10:00", read: false },
  {id: 2, subject: "Reminder", message: "Event 'Food Bank Support' is tomorrow.", timestamp: "2025-07-01 08:00", read: true },
  {id: 3, subject: "Update", message: "Event 'Blood Drive' has been moved to a later date.", timestamp: "2025-07-03 05:00", read: false },

];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    if(filter === 'unread') return !n.read;
    if(filter === 'read') return n.read;
    return true;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  useEffect(() => {
    setNotifications(placeholderNotifications); // Replace with backend data 
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className='text-2xl font-semibold mb-6'>Notifications</h2>
      <div className='flex flex-wrap gap-3 mb-6'>
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-md text-sm font-medium border ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-grey-700'} hover:bg-blue-100 transition`}>All</button>
        <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-md text-sm font-medium border ${filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-white text-grey-700'} hover:bg-blue-100 transition`}>Unread</button>
        <button onClick={() => setFilter('read')} className={`px-4 py-2 rounded-md text-sm font-medium border ${filter === 'read' ? 'bg-blue-500 text-white' : 'bg-white text-grey-700'} hover:bg-blue-100 transition`}>Read</button>
        <button onClick={() => markAllRead()} className='ml-auto px-4 py-2 rounded-md bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition'>Mark All as Read</button>
      </div>
      <ul className='space-y-4'>
        {filteredNotifications.map(n => (
          <li key={n.id} className={`p-4 rounded-lg shadow border cursor-pointer transition ${n.read ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white border-blue-400 hover:bg-blue-50'}`} onClick={() => toggleRead(n.id)}>
            <h4 className='text-lg font-semibold'>{n.subject}</h4>
            <p className='text-gray-700 mt-1'>{n.message}</p>
            <small className='text-gray-500 mt-2 block'>{n.timestamp}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default NotificationsPage;