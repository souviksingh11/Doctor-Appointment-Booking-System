import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const Home = () => {
  const { user, loading } = useAuth();

  // Doctor stats state
  const [doctorStats, setDoctorStats] = React.useState({
    activePatients: 0,
    pendingAppointments: 0,
    totalAppointments: 0,
    rating: 4.8
  });

  // Patient stats state
  const [patientStats, setPatientStats] = React.useState({
    availableDoctors: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  });

  // Admin stats state
  const [adminStats, setAdminStats] = React.useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0
  });

  // Fetch doctor stats
  React.useEffect(() => {
    if (user && user.role === 'doctor') {
      const fetchDoctorStats = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/doctors/appointments');
          const appointments = response.data;
          
          // Calculate real statistics
          const pendingCount = appointments.filter(apt => apt.status === 'pending').length;
          const confirmedCount = appointments.filter(apt => apt.status === 'confirmed').length;
          const completedCount = appointments.filter(apt => apt.status === 'completed').length;
          const totalAppointments = appointments.length;
          
          // Get unique patients
          const uniquePatients = new Set(appointments.map(apt => apt.patient._id));
          const activePatients = uniquePatients.size;

          setDoctorStats({
            activePatients,
            pendingAppointments: pendingCount,
            totalAppointments,
            rating: 4.8 // Default rating, can be updated later
          });
        } catch (error) {
          console.error('Error fetching doctor stats:', error);
          // Keep default values if error occurs
        }
      };

      fetchDoctorStats();
    }
  }, [user]);

  // Fetch patient stats
  React.useEffect(() => {
    if (user && user.role === 'patient') {
      const fetchPatientStats = async () => {
        try {
          // Fetch patient's appointments
          const appointmentsResponse = await axios.get('http://localhost:5000/api/appointments/my-appointments');
          const appointments = appointmentsResponse.data;
          
          // Fetch available doctors
          const doctorsResponse = await axios.get('http://localhost:5000/api/doctors');
          const doctors = doctorsResponse.data;
          
          // Calculate real statistics
          const totalAppointments = appointments.length;
          const upcomingAppointments = appointments.filter(apt => apt.status === 'confirmed' || apt.status === 'pending').length;
          const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
          const availableDoctors = doctors.length;

          setPatientStats({
            availableDoctors,
            totalAppointments,
            upcomingAppointments,
            completedAppointments
          });
        } catch (error) {
          console.error('Error fetching patient stats:', error);
          // Keep default values if error occurs
        }
      };

      fetchPatientStats();
    }
  }, [user]);

  // Fetch admin stats
  React.useEffect(() => {
    if (user && user.role === 'admin') {
      const fetchAdminStats = async () => {
        try {
          // Fetch all data for admin dashboard
          const [doctorsResponse, patientsResponse, appointmentsResponse] = await Promise.all([
            axios.get('http://localhost:5000/api/admin/doctors'),
            axios.get('http://localhost:5000/api/admin/patients'),
            axios.get('http://localhost:5000/api/admin/appointments')
          ]);
          
          const doctors = doctorsResponse.data;
          const patients = patientsResponse.data;
          const appointments = appointmentsResponse.data;
          
          // Calculate real statistics
          const totalDoctors = doctors.length;
          const totalPatients = patients.length;
          const totalAppointments = appointments.length;
          const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
          const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed').length;
          const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;

          setAdminStats({
            totalDoctors,
            totalPatients,
            totalAppointments,
            pendingAppointments,
            confirmedAppointments,
            completedAppointments
          });
        } catch (error) {
          console.error('Error fetching admin stats:', error);
          // Keep default values if error occurs
        }
      };

      fetchAdminStats();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" style={{ color: classicGold }}></div></div>;
  }

  if (user) {
    // Role-based home pages
    if (user.role === 'patient') {
      return (
        <div style={{ background: classicWhite, minHeight: '100vh' }} className="d-flex flex-column justify-content-between">
          <div style={{ background: classicNavy }} className="text-white py-5 rounded-bottom shadow-sm mb-4">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h1 className="display-4 fw-bold mb-4">
                    Welcome, {user.name}!
                  </h1>
                  <p className="lead mb-4">
                    Book and manage your appointments easily.<br />
                    View your appointment history and get reminders.
                  </p>
                  <Link to="/my-appointments" className="btn btn-lg me-3 shadow-sm"
                    style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    <i className="fas fa-calendar-check me-2"></i>My Appointments
                  </Link>
                  <Link to="/doctors" className="btn btn-outline-light btn-lg shadow-sm"
                    style={{ borderColor: classicGold, color: classicGold, fontWeight: 600 }}>
                    <i className="fas fa-search me-2"></i>Find Doctors
                  </Link>
                </div>
                <div className="col-lg-4 text-center">
                  <i className="fas fa-user-md" style={{ fontSize: '8rem', opacity: 0.18, color: classicGold }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Section */}
          <div className="py-4" style={{ background: classicGold }}>
            <div className="container">
              <div className="row text-center">
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{patientStats.availableDoctors}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Available Doctors</small>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{patientStats.upcomingAppointments}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Upcoming Appointments</small>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{patientStats.completedAppointments}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Completed Appointments</small>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>24/7</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Booking Available</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Your Healthcare Dashboard</h2>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-calendar-check mb-3" style={{ fontSize: '3rem', color: classicGold }}></i>
                      <h5 className="card-title" style={{ color: classicNavy }}>Manage Appointments</h5>
                      <p className="card-text">
                        View, book, and manage all your appointments in one place.
                      </p>
                      <Link to="/my-appointments" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                        View Appointments
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-bell mb-3" style={{ fontSize: '3rem', color: classicGold }}></i>
                      <h5 className="card-title" style={{ color: classicNavy }}>Smart Reminders</h5>
                      <p className="card-text">
                        Get timely reminders for your upcoming appointments.
                      </p>
                      <span className="badge" style={{ background: classicGold, color: classicNavy }}>Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Tips Section */}
          <div className="py-5" style={{ background: '#f8f9fa', borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Health Tips & Wellness</h2>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-tint mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Stay Hydrated</h6>
                      <p className="small text-muted">Drink 8 glasses of water daily for optimal health</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-walking mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Daily Exercise</h6>
                      <p className="small text-muted">30 minutes of moderate exercise daily</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-bed mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Quality Sleep</h6>
                      <p className="small text-muted">7-9 hours of sleep for better health</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Quick Actions</h2>
              <div className="row">
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-search"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>Find Doctor</h5>
                  <p className="small">Browse qualified specialists</p>
                  <Link to="/doctors" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    Search Now
                  </Link>
                </div>
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-calendar-plus"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>Book Appointment</h5>
                  <p className="small">Schedule your visit</p>
                  <Link to="/doctors" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    Book Now
                  </Link>
                </div>
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-history"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>View History</h5>
                  <p className="small">Check past appointments</p>
                  <Link to="/my-appointments" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    View History
                  </Link>
                </div>
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-user-edit"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>Update Profile</h5>
                  <p className="small">Manage your information</p>
                  <Link to="/profile" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="py-5" style={{ background: '#f8f9fa', borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h3 className="mb-3 fw-bold" style={{ color: classicNavy }}>Emergency Contact</h3>
                  <p className="lead mb-4">
                    For medical emergencies, please contact emergency services immediately.
                  </p>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-phone me-3" style={{ fontSize: '1.5rem', color: classicGold }}></i>
                        <div>
                          <strong style={{ color: classicNavy }}>Emergency</strong><br />
                          <span>911</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-hospital me-3" style={{ fontSize: '1.5rem', color: classicGold }}></i>
                        <div>
                          <strong style={{ color: classicNavy }}>Nearest Hospital</strong><br />
                          <span>City General Hospital</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 text-center">
                  <i className="fas fa-ambulance" style={{ fontSize: '4rem', color: classicGold }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <footer style={{ background: classicNavy }} className="text-light py-5 mt-auto">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-stethoscope fa-2x me-3" style={{ color: classicGold }}></i>
                    <h4 className="mb-0" style={{ color: classicGold }}>MediConnect</h4>
                  </div>
                  <p className="mb-3">
                    Your trusted platform for booking doctor appointments online. 
                    We connect patients with qualified healthcare professionals for better health outcomes.
                  </p>
                  <div className="d-flex">
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-facebook"></i>
                    </a>
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6 mb-4">
                  <h6 className="mb-3" style={{ color: classicGold }}>Quick Links</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <Link to="/" className="text-light text-decoration-none">Home</Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/my-appointments" className="text-light text-decoration-none">My Appointments</Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/doctors" className="text-light text-decoration-none">Find Doctors</Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/profile" className="text-light text-decoration-none">My Profile</Link>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-2 col-md-6 mb-4">
                  <h6 className="mb-3" style={{ color: classicGold }}>Services</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">Cardiology</a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">Neurology</a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">Pediatrics</a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">Dentistry</a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 mb-4">
                  <h6 className="mb-3" style={{ color: classicGold }}>Contact Information</h6>
                  <div className="mb-3">
                    <i className="fas fa-map-marker-alt me-2" style={{ color: classicGold }}></i>
                    <span>123 Healthcare Street, Medical District, City</span>
                  </div>
                  <div className="mb-3">
                    <i className="fas fa-phone me-2" style={{ color: classicGold }}></i>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="mb-3">
                    <i className="fas fa-envelope me-2" style={{ color: classicGold }}></i>
                    <span>support@doctorbooking.com</span>
                  </div>
                  <div className="mb-3">
                    <i className="fas fa-clock me-2" style={{ color: classicGold }}></i>
                    <span>24/7 Support Available</span>
                  </div>
                </div>
              </div>
              <hr style={{ borderColor: classicGold, opacity: 0.3 }} />
              <div className="row align-items-center">
                <div className="col-md-6 text-center text-md-start">
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} MediConnect. All rights reserved.
                  </p>
                </div>
                <div className="col-md-6 text-center text-md-end">
                  <div className="small">
                    <a href="#" className="text-light text-decoration-none me-3">Privacy Policy</a>
                    <a href="#" className="text-light text-decoration-none me-3">Terms of Service</a>
                    <a href="#" className="text-light text-decoration-none">Cookie Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      );
    }
    if (user.role === 'doctor') {
      return (
        <div style={{ background: classicWhite, minHeight: '100vh' }} className="d-flex flex-column justify-content-between">
          <div style={{ background: classicNavy }} className="text-white py-5 rounded-bottom shadow-sm mb-4">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h1 className="display-4 fw-bold mb-4">
                    Welcome, Dr. {user.name}!
                  </h1>
                  <p className="lead mb-4">
                    Manage your appointments and view your patient list.<br />
                    Stay organized and provide the best care.
                  </p>
                  <Link to="/doctor-dashboard" className="btn btn-lg me-3 shadow-sm"
                    style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    <i className="fas fa-calendar-check me-2"></i>Doctor Dashboard
                  </Link>
                  <Link to="/profile" className="btn btn-outline-light btn-lg shadow-sm"
                    style={{ borderColor: classicGold, color: classicGold, fontWeight: 600 }}>
                    <i className="fas fa-user-md me-2"></i>My Profile
                  </Link>
                </div>
                <div className="col-lg-4 text-center">
                  <i className="fas fa-user-md" style={{ fontSize: '8rem', opacity: 0.18, color: classicGold }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Stats Section */}
          <div className="py-4" style={{ background: classicGold }}>
            <div className="container">
              <div className="row text-center">
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{doctorStats.activePatients}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Active Patients</small>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{doctorStats.pendingAppointments}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Pending Appointments</small>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>₹{user.consultationFee || 500}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Consultation Fee</small>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{doctorStats.rating}★</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Patient Rating</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Your Practice Management</h2>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-calendar-check mb-3" style={{ fontSize: '3rem', color: classicGold }}></i>
                      <h5 className="card-title" style={{ color: classicNavy }}>Manage Appointments</h5>
                      <p className="card-text">
                        View and manage all your patient appointments in one place.
                      </p>
                      <Link to="/doctor-dashboard" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                        View Appointments
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-users mb-3" style={{ fontSize: '3rem', color: classicGold }}></i>
                      <h5 className="card-title" style={{ color: classicNavy }}>Patient List</h5>
                      <p className="card-text">
                        Access your patient list and view their appointment history.
                      </p>
                      <span className="badge" style={{ background: classicGold, color: classicNavy }}>Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Information Section */}
          <div className="py-5" style={{ background: '#f8f9fa', borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Practice Information</h2>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-graduation-cap mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Specialization</h6>
                      <p className="small text-muted">{user.specialization || 'General Medicine'}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-clock mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Experience</h6>
                      <p className="small text-muted">{user.experience || '5'} years of practice</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-certificate mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>License</h6>
                      <p className="small text-muted">License: {user.licenseNumber || 'MD12345'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Quick Actions</h2>
              <div className="row">
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>View Appointments</h5>
                  <p className="small">Check pending requests</p>
                  <Link to="/doctor-dashboard" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    Manage Now
                  </Link>
                </div>
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-user-edit"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>Update Profile</h5>
                  <p className="small">Edit your information</p>
                  <Link to="/profile" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    Edit Profile
                  </Link>
                </div>
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>Practice Analytics</h5>
                  <p className="small">View your statistics</p>
                  <span className="badge" style={{ background: classicGold, color: classicNavy }}>Coming Soon</span>
                </div>
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-cog"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>Settings</h5>
                  <p className="small">Configure preferences</p>
                  <span className="badge" style={{ background: classicGold, color: classicNavy }}>Coming Soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Resources Section */}
          <div className="py-5" style={{ background: '#f8f9fa', borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Medical Resources</h2>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-book-medical mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Medical Guidelines</h6>
                      <p className="small text-muted">Latest treatment protocols and guidelines</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-pills mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Drug Database</h6>
                      <p className="small text-muted">Comprehensive medication information</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-microscope mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Lab Results</h6>
                      <p className="small text-muted">Access patient test results</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Development Section */}
          <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h3 className="mb-3 fw-bold" style={{ color: classicNavy }}>Professional Development</h3>
                  <p className="lead mb-4">
                    Stay updated with the latest medical advancements and continuing education opportunities.
                  </p>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-graduation-cap me-3" style={{ fontSize: '1.5rem', color: classicGold }}></i>
                        <div>
                          <strong style={{ color: classicNavy }}>CME Credits</strong><br />
                          <span>Earn continuing education credits</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-newspaper me-3" style={{ fontSize: '1.5rem', color: classicGold }}></i>
                        <div>
                          <strong style={{ color: classicNavy }}>Medical Journals</strong><br />
                          <span>Access latest research papers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 text-center">
                  <i className="fas fa-user-md" style={{ fontSize: '4rem', color: classicGold }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <footer style={{ background: classicNavy }} className="text-light py-5 mt-auto">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-stethoscope fa-2x me-3" style={{ color: classicGold }}></i>
                    <h4 className="mb-0" style={{ color: classicGold }}>MediConnect</h4>
                  </div>
                  <p className="mb-3">
                    Your trusted platform for managing patient appointments online. 
                    We help doctors provide better care through efficient practice management.
                  </p>
                  <div className="d-flex">
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-facebook"></i>
                    </a>
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6 mb-4">
                  <h6 className="mb-3" style={{ color: classicGold }}>Quick Links</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <Link to="/" className="text-light text-decoration-none">Home</Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/doctor-dashboard" className="text-light text-decoration-none">Dashboard</Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/profile" className="text-light text-decoration-none">My Profile</Link>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">Resources</a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-2 col-md-6 mb-4">
                  <h6 className="mb-3" style={{ color: classicGold }}>Services</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">Appointment Management</a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">Patient Records</a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">Practice Analytics</a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">CME Credits</a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 mb-4">
                  <h6 className="mb-3" style={{ color: classicGold }}>Contact Information</h6>
                  <div className="mb-3">
                    <i className="fas fa-map-marker-alt me-2" style={{ color: classicGold }}></i>
                    <span>123 Healthcare Street, Medical District, City</span>
                  </div>
                  <div className="mb-3">
                    <i className="fas fa-phone me-2" style={{ color: classicGold }}></i>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="mb-3">
                    <i className="fas fa-envelope me-2" style={{ color: classicGold }}></i>
                    <span>support@doctorbooking.com</span>
                  </div>
                  <div className="mb-3">
                    <i className="fas fa-clock me-2" style={{ color: classicGold }}></i>
                    <span>24/7 Support Available</span>
                  </div>
                </div>
              </div>
              <hr style={{ borderColor: classicGold, opacity: 0.3 }} />
              <div className="row align-items-center">
                <div className="col-md-6 text-center text-md-start">
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} MediConnect. All rights reserved.
                  </p>
                </div>
                <div className="col-md-6 text-center text-md-end">
                  <div className="small">
                    <a href="#" className="text-light text-decoration-none me-3">Privacy Policy</a>
                    <a href="#" className="text-light text-decoration-none me-3">Terms of Service</a>
                    <a href="#" className="text-light text-decoration-none">Cookie Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      );
    }
    if (user.role === 'admin') {
      return (
        <div style={{ background: classicWhite, minHeight: '100vh' }} className="d-flex flex-column justify-content-between">
          <div style={{ background: classicNavy }} className="text-white py-5 rounded-bottom shadow-sm mb-4">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h1 className="display-4 fw-bold mb-4">
                    Welcome, Admin!
                  </h1>
                  <p className="lead mb-4">
                    Manage doctors, patients, and appointments from your dashboard.<br />
                    Keep the platform running smoothly.
                  </p>
                  <Link to="/admin-dashboard" className="btn btn-lg me-3 shadow-sm"
                    style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    <i className="fas fa-tools me-2"></i>Admin Dashboard
                  </Link>
                  <Link to="/profile" className="btn btn-outline-light btn-lg shadow-sm"
                    style={{ borderColor: classicGold, color: classicGold, fontWeight: 600 }}>
                    <i className="fas fa-user-cog me-2"></i>My Profile
                  </Link>
                </div>
                <div className="col-lg-4 text-center">
                  <i className="fas fa-user-shield" style={{ fontSize: '8rem', opacity: 0.18, color: classicGold }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Stats Section */}
          <div className="py-4" style={{ background: classicGold }}>
            <div className="container">
              <div className="row text-center">
                <div className="col-md-2 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{adminStats.totalDoctors}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Total Doctors</small>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{adminStats.totalPatients}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Total Patients</small>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{adminStats.totalAppointments}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Total Appointments</small>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{adminStats.pendingAppointments}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Pending</small>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{adminStats.confirmedAppointments}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Confirmed</small>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>{adminStats.completedAppointments}</h3>
                    <small style={{ color: classicNavy, fontWeight: 600 }}>Completed</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Platform Management</h2>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-user-md mb-3" style={{ fontSize: '3rem', color: classicGold }}></i>
                      <h5 className="card-title" style={{ color: classicNavy }}>Manage Doctors</h5>
                      <p className="card-text">
                        Add, remove, and manage doctors on the platform.
                      </p>
                      <Link to="/admin-dashboard" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                        Manage Doctors
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-users mb-3" style={{ fontSize: '3rem', color: classicGold }}></i>
                      <h5 className="card-title" style={{ color: classicNavy }}>Manage Patients</h5>
                      <p className="card-text">
                        View and manage all registered patients.
                      </p>
                      <span className="badge" style={{ background: classicGold, color: classicNavy }}>Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Overview Section */}
          <div className="py-5" style={{ background: '#f8f9fa', borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>System Overview</h2>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-chart-line mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Platform Analytics</h6>
                      <p className="small text-muted">Monitor system performance and usage statistics</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-shield-alt mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Security Management</h6>
                      <p className="small text-muted">Manage user access and platform security</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-cog mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>System Settings</h6>
                      <p className="small text-muted">Configure platform settings and preferences</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Quick Actions</h2>
              <div className="row">
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-user-md"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>Manage Doctors</h5>
                  <p className="small">Add or remove doctors</p>
                  <Link to="/admin-dashboard" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    Manage Now
                  </Link>
                </div>
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-users"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>Manage Patients</h5>
                  <p className="small">View patient information</p>
                  <Link to="/admin-dashboard" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    View Patients
                  </Link>
                </div>
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>Monitor Appointments</h5>
                  <p className="small">Track all appointments</p>
                  <Link to="/admin-dashboard" className="btn btn-sm" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                    View All
                  </Link>
                </div>
                <div className="col-md-3 text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                       style={{ width: '80px', height: '80px', fontWeight: 600, fontSize: '2rem', background: classicGold, color: classicNavy }}>
                    <i className="fas fa-chart-bar"></i>
                  </div>
                  <h5 style={{ color: classicNavy }}>Analytics</h5>
                  <p className="small">View platform analytics</p>
                  <span className="badge" style={{ background: classicGold, color: classicNavy }}>Coming Soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Management Section */}
          <div className="py-5" style={{ background: '#f8f9fa', borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Platform Management</h2>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-database mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Data Management</h6>
                      <p className="small text-muted">Manage system data and backups</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-bell mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Notifications</h6>
                      <p className="small text-muted">Manage system notifications</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                    <div className="card-body text-center">
                      <i className="fas fa-file-alt mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                      <h6 style={{ color: classicNavy }}>Reports</h6>
                      <p className="small text-muted">Generate system reports</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Health Section */}
          <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h3 className="mb-3 fw-bold" style={{ color: classicNavy }}>System Health & Performance</h3>
                  <p className="lead mb-4">
                    Monitor platform performance, user activity, and system health metrics.
                  </p>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-server me-3" style={{ fontSize: '1.5rem', color: classicGold }}></i>
                        <div>
                          <strong style={{ color: classicNavy }}>System Status</strong><br />
                          <span>All systems operational</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-chart-pie me-3" style={{ fontSize: '1.5rem', color: classicGold }}></i>
                        <div>
                          <strong style={{ color: classicNavy }}>Performance</strong><br />
                          <span>99.9% uptime</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 text-center">
                  <i className="fas fa-server" style={{ fontSize: '4rem', color: classicGold }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <footer style={{ background: classicNavy }} className="text-light py-5 mt-auto">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-stethoscope fa-2x me-3" style={{ color: classicGold }}></i>
                    <h4 className="mb-0" style={{ color: classicGold }}>MediConnect</h4>
                  </div>
                  <p className="mb-3">
                    Your trusted platform for managing patient appointments online. 
                    We help administrators maintain a smooth healthcare platform.
                  </p>
                  <div className="d-flex">
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-facebook"></i>
                    </a>
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6 mb-4">
                  <h6 className="mb-3" style={{ color: classicGold }}>Quick Links</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <Link to="/" className="text-light text-decoration-none">Home</Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/admin-dashboard" className="text-light text-decoration-none">Admin Dashboard</Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/profile" className="text-light text-decoration-none">My Profile</Link>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">System Settings</a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-2 col-md-6 mb-4">
                  <h6 className="mb-3" style={{ color: classicGold }}>Management</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">User Management</a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">System Analytics</a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">Security Settings</a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-light text-decoration-none">Platform Reports</a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 mb-4">
                  <h6 className="mb-3" style={{ color: classicGold }}>Contact Information</h6>
                  <div className="mb-3">
                    <i className="fas fa-map-marker-alt me-2" style={{ color: classicGold }}></i>
                    <span>123 Healthcare Street, Medical District, City</span>
                  </div>
                  <div className="mb-3">
                    <i className="fas fa-phone me-2" style={{ color: classicGold }}></i>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="mb-3">
                    <i className="fas fa-envelope me-2" style={{ color: classicGold }}></i>
                    <span>support@doctorbooking.com</span>
                  </div>
                  <div className="mb-3">
                    <i className="fas fa-clock me-2" style={{ color: classicGold }}></i>
                    <span>24/7 Support Available</span>
                  </div>
                </div>
              </div>
              <hr style={{ borderColor: classicGold, opacity: 0.3 }} />
              <div className="row align-items-center">
                <div className="col-md-6 text-center text-md-start">
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} MediConnect. All rights reserved.
                  </p>
                </div>
                <div className="col-md-6 text-center text-md-end">
                  <div className="small">
                    <a href="#" className="text-light text-decoration-none me-3">Privacy Policy</a>
                    <a href="#" className="text-light text-decoration-none me-3">Terms of Service</a>
                    <a href="#" className="text-light text-decoration-none">Cookie Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      );
    }
  }

  // Not logged in: show the default home page
  return (
    <div style={{ background: classicWhite, minHeight: '100vh' }} className="d-flex flex-column justify-content-between">
      {/* Hero Section */}
      <div style={{ background: classicNavy }} className="text-white py-5 rounded-bottom shadow-sm mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Book Your Doctor Appointment Online
              </h1>
              <p className="lead mb-4">
                Find and book appointments with qualified doctors in your area.<br />
                Quick, easy, and convenient healthcare at your fingertips.
              </p>
              <Link to="/doctors" className="btn btn-lg me-3 shadow-sm"
                style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
                <i className="fas fa-search me-2"></i>Find Doctors
              </Link>
              <Link to="/register" className="btn btn-outline-light btn-lg shadow-sm"
                style={{ borderColor: classicGold, color: classicGold, fontWeight: 600 }}>
                <i className="fas fa-user-plus me-2"></i>Get Started
              </Link>
            </div>
            <div className="col-lg-6 text-center">
              <i className="fas fa-user-md" style={{ fontSize: '8rem', opacity: 0.18, color: classicGold }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-4" style={{ background: classicGold }}>
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-3">
              <div className="d-flex flex-column align-items-center">
                <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>500+</h3>
                <small style={{ color: classicNavy, fontWeight: 600 }}>Qualified Doctors</small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-flex flex-column align-items-center">
                <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>10,000+</h3>
                <small style={{ color: classicNavy, fontWeight: 600 }}>Happy Patients</small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-flex flex-column align-items-center">
                <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>50+</h3>
                <small style={{ color: classicNavy, fontWeight: 600 }}>Specializations</small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-flex flex-column align-items-center">
                <h3 className="fw-bold mb-0" style={{ color: classicNavy }}>24/7</h3>
                <small style={{ color: classicNavy, fontWeight: 600 }}>Support Available</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Why Choose Our Platform?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                <div className="card-body text-center">
                  <i className="fas fa-clock mb-3" style={{ fontSize: '3rem', color: classicGold }}></i>
                  <h5 className="card-title" style={{ color: classicNavy }}>24/7 Booking</h5>
                  <p className="card-text">
                    Book appointments anytime, anywhere. No need to wait for office hours.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                <div className="card-body text-center">
                  <i className="fas fa-user-md mb-3" style={{ fontSize: '3rem', color: classicGold }}></i>
                  <h5 className="card-title" style={{ color: classicNavy }}>Qualified Doctors</h5>
                  <p className="card-text">
                    Connect with experienced and certified healthcare professionals.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                <div className="card-body text-center">
                  <i className="fas fa-mobile-alt mb-3" style={{ fontSize: '3rem', color: classicGold }}></i>
                  <h5 className="card-title" style={{ color: classicNavy }}>Easy Management</h5>
                  <p className="card-text">
                    Manage your appointments, view history, and get reminders easily.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specializations Section */}
      <div className="py-5" style={{ background: '#f8f9fa', borderBottom: `2px solid ${classicGold}` }}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Our Medical Specializations</h2>
          <div className="row">
            <div className="col-md-3 col-6 mb-4 text-center">
              <div className="p-3">
                <i className="fas fa-heart mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                <h6 style={{ color: classicNavy }}>Cardiology</h6>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4 text-center">
              <div className="p-3">
                <i className="fas fa-brain mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                <h6 style={{ color: classicNavy }}>Neurology</h6>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4 text-center">
              <div className="p-3">
                <i className="fas fa-baby mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                <h6 style={{ color: classicNavy }}>Pediatrics</h6>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4 text-center">
              <div className="p-3">
                <i className="fas fa-eye mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                <h6 style={{ color: classicNavy }}>Ophthalmology</h6>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4 text-center">
              <div className="p-3">
                <i className="fas fa-tooth mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                <h6 style={{ color: classicNavy }}>Dentistry</h6>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4 text-center">
              <div className="p-3">
                <i className="fas fa-bone mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                <h6 style={{ color: classicNavy }}>Orthopedics</h6>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4 text-center">
              <div className="p-3">
                <i className="fas fa-lungs mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                <h6 style={{ color: classicNavy }}>Pulmonology</h6>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4 text-center">
              <div className="p-3">
                <i className="fas fa-stomach mb-3" style={{ fontSize: '2.5rem', color: classicGold }}></i>
                <h6 style={{ color: classicNavy }}>Gastroenterology</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>How It Works</h2>
          <div className="row">
            <div className="col-md-3 text-center mb-4">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                   style={{ width: '60px', height: '60px', fontWeight: 600, fontSize: '1.5rem', background: classicGold, color: classicNavy }}>
                <span>1</span>
              </div>
              <h5 style={{ color: classicNavy }}>Find a Doctor</h5>
              <p>Browse through our list of qualified doctors and specialists.</p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                   style={{ width: '60px', height: '60px', fontWeight: 600, fontSize: '1.5rem', background: classicGold, color: classicNavy }}>
                <span>2</span>
              </div>
              <h5 style={{ color: classicNavy }}>Choose Time</h5>
              <p>Select a convenient date and time slot for your appointment.</p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                   style={{ width: '60px', height: '60px', fontWeight: 600, fontSize: '1.5rem', background: classicGold, color: classicNavy }}>
                <span>3</span>
              </div>
              <h5 style={{ color: classicNavy }}>Book Appointment</h5>
              <p>Confirm your booking and receive instant confirmation.</p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                   style={{ width: '60px', height: '60px', fontWeight: 600, fontSize: '1.5rem', background: classicGold, color: classicNavy }}>
                <span>4</span>
              </div>
              <h5 style={{ color: classicNavy }}>Get Care</h5>
              <p>Visit your doctor and receive quality healthcare.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-5" style={{ background: '#f8f9fa', borderBottom: `2px solid ${classicGold}` }}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>What Our Patients Say</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                  </div>
                  <p className="card-text mb-3">
                    "Excellent platform! Found my cardiologist easily and the booking process was seamless. Highly recommended!"
                  </p>
                  <h6 style={{ color: classicNavy }}>Sarah Johnson</h6>
                  <small className="text-muted">Patient</small>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                  </div>
                  <p className="card-text mb-3">
                    "The reminder system is fantastic. Never missed an appointment since I started using this platform."
                  </p>
                  <h6 style={{ color: classicNavy }}>Michael Chen</h6>
                  <small className="text-muted">Patient</small>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                    <i className="fas fa-star" style={{ color: classicGold }}></i>
                  </div>
                  <p className="card-text mb-3">
                    "As a doctor, this platform has made managing my practice so much easier. Great for both doctors and patients."
                  </p>
                  <h6 style={{ color: classicNavy }}>Dr. Emily Rodriguez</h6>
                  <small className="text-muted">Cardiologist</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold" style={{ color: classicNavy }}>Advanced Features</h2>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-shield-alt me-3" style={{ fontSize: '2rem', color: classicGold }}></i>
                    <h5 className="card-title mb-0" style={{ color: classicNavy }}>Secure & Private</h5>
                  </div>
                  <p className="card-text">
                    Your health information is protected with bank-level security. All data is encrypted and HIPAA compliant.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-mobile-alt me-3" style={{ fontSize: '2rem', color: classicGold }}></i>
                    <h5 className="card-title mb-0" style={{ color: classicNavy }}>Mobile Friendly</h5>
                  </div>
                  <p className="card-text">
                    Access our platform from any device. Book appointments on your phone, tablet, or computer.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-bell me-3" style={{ fontSize: '2rem', color: classicGold }}></i>
                    <h5 className="card-title mb-0" style={{ color: classicNavy }}>Smart Reminders</h5>
                  </div>
                  <p className="card-text">
                    Get timely notifications about your appointments. Never miss an important medical visit again.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{ background: classicWhite }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-chart-line me-3" style={{ fontSize: '2rem', color: classicGold }}></i>
                    <h5 className="card-title mb-0" style={{ color: classicNavy }}>Health Tracking</h5>
                  </div>
                  <p className="card-text">
                    Keep track of your medical history and appointments. View your health journey over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-5" style={{ background: classicWhite, borderBottom: `2px solid ${classicGold}` }}>
        <div className="container text-center">
          <h2 className="mb-4 fw-bold" style={{ color: classicNavy }}>Ready to Get Started?</h2>
          <p className="lead mb-4">
            Join thousands of patients who trust our platform for their healthcare needs.
          </p>
          <Link to="/register" className="btn btn-lg me-3 shadow" style={{ background: classicGold, color: classicNavy, border: 'none', fontWeight: 600 }}>
            <i className="fas fa-user-plus me-2"></i>Register Now
          </Link>
          <Link to="/doctors" className="btn btn-outline-primary btn-lg shadow" style={{ borderColor: classicGold, color: classicGold, fontWeight: 600 }}>
            <i className="fas fa-search me-2"></i>Browse Doctors
          </Link>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer style={{ background: classicNavy }} className="text-light py-5 mt-auto">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-stethoscope fa-2x me-3" style={{ color: classicGold }}></i>
                <h4 className="mb-0" style={{ color: classicGold }}>MediConnect</h4>
              </div>
              <p className="mb-3">
                Your trusted platform for booking doctor appointments online. 
                We connect patients with qualified healthcare professionals for better health outcomes.
              </p>
              <div className="d-flex">
                <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="me-3" style={{ color: classicGold, fontSize: '1.5rem' }}>
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="mb-3" style={{ color: classicGold }}>Quick Links</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="text-light text-decoration-none">Home</Link>
                </li>
                <li className="mb-2">
                  <Link to="/doctors" className="text-light text-decoration-none">Find Doctors</Link>
                </li>
                <li className="mb-2">
                  <Link to="/register" className="text-light text-decoration-none">Register</Link>
                </li>
                <li className="mb-2">
                  <Link to="/login" className="text-light text-decoration-none">Login</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="mb-3" style={{ color: classicGold }}>Services</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-light text-decoration-none">Cardiology</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light text-decoration-none">Neurology</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light text-decoration-none">Pediatrics</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light text-decoration-none">Dentistry</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 mb-4">
              <h6 className="mb-3" style={{ color: classicGold }}>Contact Information</h6>
              <div className="mb-3">
                <i className="fas fa-map-marker-alt me-2" style={{ color: classicGold }}></i>
                <span>123 Healthcare Street, Medical District, City</span>
              </div>
              <div className="mb-3">
                <i className="fas fa-phone me-2" style={{ color: classicGold }}></i>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="mb-3">
                <i className="fas fa-envelope me-2" style={{ color: classicGold }}></i>
                <span>support@doctorbooking.com</span>
              </div>
              <div className="mb-3">
                <i className="fas fa-clock me-2" style={{ color: classicGold }}></i>
                <span>24/7 Support Available</span>
              </div>
            </div>
          </div>
          <hr style={{ borderColor: classicGold, opacity: 0.3 }} />
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0">
                &copy; {new Date().getFullYear()} MediConnect. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="small">
                <a href="#" className="text-light text-decoration-none me-3">Privacy Policy</a>
                <a href="#" className="text-light text-decoration-none me-3">Terms of Service</a>
                <a href="#" className="text-light text-decoration-none">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 