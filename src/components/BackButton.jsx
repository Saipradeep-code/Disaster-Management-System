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
      className="fixed bottom-6 left-6 z-50 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 hover:border-slate-500 hover:bg-slate-700/80 text-slate-300 hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 group flex items-center justify-center animate-fade-in"
      title="Go Back"
    >
      <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
    </button>
  );
}

export default BackButton;
