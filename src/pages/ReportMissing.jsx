import { useState, useEffect } from "react";
import { UserPlus, Image as ImageIcon, Send, User, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

function ReportMissing() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "disasters"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDisasters(data);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "missing_persons"), {
        name: e.target.personName.value,
        age: e.target.age.value,
        lastSeen: e.target.lastSeen.value,
        features: e.target.features.value,
        disasterId: selectedDisaster || "None",
        match: "Pending Scan",
        status: "Missing",
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${e.target.personName.value}&backgroundColor=1e293b`
      });
      alert("Missing person report securely submitted to the NGO centralized database. Rescue units have been notified.");
      setIsSubmitting(false);
      window.history.back();
    } catch (error) {
      console.error(error);
      alert("Error reporting missing person.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden pt-24 pb-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] top-0 right-0 animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-2xl z-10 animate-slide-up">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
            <div className="bg-purple-500/10 p-4 rounded-2xl">
              <UserPlus className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Report Missing Person</h1>
              <p className="text-slate-400 mt-1">Provide details and a clear photo to enable AI matching.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Photo Upload Area - Simulated */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Recent Photo (Required for AI Match)</label>
              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 hover:bg-slate-800/50 hover:border-purple-500/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group">
                <div className="bg-slate-800 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-center">
                  <span className="text-purple-400 font-semibold cursor-pointer">Click to upload</span>
                  <span className="text-slate-500 ml-2">or drag and drop</span>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG up to 10MB. Ensure face is clearly visible.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input name="personName" type="text" required placeholder="John Doe" className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Age</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input name="age" type="number" required placeholder="Age in years" className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Associated Active Disaster</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AlertTriangle className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <select 
                  value={selectedDisaster} 
                  onChange={(e) => setSelectedDisaster(e.target.value)} 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all outline-none appearance-none"
                >
                  <option value="" disabled>Select the relevant emergency...</option>
                  {disasters.map(d => (
                    <option key={d.id} value={d.id}>{d.type} - {d.location}</option>
                  ))}
                  <option value="None">Not associated with an existing report</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Last Known Location</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input name="lastSeen" type="text" required placeholder="Specific address or landmark" className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Distinguishing Features & Clothing</label>
              <textarea name="features" required rows="3" placeholder="Red jacket, blue jeans, scar on left cheek..." className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all outline-none resize-none"></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span>Processing Image AI...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Submit to Registry
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportMissing;
