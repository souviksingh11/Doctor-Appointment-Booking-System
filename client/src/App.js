import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import DoctorList from './components/DoctorList';
import BookAppointment from './components/BookAppointment';
import MyAppointments from './components/MyAppointments';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import AdminAppointments from './components/AdminAppointments';
import About from './components/About';
import Contact from './components/Contact';
import AdminContactRequests from './components/AdminContactRequests';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doctors" element={<DoctorList />} />
              <Route path="/book-appointment/:doctorId" element={<PrivateRoute><BookAppointment /></PrivateRoute>} />
              <Route path="/my-appointments" element={<PrivateRoute><MyAppointments /></PrivateRoute>} />
              <Route path="/doctor-dashboard" element={<PrivateRoute><DoctorDashboard /></PrivateRoute>} />
              <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/admin-appointments" element={<AdminRoute><AdminAppointments /></AdminRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin-contact-requests" element={<AdminRoute><AdminContactRequests /></AdminRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Private Route Component
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }
  return user ? children : <Navigate to="/login" />;
}

// Admin Route Component
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return children;
}

export default App;
