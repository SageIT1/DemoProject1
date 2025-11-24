// backend/searchReports.js

// Sample dataset (simulate database)
const reports = [
  { id: 1, title: "Annual Sales Report", category: "sales", date: "2025-01-02" },
  { id: 2, title: "Marketing Plan Q1", category: "marketing", date: "2025-02-11" },
  { id: 3, title: "Development Progress", category: "development", date: "2025-03-15" },
  { id: 4, title: "Sales Forecast", category: "sales", date: "2025-04-08" },
  { id: 5, title: "Marketing Campaign", category: "marketing", date: "2025-05-21" },
];

// Simple search function
function searchReports({ searchTerm = "", category = "", startDate, endDate }) {
  return reports.filter(report => {
    const reportDate = new Date(report.date);

    // Search term filter (case-insensitive)
    const searchMatch = report.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const categoryMatch = category ? report.category === category : true;

    // Date range filter
    let dateMatch = true;
    if (startDate) dateMatch = reportDate >= new Date(startDate);
    if (endDate) dateMatch = dateMatch && reportDate <= new Date(endDate);

    return searchMatch && categoryMatch && dateMatch;
  });
}

// Example usage
const filters = {
  searchTerm: "sales",
  category: "sales",
  startDate: "2025-01-01",
  endDate: "2025-12-31",
};

const results = searchReports(filters);
console.log("Filtered Reports:", results);
