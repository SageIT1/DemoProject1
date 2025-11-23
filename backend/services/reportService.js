// Mock data (replace with DB integration)
const reports = [
  { id: 1, title: 'Finance Report Q1', status: 'open', category: 'finance', date: '2025-11-01' },
  { id: 2, title: 'Ops Report October', status: 'closed', category: 'ops', date: '2025-10-25' },
  { id: 3, title: 'Finance Report Q2', status: 'open', category: 'finance', date: '2025-11-05' },
  { id: 4, title: 'Ops Report November', status: 'open', category: 'ops', date: '2025-11-10' },
];

const VALID_STATUSES = ['open', 'closed', 'all'];
const VALID_CATEGORIES = ['finance', 'ops', 'all'];
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

// Helper function to validate and normalize date input
const parseDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date;
};

// Helper function to validate status
const validateStatus = (status) => {
  if (!status) return 'all';
  const normalized = status.toLowerCase();
  if (!VALID_STATUSES.includes(normalized)) {
    throw new Error(`Invalid status: ${status}. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  return normalized;
};

// Helper function to validate category
const validateCategory = (category) => {
  if (!category) return 'all';
  const normalized = category.toLowerCase();
  if (!VALID_CATEGORIES.includes(normalized)) {
    throw new Error(`Invalid category: ${category}. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }
  return normalized;
};

// Helper function to validate and normalize pagination
const validatePagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || DEFAULT_PAGE_SIZE;
  
  if (pageNum < 1) {
    throw new Error('Page must be greater than 0');
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
    const fromDate = parseDate(from);
    const toDate = parseDate(to);
    const validatedStatus = validateStatus(status);
    const validatedCategory = validateCategory(category);
    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);
    
    // Validate date range logic
    if (fromDate && toDate && fromDate > toDate) {
      throw new Error('From date must be before or equal to to date');
    }
    
    let filtered = [...reports];
    
    // Apply filters
    if (fromDate) {
      filtered = filtered.filter(r => {
        const reportDate = new Date(r.date);
        return reportDate >= fromDate;
      });
    }
    
    if (toDate) {
      filtered = filtered.filter(r => {
        const reportDate = new Date(r.date);
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
    const total = filtered.length;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedResults = filtered.slice(startIndex, endIndex);
    
    return {
      data: paginatedResults,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  } catch (error) {
    throw new Error(`Error fetching reports: ${error.message}`);
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
      return null;
    }
    
    return report;
  } catch (error) {
    throw new Error(`Error fetching report by ID: ${error.message}`);
  }
};