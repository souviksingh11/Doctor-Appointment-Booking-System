import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    available: 'true'
  });

  useEffect(() => {
    fetchDoctors();
  }, []); // Only fetch on component mount

  const fetchDoctors = async (searchFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchFilters.specialization) params.append('specialization', searchFilters.specialization);
      if (searchFilters.available) params.append('available', searchFilters.available);
      const response = await axios.get(`http://localhost:5000/api/doctors?${params}`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({
      ...filters,
      specialization: searchInput
    });
    fetchDoctors({
      ...filters,
      specialization: searchInput
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
    fetchDoctors(newFilters);
  };

  const clearSearch = () => {
    setSearchInput('');
    setFilters({
      ...filters,
      specialization: ''
    });
    fetchDoctors({
      ...filters,
      specialization: ''
    });
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
          <h2 className="fw-bold" style={{ color: classicNavy }}>Find Doctors</h2>
          <div className="d-flex gap-2">
            <div className="input-group" style={{ width: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by specialization..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ borderColor: classicGold }}
              />
              <button
                className="btn"
                onClick={handleSearch}
                style={{ background: classicGold, color: classicNavy, border: 'none' }}
              >
                <i className="fas fa-search"></i>
              </button>
              {searchInput && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={clearSearch}
                  style={{ borderColor: classicGold }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <select
              className="form-select"
              name="available"
              value={filters.available}
              onChange={handleFilterChange}
              style={{ width: '150px', borderColor: classicGold }}
            >
              <option value="true">Available</option>
              <option value="">All Doctors</option>
            </select>
          </div>
        </div>
        {doctors.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-user-md" style={{ fontSize: '4rem', color: classicGold, opacity: 0.7 }}></i>
            <h4 className="mt-3 text-muted">No doctors found</h4>
            <p className="text-muted">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="row">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm border-0" style={{ background: classicWhite }}>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: '50px', height: '50px', background: classicNavy, color: classicGold }}>
                        <i className="fas fa-user-md"></i>
                      </div>
                      <div>
                        <h5 className="card-title mb-1" style={{ color: classicNavy }}>{doctor.name}</h5>
                        <p className="mb-0" style={{ color: classicGold }}>{doctor.specialization}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row small">
                        <div className="col-6" style={{ color: classicNavy }}>
                          <i className="fas fa-graduation-cap me-1"></i>
                          {doctor.education}
                        </div>
                        <div className="col-6" style={{ color: classicNavy }}>
                          <i className="fas fa-clock me-1"></i>
                          {doctor.experience} years
                        </div>
                      </div>
                    </div>
                    {doctor.phone && (
                      <p className="small mb-2" style={{ color: classicNavy }}>
                        <i className="fas fa-phone me-1"></i>
                        {doctor.phone}
                      </p>
                    )}
                    {doctor.consultationFee && (
                      <p className="small mb-2" style={{ color: classicNavy }}>
                        <i className="fas fa-rupee-sign me-1"></i>
                        Consultation Fee: ₹{doctor.consultationFee}
                      </p>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge" style={{ background: doctor.isAvailable ? classicGold : '#ccc', color: classicNavy, fontWeight: 600 }}>
                        {doctor.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                      <Link
                        to={`/book-appointment/${doctor._id}`}
                        className={`btn btn-sm ${!doctor.isAvailable ? 'disabled' : ''}`}
                        style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }}
                      >
                        Book Appointment
                      </Link>
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

export default DoctorList; 