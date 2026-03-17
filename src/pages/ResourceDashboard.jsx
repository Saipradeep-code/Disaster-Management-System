import { Package, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

const RESOURCES = [
  { id: 1, name: "Bottled Water (L)", current: 4500, target: 10000, status: "Critical", trend: "down" },
  { id: 2, name: "Meals Ready-to-Eat", current: 8200, target: 10000, status: "Good", trend: "up" },
  { id: 3, name: "First Aid Kits", current: 300, target: 1000, status: "Low", trend: "down" },
  { id: 4, name: "Blankets", current: 1500, target: 2000, status: "Stable", trend: "up" },
];

function ResourceDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20">
            <Package className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Resource Inventory
            </h1>
            <p className="text-slate-400 mt-1">Live tracking of supplies across designated shelters.</p>
          </div>
        </div>

        {/* Global Warnings */}
        <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 mb-8 flex items-center gap-4 animate-slide-up">
          <div className="bg-rose-500/20 p-2 rounded-full animate-pulse">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-rose-200 font-bold">Critical Supply Shortage</h3>
            <p className="text-sm text-rose-300">Sector 4 and East Side Shelters require immediate water and medical resupply.</p>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESOURCES.map((item, i) => {
            const percentage = (item.current / item.target) * 100;
            let colorString = "bg-blue-500";
            if(percentage < 50) colorString = "bg-rose-500";
            else if (percentage >= 50 && percentage < 80) colorString = "bg-amber-500";
            else colorString = "bg-emerald-500";

            return (
              <div 
                key={item.id} 
                className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-xl hover:border-slate-600 transition-all group"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white font-bold max-w-[70%] leading-tight">{item.name}</h3>
                  <div className={`p-1.5 rounded-lg ${item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-3xl font-extrabold text-white">{item.current.toLocaleString()}</span>
                    <span className="text-sm text-slate-400 mb-1">/ {item.target.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${colorString} transition-all duration-1000 ease-out relative`} 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse-slow"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.status === 'Critical' ? 'bg-rose-500/20 text-rose-400' : item.status === 'Low' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {item.status}
                  </span>
                  <button className="text-xs text-orange-400 hover:text-orange-300 font-semibold uppercase tracking-wider transition-colors">
                    Request Supply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ResourceDashboard;
