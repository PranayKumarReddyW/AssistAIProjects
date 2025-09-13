// controllers/TranscriptionController.js
const Transcription = require("../models/TranscriptionModel");

// @desc    Get all transcriptions
// @route   GET /api/transcriptions
// @access  Private (e.g., admin, staff, doctor)
const getTranscriptions = async (req, res) => {
  try {
    // Filtering by consultationId
    const filter = {};
    if (req.query.consultationId) {
      filter.consultationId = req.query.consultationId;
    }
    const transcriptions = await Transcription.find(filter);
    res.status(200).json(transcriptions);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Get single transcription by ID
// @route   GET /api/transcriptions/:id
// @access  Private
const getTranscriptionById = async (req, res) => {
  try {
    const transcription = await Transcription.findById(req.params.id);
    if (!transcription) {
      return res
        .status(404)
        .json({ error: "Transcription not found", code: 404 });
    }
    res.status(200).json(transcription);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Create new transcription
// @route   POST /api/transcriptions
// @access  Private
const createTranscription = async (req, res) => {
  try {
    const transcription = new Transcription(req.body);
    const createdTranscription = await transcription.save();
    res.status(201).json(createdTranscription);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Update transcription
// @route   PUT /api/transcriptions/:id
// @access  Private
const updateTranscription = async (req, res) => {
  try {
    const transcription = await Transcription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on update
      }
    );
    if (!transcription) {
      return res
        .status(404)
        .json({ error: "Transcription not found", code: 404 });
    }
    res.status(200).json(transcription);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Delete transcription
// @route   DELETE /api/transcriptions/:id
// @access  Private
const deleteTranscription = async (req, res) => {
  try {
    const transcription = await Transcription.findByIdAndDelete(req.params.id);
    if (!transcription) {
      return res
        .status(404)
        .json({ error: "Transcription not found", code: 404 });
    }
    res.status(200).json({ message: "Transcription removed" });
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

module.exports = {
  getTranscriptions,
  getTranscriptionById,
  createTranscription,
  updateTranscription,
  deleteTranscription,
};
