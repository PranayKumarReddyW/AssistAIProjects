// controllers/SettingsController.js
const Settings = require('../models/SettingsModel');

// @desc    Get all settingss
// @route   GET /api/settingss
// @access  Private (e.g., admin, staff, doctor)
const getSettingss = async (req, res) => {
    try {
        // Implement filtering, pagination, sorting based on req.query
        const settingss = await Settings.find({});
        res.status(200).json(settingss);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single settings by ID
// @route   GET /api/settingss/:id
// @access  Private
const getSettingsById = async (req, res) => {
    try {
        const settings = await Settings.findById(req.params.id);
        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new settings
// @route   POST /api/settingss
// @access  Private
const createSettings = async (req, res) => {
    try {
        const settings = new Settings(req.body);
        const createdSettings = await settings.save();
        res.status(201).json(createdSettings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update settings
// @route   PUT /api/settingss/:id
// @access  Private
const updateSettings = async (req, res) => {
    try {
        const settings = await Settings.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update
        });
        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete settings
// @route   DELETE /api/settingss/:id
// @access  Private
const deleteSettings = async (req, res) => {
    try {
        const settings = await Settings.findByIdAndDelete(req.params.id);
        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }
        res.status(200).json({ message: 'Settings removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettingss,
    getSettingsById,
    createSettings,
    updateSettings,
    deleteSettings
};
