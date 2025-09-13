// routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/UserController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Define API routes for User
router.route('/').get(protect, getUsers).post(protect, createUser);
router.route('/:id').get(protect, getUserById).put(protect, updateUser).delete(protect, deleteUser);

// Example of role-based access for some routes
// router.route('/').get(protect, authorize(['admin', 'doctor', 'staff']), getUsers);
// router.route('/:id').delete(protect, authorize(['admin']), deleteUser);

module.exports = router;
