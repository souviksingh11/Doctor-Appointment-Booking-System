const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, specialization, experience, education, licenseNumber, consultationFee, adminCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate admin code if registering as admin
    if (role === 'admin') {
      const correctAdminCode = process.env.ADMIN_CODE || 'ADMIN2024';
      if (!adminCode || adminCode !== correctAdminCode) {
        return res.status(400).json({ message: 'Invalid admin code. Please contact system administrator.' });
      }
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role: role || 'patient',
      phone,
      ...(role === 'doctor' && {
        specialization,
        experience,
        education,
        licenseNumber,
        consultationFee
      }),
      ...(role === 'admin' && {
        adminCode
      })
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, adminCode, role } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is trying to login as admin
    if (role === 'admin') {
      // Verify the user is actually an admin
      if (user.role !== 'admin') {
        return res.status(400).json({ message: 'You are not authorized to login as admin' });
      }
      
      // Check admin code if user is admin
      const correctAdminCode = process.env.ADMIN_CODE || 'ADMIN2024';
      if (!adminCode || adminCode !== correctAdminCode) {
        return res.status(400).json({ message: 'Invalid admin code. Please contact system administrator.' });
      }
    } else if (role === 'patient') {
      // Verify the user is actually a patient
      if (user.role !== 'patient') {
        return res.status(400).json({ message: 'You are not authorized to login as patient' });
      }
    } else if (role === 'doctor') {
      // Verify the user is actually a doctor
      if (user.role !== 'doctor') {
        return res.status(400).json({ message: 'You are not authorized to login as doctor' });
      }
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateJWT, async (req, res) => {
  try {
    console.log('Profile update request received:', req.body);
    console.log('User ID:', req.user._id);
    
    const updates = req.body;
    const allowedUpdates = [
      'name', 'email', 'phone', 'dateOfBirth', 'gender', 'address'
    ];
    
    const filteredUpdates = {};
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });
    
    console.log('Filtered updates:', filteredUpdates);
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password');
    
    console.log('Updated user:', user);
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 