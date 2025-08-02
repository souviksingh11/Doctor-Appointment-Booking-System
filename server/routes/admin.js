const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all doctors
router.get('/doctors', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password').sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all patients
router.get('/patients', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments
router.get('/appointments', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialization')
      .sort({ date: 1, timeSlot: 1, createdAt: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete doctor
router.delete('/doctors/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id, role: 'doctor' });
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete patient
router.delete('/patients/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id, role: 'patient' });
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete appointment
router.delete('/appointments/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if appointment can be deleted (only pending appointments can be deleted)
    if (appointment.status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot delete appointment. Current status is '${appointment.status}'. Only pending appointments can be deleted.` 
      });
    }
    
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status
router.patch('/appointments/:id/status', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if appointment can be modified (only pending appointments can be changed)
    if (appointment.status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot modify appointment. Current status is '${appointment.status}'. Only pending appointments can be modified.` 
      });
    }
    
    // Validate the new status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    appointment.status = status;
    await appointment.save();
    res.json({ message: 'Status updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 