import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaUsers, FaBell, FaUser, FaSignOutAlt, FaClipboardList, FaChartBar, FaAngleDoubleLeft, FaBars } from "react-icons/fa";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/home', icon: <FaHome /> },
    { label: 'Events List', path: '/events-list', icon: <FaClipboardList />},
    { label: 'Create Event', path: '/create-event', icon: <FaPlusCircle /> },
    { label: 'Volunteer Matching', path: '/matching', icon: <FaUsers /> },
    { label: 'Reports', path: '/report', icon: <FaChartBar />},
    { label: 'Notifications', path: '/notifications', icon: <FaBell /> },
    { label: 'Profile', path: '/profile', icon: <FaUser /> },
    { label: 'Logout', path: '/logout', icon: <FaSignOutAlt /> },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-gray-800 text-white p-4 fixed`}>
      <div>
        {!isCollapsed ? (
          <>
            <span>Admin Panel</span>
            <button onClick={() => setIsCollapsed(true)} className='text-white hover:text-gray-400' title='Collapse'>
              <FaAngleDoubleLeft />
            </button>
          </>
        ) : (
          <button onClick={() => setIsCollapsed(false)} className='text-white hover:text-gray-400' title='Expand'>
            <FaBars size={20} />
          </button>
        )}
      </div>
      <ul className="space-y-4">
        {navItems.map((item) => (
          <li key={item.path} className="cursor-pointer hover:bg-gray-700 p-2 rounded" onClick={() => navigate(item.path)} title={isCollapsed ? item.label : undefined}>
            <span>{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
