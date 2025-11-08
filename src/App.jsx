import { useMemo, useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeCard from "./components/EmployeeCard";
import DomainManager from "./components/DomainManager";
import IdViewer from "./components/IdViewer";

const DEFAULT_DOMAIN_MAP = {
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

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [result, setResult] = useState(null);
  const [domainMap, setDomainMap] = useState(DEFAULT_DOMAIN_MAP);

  function handleSuccess() {
    setSignedIn(true);
  }

  function handleGenerate(data) {
    setResult(data);
    try {
      const raw = localStorage.getItem("ids");
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(data);
      localStorage.setItem("ids", JSON.stringify(list));
    } catch (e) {
      // ignore storage errors
    }
  }

  function reset() {
    setResult(null);
  }

  function handleAddDomain(name, id) {
    setDomainMap((prev) => ({ ...prev, [name]: Number(id) }));
  }

  const domainCount = useMemo(() => Object.keys(domainMap).length, [domainMap]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <Header signedIn={signedIn} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        {!signedIn ? (
          <div className="flex items-center justify-center">
            <Login onSuccess={handleSuccess} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <EmployeeForm onGenerate={handleGenerate} domainMap={domainMap} />
              <DomainManager domainMap={domainMap} onAddDomain={handleAddDomain} />
            </div>
            <div className="space-y-6">
              {result ? (
                <EmployeeCard data={result} onReset={reset} />
              ) : (
                <div className="min-h-[320px] rounded-xl border bg-white/60 grid place-items-center text-slate-500">
                  Fill the form to generate an ID card
                </div>
              )}
              <div className="bg-white border rounded-xl p-4 text-sm text-slate-600">
                <div className="font-medium text-slate-900 mb-1">Format</div>
                <div>
                  EMPXYYYYD01 — X: T/P, YYYY: year of joining, D: domain id, 01: series
                </div>
                <div className="mt-2 text-xs text-slate-500">Domains available: {domainCount}</div>
              </div>
              <IdViewer />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
