import { useState } from "react";
import { Plus, Hash } from "lucide-react";

export default function DomainManager({ domainMap, onAddDomain }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    const trimmed = name.trim();
    const num = Number(id);
    if (!trimmed) return setError("Enter a domain name");
    if (!id || Number.isNaN(num) || num <= 0) return setError("Enter a valid numeric ID");
    if (Object.values(domainMap).includes(num)) return setError("This ID already exists");
    if (domainMap[trimmed]) return setError("This domain already exists");
    onAddDomain(trimmed, num);
    setName("");
    setId("");
    setError("");
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-3">Add New Domain</h3>
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Domain Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Machine Learning"
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Hash className="h-4 w-4 text-slate-400"/>ID</label>
          <input
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="e.g., 25"
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="sm:col-span-3">
          <button type="submit" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
            <Plus className="h-4 w-4"/> Add Domain
          </button>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      </form>
      <div className="mt-4 text-xs text-slate-500">
        Existing domains: {Object.keys(domainMap).length}
      </div>
    </div>
  );
}
