// routes/NotificationRoutes.js
const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification
} = require('../controllers/NotificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Define API routes for Notification
router.route('/').get(protect, getNotifications).post(protect, createNotification);
router.route('/:id').get(protect, getNotificationById).put(protect, updateNotification).delete(protect, deleteNotification);

// Example of role-based access for some routes
// router.route('/').get(protect, authorize(['admin', 'doctor', 'staff']), getNotifications);
// router.route('/:id').delete(protect, authorize(['admin']), deleteNotification);

module.exports = router;
