import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const AdminContactRequests = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/contact-messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      setError('Failed to fetch contact requests.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ background: classicWhite, minHeight: '80vh' }}>
      <h2 className="fw-bold mb-4" style={{ color: classicNavy }}>Contact Requests</h2>
      {loading && <div className="text-center"><div className="spinner-border" style={{ color: classicGold }}></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ background: classicGold, color: classicNavy }}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr><td colSpan="4" className="text-center">No contact requests found.</td></tr>
              ) : messages.map(msg => (
                <tr key={msg._id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminContactRequests; 