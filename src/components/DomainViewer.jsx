import { useMemo, useState } from "react";
import { Search, List, Copy } from "lucide-react";

export default function DomainViewer({ domainMap }) {
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const entries = Object.entries(domainMap).map(([name, id]) => ({ name, id }));
    const filtered = query
      ? entries.filter((e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) || String(e.id).includes(query)
        )
      : entries;
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [domainMap, query]);

  function handleCopy() {
    const data = Object.fromEntries(list.map((d) => [d.name, d.id]));
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">Domains</h3>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md"
        >
          <Copy className="h-4 w-4" /> Copy JSON
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or ID"
            className="w-full pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">Showing {list.length} of {Object.keys(domainMap).length} domains</p>
      </div>

      {list.length === 0 ? (
        <div className="min-h-[120px] grid place-items-center text-slate-500 text-sm">
          No domains match your search.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((d) => (
            <li key={d.name} className="flex items-center justify-between rounded-lg border px-3 py-2">
              <div>
                <div className="text-sm font-medium text-slate-900">{d.name}</div>
                <div className="text-xs text-slate-500">ID: {d.id}</div>
              </div>
              <span className="text-[11px] px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">{String(d.id).padStart(2, "0")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
