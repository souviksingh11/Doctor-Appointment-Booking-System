const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Book an appointment
router.post('/', authenticateJWT, authorizeRoles('patient'), async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason, symptoms } = req.body;

    // Validate required fields
    if (!doctorId || !date || !timeSlot || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if doctor exists and is available
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor', isAvailable: true });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found or not available' });
    }

    // Check if the selected date is not in the past
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return res.status(400).json({ message: 'Cannot book appointments in the past' });
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: appointmentDate,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date: appointmentDate,
      timeSlot,
      reason,
      symptoms,
      consultationFee: doctor.consultationFee
    });

    await appointment.save();

    // Populate doctor details
    await appointment.populate('doctor', 'name specialization');

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient's appointments
router.get('/my-appointments', authenticateJWT, authorizeRoles('patient'), async (req, res) => {
  try {
    const { status } = req.query;
    let query = { patient: req.user._id };

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialization')
      .populate('patient', 'name email phone')
      .sort({ date: 1, timeSlot: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointment by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization phone');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission to view this appointment
    if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status (doctor only)
router.patch('/:id/status', authenticateJWT, authorizeRoles('doctor'), async (req, res) => {
  try {
    const { status } = req.body;
    const appointmentId = req.params.id;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the appointment belongs to this doctor
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = status;
    await appointment.save();

    await appointment.populate('patient', 'name email phone');

    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment details (doctor only)
router.put('/:id', authenticateJWT, authorizeRoles('doctor'), async (req, res) => {
  try {
    const { notes, prescription, diagnosis, followUpDate } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the appointment belongs to this doctor
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update appointment details
    if (notes !== undefined) appointment.notes = notes;
    if (prescription !== undefined) appointment.prescription = prescription;
    if (diagnosis !== undefined) appointment.diagnosis = diagnosis;
    if (followUpDate !== undefined) appointment.followUpDate = followUpDate;

    await appointment.save();

    await appointment.populate('patient', 'name email phone');

    res.json({
      message: 'Appointment details updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Pay for appointment (patient only)
router.post('/:id/pay', authenticateJWT, authorizeRoles('patient'), async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'name specialization');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the appointment belongs to this patient
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if appointment is confirmed and payment is pending
    if (appointment.status !== 'confirmed' && appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Payment can only be made for confirmed or completed appointments' });
    }

    if (appointment.paymentStatus !== 'pending') {
      return res.status(400).json({ message: 'Payment has already been processed' });
    }

    // Process payment (mock implementation)
    // In a real app, you would integrate with a payment gateway here
    appointment.paymentStatus = 'paid';
    appointment.paymentMethod = paymentMethod || 'online';
    await appointment.save();

    res.json({
      message: 'Payment processed successfully',
      appointment: {
        _id: appointment._id,
        paymentStatus: appointment.paymentStatus,
        paymentMethod: appointment.paymentMethod,
        consultationFee: appointment.consultationFee
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify payment and update appointment
router.post('/:id/verify-payment', authenticateJWT, authorizeRoles('patient'), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the appointment belongs to this patient
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if appointment is confirmed or completed and payment is pending
    if (appointment.status !== 'confirmed' && appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Payment can only be made for confirmed or completed appointments' });
    }

    if (appointment.paymentStatus !== 'pending') {
      return res.status(400).json({ message: 'Payment has already been processed' });
    }

    // For mock payment, just update the status
    // In real implementation, verify payment signature here
    appointment.paymentStatus = 'paid';
    appointment.paymentMethod = 'online';
    await appointment.save();

    res.json({
      message: 'Payment verified and processed successfully',
      appointment: {
        _id: appointment._id,
        paymentStatus: appointment.paymentStatus,
        paymentMethod: appointment.paymentMethod,
        consultationFee: appointment.consultationFee
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

// Cancel appointment (patient only)
router.delete('/:id', authenticateJWT, authorizeRoles('patient'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the appointment belongs to this patient
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if appointment can be cancelled (not completed)
    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 