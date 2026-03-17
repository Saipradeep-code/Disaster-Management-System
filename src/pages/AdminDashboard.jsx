import { Activity, ShieldCheck, AlertTriangle, Users, TrendingUp, BarChart, Server } from "lucide-react";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 pt-24 pb-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-red-900/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                System Administration
              </h1>
              <p className="text-slate-400 mt-1">Live metrics, AI predictions, and unified command view.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-emerald-400 tracking-wider">SYSTEM SECURE</span>
          </div>
        </div>

        {/* Global Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Incidents", value: "24", icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
            { label: "Deployed Units", value: "142", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
            { label: "Uptime", value: "99.99%", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
            { label: "Server Load", value: "42%", icon: Server, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
          ].map((metric, i) => (
            <div key={i} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-center relative overflow-hidden group hover:border-slate-600 transition-colors">
              <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl transition-opacity opacity-50 group-hover:opacity-100 ${metric.bg}`}></div>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-xl ${metric.bg} border ${metric.border}`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">{metric.value}</h3>
              <p className="text-sm font-medium text-slate-400">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* AI Prediction Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" /> AI Risk Forecast (72h)
              </h2>
              <div className="bg-slate-800 px-3 py-1 rounded-lg text-xs text-slate-300 font-mono border border-slate-700">Model: v4.2.1-live</div>
            </div>
            
            {/* Simulated Chart */}
            <div className="flex-1 relative min-h-[250px] flex items-end justify-between gap-2 pt-10 border-b border-t border-slate-800/50 my-auto pb-0">
               {/* Y Axis Labels */}
               <div className="absolute left-0 top-0 bottom-0 py-4 flex flex-col justify-between text-xs text-slate-500 font-mono">
                 <span>100%</span>
                 <span>75%</span>
                 <span>50%</span>
                 <span>25%</span>
                 <span>0%</span>
               </div>
               
               {/* Bars */}
               <div className="w-full h-full flex items-end justify-around pl-8">
                 {[30, 45, 60, 85, 95, 80, 50, 40].map((height, i) => (
                   <div key={i} className="w-[8%] flex flex-col items-center group relative cursor-pointer">
                     {/* Tooltip */}
                     <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-xs text-white px-2 py-1 rounded border border-slate-700 pointer-events-none z-10">
                       Risk: {height}%
                     </div>
                     <div 
                      className={`w-full rounded-t-sm transition-all duration-1000 bg-gradient-to-t ${height > 80 ? 'from-rose-600/20 to-rose-500' : height > 50 ? 'from-amber-600/20 to-amber-500' : 'from-blue-600/20 to-blue-500'}`} 
                      style={{ height: `${height}%` }}
                     ></div>
                   </div>
                 ))}
               </div>
            </div>
            
            {/* X Axis Labels */}
            <div className="flex justify-around pl-8 mt-4 text-xs font-semibold text-slate-500 hidden sm:flex">
              <span>Now</span>
              <span>+6h</span>
              <span>+12h</span>
              <span>+24h</span>
              <span>+36h</span>
              <span>+48h</span>
              <span>+60h</span>
              <span>+72h</span>
            </div>
          </div>

          {/* Quick Actions / Alerts */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-xl flex flex-col">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <BarChart className="w-5 h-5 text-amber-400" /> Automated Insights
            </h2>
            
            <div className="space-y-4 flex-1">
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl animate-pulse">
                <p className="text-sm font-bold text-rose-400 mb-1">High Probability Flood</p>
                <p className="text-xs text-rose-200/70">Weather APIS indicate 85% chance of severe flooding in Sector 4 within 24 hours.</p>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                <p className="text-sm font-bold text-amber-400 mb-1">Resource Depletion Alert</p>
                <p className="text-xs text-amber-200/70">East Side Shelter predicted to exhaust water supply strictly in 18 hours based on current consumption rates.</p>
              </div>

               <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl">
                <p className="text-sm font-bold text-slate-300 mb-1">Drone Fleet Status</p>
                <p className="text-xs text-slate-400">12/15 drones operational. 3 undergoing routine maintenance protocols.</p>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl border border-slate-700 transition-colors text-sm">
              Generate Detailed Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
