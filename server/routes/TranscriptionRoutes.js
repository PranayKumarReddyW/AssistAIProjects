// routes/TranscriptionRoutes.js
const express = require('express');
const router = express.Router();
const {
    getTranscriptions,
    getTranscriptionById,
    createTranscription,
    updateTranscription,
    deleteTranscription
} = require('../controllers/TranscriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Define API routes for Transcription
router.route('/').get(protect, getTranscriptions).post(protect, createTranscription);
router.route('/:id').get(protect, getTranscriptionById).put(protect, updateTranscription).delete(protect, deleteTranscription);

// Example of role-based access for some routes
// router.route('/').get(protect, authorize(['admin', 'doctor', 'staff']), getTranscriptions);
// router.route('/:id').delete(protect, authorize(['admin']), deleteTranscription);

module.exports = router;
