// controllers/PatientController.js
const Patient = require("../models/PatientModel");

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (e.g., admin, staff, doctor)
const getPatients = async (req, res) => {
  try {
    // Implement filtering, pagination, sorting based on req.query
    const patients = await Patient.find({});
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Get single patient by ID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found", code: 404 });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const createdPatient = await patient.save();
    res.status(201).json(createdPatient);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found", code: 404 });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found", code: 404 });
    }
    res.status(200).json({ message: "Patient removed" });
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
