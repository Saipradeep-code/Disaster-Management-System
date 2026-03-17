import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  AlertTriangle, Map, Home, PlusCircle, LifeBuoy, Menu,
  Bell, Activity, MapPin, User, Settings, FileText, 
  MessageSquare, HeartHandshake, ShieldCheck, ChevronRight
} from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import DisasterMap from "./DisasterMap";

function UserHome() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeAlert, setActiveAlert] = useState(null);

  // Simulate receiving a critical local alert
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveAlert({
        type: "Flood Warning",
        level: "CRITICAL",
        desc: "Water rising rapidly in your registered home zone. Move to higher ground immediately.",
        time: "Just now"
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  /* ------------------------------------- */
  /* TAB COMPONENTS                        */
  /* ------------------------------------- */

  const renderHome = () => (
    <div className="space-y-6 animate-fade-in pb-24">
      {/* Welcome & Quick Stats */}
      <div className="bg-slate-900/50 backdrop-blur-md p-5 rounded-3xl border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <div>
             <h2 className="text-xl font-bold text-white">Hello, Citizen</h2>
             <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3"/> Central District (Home Zone)</p>
          </div>
          <div className="w-10 h-10 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center relative">
             <User className="w-5 h-5 text-slate-400" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
           <div className="bg-slate-950/50 rounded-2xl p-3 text-center border border-slate-800/50">
              <span className="block text-xl font-black text-rose-400">2</span>
              <span className="text-[9px] uppercase font-bold text-slate-500">Active<br/>Hazards</span>
           </div>
           <div className="bg-slate-950/50 rounded-2xl p-3 text-center border border-slate-800/50">
              <span className="block text-xl font-black text-blue-400">1</span>
              <span className="text-[9px] uppercase font-bold text-slate-500">My<br/>Reports</span>
           </div>
           <div className="bg-slate-950/50 rounded-2xl p-3 text-center border border-slate-800/50">
              <span className="block text-xl font-black text-emerald-400">8</span>
              <span className="text-[9px] uppercase font-bold text-slate-500">Safe<br/>Zones</span>
           </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {activeAlert && (
        <div className="bg-red-950/40 border-l-4 border-red-500 p-4 rounded-2xl relative overflow-hidden group shadow-lg shadow-red-900/20">
           <div className="flex gap-3 relative z-10">
             <div className="bg-red-500/20 p-2 rounded-xl h-fit animate-pulse">
               <AlertTriangle className="w-6 h-6 text-red-500" />
             </div>
             <div>
               <div className="flex justify-between items-start mb-1">
                 <h3 className="font-bold text-red-400 text-sm flex items-center gap-2">
                   {activeAlert.type} 
                   <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded animate-pulse">{activeAlert.level}</span>
                 </h3>
                 <span className="text-[10px] text-red-500/60">{activeAlert.time}</span>
               </div>
               <p className="text-slate-300 text-xs leading-relaxed">{activeAlert.desc}</p>
             </div>
           </div>
        </div>
      )}

      {/* Emergency Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Emergency Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setActiveTab('report')} className="bg-rose-900/20 hover:bg-rose-900/40 border border-rose-500/30 p-4 rounded-2xl transition-colors flex flex-col items-center justify-center gap-2 text-center group">
             <AlertTriangle className="w-8 h-8 text-rose-400 group-hover:scale-110 transition-transform"/>
             <span className="text-sm font-bold text-rose-300">Report Hazard</span>
          </button>
          <button onClick={() => setActiveTab('help')} className="bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/30 p-4 rounded-2xl transition-colors flex flex-col items-center justify-center gap-2 text-center group">
             <LifeBuoy className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform"/>
             <span className="text-sm font-bold text-blue-300">Request Help</span>
          </button>
        </div>
      </div>

      {/* Community Mutual Aid Feed */}
      <div>
         <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Community Mutual Aid</h3>
            <span className="text-xs text-indigo-400 font-semibold cursor-pointer">View All</span>
         </div>
         <div className="space-y-3">
            {[
              { name: "Sarah M.", action: "Offering", item: "Transport (SUV)", loc: "West End", time: "10m ago" },
              { name: "John D.", action: "Needs", item: "Baby Formula", loc: "Sector 4 Shelter", time: "25m ago" },
              { name: "Local Deli", action: "Offering", item: "Hot Meals (50)", loc: "Main Street", time: "1h ago" }
            ].map((feed, i) => (
               <div key={i} className="bg-slate-900/40 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${feed.action === 'Offering' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {feed.name.charAt(0)}
                     </div>
                     <div>
                        <p className="text-sm text-white font-semibold">
                          <span className={feed.action === 'Offering' ? 'text-emerald-400' : 'text-orange-400'}>{feed.action}</span> {feed.item}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{feed.name} • {feed.loc}</p>
                     </div>
                  </div>
                  <div className="text-[10px] text-slate-500">{feed.time}</div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderReport = () => (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="bg-slate-900/50 backdrop-blur-md p-5 rounded-3xl border border-slate-800">
         <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><PlusCircle className="text-rose-400"/> Report Hazard</h2>
         <p className="text-slate-400 text-sm mb-6">Your report will be immediately visible to emergency services and nearby citizens.</p>
         
         <form className="space-y-4">
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hazard Type</label>
             <div className="grid grid-cols-2 gap-2">
                {['Flood', 'Fire', 'Collapse', 'Medical', 'Road Block', 'Other'].map(type => (
                  <div key={type} className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-3 text-center cursor-pointer hover:border-rose-500/50 hover:bg-rose-500/10 transition-colors">
                     <span className="text-sm font-semibold text-slate-300">{type}</span>
                  </div>
                ))}
             </div>
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Location</label>
             <button type="button" className="w-full bg-blue-500/10 border border-blue-500/30 text-blue-400 py-3 rounded-xl text-sm font-bold flex flex-col items-center justify-center gap-1">
               <MapPin className="w-5 h-5"/>
               Use Current GPS coordinates
             </button>
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Photo Evidence</label>
             <div className="w-full bg-slate-950/50 border border-dashed border-slate-700 rounded-xl h-24 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-800 transition-colors">
               <span className="text-sm font-bold">+ Tap to Upload</span>
             </div>
           </div>
           <button type="button" className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/25 transition-all">
             Submit Emergency Report
           </button>
         </form>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="bg-slate-900/50 backdrop-blur-md p-5 rounded-3xl border border-slate-800">
         <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><LifeBuoy className="text-blue-400"/> Request Assistance</h2>
         <p className="text-slate-400 text-sm mb-6">Select the type of help you need. Priority dispatch is given to critical medical emergencies.</p>
         
         <div className="space-y-3">
            {[
              { title: "Medical Emergency", desc: "Request an ambulance or ERT.", icon: Activity, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
              { title: "Evacuation / Rescue", desc: "Trapped or unable to flee danger.", icon: ShieldCheck, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
              { title: "Food & Water Needed", desc: "Stranded without supplies.", icon: HeartHandshake, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
              { title: "Report Missing Person", desc: "Initiate an AI facial scan search.", icon: User, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" }
            ].map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className={`p-4 rounded-2xl border ${r.border} ${r.bg} flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity`}>
                   <div className="bg-slate-950/50 p-3 rounded-xl">
                      <Icon className={`w-6 h-6 ${r.color}`} />
                   </div>
                   <div>
                      <h4 className="text-white font-bold">{r.title}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{r.desc}</p>
                   </div>
                   <ChevronRight className={`w-5 h-5 ml-auto ${r.color}`} />
                </div>
              )
            })}
         </div>

         <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Active Requests</h3>
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex justify-between items-center text-left">
               <div>
                  <span className="text-sm font-bold text-white">Food / Water Supply</span>
                  <p className="text-xs text-slate-400">Requested 2 hours ago</p>
               </div>
               <span className="text-[10px] font-bold uppercase bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Pending review</span>
            </div>
         </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title, icon, desc) => {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fade-in px-6">
        <div className="bg-slate-800/50 p-6 rounded-3xl mb-6 border border-slate-700/50">
           <Icon className="w-16 h-16 text-slate-400 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-slate-400 text-sm max-w-sm leading-relaxed">{desc}</p>
        <button onClick={() => setActiveTab('home')} className="mt-8 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-semibold transition-colors text-sm">
          Return Home
        </button>
      </div>
    );
  };

  const renderMap = () => (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl h-[calc(100vh-14rem)] relative overflow-hidden animate-fade-in flex flex-col mb-24 p-1">
       <DisasterMap embedded={true} />
    </div>
  );

  const renderMore = () => (
    <div className="space-y-6 animate-fade-in pb-24">
      {/* Profile Summary */}
      <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800 flex items-center gap-4">
         <div className="w-16 h-16 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-slate-400" />
         </div>
         <div>
            <h3 className="text-xl font-bold text-white">Citizen Profile</h3>
            <p className="text-sm text-slate-400">ID: CTZ-9482-B</p>
            <div className="mt-2 flex gap-2">
               <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Verified</span>
               <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Blood: O+</span>
            </div>
         </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-3">
         <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-slate-800/50 transition-colors">
            <FileText className="text-amber-400 w-8 h-8"/>
            <span className="text-sm font-bold text-slate-200">Survival Guides</span>
            <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Available Offline</span>
         </div>
         <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-slate-800/50 transition-colors">
            <MessageSquare className="text-blue-400 w-8 h-8"/>
            <span className="text-sm font-bold text-slate-200">NGO Chat</span>
            <span className="text-[10px] text-slate-500">2 Unread</span>
         </div>
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden">
         <div className="p-4 border-b border-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-3">
               <ShieldCheck className="text-slate-400 w-5 h-5"/>
               <span className="text-white font-semibold text-sm">Emergency Contacts</span>
            </div>
            <ChevronRight className="text-slate-600 w-5 h-5"/>
         </div>
         <div className="p-4 border-b border-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-3">
               <MapPin className="text-slate-400 w-5 h-5"/>
               <span className="text-white font-semibold text-sm">Zone Preferences</span>
            </div>
            <ChevronRight className="text-slate-600 w-5 h-5"/>
         </div>
         <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-3">
               <Settings className="text-slate-400 w-5 h-5"/>
               <span className="text-white font-semibold text-sm">App Settings</span>
            </div>
            <ChevronRight className="text-slate-600 w-5 h-5"/>
         </div>
      </div>

      <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} className="w-full py-4 text-center text-rose-500 font-bold text-sm bg-rose-500/10 rounded-2xl border border-rose-500/20 hover:bg-rose-500/20 transition-colors">
         Sign Out
      </button>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return renderHome();
      case 'map': return renderMap();
      case 'report': return renderReport();
      case 'help': return renderHelp();
      case 'more': return renderMore();
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center relative overflow-hidden pt-16 md:pt-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] -top-40 -left-64 animate-pulse-slow"></div>
        <div className="absolute w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[100px] bottom-0 right-[-200px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Mobile-Constrained Container */}
      <div className="w-full max-w-md h-full relative z-10 px-4 md:px-0">
         
         {/* Top Branding Header (Mobile) */}
         <div className="md:hidden flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400"/>
              Citizen Portal
            </h1>
            <button className="relative w-10 h-10 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
               <Bell className="w-5 h-5 text-slate-400" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
         </div>

         {/* Content Area */}
         {renderContent()}

         {/* Bottom Mobile Navigation Bar */}
         <div className="fixed bottom-0 left-0 w-full md:relative md:w-full md:mt-8 z-50">
            {/* Safe Area Gradient */}
            <div className="absolute inset-0 -top-8 bg-gradient-to-t from-slate-950 via-slate-950 flex md:hidden pointer-events-none"></div>
            
            <div className="max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl border-t md:border border-slate-800 md:rounded-3xl p-2 md:mb-8 pb-8 md:pb-2 relative z-10">
               <div className="flex justify-between items-center px-4 md:px-6">
                  {[
                    { id: 'home', icon: Home, label: 'Home' },
                    { id: 'map', icon: Map, label: 'Map' },
                    { id: 'report', icon: PlusCircle, label: 'Report', special: true },
                    { id: 'help', icon: LifeBuoy, label: 'Help' },
                    { id: 'more', icon: Menu, label: 'More' }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center justify-center w-14 transition-all ${item.special ? '-mt-8 relative z-20' : ''}`}
                      >
                         {item.special ? (
                           <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${isActive ? 'bg-rose-500 shadow-rose-500/30' : 'bg-slate-800 border-2 border-slate-700 shadow-slate-900'}`}>
                             <Icon className={`w-7 h-7 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                           </div>
                         ) : (
                           <>
                             <div className={`p-2 rounded-2xl mb-1 transition-colors ${isActive ? 'bg-indigo-500/10' : ''}`}>
                               <Icon className={`w-6 h-6 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                             </div>
                             <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>{item.label}</span>
                           </>
                         )}
                      </button>
                    )
                  })}
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}

export default UserHome;