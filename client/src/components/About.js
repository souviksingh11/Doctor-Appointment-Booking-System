import React from 'react';
const classicNavy = '#1a2238';
const classicGold = '#ffbe0b';
const classicWhite = '#fff';

const About = () => (
  <div className="container py-5" style={{ background: classicWhite, minHeight: '80vh' }}>
    <h2 className="fw-bold mb-4" style={{ color: classicNavy }}>About MediConnect</h2>
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <h4 style={{ color: classicGold }}>Our Mission</h4>
        <p style={{ color: classicNavy, fontSize: '1.1rem' }}>
          At <strong>MediConnect</strong>, our mission is to make healthcare accessible, convenient, and efficient for everyone. We connect patients with qualified healthcare professionals and empower doctors and administrators with modern tools to deliver the best care.
        </p>
        <h4 className="mt-4" style={{ color: classicGold }}>How It Works</h4>
        <ul style={{ color: classicNavy }}>
          <li><strong>Patients:</strong> Register, browse doctors, book appointments, manage your health records, and make secure payments online.</li>
          <li><strong>Doctors:</strong> Manage your profile, set consultation fees, view and confirm appointments, and track patient history.</li>
          <li><strong>Admins:</strong> Oversee the platform, manage users, appointments, and ensure a smooth and secure experience for all.</li>
        </ul>
        <h4 className="mt-4" style={{ color: classicGold }}>Key Features</h4>
        <ul style={{ color: classicNavy }}>
          <li>Easy online appointment booking and management</li>
          <li>Role-based dashboards for patients, doctors, and admins</li>
          <li>Secure payment integration</li>
          <li>Real-time notifications and reminders</li>
          <li>Comprehensive appointment and patient history</li>
          <li>Modern, responsive design with a classic color palette</li>
        </ul>
        <h4 className="mt-4" style={{ color: classicGold }}>Security & Privacy</h4>
        <p style={{ color: classicNavy }}>
          We use industry-standard security practices to protect your data. All personal and medical information is encrypted and handled with strict confidentiality.
        </p>
        <h4 className="mt-4" style={{ color: classicGold }}>Why Choose Us?</h4>
        <ul style={{ color: classicNavy }}>
          <li>Trusted by patients and doctors</li>
          <li>24/7 support and assistance</li>
          <li>Continuous improvements and new features</li>
          <li>Commitment to healthcare excellence</li>
        </ul>
        <div className="mt-4">
          <h5 style={{ color: classicGold }}>Have Questions?</h5>
          <p style={{ color: classicNavy }}>
            Visit our <a href="/contact" style={{ color: classicGold, textDecoration: 'underline' }}>Contact</a> page to get in touch with our support team.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default About; 