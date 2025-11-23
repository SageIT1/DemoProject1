// Mock data (replace with DB integration)
const reports = [
  { id: 1, title: 'Finance Report Q1', status: 'open', category: 'finance', date: '2025-11-01' },
  { id: 2, title: 'Ops Report October', status: 'closed', category: 'ops', date: '2025-10-25' },
  { id: 3, title: 'Finance Report Q2', status: 'open', category: 'finance', date: '2025-11-05' },
  { id: 4, title: 'Ops Report November', status: 'open', category: 'ops', date: '2025-11-10' },
];

// Constants for validation
const VALID_STATUSES = ['open', 'closed', 'all'];
const VALID_CATEGORIES = ['finance', 'ops', 'all'];
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

// Utility: Validate and parse date
const parseDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date;
};

// Utility: Normalize date to UTC midnight
const normalizeToUTC = (date) => {
  if (!date) return null;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

// Utility: Validate status
const validateStatus = (status) => {
  if (!status) return 'all';
  const normalized = status.toLowerCase();
  if (!VALID_STATUSES.includes(normalized)) {
    throw new Error(`Invalid status: ${status}. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  return normalized;
};

// Utility: Validate category
const validateCategory = (category) => {
  if (!category) return 'all';
  const normalized = category.toLowerCase();
  if (!VALID_CATEGORIES.includes(normalized)) {
    throw new Error(`Invalid category: ${category}. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }
  return normalized;
};

// Utility: Validate and parse pagination parameters
const validatePagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || DEFAULT_PAGE_SIZE;

  if (pageNum < 1) {
    throw new Error('Page number must be greater than or equal to 1');
  }

  if (limitNum < 1 || limitNum > MAX_PAGE_SIZE) {
    throw new Error(`Limit must be between 1 and ${MAX_PAGE_SIZE}`);
  }

  return { page: pageNum, limit: limitNum };
};

// Filter and fetch reports with validation and pagination
exports.getReports = async ({ from, to, status, category, page, limit }) => {
  try {
    // Validate and normalize inputs
    const fromDate = normalizeToUTC(parseDate(from));
    const toDate = normalizeToUTC(parseDate(to));
    const validatedStatus = validateStatus(status);
    const validatedCategory = validateCategory(category);
    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);

    // Validate date range
    if (fromDate && toDate && fromDate > toDate) {
      throw new Error('"from" date must be before or equal to "to" date');
    }

    // Apply filters
    let filtered = [...reports];

    if (fromDate) {
      filtered = filtered.filter(r => {
        const reportDate = normalizeToUTC(new Date(r.date));
        return reportDate >= fromDate;
      });
    }

    if (toDate) {
      filtered = filtered.filter(r => {
        const reportDate = normalizeToUTC(new Date(r.date));
        return reportDate <= toDate;
      });
    }

    if (validatedStatus !== 'all') {
      filtered = filtered.filter(r => r.status.toLowerCase() === validatedStatus);
    }

    if (validatedCategory !== 'all') {
      filtered = filtered.filter(r => r.category.toLowerCase() === validatedCategory);
    }

    // Apply pagination
    const totalCount = filtered.length;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedResults = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedResults,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch reports: ${error.message}`);
  }
};

// Fetch single report with validation
exports.getReportById = async (id) => {
  try {
    // Validate ID
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId < 1) {
      throw new Error(`Invalid report ID: ${id}. ID must be a positive integer.`);
    }

    const report = reports.find(r => r.id === parsedId);

    if (!report) {
      throw new Error(`Report not found with ID: ${parsedId}`);
    }

    return report;
  } catch (error) {
    throw new Error(`Failed to fetch report: ${error.message}`);
  }
};