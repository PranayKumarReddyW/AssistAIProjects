// controllers/ReportController.js
const Report = require("../models/ReportModel");

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private (e.g., admin, staff, doctor)
const getReports = async (req, res) => {
  try {
    // Filtering by patientId (and optionally doctorId)
    const filter = {};
    if (req.query.patientId) {
      filter.patientId = req.query.patientId;
    }
    if (req.query.doctorId) {
      filter.doctorId = req.query.doctorId;
    }
    const reports = await Report.find(filter);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found", code: 404 });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const report = new Report(req.body);
    const createdReport = await report.save();
    res.status(201).json(createdReport);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });
    if (!report) {
      return res.status(404).json({ error: "Report not found", code: 404 });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message, code: 400 });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found", code: 404 });
    }
    res.status(200).json({ message: "Report removed" });
  } catch (error) {
    res.status(500).json({ error: error.message, code: 500 });
  }
};

module.exports = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
};
