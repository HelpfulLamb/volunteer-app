// ToastProvider.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import NotificationToast from '../site/NotificationsToast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback(({ type, title, message }) => {
    setToast({ type, title, message });
  }, []);

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <NotificationToast type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />
      )}
    </ToastContext.Provider>
  );
};
