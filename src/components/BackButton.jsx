import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on the main auth home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-6 left-6 z-50 flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 hover:bg-slate-800/90 text-slate-300 hover:text-indigo-400 p-3 rounded-full shadow-2xl hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-400 ease-out group overflow-hidden"
      title="Go Back"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <ArrowLeft className="w-6 h-6 relative z-10 group-hover:-translate-x-0.5 transition-transform duration-300 ease-out" />
      <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-out">
        <div className="overflow-hidden flex items-center">
          <span className="whitespace-nowrap pl-2 pr-1 font-medium tracking-wide text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            Back
          </span>
        </div>
      </div>
    </button>
  );
}

export default BackButton;
