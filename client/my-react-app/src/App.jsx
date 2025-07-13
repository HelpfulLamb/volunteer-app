import React, { useState } from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import './App.css'

import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

import Sidebar from './site/Sidebar.jsx';
import Home from './site/Home.jsx';
import EventManagementForm from './admin/EventForm.jsx';
import VolunteerMatchingPage from './admin/MatchingForm.jsx';
import EventsList from './admin/EventsList.jsx';
import EditEvent from './components/EditEvent.jsx';
import UserProfile from './users/Profile.jsx';
import PersonalInfoSection from './users/PersonalInfo.jsx';
import VolunteerHistory from './site/VolunteerHistory.jsx';
import NotificationsPage from './site/NotificationsPage.jsx';
import Login from './context/Login.jsx';
import Registration from './context/Registration.jsx';

function App() {
  const location = useLocation();
  const authRoutes = ['/', '/login', '/registration'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <ToastProvider>
        {isAuthRoute ? (
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Registration />} />
          </Routes>
        ) : (
          <div className='flex'>
            <Sidebar />
            <div className='ml-64 p-6 w-full'>
              <Routes>
                <Route path='/home' element={<Home />} />
                <Route path='/create-event' element={<EventManagementForm />} />
                <Route path='/matching' element={<VolunteerMatchingPage />} />
                <Route path='/events-list' element={<EventsList />}/>
                <Route path='/edit-event/:id' element={<EditEvent />} />
                <Route path='/profile' element={<UserProfile />} />
                <Route path='/edit-profile' element={<PersonalInfoSection />} />
                <Route path='/volunteer-history' element={<VolunteerHistory />} />
                <Route path='/notifications' element={<NotificationsPage />} />
                <Route path='*' element={<div>404 - Page Not Found</div>} />
              </Routes>
            </div>
          </div>
        )}
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
