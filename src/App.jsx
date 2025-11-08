import { useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeCard from "./components/EmployeeCard";

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [result, setResult] = useState(null);

  function handleSuccess() {
    setSignedIn(true);
  }

  function handleGenerate(data) {
    setResult(data);
  }

  function reset() {
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <Header signedIn={signedIn} />
      <main className="max-w-5xl mx-auto px-4 py-10">
        {!signedIn ? (
          <div className="flex items-center justify-center">
            <Login onSuccess={handleSuccess} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmployeeForm onGenerate={handleGenerate} />
            <div className="space-y-4">
              {result ? (
                <EmployeeCard data={result} onReset={reset} />
              ) : (
                <div className="h-full min-h-[320px] rounded-xl border bg-white/60 grid place-items-center text-slate-500">
                  Fill the form to generate an ID card
                </div>
              )}
              <div className="text-xs text-slate-500">
                ID format: EMPXYYYYD01 where X is role (T/P), YYYY is year, D is domain id, 01 is series.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
