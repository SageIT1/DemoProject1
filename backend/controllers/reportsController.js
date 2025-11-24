const reportService = require('../services/reportService');

// Get all reports (with filters)
exports.getReports = async (req, res) => {
  try {
    const { from, to, status, category } = req.query;
    const reports = await reportService.getReports({ from, to, status, category });
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
};

// Get single report by ID
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await reportService.getReportById(id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch report details' });
  }
};

// reports/controllers/reportsController.js
const Report = require('../models/reportModel');

async function searchReports(req, res) {
  try {
    const {
      searchTerm = "",
      category = "",
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    // Build query
    const query = {};
    if (searchTerm) query.title = { $regex: searchTerm, $options: "i" }; // case-insensitive search
    if (category && category !== "all") query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query (DB handles filtering + sorting)
    const reports = await Report.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: reports,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
exports.getReports = async (req, res) => {
  try {
    // Simulate DB call
    const reports = [
      { id: 1, title: "Q1 Performance", category: "Finance" },
      { id: 2, title: "System Audit", category: "Operations" },
    ];

    res.json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

exports.exportReports = async (req, res) => {
  try {
    // Placeholder for export logic
    res.json({ message: "Export started successfully" });
  } catch (error) {
    console.error("Error exporting reports:", error);
    res.status(500).json({ message: "Failed to export reports" });
  }
};
// reports/controllers/reportsController.js
const reportsService = require('../services/reportsService');

/**
 * GET /reports
 * Fetch all reports with optional filters
 */
async function getReportsController(req, res) {
  try {
    const { category, startDate, endDate } = req.query;

    const reports = await reportsService.getReports({ category, startDate, endDate });

    res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: reports
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

module.exports = {
  getReportsController
  searchReports
};
