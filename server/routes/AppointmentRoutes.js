// routes/AppointmentRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
} = require('../controllers/AppointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Define API routes for Appointment
router.route('/').get(protect, getAppointments).post(protect, createAppointment);
router.route('/:id').get(protect, getAppointmentById).put(protect, updateAppointment).delete(protect, deleteAppointment);

// Example of role-based access for some routes
// router.route('/').get(protect, authorize(['admin', 'doctor', 'staff']), getAppointments);
// router.route('/:id').delete(protect, authorize(['admin']), deleteAppointment);

module.exports = router;
