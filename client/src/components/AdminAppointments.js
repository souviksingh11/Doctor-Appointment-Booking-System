import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const AdminAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/admin/appointments');
      // Sort appointments by date, timeSlot, createdAt
      const sorted = res.data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
        const timeA = a.timeSlot;
        const timeB = b.timeSlot;
        if (timeA !== timeB) return timeA.localeCompare(timeB);
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setAppointments(sorted);
    } catch (err) {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  const canModifyAppointment = (appointment) => appointment.status === 'pending';

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" style={{ color: classicGold }}></div></div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div style={{ background: classicWhite, minHeight: '100vh' }} className="py-5">
      <div className="container">
        <h2 className="mb-4 fw-bold" style={{ color: classicNavy }}>Manage Appointments</h2>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ background: classicGold, color: classicNavy }}>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Fee</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan="8" className="text-center">No appointments found.</td></tr>
              ) : appointments.map(app => {
                const canModify = canModifyAppointment(app);
                const statusStyle = {
                  background: app.status === 'confirmed' ? '#28a745' : 
                             app.status === 'cancelled' ? '#dc3545' : 
                             app.status === 'completed' ? '#17a2b8' : classicGold,
                  color: app.status === 'pending' ? classicNavy : classicWhite,
                  fontWeight: 600,
                  borderRadius: '6px',
                  padding: '2px 10px'
                };
                return (
                  <tr key={app._id}>
                    <td>{app.patient?.name || '-'}</td>
                    <td>{app.doctor?.name || '-'}</td>
                    <td>{new Date(app.date).toLocaleDateString()}</td>
                    <td>{app.timeSlot}</td>
                    <td><span style={statusStyle}>{app.status}</span></td>
                    <td>{app.consultationFee ? `₹${app.consultationFee}` : '-'}</td>
                    <td>
                      {app.paymentStatus === 'paid' ? (
                        <span style={{ color: '#28a745', fontWeight: 600 }}><i className="fas fa-check me-1"></i>Paid</span>
                      ) : app.paymentStatus === 'pending' ? (
                        <span style={{ color: '#ffc107', fontWeight: 600 }}><i className="fas fa-clock me-1"></i>Pending</span>
                      ) : (
                        <span style={{ color: '#dc3545', fontWeight: 600 }}><i className="fas fa-times me-1"></i>Failed</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm me-2"
                        style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }}
                        onClick={() => canModify && handleDelete(app._id)}
                        disabled={!canModify}
                      >Delete</button>
                      <button
                        className="btn btn-sm me-2"
                        style={{ background: classicNavy, color: classicGold, fontWeight: 600, border: 'none' }}
                        onClick={() => canModify && handleStatusUpdate(app._id, 'confirmed')}
                        disabled={!canModify}
                      >Confirm</button>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#dc3545', color: classicWhite, fontWeight: 600, border: 'none' }}
                        onClick={() => canModify && handleStatusUpdate(app._id, 'cancelled')}
                        disabled={!canModify}
                      >Cancel</button>
                      {!canModify && (
                        <small className="text-muted d-block mt-1">
                          <i className="fas fa-info-circle me-1"></i>
                          This appointment has been {app.status} and cannot be modified.
                        </small>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments; 