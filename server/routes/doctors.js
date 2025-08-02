const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get doctor's appointments (MUST be before /:id)
router.get('/appointments', authenticateJWT, authorizeRoles('doctor'), async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = { doctor: req.user._id };

    if (status) {
      query.status = status;
    }

    if (date) {
      const selectedDate = new Date(date);
      query.date = {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .sort({ date: 1, timeSlot: 1, createdAt: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { specialization, available } = req.query;
    let query = { role: 'doctor' };
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    if (available === 'true') {
      query.isAvailable = true;
    }
    const doctors = await User.find(query)
      .select('-password')
      .sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' })
      .select('-password');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor's available time slots
router.get('/:id/availability', async (req, res) => {
  try {
    const { date } = req.query;
    const doctorId = req.params.id;
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.json({ availableSlots: [] });
    }
    const allTimeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30'
    ];
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['pending', 'confirmed'] }
    });
    const bookedTimeSlots = bookedAppointments.map(app => app.timeSlot);
    const availableSlots = allTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));
    res.json({ availableSlots });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor profile (only by the doctor themselves)
router.put('/profile', authenticateJWT, authorizeRoles('doctor'), async (req, res) => {
  try {
    console.log('Doctor profile update request received:', req.body);
    console.log('Doctor ID:', req.user._id);
    
    const updates = req.body;
    const allowedUpdates = [
      'name', 'phone', 'specialization', 'experience', 
      'education', 'licenseNumber', 'isAvailable', 'profileImage', 'consultationFee'
    ];
    const filteredUpdates = {};
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });
    
    console.log('Filtered doctor updates:', filteredUpdates);
    
    const doctor = await User.findByIdAndUpdate(
      req.user._id,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password');
    
    console.log('Updated doctor:', doctor);
    res.json(doctor);
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 