import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

// Sample dataset
const rawData = [
  { date: "2025-01-02", category: "sales", value: 45 },
  { date: "2025-02-11", category: "marketing", value: 30 },
  { date: "2025-03-15", category: "development", value: 50 },
  { date: "2025-04-08", category: "sales", value: 40 },
  { date: "2025-05-21", category: "marketing", value: 60 },
  { date: "2025-06-10", category: "development", value: 70 },
];

export default function DashboardChart() {
  const [filteredData, setFilteredData] = useState(rawData);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("all");

  const handleFilter = () => {
    const filtered = rawData.filter(item => {
      const itemDate = new Date(item.date);
      let dateMatch = true;
      if (startDate) dateMatch = itemDate >= new Date(startDate);
      if (endDate) dateMatch = dateMatch && itemDate <= new Date(endDate);

      let categoryMatch = category === "all" || item.category === category;
      return dateMatch && categoryMatch;
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [startDate, endDate, category]);

  const chartData = {
    labels: filteredData.map(i => i.date),
    datasets: [{
      label: "Report Values",
      data: filteredData.map(i => i.value),
      borderColor: "blue",
      fill: false,
    }],
  };

  return (
    <div>
      <h2>Dashboard Charts</h2>
      <div>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="sales">Sales</option>
          <option value="marketing">Marketing</option>
          <option value="development">Development</option>
        </select>
      </div>
      <Line data={chartData} />
    </div>
  );
}
