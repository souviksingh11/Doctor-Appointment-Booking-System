import React, { useState, useEffect } from 'react';
import axios from 'axios';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const response = await axios.get(`http://localhost:5000/api/appointments/my-appointments${params}`);
      console.log('Appointments data:', response.data);
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
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`);
        fetchAppointments(); // Refresh the list
        alert('Appointment cancelled successfully');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel appointment');
      }
    }
  };

  const handlePayment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to proceed with the payment?')) {
      try {
        const response = await axios.post(`http://localhost:5000/api/appointments/${appointmentId}/pay`, {
          paymentMethod: 'online'
        });
        fetchAppointments(); // Refresh the list
        alert('Payment processed successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to process payment');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: classicGold,
      confirmed: classicNavy,
      cancelled: '#dc3545',
      completed: '#198754'
    };
    return {
      background: statusColors[status] || '#adb5bd',
      color: status === 'pending' ? classicNavy : classicWhite,
      fontWeight: 600,
      borderRadius: '6px',
      padding: '2px 10px',
      fontSize: '0.95em'
    };
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status" style={{ color: classicGold }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div style={{ background: classicWhite, minHeight: '100vh' }} className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold" style={{ color: classicNavy }}>My Appointments</h2>
          <select
            className="form-select"
            style={{ width: '200px', borderColor: classicGold }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {appointments.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-calendar-times" style={{ fontSize: '4rem', color: classicGold, opacity: 0.7 }}></i>
            <h4 className="mt-3 text-muted">No appointments found</h4>
            <p className="text-muted">
              {statusFilter ? 'No appointments with the selected status' : 'You haven\'t booked any appointments yet'}
            </p>
          </div>
        ) : (
          <div className="row">
            {appointments.filter(appointment => appointment && appointment._id).map((appointment) => (
              <div key={appointment._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm border-0" style={{ background: classicWhite }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="card-title mb-1" style={{ color: classicNavy }}>
                          {appointment.doctor?.name || 'Doctor Information Unavailable'}
                        </h5>
                        <p className="mb-0" style={{ color: classicGold }}>
                          {appointment.doctor?.specialization || 'Specialization not available'}
                        </p>
                        {!appointment.doctor && (
                          <small className="text-muted">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            Doctor data missing
                          </small>
                        )}
                      </div>
                      <span style={getStatusBadge(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="row small">
                        <div className="col-6" style={{ color: classicNavy }}>
                          <i className="fas fa-calendar me-1"></i>
                          {formatDate(appointment.date)}
                        </div>
                        <div className="col-6" style={{ color: classicNavy }}>
                          <i className="fas fa-clock me-1"></i>
                          {appointment.timeSlot}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <h6 className="mb-2" style={{ color: classicNavy }}>Reason for Visit</h6>
                      <p className="text-muted small mb-0">{appointment.reason}</p>
                    </div>
                    {appointment.symptoms && (
                      <div className="mb-3">
                        <h6 className="mb-2" style={{ color: classicNavy }}>Symptoms</h6>
                        <p className="text-muted small mb-0">{appointment.symptoms}</p>
                      </div>
                    )}
                    {appointment.notes && (
                      <div className="mb-3">
                        <h6 className="mb-2" style={{ color: classicNavy }}>Doctor's Notes</h6>
                        <p className="text-muted small mb-0">{appointment.notes}</p>
                      </div>
                    )}
                    {appointment.prescription && (
                      <div className="mb-3">
                        <h6 className="mb-2" style={{ color: classicNavy }}>Prescription</h6>
                        <p className="text-muted small mb-0">{appointment.prescription}</p>
                      </div>
                    )}
                    {appointment.diagnosis && (
                      <div className="mb-3">
                        <h6 className="mb-2" style={{ color: classicNavy }}>Diagnosis</h6>
                        <p className="text-muted small mb-0">{appointment.diagnosis}</p>
                      </div>
                    )}
                    {appointment.consultationFee && (
                      <div className="mb-3">
                        <h6 className="mb-2" style={{ color: classicNavy }}>Consultation Fee</h6>
                        <p className="text-muted small mb-0">
                          <i className="fas fa-rupee-sign me-1"></i>
                          ₹{appointment.consultationFee}
                        </p>
                      </div>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Booked on {new Date(appointment.createdAt).toLocaleDateString()}
                      </small>
                      <div className="d-flex gap-2">
                        {appointment.status === 'pending' && (
                          <button
                            className="btn btn-sm"
                            style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }}
                            onClick={() => handleCancelAppointment(appointment._id)}
                          >
                            Cancel
                          </button>
                        )}
                        {(appointment.status === 'confirmed' || appointment.status === 'completed') && appointment.paymentStatus === 'pending' && (
                          <button
                            className="btn btn-sm"
                            style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }}
                            onClick={() => handlePayment(appointment._id)}
                          >
                            Pay Now
                          </button>
                        )}
                        {appointment.paymentStatus === 'paid' && (
                          <span className="badge" style={{ background: '#198754', color: classicWhite, fontWeight: 600 }}>
                            <i className="fas fa-check me-1"></i>
                            Paid
                          </span>
                        )}
                      </div>
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

export default MyAppointments; 