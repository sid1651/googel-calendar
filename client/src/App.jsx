import React from 'react';
import { Route, Routes } from 'react-router';
import Login from './Pages/login';
import CalendarPage from './Pages/CalenderPage';
import './App.css';
const App=()=>{
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/calendar" element={<CalendarPage/>}/>
    </Routes>
  );
};

export default App;

