// routes/PatientRoutes.js
const express = require('express');
const router = express.Router();
const {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
} = require('../controllers/PatientController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Define API routes for Patient
router.route('/').get(protect, getPatients).post(protect, createPatient);
router.route('/:id').get(protect, getPatientById).put(protect, updatePatient).delete(protect, deletePatient);

// Example of role-based access for some routes
// router.route('/').get(protect, authorize(['admin', 'doctor', 'staff']), getPatients);
// router.route('/:id').delete(protect, authorize(['admin']), deletePatient);

module.exports = router;
