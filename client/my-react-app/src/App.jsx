import React, { useState } from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import './App.css'

import Sidebar from './site/Sidebar.jsx';
import Home from './site/Home.jsx';
import EventManagementForm from './admin/EventForm.jsx';
import VolunteerMatchingForm from './admin/MatchingForm.jsx';
import EventsList from './admin/EventsList.jsx';
import EditEvent from './components/EditEvent.jsx';

function App() {
  const location = useLocation();

  return (
    <div className='flex'>
      <Sidebar />
      <div className='ml-64 p-6 w-full'>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/create-event' element={<EventManagementForm />} />
          <Route path='/matching' element={<VolunteerMatchingForm />} />
          <Route path='/events-list' element={<EventsList />}/>
          <Route path='/edit-event/:id' element={<EditEvent />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
