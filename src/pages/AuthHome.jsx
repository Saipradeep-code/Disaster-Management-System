import { Link } from "react-router-dom";
import { Shield, Users, Building2, AlertTriangle, ArrowRight, Activity, Radar, Radio, Target, CheckCircle2 } from "lucide-react";

function AuthHome() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative font-sans text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Fixed Dynamic Background serving the whole scrollable page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-blue-900/5 to-transparent rounded-full blur-[120px] -top-32 -left-32 animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/20 via-emerald-900/5 to-transparent rounded-full blur-[100px] bottom-0 right-[-100px] animate-[pulse_8s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-600/20 via-indigo-900/5 to-transparent rounded-full blur-[100px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* --- HERO SECTION --- (Takes at least full screen height) */}
      <div className="min-h-[90vh] flex flex-col justify-center py-20 relative z-10 w-full">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-5 gap-12 items-center px-4 md:px-8 text-center lg:text-left">
          
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start animate-fade-in relative">
            
            <div className="inline-flex items-center p-2 mb-6 rounded-full bg-slate-900/80 border border-indigo-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <div className="bg-indigo-500/20 p-2 rounded-full mr-3">
                <Shield className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-slate-200 text-xs font-bold tracking-widest uppercase pr-4">Global Response Nexus</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
              Crisis <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Management
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-light">
              An advanced, real-time coordination platform. Connecting citizens in danger with rapid-response NGOs and emergency services dynamically.
            </p>

            <div className="flex gap-4 mb-12 lg:mb-0">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">124ms</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Latency</span>
              </div>
              <div className="w-px bg-slate-800"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white flex items-center gap-2"><Activity className="w-6 h-6 text-emerald-400"/> 99.9%</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Uptime</span>
              </div>
            </div>
          </div>
          
          {/* Right Column: Portal Cards Grid */}
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-6 animate-slide-up perspective-1000">
            
            <Link to="/login" className="group relative block transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
              <div className="h-full relative bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 border border-slate-700/50 group-hover:border-blue-500/50 shadow-2xl overflow-hidden z-10 flex flex-col justify-between">
                <div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:rotate-6 transition-all duration-500">
                    <Users className="text-blue-400 w-10 h-10 group-hover:scale-110 transition-transform"/>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Citizen Portal</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    Access localized alerts, report immediate hazards, and connect with nearby mutual aid networks.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Secured Access</span>
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white text-blue-400 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/register" className="group relative block transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
              <div className="h-full relative bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 border border-slate-700/50 group-hover:border-emerald-500/50 shadow-2xl overflow-hidden z-10 flex flex-col justify-between">
                <div>
                  <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:-rotate-6 transition-all duration-500">
                    <AlertTriangle className="text-emerald-400 w-10 h-10 group-hover:scale-110 transition-transform"/>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">New Member</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    Enroll via biometric or phone auth to prepare your household before disaster strikes.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Create Profile</span>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white text-emerald-400 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/ngo-login" className="md:col-span-2 group relative block transform transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-purple-600/20 rounded-3xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
              <div className="h-full relative bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-slate-700/50 group-hover:border-rose-500/50 shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="bg-gradient-to-br from-rose-500/20 to-purple-500/10 w-24 h-24 rounded-2xl flex shrink-0 items-center justify-center border border-rose-500/20 group-hover:scale-105 transition-all duration-500">
                    <Building2 className="text-rose-400 w-12 h-12"/>
                  </div>
                  <div className="text-left">
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Command Center</h3>
                    <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                      NGO & Government terminal for deploying assets, routing units, and macro-level emergency coordination.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-14 h-14 shrink-0 rounded-full bg-rose-500/10 group-hover:bg-rose-500 group-hover:text-white text-rose-400 transition-all duration-300 border border-rose-500/20">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>

      {/* --- HOW IT WORKS / ROADMAP SECTION --- */}
      <div className="relative z-10 py-24 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
            <h2 className="text-4xl font-extrabold text-white mb-6">Unified Operational Flow</h2>
            <p className="text-slate-400 text-lg">A seamlessly integrated pipeline ensuring zero latency between a citizen's cry for help and the emergency team's deployment.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative mt-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden md:block absolute top-12 left-[10%] w-[80%] h-0.5 bg-gradient-to-r from-blue-500/30 via-emerald-500/30 to-rose-500/30 -translate-y-1/2 z-0"></div>

            {[
              { icon: Radar, title: "1. Incident Detection", desc: "Citizen reports hazard or system auto-detects anomalies via sensors.", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
              { icon: Radio, title: "2. Signal Broadcast", desc: "Instant alert pushed to local verified NGO & Government dashboards.", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
              { icon: Target, title: "3. Resource Allocation", desc: "AI routes nearest active volunteers and available depot inventory.", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
              { icon: CheckCircle2, title: "4. Crisis Resolution", desc: "Units deployed, citizen updated, and hazard is marked successfully resolved.", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" }
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative z-10 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 shadow-xl hover:border-slate-500/50">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border ${step.bg} ${step.border} shadow-lg`}>
                     <Icon className={`w-10 h-10 ${step.color}`} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">{step.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Footer Element */}
      <div className="relative z-10 py-8 border-t border-slate-800 bg-slate-950 text-center text-slate-600 text-xs font-bold uppercase tracking-widest mt-auto">
        Disaster Management System © {new Date().getFullYear()} • Encrypted Network Protocol
      </div>
    </div>
  );
}

export default AuthHome;
