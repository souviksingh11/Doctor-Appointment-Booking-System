import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    reason: '',
    symptoms: ''
  });
  useEffect(() => { fetchDoctor(); }, [doctorId]);
  const fetchDoctor = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`);
      setDoctor(response.data);
    } catch (error) {
      setError('Failed to load doctor information');
    } finally {
      setLoading(false);
    }
  };
  const fetchAvailableSlots = async (date) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/doctors/${doctorId}/availability?date=${date}`);
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      setError('Failed to load available time slots');
    }
  };
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFormData({ ...formData, date: selectedDate, timeSlot: '' });
    if (selectedDate) fetchAvailableSlots(selectedDate); else setAvailableSlots([]);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/appointments', { doctorId, ...formData });
      alert('Appointment booked successfully!');
      navigate('/my-appointments');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
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
  if (error && !doctor) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }
  if (!doctor) {
    return <div className="alert alert-warning" role="alert">Doctor not found</div>;
  }
  const today = new Date().toISOString().split('T')[0];
  return (
    <div style={{ background: classicWhite, minHeight: '100vh' }} className="py-5 d-flex align-items-center justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow border-0" style={{ background: classicWhite }}>
          <div className="card-body p-5">
            <h2 className="text-center mb-4 fw-bold" style={{ color: classicNavy }}>Book Appointment</h2>
            {/* Doctor Info */}
            <div className="card mb-4 border-0" style={{ background: classicWhite }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                       style={{ width: '60px', height: '60px', background: classicNavy, color: classicGold }}>
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-1" style={{ color: classicNavy }}>{doctor.name}</h5>
                    <p className="mb-1" style={{ color: classicGold }}>{doctor.specialization}</p>
                    <p className="small mb-0" style={{ color: classicNavy }}>{doctor.education} • {doctor.experience} years experience</p>
                    {doctor.consultationFee && (
                      <p className="small mb-0 mt-2" style={{ color: classicNavy, fontWeight: 600 }}>
                        <i className="fas fa-rupee-sign me-1"></i>
                        Consultation Fee: ₹{doctor.consultationFee}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="date" className="form-label" style={{ color: classicNavy }}>Appointment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleDateChange}
                    min={today}
                    required
                    style={{ borderColor: classicGold }}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="timeSlot" className="form-label" style={{ color: classicNavy }}>Time Slot</label>
                  <select
                    className="form-select"
                    id="timeSlot"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    required
                    disabled={!formData.date || availableSlots.length === 0}
                    style={{ borderColor: classicGold }}
                  >
                    <option value="">Select time slot</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {formData.date && availableSlots.length === 0 && (
                    <small className="text-muted">No available slots for this date</small>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="reason" className="form-label" style={{ color: classicNavy }}>Reason for Visit</label>
                <textarea
                  className="form-control"
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Please describe the reason for your appointment..."
                  required
                  style={{ borderColor: classicGold }}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="symptoms" className="form-label" style={{ color: classicNavy }}>Symptoms (Optional)</label>
                <textarea
                  className="form-control"
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe any symptoms you're experiencing..."
                  style={{ borderColor: classicGold }}
                />
              </div>
              {doctor.consultationFee && (
                <div className="alert alert-info mb-4" style={{ background: classicGold, color: classicNavy, border: 'none' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="fas fa-credit-card me-2"></i>
                      <strong>Payment Required</strong>
                    </div>
                    <div>
                      <span className="fw-bold">₹{doctor.consultationFee}</span>
                    </div>
                  </div>
                  <small className="d-block mt-2">
                    You will be charged ₹{doctor.consultationFee} for this consultation. 
                    Payment will be processed when the doctor confirms your appointment.
                  </small>
                </div>
              )}
              <button
                type="submit"
                className="btn w-100"
                style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }}
                disabled={bookingLoading || !formData.date || !formData.timeSlot || !formData.reason}
              >
                {bookingLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Booking Appointment...
                  </>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment; 