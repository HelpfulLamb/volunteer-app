import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaUsers, FaBell, FaUser, FaSignOutAlt, FaClipboardList, FaChartBar, FaAngleDoubleLeft, FaBars, FaHistory, FaUserCog } from "react-icons/fa";
import ConfirmModal from '../components/ConfirmModal';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  });
  const [activeItem, setActiveItem] = useState('/home');
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  let navItems = [
    { label: 'Dashboard', path: '/home', icon: <FaHome /> },
  ];
  if(user?.role === 'admin'){
    navItems = navItems.concat([
      { label: 'Events List', path: '/events-list', icon: <FaClipboardList /> },
      { label: 'Create Event', path: '/create-event', icon: <FaPlusCircle /> },
      { label: 'Volunteer Matching', path: '/matching', icon: <FaUsers /> },
      // { label: 'Volunteer List', path: '/view-volunteers', icon: <FaUserCog />},
      { label: 'Reports', path: '/report', icon: <FaChartBar /> },
    ]);
  }
  if(user?.role === 'volunteer'){
    navItems = navItems.concat([
      { label: 'History', path: '/volunteer-history', icon: <FaHistory /> },
      { label: 'Notifications', path: '/notifications', icon: <FaBell /> },
    ]);
  }
  navItems = navItems.concat([
    { label: 'Profile', path: '/profile', icon: <FaUser /> },
    { label: 'Logout', path: 'LOGOUT', icon: <FaSignOutAlt /> },
  ]);

  const handleNavigation = (path) => {
    if(path === 'LOGOUT') {
      setModal({
        open: true,
        title: 'Confirm Logout',
        message: 'Are you sure you want to logout?',
        onConfirm: () => {
          setModal({ ...modal, open: false });
          logout();
          navigate('/');
        }
      });
      return;
    }
    setActiveItem(path);
    navigate(path);
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-gray-600 text-white transition-all duration-100 ease-in fixed`}>
      <div className="flex flex-col h-full">
        <div className={`flex items-center ${isCollapsed ? 'justify-center p-4' : 'justify-between p-6'}`}>
          {!isCollapsed && (
            <h1 className="text-xl font-bold">{user?.role === 'admin' ? 'Admin Panel' : 'Volunteer Dashboard'}</h1>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-full hover:bg-indigo-700" aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {isCollapsed ? (
              <FaBars className="text-lg" />
            ) : (
              <FaAngleDoubleLeft className="text-lg" />
            )}
          </button>
        </div>
        <nav className="flex-1 pt-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <button onClick={() => handleNavigation(item.path)} title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'} rounded-lg transition-colors duration-200 ${activeItem === item.path ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-700/50 text-white/90'}`}>
                  <span className={`${activeItem === item.path ? 'text-white' : 'text-white/80'} ${!isCollapsed && 'mr-3'}`}>{item.icon}</span>
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {!isCollapsed && (
          <div className="p-4 text-xs text-white/60">
            &copy; {new Date().getFullYear()} Volunteer App
          </div>
        )}
      </div>
      <ConfirmModal isOpen={modal.open} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onCancel={() => setModal({ ...modal, open: false })} />
    </div>
  );
}