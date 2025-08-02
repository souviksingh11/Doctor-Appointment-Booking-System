import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const Profile = () => {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    gender: user?.gender || '',
    address: user?.address || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
    education: user?.education || '',
    licenseNumber: user?.licenseNumber || '',
    consultationFee: user?.consultationFee || '',
    isAvailable: user?.isAvailable !== undefined ? user.isAvailable : true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        address: user.address || '',
        specialization: user.specialization || '',
        experience: user.experience || '',
        education: user.education || '',
        licenseNumber: user.licenseNumber || '',
        consultationFee: user.consultationFee || '',
        isAvailable: user.isAvailable !== undefined ? user.isAvailable : true
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      let response;
      if (user.role === 'doctor') {
        response = await axios.put('http://localhost:5000/api/doctors/profile', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.put('http://localhost:5000/api/auth/profile', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      if (response.data) {
        updateUser(response.data);
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderPatientFields = () => (
    <>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="dateOfBirth" className="form-label" style={{ color: classicNavy }}>Date of Birth</label>
          <input
            type="date"
            className="form-control"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="gender" className="form-label" style={{ color: classicNavy }}>Gender</label>
          <select
            className="form-control"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="row g-3 mt-1">
        <div className="col-12">
          <label htmlFor="address" className="form-label" style={{ color: classicNavy }}>Address</label>
          <textarea
            className="form-control"
            id="address"
            name="address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your full address"
          />
        </div>
      </div>
    </>
  );

  const renderDoctorFields = () => (
    <>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="specialization" className="form-label" style={{ color: classicNavy }}>Specialization</label>
          <input
            type="text"
            className="form-control"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="e.g., Cardiology"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="experience" className="form-label" style={{ color: classicNavy }}>Years of Experience</label>
          <input
            type="number"
            className="form-control"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>
      <div className="row g-3 mt-1">
        <div className="col-md-6">
          <label htmlFor="education" className="form-label" style={{ color: classicNavy }}>Education</label>
          <input
            type="text"
            className="form-control"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            placeholder="e.g., MBBS, MD"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="licenseNumber" className="form-label" style={{ color: classicNavy }}>License Number</label>
          <input
            type="text"
            className="form-control"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row g-3 mt-1">
        <div className="col-md-6">
          <label htmlFor="consultationFee" className="form-label" style={{ color: classicNavy }}>Consultation Fee (₹)</label>
          <input
            type="number"
            className="form-control"
            id="consultationFee"
            name="consultationFee"
            value={formData.consultationFee}
            onChange={handleChange}
            min="0"
            placeholder="e.g., 500"
          />
        </div>
        <div className="col-md-6">
          <div className="form-check mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isAvailable" style={{ color: classicNavy }}>
              Available for appointments
            </label>
          </div>
        </div>
      </div>
    </>
  );

  if (!user) {
    return (
      <div className="alert alert-warning" role="alert">
        Please log in to view your profile
      </div>
    );
  }

  return (
    <div style={{ background: classicWhite, minHeight: '100vh' }} className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0" style={{ background: classicWhite }}>
            <div className="card-body p-5">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow"
                       style={{ width: '70px', height: '70px', fontSize: '2rem', background: classicNavy, color: classicGold }}>
                    <i className={`fas ${user.role === 'doctor' ? 'fa-user-md' : user.role === 'admin' ? 'fa-user-shield' : 'fa-user'}`}></i>
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: classicNavy }}>{user.name}</h3>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge" style={{ background: classicGold, color: classicNavy, fontWeight: 600 }}>{user.role}</span>
                      <span className="text-muted small">{user.email}</span>
                    </div>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setIsEditing(true)}
                    style={{ borderColor: classicGold, color: classicGold }}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Edit Profile
                  </button>
                )}
              </div>

              {message && (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {isEditing ? (
                <>
                  <h5 className="mb-3 border-bottom pb-2" style={{ color: classicNavy }}>
                    <i className="fas fa-edit me-2" style={{ color: classicGold }}></i>
                    Edit Profile
                  </h5>
                  <form onSubmit={handleSubmit} className="mb-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label" style={{ color: classicNavy }}>Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          style={{ borderColor: classicGold }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label" style={{ color: classicNavy }}>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{ borderColor: classicGold }}
                        />
                      </div>
                    </div>
                    <div className="row g-3 mt-1">
                      <div className="col-12">
                        <label htmlFor="phone" className="form-label" style={{ color: classicNavy }}>Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          style={{ borderColor: classicGold }}
                        />
                      </div>
                    </div>

                    {user.role === 'patient' && renderPatientFields()}
                    {user.role === 'doctor' && renderDoctorFields()}

                    <div className="d-flex gap-2 mt-4">
                      <button
                        type="submit"
                        className="btn flex-fill"
                        style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setIsEditing(false)}
                        style={{ borderColor: classicGold, color: classicGold }}
                      >
                        <i className="fas fa-times me-2"></i>
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h5 className="mb-3 border-bottom pb-2" style={{ color: classicNavy }}>
                    <i className="fas fa-user me-2" style={{ color: classicGold }}></i>
                    Profile Information
                  </h5>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <p className="mb-1"><strong style={{ color: classicNavy }}>Name:</strong></p>
                      <p className="text-muted">{user.name}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1"><strong style={{ color: classicNavy }}>Email:</strong></p>
                      <p className="text-muted">{user.email}</p>
                    </div>
                    {user.phone && (
                      <div className="col-md-6">
                        <p className="mb-1"><strong style={{ color: classicNavy }}>Phone:</strong></p>
                        <p className="text-muted">{user.phone}</p>
                      </div>
                    )}
                    {user.role === 'patient' && user.dateOfBirth && (
                      <div className="col-md-6">
                        <p className="mb-1"><strong style={{ color: classicNavy }}>Date of Birth:</strong></p>
                        <p className="text-muted">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                    )}
                    {user.role === 'patient' && user.gender && (
                      <div className="col-md-6">
                        <p className="mb-1"><strong style={{ color: classicNavy }}>Gender:</strong></p>
                        <p className="text-muted">{user.gender}</p>
                      </div>
                    )}
                    {user.role === 'patient' && user.address && (
                      <div className="col-12">
                        <p className="mb-1"><strong style={{ color: classicNavy }}>Address:</strong></p>
                        <p className="text-muted">{user.address}</p>
                      </div>
                    )}
                    {user.role === 'doctor' && (
                      <>
                        {user.specialization && (
                          <div className="col-md-6">
                            <p className="mb-1"><strong style={{ color: classicNavy }}>Specialization:</strong></p>
                            <p className="text-muted">{user.specialization}</p>
                          </div>
                        )}
                        {user.experience && (
                          <div className="col-md-6">
                            <p className="mb-1"><strong style={{ color: classicNavy }}>Experience:</strong></p>
                            <p className="text-muted">{user.experience} years</p>
                          </div>
                        )}
                        {user.education && (
                          <div className="col-md-6">
                            <p className="mb-1"><strong style={{ color: classicNavy }}>Education:</strong></p>
                            <p className="text-muted">{user.education}</p>
                          </div>
                        )}
                        {user.consultationFee && (
                          <div className="col-md-6">
                            <p className="mb-1"><strong style={{ color: classicNavy }}>Consultation Fee:</strong></p>
                            <p className="text-muted">₹{user.consultationFee}</p>
                          </div>
                        )}
                        <div className="col-md-6">
                          <p className="mb-1"><strong style={{ color: classicNavy }}>Status:</strong></p>
                          <span className={`badge ${user.isAvailable ? 'bg-success' : 'bg-secondary'}`}>
                            {user.isAvailable ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              <div className="bg-light rounded p-3 mb-3 border">
                <h6 className="mb-2" style={{ color: classicNavy }}>
                  <i className="fas fa-info-circle me-2" style={{ color: classicGold }}></i>
                  Account Information
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Member Since:</strong></p>
                    <p className="text-muted mb-2">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Account Type:</strong></p>
                    <p className="text-muted mb-2">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                  </div>
                </div>
              </div>

              <button
                className="btn w-100 mt-2"
                style={{ background: classicWhite, color: classicNavy, border: `2px solid ${classicGold}`, fontWeight: 600 }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    logout();
                    navigate('/');
                  }
                }}
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 