function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '', status: 'all', category: 'all' });

  useEffect(() => {
    async function load() {
      const q = new URLSearchParams();
      if (filters.from) q.append('from', filters.from);
      if (filters.to) q.append('to', filters.to);
      if (filters.status !== 'all') q.append('status', filters.status);
      if (filters.category !== 'all') q.append('category', filters.category);
      const res = await fetch(`/api/reports?${q.toString()}`);
      const data = await res.json();
      setReports(data);
    }
    load();
  }, [filters]);

  return (
    <div>
      <h1>Reports</h1>
      <div className="filters">
        <input type="date" value={filters.from} onChange={e => setFilters({...filters, from: e.target.value})}/>
        <input type="date" value={filters.to} onChange={e => setFilters({...filters, to: e.target.value})}/>
        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
          <option value="all">All</option>
          <option value="finance">Finance</option>
          <option value="ops">Ops</option>
        </select>
      </div>

      <ul>
        {reports.map(r => <li key={r.id}>{r.title} — {r.status}</li>)}
      </ul>
    </div>
  );
}
