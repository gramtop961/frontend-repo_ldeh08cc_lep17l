import { useEffect, useMemo, useState } from "react";
import EmployeeCard from "./EmployeeCard";
import { Search, Pencil, Trash2, Upload, Image, X } from "lucide-react";

// Viewer and manager for saved ID cards stored in localStorage
export default function IdViewer({ domainMap }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // holds the original empId of the item being edited
  const [form, setForm] = useState({ name: "", yoj: "", type: "P", domain: "", photo: null });
  const [error, setError] = useState("");

  // Load items from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ids");
      const list = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setItems([]);
    }
  }, []);

  // Helpers
  function saveItems(list) {
    try {
      localStorage.setItem("ids", JSON.stringify(list));
    } catch {}
    setItems(list);
  }

  // Filtered list for search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      i.empId.toLowerCase().includes(q) ||
      i.name.toLowerCase().includes(q) ||
      i.domain.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Edit flow
  function startEdit(item) {
    setEditing(item.empId);
    setForm({ name: item.name, yoj: item.yoj, type: item.type, domain: item.domain, photo: item.photo || null });
    setError("");
  }

  function cancelEdit() {
    setEditing(null);
    setError("");
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, photo: reader.result }));
    reader.readAsDataURL(file);
  }

  function computeEmpId({ type, yoj, domain }) {
    const domainId = domainMap?.[domain];
    if (!yoj || !domainId) return "";
    return `EMP${type}${yoj}${domainId}01`;
  }

  function saveEdit() {
    const { name, yoj, type, domain, photo } = form;
    const domainId = domainMap?.[domain];
    if (!name.trim()) return setError("Enter a name");
    if (!yoj) return setError("Select year of joining");
    if (!domainId) return setError("Select a valid domain");

    const newEmpId = computeEmpId({ type, yoj, domain });

    // Ensure no duplicate empId among other items
    const duplicate = items.some((it) => it.empId !== editing && it.empId === newEmpId);
    if (duplicate) return setError("Another record already has this generated ID");

    const updated = items.map((it) =>
      it.empId === editing
        ? { ...it, name: name.trim(), yoj, type, domain, domainId, empId: newEmpId, photo }
        : it
    );
    saveItems(updated);

    // Update selected if it was the edited one
    if (selected && selected.empId === editing) {
      const newSelected = updated.find((u) => u.empId === newEmpId) || null;
      setSelected(newSelected);
    }

    setEditing(null);
  }

  // Delete
  function handleDelete(empId) {
    if (!confirm("Delete this ID card? This action cannot be undone.")) return;
    const next = items.filter((i) => i.empId !== empId);
    saveItems(next);
    if (selected && selected.empId === empId) setSelected(null);
    if (editing === empId) cancelEdit();
  }

  const years = useMemo(
    () => Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i)),
    []
  );

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Manage Saved ID Cards</h3>
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
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => (
            <div key={item.empId} className="border rounded-lg overflow-hidden">
              <div className="p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-md">
                  <div>
                    <div className="text-sm font-mono font-semibold">{item.empId}</div>
                    <div className="text-xs text-slate-500">{item.name} • {item.domain}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelected(item)}
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.empId)}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>

                {editing === item.empId && (
                  <div className="p-3 rounded-md border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-slate-900">Edit Details</div>
                      <button onClick={cancelEdit} className="text-slate-500 hover:text-slate-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Year of Joining</label>
                        <select
                          value={form.yoj}
                          onChange={(e) => setForm((f) => ({ ...f, yoj: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="" disabled>Select year</option>
                          {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                        <select
                          value={form.type}
                          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="P">Permanent (P)</option>
                          <option value="T">Temporary (T)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Domain</label>
                        <select
                          value={form.domain}
                          onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {Object.keys(domainMap || {}).map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Photo</label>
                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-slate-700 hover:bg-slate-50">
                            <Upload className="h-4 w-4" />
                            <span className="text-sm">Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                          </label>
                          {form.photo ? (
                            <div className="flex items-center gap-2 text-green-600 text-xs"><Image className="h-4 w-4" /> Selected</div>
                          ) : (
                            <div className="text-xs text-slate-500">No file chosen</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-slate-600">New ID: <span className="font-mono font-semibold text-slate-900">{computeEmpId(form) || "—"}</span></div>
                      <div className="flex items-center gap-2">
                        <button onClick={cancelEdit} className="px-3 py-1.5 rounded bg-slate-100 text-slate-800 text-sm">Cancel</button>
                        <button onClick={saveEdit} className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Save Changes</button>
                      </div>
                    </div>
                    {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
                  </div>
                )}
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
