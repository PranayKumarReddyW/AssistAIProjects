// routes/SettingsRoutes.js
const express = require('express');
const router = express.Router();
const {
    getSettingss,
    getSettingsById,
    createSettings,
    updateSettings,
    deleteSettings
} = require('../controllers/SettingsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Define API routes for Settings
router.route('/').get(protect, getSettingss).post(protect, createSettings);
router.route('/:id').get(protect, getSettingsById).put(protect, updateSettings).delete(protect, deleteSettings);

// Example of role-based access for some routes
// router.route('/').get(protect, authorize(['admin', 'doctor', 'staff']), getSettingss);
// router.route('/:id').delete(protect, authorize(['admin']), deleteSettings);

module.exports = router;
