import { BadgeCheck } from "lucide-react";

export default function EmployeeCard({ data, onReset }) {
  if (!data) return null;
  const { name, yoj, type, domain, domainId, empId, photo } = data;

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white flex items-center justify-between">
        <div className="font-semibold">Company Access ID</div>
        <BadgeCheck className="h-5 w-5" />
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div className="sm:col-span-1 flex items-center justify-center">
          <div className="h-32 w-32 rounded-xl overflow-hidden border bg-slate-50">
            {photo ? (
              <img src={photo} alt="Employee" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full grid place-items-center text-slate-400 text-sm">No Photo</div>
            )}
          </div>
        </div>
        <div className="sm:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Employee Name" value={name} />
            <Field label="Year of Joining" value={yoj} />
            <Field label="Type" value={type === "P" ? "Permanent" : "Temporary"} />
            <Field label="Domain" value={`${domain} (${domainId})`} />
            <Field label="Employee ID" value={empId} mono />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={onReset}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg text-sm"
            >
              Generate Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
