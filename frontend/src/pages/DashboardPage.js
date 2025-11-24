import DashboardChart from "../components/DashboardChart";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardChart />
    </div>
  );
}
// dashboard.js
let reportData = []; // no raw data hardcoded

async function fetchReports() {
  try {
    const res = await fetch('/api/reports');
    reportData = await res.json();
    updateDashboard(); // initial render
  } catch (error) {
    console.error("Failed to fetch reports:", error);
  }
}

// Filter function
function filterData() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const category = document.getElementById("categoryFilter").value;

  return reportData.filter(item => {
    const itemDate = new Date(item.date);
    let dateMatch = true;
    if (startDate) dateMatch = itemDate >= new Date(startDate);
    if (endDate) dateMatch = dateMatch && itemDate <= new Date(endDate);
    let categoryMatch = category === "all" || item.category === category;
    return dateMatch && categoryMatch;
  });
}

// Update chart + KPIs
function updateDashboard() {
  const filtered = filterData();

  // Chart update
  chart.data.labels = filtered.map(i => i.date);
  chart.data.datasets[0].data = filtered.map(i => i.value);
  chart.update();

  // Update KPIs
  document.getElementById("totalSales").innerText = filtered.filter(i => i.category === "sales").length;
  document.getElementById("totalUsers").innerText = filtered.length;
  document.getElementById("avgRevenue").innerText =
    filtered.length ? (filtered.reduce((sum, i) => sum + i.value, 0) / filtered.length).toFixed(2) : 0;
}

// Initialize chart
let chartCtx = document.getElementById("reportChart").getContext("2d");
let chart = new Chart(chartCtx, {
  type: "line",
  data: { labels: [], datasets: [{ label: "Report Values", data: [], borderColor: "blue", fill: false }] }
});

// Event listener
document.getElementById("applyFiltersBtn").addEventListener("click", updateDashboard);

// Fetch reports when page loads
fetchReports();

