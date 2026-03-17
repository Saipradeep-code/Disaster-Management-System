import { Link } from "react-router-dom";
import { Shield, Users, Building2, AlertTriangle, ArrowRight } from "lucide-react";

function AuthHome() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -top-32 -left-32 animate-pulse-slow"></div>
        <div className="absolute w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] bottom-0 right-0 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-6xl w-full z-10 flex flex-col items-center animate-fade-in text-center mb-16 px-4">
        <div className="inline-flex items-center justify-center p-3 mb-8 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-md shadow-2xl">
          <Shield className="w-8 h-8 text-blue-400" />
          <span className="ml-3 text-slate-200 font-semibold tracking-wide pr-2">Secure Response Network</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-200 mb-8 tracking-tight pb-2">
          Disaster Management System
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Coordinating emergency response and relief efforts in real-time. When every second counts, we bring help faster.
        </p>
      </div>

      <div className="max-w-6xl w-full z-10 grid md:grid-cols-3 gap-6 animate-slide-up px-4">
        {/* USER LOGIN */}
        <Link to="/login" className="group block">
          <div className="h-full bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-blue-500/10">
            <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
              <Users className="text-blue-400 w-8 h-8"/>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3">User Portal</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Log in to report disasters, request emergency help, and view active alerts in your area.
            </p>
            <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
              Sign In <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* REGISTER */}
        <Link to="/register" className="group block">
          <div className="h-full bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-emerald-500/10">
            <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
              <AlertTriangle className="text-emerald-400 w-8 h-8"/>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3">New User</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Create an account to access emergency support, track rescue teams, and connect with NGOs.
            </p>
            <div className="flex items-center text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors">
              Register <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* NGO LOGIN */}
        <Link to="/ngo-login" className="group block">
          <div className="h-full bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-rose-500/10">
            <div className="bg-rose-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-500">
              <Building2 className="text-rose-400 w-8 h-8"/>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3">NGO Portal</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Manage disaster responses, coordinate relief efforts, and dispatch rescue teams efficiently.
            </p>
            <div className="flex items-center text-rose-400 font-semibold group-hover:text-rose-300 transition-colors">
              Access <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
      
      <div className="absolute bottom-8 text-slate-500 text-sm font-medium animate-fade-in" style={{ animationDelay: '1s' }}>
        DMS © {new Date().getFullYear()} • Secure & Reliable
      </div>
    </div>
  );
}

export default AuthHome;