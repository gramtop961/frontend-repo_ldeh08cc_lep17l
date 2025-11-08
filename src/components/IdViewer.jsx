import { useMemo, useState } from "react";
import EmployeeCard from "./EmployeeCard";
import { Search } from "lucide-react";

// Simple local search viewer using an in-memory list stored in localStorage
export default function IdViewer() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const list = useMemo(() => {
    try {
      const raw = localStorage.getItem("ids");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }, [selected, query]);

  const filtered = list.filter((i) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      i.empId.toLowerCase().includes(q) ||
      i.name.toLowerCase().includes(q) ||
      i.domain.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">View Generated ID Cards</h3>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by ID, name, or domain"
          className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">No records found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.empId} className="border rounded-lg overflow-hidden">
              <div className="p-3 flex items-center justify-between bg-slate-50">
                <div>
                  <div className="text-sm font-mono font-semibold">{item.empId}</div>
                  <div className="text-xs text-slate-500">{item.name} • {item.domain}</div>
                </div>
                <button
                  onClick={() => setSelected(item)}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  View card
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-6">
          <EmployeeCard data={selected} onReset={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}
