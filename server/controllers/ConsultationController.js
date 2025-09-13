// controllers/ConsultationController.js
const Consultation = require("../models/ConsultationModel");

// @desc    Get all consultations
// @route   GET /api/consultations
// @access  Private (e.g., admin, staff, doctor)
const getConsultations = async (req, res) => {
  try {
    // Filtering by patientId (and optionally doctorId)
    const filter = {};
    if (req.query.patientId) {
      filter.patientId = req.query.patientId;
    }
    if (req.query.doctorId) {
      filter.doctorId = req.query.doctorId;
    }
    const consultations = await Consultation.find(filter);
    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Get single consultation by ID
// @route   GET /api/consultations/:id
// @access  Private
const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res
        .status(404)
        .json({ error: "Consultation not found", code: 404 });
    }
    res.status(200).json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Create new consultation
// @route   POST /api/consultations
// @access  Private
const createConsultation = async (req, res) => {
  try {
    const consultation = new Consultation(req.body);
    const createdConsultation = await consultation.save();
    res.status(201).json(createdConsultation);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Update consultation
// @route   PUT /api/consultations/:id
// @access  Private
const updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on update
      }
    );
    if (!consultation) {
      return res
        .status(404)
        .json({ error: "Consultation not found", code: 404 });
    }
    res.status(200).json(consultation);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Delete consultation
// @route   DELETE /api/consultations/:id
// @access  Private
const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!consultation) {
      return res
        .status(404)
        .json({ error: "Consultation not found", code: 404 });
    }
    res.status(200).json({ message: "Consultation removed" });
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

module.exports = {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
};
