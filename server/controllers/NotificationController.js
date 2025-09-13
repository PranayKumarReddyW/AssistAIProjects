// controllers/NotificationController.js
const Notification = require('../models/NotificationModel');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private (e.g., admin, staff, doctor)
const getNotifications = async (req, res) => {
    try {
        // Implement filtering, pagination, sorting based on req.query
        const notifications = await Notification.find({});
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single notification by ID
// @route   GET /api/notifications/:id
// @access  Private
const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new notification
// @route   POST /api/notifications
// @access  Private
const createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        const createdNotification = await notification.save();
        res.status(201).json(createdNotification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update notification
// @route   PUT /api/notifications/:id
// @access  Private
const updateNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update
        });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification
};
