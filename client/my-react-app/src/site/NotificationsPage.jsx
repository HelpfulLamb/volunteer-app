import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  const filteredNotifications = notifications.filter(n => {
    if(filter === 'unread') return !n.read;
    if(filter === 'read') return n.read;
    return true;
  });

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    try {
        await Promise.all(unread.map(n => 
            fetch(`/api/notifications/mark-notification/${n.id}/read`, {
                method: 'PATCH'
            })
        ));
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
        console.error('Failed to mark all as read.');
        setErrors(error.message)
    }
  };

  const toggleRead = async (id) => {
    try {
      console.log("Marking notification as read:", id);
      const response = await fetch(`/api/notifications/mark-notification/${id}/read`, {
        method: 'PATCH'
      });
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}. Failed to mark as read.`);
      }
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read:true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read.');
      setErrors(error.message)
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const response = await fetch(`/api/notifications/volunteer/${user.id}`);
            if(!response.ok){
                throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch notifications.`);
            }
            const data = await response.json();
            if(data.success){
                const formatted = data.data.map(n => ({
                    id: n.n_id,
                    subject: n.title,
                    message: n.message,
                    timestamp: new Date(n.createdAt).toLocaleString(),
                    read: n.status === 'read'
                }));
                setNotifications(formatted);
            }
        } catch (error) {
            setErrors(error.message);
        } finally {
            setLoading(false);
        }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`/api/notifications/volunteer/${user.id}/unread-count`);
        if(!response.ok){
          throw new Error(`HTTP Error! Status: ${response.status}. Failed to fetch unread notifications.`);
        }
        const data = await response.json();
        console.log("Unread count:", data.data.count);
      } catch (error) {
        console.error("Failed to fetch unread count", error);
        setErrors(error.message);
      }
    };
    fetchUnreadCount();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/notifications/delete-notification/${id}`, {
        method: 'DELETE'
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification');
      setErrors(error.message);
    }
  };

  if(loading) return <div>Loading...</div>;
  if(errors) return <div>Error: {errors}</div>

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
          <li key={n.id} className={`p-4 rounded-lg shadow border relative cursor-pointer transition ${n.read ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white border-blue-400 hover:bg-blue-50'}`} onClick={() => toggleRead(n.id)}>
            <button title="Delete notification" onClick={(e) => {
              e.stopPropagation();
              handleDelete(n.id);
              }} className='absolute top-2 right-5 text-gray-500 hover:text-red-600 text-sm font-bold'>X</button>
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