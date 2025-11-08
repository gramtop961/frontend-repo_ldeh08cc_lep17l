import { useMemo, useState } from "react";
import { Upload, User, Calendar, Briefcase, Image } from "lucide-react";

const DOMAIN_MAP = {
  "Consultant": 2,
  "Data Analyst": 6,
  "Project Manager": 5,
  "Business Analysits": 7,
  "Developers": 4,
  "Sales": 3,
  "Human Resources": 1,
  "Digital Marketing": 9,
  "Cyber Security": 8,
  "Process Associates": 10,
  "Security Anlayst": 11,
  "SAP Consultant": 12,
  "Data Scientist": 24,
  "R&D": 15,
  "Trainers": 13,
  "UI/UX": 14,
  "Administrative Manager": 16,
  "Ai Automator": 17,
  "CFO": 18,
  "CMO": 19,
  "CTO": 20,
  "Devops Engineer": 21,
  "Director": 22,
  "Graphical Designer": 23,
};

function pad2(n) {
  return String(n).padStart(2, "0");
}

export default function EmployeeForm({ onGenerate }) {
  const [name, setName] = useState("");
  const [yoj, setYoj] = useState("");
  const [type, setType] = useState("P");
  const [domain, setDomain] = useState("Developers");
  const [photo, setPhoto] = useState(null);

  const domainId = DOMAIN_MAP[domain];

  const empId = useMemo(() => {
    if (!yoj || !domainId) return "";
    return `EMP${type}${yoj}${domainId}01`;
  }, [type, yoj, domainId]);

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !yoj || !domain) return;
    onGenerate({ name, yoj, type, domain, domainId, empId, photo });
  }

  const years = Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i));

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Enter Employee Details</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Year of Joining</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={yoj}
              onChange={(e) => setYoj(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Select year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Employee Type</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="P">Permanent (P)</option>
              <option value="T">Temporary (T)</option>
            </select>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Domain</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.keys(DOMAIN_MAP).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Photo</label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-slate-700 hover:bg-slate-50">
              <Upload className="h-5 w-5" />
              <span>Upload Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
            {photo ? (
              <div className="flex items-center gap-2 text-green-600 text-sm"><Image className="h-4 w-4" /> Selected</div>
            ) : (
              <div className="text-sm text-slate-500">No file chosen</div>
            )}
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
          <div className="text-sm text-slate-600">Generated ID: <span className="font-mono font-semibold text-slate-900">{empId || "—"}</span></div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium self-start sm:self-auto"
          >
            Generate ID Card
          </button>
        </div>
      </form>
    </div>
  );
}
