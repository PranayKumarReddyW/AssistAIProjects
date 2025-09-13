// routes/ReportRoutes.js
const express = require('express');
const router = express.Router();
const {
    getReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport
} = require('../controllers/ReportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Define API routes for Report
router.route('/').get(protect, getReports).post(protect, createReport);
router.route('/:id').get(protect, getReportById).put(protect, updateReport).delete(protect, deleteReport);

// Example of role-based access for some routes
// router.route('/').get(protect, authorize(['admin', 'doctor', 'staff']), getReports);
// router.route('/:id').delete(protect, authorize(['admin']), deleteReport);

module.exports = router;
