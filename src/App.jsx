import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Activity, ShieldAlert, Globe2 } from "lucide-react";

import AuthHome from "./pages/AuthHome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NgoLogin from "./pages/NgoLogin";
import NgoRegister from "./pages/NgoRegister";

import UserHome from "./pages/UserHome";
import ReportDisaster from "./pages/ReportDisaster";
import DisasterMap from "./pages/DisasterMap";

import Dashboard from "./pages/Dashboard";

// New Components
import BackButton from "./components/BackButton";
import SOSButton from "./components/SOSButton";
import Chatbot from "./components/Chatbot";

// Placeholders for new pages
import MissingPersons from "./pages/MissingPersons";
import ReportMissing from "./pages/ReportMissing";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ResourceDashboard from "./pages/ResourceDashboard";

function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // 5 seconds intro
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>
      <div className="absolute w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        {/* Core Icon Assembly */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full animate-[spin_4s_linear_infinite]"></div>
          <div className="absolute inset-2 border-4 border-t-blue-500 border-r-rose-500 border-b-emerald-500 border-l-amber-500 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe2 className="w-12 h-12 text-slate-300 animate-pulse" />
          </div>
          <div className="absolute -top-4 -right-4 bg-red-500 rounded-full p-2 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-bounce">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Text Reveal */}
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 flex items-center gap-2 overflow-hidden">
          <span className="inline-block animate-[slide-up_1s_ease-out_forwards]">DISASTER</span>
          <span className="inline-block text-blue-500 animate-[slide-up_1s_ease-out_0.2s_forwards] opacity-0">MANAGEMENT</span>
          <span className="inline-block text-emerald-500 animate-[slide-up_1s_ease-out_0.4s_forwards] opacity-0">SYSTEM</span>
        </h1>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden mt-8">
          <div className="h-full bg-gradient-to-r from-blue-500 via-rose-500 to-emerald-500 animate-[progress_4.5s_ease-in-out_forwards] w-0"></div>
        </div>
        
        <p className="text-slate-500 font-mono text-xs mt-4 animate-pulse uppercase tracking-widest">Initializing Global Protocols...</p>

        <style>{`
          @keyframes slide-up {
            0% { transform: translateY(100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Simulate caching important data for offline mode
    if (navigator.onLine) {
      const offlineData = {
        contacts: [
          { name: "National Emergency", number: "112" },
          { name: "Ambulance", number: "102" },
          { name: "National Disaster Response", number: "1078" }
        ],
        shelters: [
          { name: "Central City High School", capacity: "450/500", lat: 20.6, lng: 79.1 },
          { name: "East District Community Center", capacity: "120/300", lat: 20.4, lng: 78.8 }
        ]
      };
      localStorage.setItem("dms_offline_cache", JSON.stringify(offlineData));
    }
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <>
          <Routes>
            {/* AUTH */}
            <Route path="/" element={<AuthHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ngo-login" element={<NgoLogin />} />
            <Route path="/ngo-register" element={<NgoRegister />} />

            {/* USER */}
            <Route path="/user-home" element={<UserHome />} />
            <Route path="/report" element={<ReportDisaster />} />
            <Route path="/map" element={<DisasterMap />} />
            <Route path="/missing" element={<MissingPersons />} />
            <Route path="/report-missing" element={<ReportMissing />} />

            {/* NGO / VOLUNTEER / ADMIN */}
            <Route path="/ngo-dashboard" element={<Dashboard />} />
            <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/resources" element={<ResourceDashboard />} />
          </Routes>
          <BackButton />
          <SOSButton />
          <Chatbot />
        </>
      )}
    </>
  );
}

export default App;