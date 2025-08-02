import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    specialization: '',
    experience: '',
    education: '',
    licenseNumber: '',
    consultationFee: '',
    adminCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone
    };
    if (formData.role === 'doctor') {
      if (!formData.specialization || !formData.experience || !formData.education || !formData.licenseNumber || !formData.consultationFee) {
        setError('All doctor fields are required');
        setLoading(false);
        return;
      }
      registrationData.specialization = formData.specialization;
      registrationData.experience = parseInt(formData.experience);
      registrationData.education = formData.education;
      registrationData.licenseNumber = formData.licenseNumber;
      registrationData.consultationFee = parseInt(formData.consultationFee);
    }
    if (formData.role === 'admin') {
      if (!formData.adminCode) {
        setError('Admin code is required');
        setLoading(false);
        return;
      }
      registrationData.adminCode = formData.adminCode;
    }
    const result = await register(registrationData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: classicWhite, minHeight: '100vh' }} className="d-flex align-items-center justify-content-center py-5">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow border-0" style={{ background: classicWhite }}>
          <div className="card-body p-5">
            <h2 className="text-center mb-4 fw-bold" style={{ color: classicNavy }}>Register</h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label" style={{ color: classicNavy }}>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label" style={{ color: classicNavy }}>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="password" className="form-label" style={{ color: classicNavy }}>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="confirmPassword" className="form-label" style={{ color: classicNavy }}>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="role" className="form-label" style={{ color: classicNavy }}>Role</label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label" style={{ color: classicNavy }}>Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.role === 'doctor' && (
                <div className="border rounded p-3 mb-3" style={{ borderColor: classicGold }}>
                  <h6 className="mb-3" style={{ color: classicNavy }}>Doctor Information</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="specialization" className="form-label" style={{ color: classicNavy }}>Specialization</label>
                      <input
                        type="text"
                        className="form-control"
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="experience" className="form-label" style={{ color: classicNavy }}>Years of Experience</label>
                      <input
                        type="number"
                        className="form-control"
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="education" className="form-label" style={{ color: classicNavy }}>Education</label>
                      <input
                        type="text"
                        className="form-control"
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        placeholder="e.g., MBBS, MD"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="licenseNumber" className="form-label" style={{ color: classicNavy }}>License Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="licenseNumber"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              {formData.role === 'admin' && (
                <div className="border rounded p-3 mb-3" style={{ borderColor: classicGold }}>
                  <h6 className="mb-3" style={{ color: classicNavy }}>Admin Information</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="adminCode" className="form-label" style={{ color: classicNavy }}>Admin Code</label>
                      <input
                        type="password"
                        className="form-control"
                        id="adminCode"
                        name="adminCode"
                        value={formData.adminCode}
                        onChange={handleChange}
                        placeholder="Enter admin code"
                        required
                      />
                      <small className="form-text text-muted">Contact system administrator for the admin code</small>
                    </div>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="btn w-100"
                style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>
            <div className="text-center mt-3">
              <p className="mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none" style={{ color: classicGold, fontWeight: 600 }}>
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 