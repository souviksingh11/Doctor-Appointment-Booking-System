const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// POST /api/contact-messages - anyone can submit
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// GET /api/contact-messages - admin only
router.get('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});

module.exports = router; 