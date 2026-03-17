import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { MapPin, AlertCircle, FileText, Send, Navigation, WifiOff } from "lucide-react";

function ReportDisaster() {

  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [needs, setNeeds] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncOfflineReports();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (navigator.onLine) {
      syncOfflineReports();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncOfflineReports = async () => {
    const pendingReports = localStorage.getItem("pending_reports");
    if (pendingReports) {
      try {
        const reportsData = JSON.parse(pendingReports);
        for (const report of reportsData) {
          await addDoc(collection(db, "disasters"), {
            ...report,
            time: serverTimestamp()
          });
        }
        localStorage.removeItem("pending_reports");
        alert("Connection restored! All your offline disaster reports have been successfully broadcasted to NGOs.");
      } catch (error) {
        console.error("Failed to sync offline reports:", error);
      }
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const loc = `Latitude: ${lat}, Longitude: ${lon}`;
        setLocation(loc);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      type: type,
      location: location,
      needs: needs,
      status: "Pending"
    };

    if (!navigator.onLine) {
      const existing = JSON.parse(localStorage.getItem("pending_reports") || "[]");
      existing.push(payload);
      localStorage.setItem("pending_reports", JSON.stringify(existing));
      alert("You are offline. Your report has been saved locally and will send automatically when your connection returns.");
      setType("");
      setLocation("");
      setNeeds("");
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, "disasters"), {
        ...payload,
        time: serverTimestamp()
      });
      alert("Disaster Report Saved!");
      setType("");
      setLocation("");
      setNeeds("");
    } catch (error) {
      console.error("Error saving disaster:", error);
      alert("Failed to save report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden pt-24">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[100px] top-0 left-0 animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-2xl z-10 animate-fade-in">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
            <div className="bg-red-500/10 p-4 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Report Disaster</h1>
              <p className="text-slate-400 mt-1">Submit an emergency alert to NGOs and responders</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Disaster Type</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-slate-500 group-focus-within:text-red-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Flood, Earthquake, Fire..."
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-slate-500 transition-all outline-none"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Location Details</label>
              <div className="flex gap-3">
                <div className="relative group flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Address or Coordinates"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-500 transition-all outline-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={getLocation}
                  className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-4 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  title="Get current GPS location"
                >
                  <Navigation className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Auto-Locate</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Immediate Needs</label>
              <div className="relative group">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <FileText className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <textarea
                  placeholder="e.g. Food, Shelter, Medicine, Medical Aid..."
                  required
                  rows="4"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-slate-500 transition-all outline-none resize-none"
                  value={needs}
                  onChange={(e) => setNeeds(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Submitting Alert...' : 'Broadcast Emergency Report'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportDisaster;