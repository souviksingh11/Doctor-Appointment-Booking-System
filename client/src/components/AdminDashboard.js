import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/doctors'),
        axios.get('http://localhost:5000/api/admin/patients'),
      ]);
      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
    } catch (err) {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/${type}/${id}`);
      fetchAll();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Delete failed';
      alert(errorMessage);
    }
  };

  // Filtered lists
  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    doc.email.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    (doc.specialization && doc.specialization.toLowerCase().includes(doctorSearch.toLowerCase()))
  );
  const filteredPatients = patients.filter(pat =>
    pat.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    pat.email.toLowerCase().includes(patientSearch.toLowerCase())
  );

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" style={{ color: classicGold }}></div></div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div style={{ background: classicWhite, minHeight: '100vh' }} className="py-5">
      <div className="container">
        <h2 className="mb-4 fw-bold" style={{ color: classicNavy }}>Admin Dashboard</h2>
        <div className="row">
          {/* Doctors Table */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h4 className="fw-bold mb-3" style={{ color: classicNavy }}>Doctors</h4>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search doctors by name, email, or specialization"
                  value={doctorSearch}
                  onChange={e => setDoctorSearch(e.target.value)}
                  style={{ borderColor: classicGold }}
                />
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  <table className="table table-hover align-middle">
                    <thead style={{ background: classicGold, color: classicNavy }}>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Specialization</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDoctors.length === 0 ? (
                        <tr><td colSpan="4" className="text-center">No doctors found.</td></tr>
                      ) : filteredDoctors.map(doc => (
                        <tr key={doc._id}>
                          <td>{doc.name}</td>
                          <td>{doc.email}</td>
                          <td>{doc.specialization || <span className="text-muted">-</span>}</td>
                          <td>
                            <button
                              className="btn btn-sm"
                              style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }}
                              onClick={() => handleDelete('doctors', doc._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* Patients Table */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h4 className="fw-bold mb-3" style={{ color: classicNavy }}>Patients</h4>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search patients by name or email"
                  value={patientSearch}
                  onChange={e => setPatientSearch(e.target.value)}
                  style={{ borderColor: classicGold }}
                />
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  <table className="table table-hover align-middle">
                    <thead style={{ background: classicGold, color: classicNavy }}>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.length === 0 ? (
                        <tr><td colSpan="3" className="text-center">No patients found.</td></tr>
                      ) : filteredPatients.map(pat => (
                        <tr key={pat._id}>
                          <td>{pat.name}</td>
                          <td>{pat.email}</td>
                          <td>
                            <button
                              className="btn btn-sm"
                              style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }}
                              onClick={() => handleDelete('patients', pat._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 