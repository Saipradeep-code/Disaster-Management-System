import { Link } from "react-router-dom";
import { LogOut, Map, AlertCircle, LayoutDashboard } from "lucide-react";

function Navbar(){

  const role = localStorage.getItem("role");

  const logout = ()=>{
    localStorage.removeItem("role");
    window.location.href="/";
  };

  if (!role) return null;

  return(
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-5xl bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-full shadow-lg shadow-blue-500/20">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold text-lg hidden sm:block tracking-wide">
          DMS
        </span>
      </div>

      <div className="flex items-center gap-6">
        {role === "user" && (
          <>
            <Link to="/report" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:block">Report</span>
            </Link>
            <Link to="/map" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
              <Map className="w-4 h-4" />
              <span className="hidden sm:block">Map</span>
            </Link>
          </>
        )}

        {role === "ngo" && (
          <>
            <Link to="/dashboard" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:block">Dashboard</span>
            </Link>
            <Link to="/map" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
              <Map className="w-4 h-4" />
              <span className="hidden sm:block">Map</span>
            </Link>
          </>
        )}

        <div className="h-6 w-px bg-slate-700 mx-2"></div>

        <button 
          onClick={logout}
          className="flex items-center gap-2 text-slate-300 hover:text-rose-400 transition-colors text-sm font-medium group"
        >
          <span className="hidden sm:block">Logout</span>
          <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;