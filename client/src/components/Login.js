import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient',
    adminCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdminCode, setShowAdminCode] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear admin code if role changes from admin to something else
    if (name === 'role' && value !== 'admin') {
      setFormData({
        ...formData,
        [name]: value,
        adminCode: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loginData = {
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    // Include admin code if admin role is selected
    if (formData.role === 'admin' && formData.adminCode) {
      loginData.adminCode = formData.adminCode;
    }

    const result = await login(loginData.email, loginData.password, formData.role, loginData.adminCode);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ background: classicWhite, minHeight: '100vh' }} className="d-flex align-items-center justify-content-center py-5">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow border-0" style={{ background: classicWhite }}>
          <div className="card-body p-5">
            <h2 className="text-center mb-4 fw-bold" style={{ color: classicNavy }}>Login</h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="role" className="form-label" style={{ color: classicNavy }}>Login As</label>
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
              <div className="mb-3">
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
              <div className="mb-3">
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
              {formData.role === 'admin' && (
                <div className="mb-3">
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
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
            <div className="text-center mt-3">
              <p className="mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none" style={{ color: classicGold, fontWeight: 600 }}>
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 