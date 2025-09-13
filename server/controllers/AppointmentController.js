// controllers/AppointmentController.js
const Appointment = require("../models/AppointmentModel");

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (e.g., admin, staff, doctor)
const getAppointments = async (req, res) => {
  try {
    // Implement filtering, pagination, sorting based on req.query
    const appointments = await Appointment.find({});
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res
        .status(404)
        .json({ error: "Appointment not found", code: 404 });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on update
      }
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ error: "Appointment not found", code: 404 });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res
        .status(404)
        .json({ error: "Appointment not found", code: 404 });
    }
    res.status(200).json({ message: "Appointment removed" });
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
