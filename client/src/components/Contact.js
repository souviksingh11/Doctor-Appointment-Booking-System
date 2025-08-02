import React, { useState } from 'react';
import axios from 'axios';
const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await axios.post('http://localhost:5000/api/contact-messages', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ background: classicWhite, minHeight: '80vh' }}>
      <h2 className="fw-bold mb-4" style={{ color: classicNavy }}>Contact Us</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 style={{ color: classicGold }}>Contact Information</h5>
              <p style={{ color: classicNavy }}><i className="fas fa-map-marker-alt me-2"></i>123 Healthcare Street, Medical District, City</p>
              <p style={{ color: classicNavy }}><i className="fas fa-phone me-2"></i>+1 (555) 123-4567</p>
              <p style={{ color: classicNavy }}><i className="fas fa-envelope me-2"></i>support@mediconnect.com</p>
              <p style={{ color: classicNavy }}><i className="fas fa-clock me-2"></i>24/7 Support Available</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 style={{ color: classicGold }}>Send Us a Message</h5>
              {status === 'success' && <div className="alert alert-success">Message sent successfully!</div>}
              {status === 'error' && <div className="alert alert-danger">Failed to send message. Please try again.</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ color: classicNavy }}>Your Name</label>
                  <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: classicNavy }}>Your Email</label>
                  <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: classicNavy }}>Message</label>
                  <textarea className="form-control" name="message" rows="4" value={form.message} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="btn" style={{ background: classicGold, color: classicNavy, fontWeight: 600, border: 'none' }} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact; 