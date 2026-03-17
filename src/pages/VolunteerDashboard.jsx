import { useState } from "react";
import { Users, CheckCircle2, MapPin, Clock, Briefcase, ChevronRight } from "lucide-react";

const MOCK_TASKS = [
  { id: 1, title: "Medical Assistance Required", location: "Sector 4 Shelter", priority: "High", skill: "Medical", distance: "2.4 km", status: "Open" },
  { id: 2, title: "Debris Clearance", location: "Main Street, Block A", priority: "Medium", skill: "Physical Work", distance: "4.1 km", status: "Assigned" },
  { id: 3, title: "Food Distribution Logistics", location: "City Hall Drop point", priority: "Medium", skill: "Driving/Logistics", distance: "1.2 km", status: "Open" },
];

function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState("available");

  return (
    <div className="min-h-screen bg-slate-950 p-4 pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
              <Users className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Volunteer Portal
              </h1>
              <p className="text-slate-400 mt-1">Coordinate efforts and join active rescue tasks.</p>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-1.5 rounded-xl flex gap-1">
            <button 
              onClick={() => setActiveTab("available")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'available' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              Available Tasks
            </button>
            <button 
              onClick={() => setActiveTab("my-tasks")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'my-tasks' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              My Assignments
            </button>
          </div>
        </div>

        {/* User Profile Summary */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in shadow-xl">
           <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-xl relative group cursor-pointer">
               V
               <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
             </div>
             <div>
               <h2 className="text-white font-bold text-lg">Active Volunteer</h2>
               <div className="flex gap-2 mt-1">
                 <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Medical (Basic)</span>
                 <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Driver</span>
               </div>
             </div>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
             <div className="bg-slate-950/50 rounded-xl p-4 flex-1 md:flex-none border border-slate-800 text-center">
               <p className="text-2xl font-bold text-emerald-400">12</p>
               <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tasks Done</p>
             </div>
             <div className="bg-slate-950/50 rounded-xl p-4 flex-1 md:flex-none border border-slate-800 text-center">
               <p className="text-2xl font-bold text-blue-400">48</p>
               <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Hours</p>
             </div>
           </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white mb-4">
            {activeTab === 'available' ? 'Urgent Needs Near You' : 'Your Current Assignments'}
          </h3>
          
          {MOCK_TASKS.filter(t => activeTab === 'available' ? t.status === 'Open' : t.status === 'Assigned').map((task) => (
            <div key={task.id} className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 hover:border-emerald-500/30 rounded-2xl p-5 shadow-lg transition-all group hover:-translate-y-0.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${task.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'}`}></span>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{task.title}</h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 pl-5">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-500" /> {task.location} ({task.distance})</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-emerald-500" /> Requires: {task.skill}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-500" /> Posted 10m ago</span>
                </div>
              </div>
              
              <button className={`w-full md:w-auto px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'available' ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-slate-700'}`}>
                {activeTab === 'available' ? (
                  <>Accept Task <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Mark Completed</>
                )}
              </button>
            </div>
          ))}
          
          {MOCK_TASKS.filter(t => activeTab === 'available' ? t.status === 'Open' : t.status === 'Assigned').length === 0 && (
            <div className="py-12 bg-slate-900/20 rounded-2xl border border-slate-800/50 border-dashed text-center">
              <p className="text-slate-500">No tasks found for this view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VolunteerDashboard;
