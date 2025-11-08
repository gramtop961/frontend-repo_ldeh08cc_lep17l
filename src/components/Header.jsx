import { LogIn } from "lucide-react";

export default function Header({ signedIn }) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold">ID</div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Employee ID Generator</h1>
            <p className="text-xs text-slate-500 hidden sm:block">Secure admin portal for generating company IDs</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <LogIn className="h-5 w-5" />
          <span className="text-sm">{signedIn ? "Signed in as Admin" : "Sign in required"}</span>
        </div>
      </div>
    </header>
  );
}
