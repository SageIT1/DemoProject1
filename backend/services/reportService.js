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

// Helper: Validate and parse date
const parseDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date;
};

// Helper: Validate status
const validateStatus = (status) => {
  if (!status) return 'all';
  const normalized = status.toLowerCase();
  if (!VALID_STATUSES.includes(normalized)) {
    throw new Error(`Invalid status: ${status}. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  return normalized;
};

// Helper: Validate category
const validateCategory = (category) => {
  if (!category) return 'all';
  const normalized = category.toLowerCase();
  if (!VALID_CATEGORIES.includes(normalized)) {
    throw new Error(`Invalid category: ${category}. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }
  return normalized;
};

// Helper: Validate pagination parameters
const validatePagination = (page, pageSize) => {
  const parsedPage = parseInt(page) || 1;
  const parsedPageSize = parseInt(pageSize) || DEFAULT_PAGE_SIZE;
  
  if (parsedPage < 1) {
    throw new Error('Page number must be greater than 0');
  }
  
  if (parsedPageSize < 1 || parsedPageSize > MAX_PAGE_SIZE) {
    throw new Error(`Page size must be between 1 and ${MAX_PAGE_SIZE}`);
  }
  
  return { page: parsedPage, pageSize: parsedPageSize };
};

// Filter and fetch reports with validation and pagination
exports.getReports = async ({ from, to, status, category, page, pageSize }) => {
  try {
    // Validate and normalize inputs
    const fromDate = parseDate(from);
    const toDate = parseDate(to);
    const validatedStatus = validateStatus(status);
    const validatedCategory = validateCategory(category);
    const pagination = validatePagination(page, pageSize);
    
    // Date range validation
    if (fromDate && toDate && fromDate > toDate) {
      throw new Error('From date cannot be after to date');
    }
    
    // Apply filters
    let filtered = [...reports];
    
    if (fromDate) {
      filtered = filtered.filter(r => new Date(r.date) >= fromDate);
    }
    
    if (toDate) {
      filtered = filtered.filter(r => new Date(r.date) <= toDate);
    }
    
    if (validatedStatus !== 'all') {
      filtered = filtered.filter(r => r.status.toLowerCase() === validatedStatus);
    }
    
    if (validatedCategory !== 'all') {
      filtered = filtered.filter(r => r.category.toLowerCase() === validatedCategory);
    }
    
    // Calculate pagination
    const total = filtered.length;
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedResults = filtered.slice(startIndex, endIndex);
    
    // Return with metadata
    return {
      data: paginatedResults,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: total,
        totalPages: Math.ceil(total / pagination.pageSize)
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
      throw new Error(`Invalid report ID: ${id}`);
    }
    
    const report = reports.find(r => r.id === parsedId);
    
    if (!report) {
      throw new Error(`Report not found with ID: ${id}`);
    }
    
    return report;
  } catch (error) {
    throw new Error(`Failed to fetch report: ${error.message}`);
  }
};
