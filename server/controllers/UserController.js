// controllers/UserController.js
const User = require("../models/UserModel");

// @desc    Get all users
// @route   GET /api/users
// @access  Private (e.g., admin, staff, doctor)
const getUsers = async (req, res) => {
  try {
    // Implement filtering, pagination, sorting based on req.query
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found", code: 404 });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });
    if (!user) {
      return res.status(404).json({ error: "User not found", code: 404 });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found", code: 404 });
    }
    res.status(200).json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
