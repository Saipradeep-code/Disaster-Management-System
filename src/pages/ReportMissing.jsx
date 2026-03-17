import { useState } from "react";
import { UserPlus, Image as ImageIcon, Send, User, MapPin, Calendar } from "lucide-react";

function ReportMissing() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate AI upload and processing
    setTimeout(() => {
      alert("Missing person report submitted. Our AI system will begin matching against shelter databases.");
      setIsSubmitting(false);
      window.history.back(); // Use history to go back after success
    }, 1500);
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
                  <input type="text" required placeholder="John Doe" className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Age</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input type="number" required placeholder="Age in years" className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Last Known Location</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input type="text" required placeholder="Specific address or landmark" className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Distinguishing Features & Clothing</label>
              <textarea required rows="3" placeholder="Red jacket, blue jeans, scar on left cheek..." className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all outline-none resize-none"></textarea>
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
