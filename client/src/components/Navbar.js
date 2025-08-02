import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ background: classicNavy, color: classicWhite }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ color: classicGold, fontWeight: 700, fontSize: '1.5rem' }}>
          <i className="fas fa-stethoscope me-2" style={{ color: classicGold, fontSize: '1.6rem' }}></i>
          MediConnect
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ borderColor: classicGold }}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(80%) sepia(100%) saturate(500%) hue-rotate(10deg)' }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={{ color: classicWhite }}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/doctors" style={{ color: classicWhite }}>
                Find Doctors
              </Link>
            </li>
            {user && (
              <>
                {user.role === 'patient' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/my-appointments" style={{ color: classicWhite }}>My Appointments</Link>
                  </li>
                )}
                {user.role === 'doctor' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-dashboard" style={{ color: classicWhite }}>Dashboard</Link>
                  </li>
                )}
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin-dashboard" style={{ color: classicWhite }}>Admin Dashboard</Link>
                  </li>
                )}
                {user && user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin-appointments" style={{ color: classicWhite }}>Manage Appointments</Link>
                  </li>
                )}
                {user && user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin-contact-requests" style={{ color: classicWhite }}>Contact Requests</Link>
                  </li>
                )}
              </>
            )}
            {(user === null || (user && (user.role === 'patient' || user.role === 'doctor'))) && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/about" style={{ color: classicWhite }}>
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact" style={{ color: classicWhite }}>
                    Contact
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  style={{ color: classicGold }}
                >
                  <i className="fas fa-user me-1"></i>
                  {user.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="fas fa-user-cog me-2"></i>Profile
                    </Link>
                  </li>
                  <li>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" style={{ color: classicGold }}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" style={{ color: classicGold }}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 