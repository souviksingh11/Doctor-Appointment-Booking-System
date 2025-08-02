import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const DoctorDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'doctor') {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/doctors/appointments');
      // Sort appointments by appointment date and time (earliest first)
      const sortedAppointments = response.data.sort((a, b) => {
        // First sort by date
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB;
        }
        // If same date, sort by time slot
        const timeA = a.timeSlot;
        const timeB = b.timeSlot;
        return timeA.localeCompare(timeB);
      });
      setAppointments(sortedAppointments);
    } catch (err) {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/appointments/${appointmentId}/status`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      alert('Failed to update appointment status');
    }
  };

  if (authLoading || loading) {
    return <div className="text-center mt-5"><div className="spinner-border" style={{ color: classicGold }}></div></div>;
  }

  if (!user || user.role !== 'doctor') {
    return <div className="alert alert-danger mt-4">Access denied. Only doctors can view this page.</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  return (
    <div style={{ background: classicWhite, minHeight: '100vh' }} className="py-5">
      <div className="container">
        <h2 className="mb-4 fw-bold" style={{ color: classicNavy }}>Patient Booking Requests</h2>
        {appointments.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-calendar-times" style={{ fontSize: '4rem', color: classicGold, opacity: 0.7 }}></i>
            <h4 className="mt-3 text-muted">No appointments found</h4>
            <p className="text-muted">You have no patient booking requests.</p>
          </div>
        ) : (
          <div className="row">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm border-0" style={{ background: classicWhite }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="mb-1" style={{ color: classicNavy }}>{appointment.patient.name}</h5>
                        <p className="text-muted mb-0">{appointment.patient.email}</p>
                      </div>
                      <div className="text-end">
                        <span className="badge" style={{ background: classicGold, color: classicNavy, fontWeight: 600 }}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        {appointment.status === 'pending' && (
                          <div className="mt-1">
                            <span className="badge" style={{ background: '#dc3545', color: 'white', fontSize: '0.7rem' }}>
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <strong style={{ color: classicNavy }}>Date:</strong> {new Date(appointment.date).toLocaleDateString()}<br />
                      <strong style={{ color: classicNavy }}>Time:</strong> {appointment.timeSlot}
                    </div>
                    <div className="mb-2">
                      <strong style={{ color: classicNavy }}>Reason:</strong> {appointment.reason}
                    </div>
                    {appointment.symptoms && (
                      <div className="mb-2">
                        <strong style={{ color: classicNavy }}>Symptoms:</strong> {appointment.symptoms}
                      </div>
                    )}
                    {appointment.patient.phone && (
                      <div className="mb-2">
                        <strong style={{ color: classicNavy }}>Phone:</strong> {appointment.patient.phone}
                      </div>
                    )}
                    {appointment.consultationFee && (
                      <div className="mb-2">
                        <strong style={{ color: classicNavy }}>Fee:</strong> ₹{appointment.consultationFee}
                      </div>
                    )}
                    {appointment.paymentStatus && (
                      <div className="mb-2">
                        <strong style={{ color: classicNavy }}>Payment:</strong> 
                        <span style={{ 
                          color: appointment.paymentStatus === 'paid' ? '#28a745' : 
                                 appointment.paymentStatus === 'pending' ? '#ffc107' : '#dc3545',
                          fontWeight: 600,
                          marginLeft: '5px'
                        }}>
                          {appointment.paymentStatus === 'paid' ? (
                            <>
                              <i className="fas fa-check me-1"></i>
                              Paid
                            </>
                          ) : appointment.paymentStatus === 'pending' ? (
                            <>
                              <i className="fas fa-clock me-1"></i>
                              Pending
                            </>
                          ) : (
                            <>
                              <i className="fas fa-times me-1"></i>
                              Failed
                            </>
                          )}
                        </span>
                      </div>
                    )}
                    <div className="mb-3">
                      {appointment.status === 'pending' && (
                        <>
                          <button className="btn btn-sm me-2" style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }} onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}>Confirm</button>
                          <button className="btn btn-sm" style={{ background: classicNavy, color: classicGold, fontWeight: 600, border: 'none' }} onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}>Cancel</button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <div>
                          <button className="btn btn-sm" style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }} onClick={() => handleStatusUpdate(appointment._id, 'completed')}>Mark Complete</button>
                          {appointment.paymentStatus === 'pending' && (
                            <small className="text-warning d-block mt-1">
                              <i className="fas fa-exclamation-triangle me-1"></i>
                              Payment pending - patient can still pay after completion
                            </small>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="text-muted">Booked on {new Date(appointment.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard; 