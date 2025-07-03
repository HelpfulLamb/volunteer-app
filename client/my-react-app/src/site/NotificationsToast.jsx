import { useEffect } from 'react';

const typeStyles = {
  assignment: 'bg-green-100 border-green-500 text-green-800',
  update: 'bg-blue-100 border-blue-500 text-blue-800',
  cancellation: 'bg-red-100 border-red-500 text-red-800',
  message: 'bg-gray-100 border-gray-500 text-gray-800',
  admin_alert: 'bg-yellow-100 border-yellow-500 text-yellow-800',
};

const NotificationToast = ({ type= 'message', title, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = typeStyles[type] || typeStyles.message;

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm w-full shadow-lg rounded-lg`}>
      <div className='flex justify-between items-start'>
        <div>
          <p className='font-semibold'>{title}</p>
          <p className='text-sm'>{message}</p>
        </div>
        <button onClick={onClose} className='ml-4 text-lg font-bold leading-none hover:text-red-600'>x</button>
      </div>
    </div>
  );
};
export default NotificationToast;