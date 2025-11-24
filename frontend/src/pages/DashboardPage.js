import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DashboardPage() {
  const [reportData, setReportData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "all",
  });
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // --- Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("dashboardFilters")) || {};
    setFilters(prev => ({ ...prev, ...savedFilters }));
  }, []);

  // --- Fetch reports from backend
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        setReportData(data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }
    fetchReports();
  }, []);

  // --- Filter data
  const filteredData = reportData.filter(item => {
    const itemDate = new Date(item.date);
    let dateMatch = true;
    if (filters.startDate) dateMatch = itemDate >= new Date(filters.startDate);
    if (filters.endDate) dateMatch = dateMatch && itemDate <= new Date(filters.endDate);
    const categoryMatch = filters.category === "all" || item.category === filters.category;
    return dateMatch && categoryMatch;
  });

  // --- Update chart whenever filteredData changes
  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      // Initialize chart
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: filteredData.map(i => i.date),
          datasets: [
            {
              label: "Report Values",
              data: filteredData.map(i => i.value),
              borderColor: "blue",
              fill: false,
            },
          ],
        },
      });
    } else {
      // Update existing chart
      chartInstanceRef.current.data.labels = filteredData.map(i => i.date);
      chartInstanceRef.current.data.datasets[0].data = filteredData.map(i => i.value);
      chartInstanceRef.current.update();
    }
  }, [filteredData]);

  // --- Handle filter change
  const handleFilterChange = e => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    localStorage.setItem("dashboardFilters", JSON.stringify(newFilters)); // persist filters
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          <option value="sales">Sales</option>
          <option value="marketing">Marketing</option>
          <option value="development">Development</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="kpis">
        <div>Total Sales: {filteredData.filter(i => i.category === "sales").length}</div>
        <div>Total Users: {filteredData.length}</div>
        <div>
          Avg Revenue:{" "}
          {filteredData.length
            ? (filteredData.reduce((sum, i) => sum + i.value, 0) / filteredData.length).toFixed(2)
            : 0}
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
