// routes/ConsultationRoutes.js
const express = require('express');
const router = express.Router();
const {
    getConsultations,
    getConsultationById,
    createConsultation,
    updateConsultation,
    deleteConsultation
} = require('../controllers/ConsultationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Define API routes for Consultation
router.route('/').get(protect, getConsultations).post(protect, createConsultation);
router.route('/:id').get(protect, getConsultationById).put(protect, updateConsultation).delete(protect, deleteConsultation);

// Example of role-based access for some routes
// router.route('/').get(protect, authorize(['admin', 'doctor', 'staff']), getConsultations);
// router.route('/:id').delete(protect, authorize(['admin']), deleteConsultation);

module.exports = router;
