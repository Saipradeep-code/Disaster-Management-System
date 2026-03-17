import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { 
  ShieldAlert, MapPin, CheckCircle2, AlertCircle, Clock, Activity, 
  ArrowRight, Truck, LayoutDashboard, Map, Users, Target, Box, 
  Home, UserSearch, FileText, MessageSquare, DollarSign, BarChart3, 
  FolderOpen, BrainCircuit, Globe, Bell
} from "lucide-react";
import DisasterMap from "./DisasterMap";

// Mock Data for Top Stats
const MOCK_STATS = {
  activeDisasters: 12,
  affectedPeople: 4500,
  volunteersAvailable: 342,
  missionsInProgress: 8,
  resourcesAvailable: "85%",
  activeShelters: 14
};

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic State for interactive demo features
  const [showModal, setShowModal] = useState(null);
  const [activeVolunteer, setActiveVolunteer] = useState(null);

  const [volunteers, setVolunteers] = useState([
    { id: 1, name: "Dr. Sarah Jenkins", skill: "Medical / Doctor", status: "Available", loc: "Central District" },
    { id: 2, name: "Marcus Thorne", skill: "Heavy Machinery", status: "On Mission", loc: "Sector 4" },
    { id: 3, name: "Elena Rostova", skill: "First Aid / Nurse", status: "Available", loc: "East District" },
    { id: 4, name: "David Kim", skill: "Logistics", status: "Available", loc: "HQ" },
    { id: 5, name: "Aisha Patel", skill: "Search & Rescue", status: "On Mission", loc: "Sector 2" }
  ]);

  const [missions, setMissions] = useState([
    { code: "OP-DELTA-9", type: "Flood Evacuation", loc: "River Bank North", priority: "CRITICAL", progress: 40 },
    { code: "OP-ECHO-2", type: "Medical Supply Drop", loc: "Sector 7 Shelter", priority: "HIGH", progress: 85 },
    { code: "OP-FOXTROT-1", type: "Debris Clearing", loc: "Highway 14", priority: "MEDIUM", progress: 20 },
  ]);

  const [inventory, setInventory] = useState([
    { item: "Bottled Water", qty: "4,500 L", status: "Good", percent: 85, color: "bg-blue-500" },
    { item: "MRE Rations", qty: "1,200", status: "Low", percent: 25, color: "bg-orange-500" },
    { item: "Trauma Kits", qty: "45", status: "Critical", percent: 12, color: "bg-red-500" },
    { item: "Thermal Blankets", qty: "850", status: "Good", percent: 70, color: "bg-emerald-500" },
    { item: "Generators", qty: "14", status: "Adequate", percent: 45, color: "bg-yellow-500" },
    { item: "Tent Canvas", qty: "320 m²", status: "Good", percent: 90, color: "bg-emerald-500" },
  ]);

  // Handle Form Submissions
  const handleAssignMission = (e) => {
    e.preventDefault();
    const missionName = e.target.missionName.value;
    setVolunteers(volunteers.map(v => v.id === activeVolunteer.id ? { ...v, status: 'On Mission', loc: missionName } : v));
    setShowModal(null);
    setActiveVolunteer(null);
  };

  const handleDeployUnit = (e) => {
    e.preventDefault();
    const newMission = {
      code: `OP-${e.target.unitCode.value.toUpperCase()}-${Math.floor(Math.random()*99)}`,
      type: e.target.missionType.value,
      loc: e.target.location.value,
      priority: e.target.priority.value,
      progress: 0
    };
    setMissions([newMission, ...missions]);
    setShowModal(null);
  };

  const handleRequestSupply = (e) => {
    e.preventDefault();
    const newSupply = {
      item: e.target.itemName.value,
      qty: "Requested",
      status: "Pending Drop",
      percent: 10,
      color: "bg-yellow-500"
    };
    setInventory([newSupply, ...inventory]);
    setShowModal(null);
  };

  const handleApproveRegistrations = () => {
    const newVols = [
      { id: Date.now()+1, name: "James Carter", skill: "Driver", status: "Available", loc: "HQ" },
      { id: Date.now()+2, name: "Priya Singh", skill: "Medical", status: "Available", loc: "HQ" }
    ];
    setVolunteers([...newVols, ...volunteers]);
    alert("New volunteers approved and added to available roster.");
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "disasters"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        data.sort((a, b) => b.time?.toMillis() - a.time?.toMillis());
        setReports(data);

        const pendingAlerts = data.filter(d => d.status === "Pending" || !d.status);
        if (pendingAlerts.length > 0) {
          setLatestAlert(pendingAlerts[0]);
        } else {
          setLatestAlert(null);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  const advanceStatus = async (id, currentStatus) => {
    const flow = ["Pending", "Acknowledged", "En Route", "Resolved"];
    const currentIndex = flow.indexOf(currentStatus || "Pending");
    
    if (currentIndex < flow.length - 1) {
      const nextStatus = flow[currentIndex + 1];
      const disasterRef = doc(db, "disasters", id);
      await updateDoc(disasterRef, { status: nextStatus });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'En Route': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Acknowledged': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  const getProgressPercentage = (status) => {
    switch(status) {
      case 'Resolved': return 100;
      case 'En Route': return 66;
      case 'Acknowledged': return 33;
      default: return 0;
    }
  };

  const MENU_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'monitor', label: 'Map Monitor', icon: Map },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'missions', label: 'Rescue Missions', icon: Target },
    { id: 'inventory', label: 'Resource Inventory', icon: Box },
    { id: 'shelter', label: 'Shelters & Camps', icon: Home },
    { id: 'missing', label: 'Missing Persons', icon: UserSearch },
    { id: 'reports', label: 'Citizen Reports', icon: FileText },
    { id: 'comms', label: 'Comms Center', icon: MessageSquare },
    { id: 'donations', label: 'Funding', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'docs', label: 'Documents', icon: FolderOpen },
    { id: 'ai', label: 'AI Assist', icon: BrainCircuit },
    { id: 'command', label: 'Command Center', icon: Globe },
  ];

  /* ------------------------------------- */
  /* TAB COMPONENTS                        */
  /* ------------------------------------- */

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Active Disasters", value: MOCK_STATS.activeDisasters, color: "text-red-400" },
          { label: "Affected People", value: MOCK_STATS.affectedPeople, color: "text-orange-400" },
          { label: "Volunteers Ready", value: MOCK_STATS.volunteersAvailable, color: "text-emerald-400" },
          { label: "Rescue Missions", value: MOCK_STATS.missionsInProgress, color: "text-blue-400" },
          { label: "Relief Resources", value: MOCK_STATS.resourcesAvailable, color: "text-indigo-400" },
          { label: "Active Shelters", value: MOCK_STATS.activeShelters, color: "text-purple-400" }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg hover:border-slate-700 transition-colors">
            <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide mt-1">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Emergency Alert Banner */}
      {latestAlert && (
          <div className="bg-red-950/40 border border-red-500/30 p-6 rounded-2xl shadow-xl shadow-red-900/20 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
            <div className="absolute -top-24 -right-24 bg-red-500/10 w-48 h-48 rounded-full blur-3xl pointer-events-none group-hover:bg-red-500/20 transition-all duration-700"></div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
              <div className="flex gap-4">
                <div className="bg-red-500/20 p-3 rounded-full animate-pulse">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white flex items-center gap-2">
                    EMERGENCY ALERT: {latestAlert.type.toUpperCase()}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-1 text-slate-300">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-red-400" /> {latestAlert.location}</span>
                    <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-red-400" /> Needs: {latestAlert.needs}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => advanceStatus(latestAlert.id, "Pending")} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-red-500/25 whitespace-nowrap">
                Acknowledge Alert
              </button>
            </div>
          </div>
      )}

      {/* Current Reports Pipeline */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-400"/> Live Incident Pipeline</h3>
        <div className="flex flex-col gap-4">
          {reports.map((r) => {
            const isSOS = r.type?.toUpperCase() === 'SOS EMERGENCY';
            const status = r.status || "Pending";
            const progress = getProgressPercentage(status);
            return (
              <div key={r.id} className={`bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border transition-all hover:-translate-y-0.5 ${isSOS ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-slate-800 hover:border-slate-700'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {isSOS && <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>}
                    <h2 className="text-lg font-bold text-white">{r.type}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(status)}`}>{status}</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2 lg:col-span-1">
                     <p className="text-xs text-slate-300 flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" /> {r.location}</p>
                     <p className="text-xs text-slate-300 flex items-start gap-2"><AlertCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" /> {r.needs}</p>
                     <p className="text-[10px] text-slate-500 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {r.time?.toDate ? new Date(r.time.toDate()).toLocaleString() : 'Just Now'}</p>
                  </div>
                  {/* Pipeline Bar */}
                  <div className="lg:col-span-2 px-3 py-2 border border-slate-800/50 rounded-xl bg-slate-950/30">
                     <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1.5 px-1">
                       <span className={progress >= 0 ? "text-slate-200" : ""}>Pending</span>
                       <span className={progress >= 33 ? "text-yellow-400" : ""}>Ack'd</span>
                       <span className={progress >= 66 ? "text-blue-400" : ""}>En Route</span>
                       <span className={progress === 100 ? "text-emerald-400" : ""}>Resolved</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                       <div className={`h-full transition-all duration-700 rounded-full ${progress === 100 ? 'bg-emerald-500' : progress >= 66 ? 'bg-blue-500' : progress >= 33 ? 'bg-yellow-500' : 'bg-slate-600'}`} style={{ width: `${progress === 0 ? 5 : progress}%` }}></div>
                     </div>
                  </div>
                  <div className="lg:col-span-1 flex justify-end">
                    <button onClick={() => advanceStatus(r.id, status)} disabled={status === "Resolved"} className={`flex items-center justify-center gap-2 px-4 py-2 w-full lg:w-auto rounded-xl text-sm font-semibold transition-all ${status === "Resolved" ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'}`}>
                      {status === "Resolved" ? <><CheckCircle2 className="w-4 h-4" /> Done</> : status === "En Route" ? <><CheckCircle2 className="w-4 h-4" /> Resolve</> : status === "Acknowledged" ? <><Truck className="w-4 h-4" /> Dispatch</> : <><ArrowRight className="w-4 h-4" /> Acknowledge</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title, desc) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in border border-slate-800 border-dashed rounded-3xl bg-slate-900/20">
      <div className="bg-slate-800/50 p-6 rounded-3xl mb-4">
         <Activity className="w-12 h-12 text-slate-500 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 max-w-sm">{desc}</p>
    </div>
  );

  const renderVolunteers = () => (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users className="text-emerald-400"/> Volunteer Force</h3>
        <button onClick={handleApproveRegistrations} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Approve New Registrations</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers.map((v) => (
          <div key={v.id} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors group flex flex-col justify-between">
             <div className="flex justify-between items-start mb-3">
               <div>
                 <h4 className="text-white font-bold text-lg">{v.name}</h4>
                 <p className="text-emerald-400 text-sm font-semibold mt-0.5">{v.skill}</p>
               </div>
               <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${v.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>{v.status}</span>
             </div>
             <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-4 mb-4"><MapPin className="w-3.5 h-3.5"/> {v.loc}</p>
             <button 
                onClick={() => { setActiveVolunteer(v); setShowModal('assignMission'); }} 
                disabled={v.status !== 'Available'} 
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all mt-auto ${v.status === 'Available' ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700' : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'}`}
             >
               {v.status === 'Available' ? 'Assign to Mission' : 'Currently Deployed'}
             </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMissions = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Target className="text-blue-400"/> Active Operations</h3>
        <button onClick={() => setShowModal('deployUnit')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Deploy New Unit</button>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {missions.map((m, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-10 -mt-10 blur-2xl opacity-20 pointer-events-none transition-all group-hover:opacity-40 ${m.priority === 'CRITICAL' ? 'bg-red-500' : m.priority === 'HIGH' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <span className="text-xs font-mono text-slate-500 tracking-widest">{m.code}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider ${m.priority === 'CRITICAL' ? 'border-red-500/50 text-red-400 bg-red-500/10' : m.priority === 'HIGH' ? 'border-orange-500/50 text-orange-400 bg-orange-500/10' : 'border-blue-500/50 text-blue-400 bg-blue-500/10'}`}>{m.priority}</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-1 relative z-10">{m.type}</h4>
            <p className="text-slate-400 text-sm flex items-center gap-1.5 mb-6"><MapPin className="w-4 h-4 text-blue-400"/> {m.loc}</p>
            
            <div className="relative z-10">
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
                <span>Operation Completion</span>
                <span className="text-white">{m.progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${m.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${m.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Box className="text-amber-400"/> Depot Inventory</h3>
        <button onClick={() => setShowModal('requestSupply')} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Request Supplies</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventory.map((r, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors">
            <h4 className="text-white font-bold mb-1">{r.item}</h4>
            <div className="flex justify-between items-end mb-4">
              <span className="text-2xl font-black text-slate-300">{r.qty}</span>
              <span className={`text-[10px] font-bold uppercase ${r.percent < 20 ? 'text-red-400' : r.percent < 40 ? 'text-orange-400' : 'text-slate-400'}`}>{r.status}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${r.color}`} style={{ width: `${r.percent}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderShelter = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Home className="text-purple-400"/> Shelters & Relief Camps</h3>
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Register New Shelter</button>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[
          { name: "Central City High School", cap: 450, max: 500, manager: "Elena R.", status: "Nearing Capacity" },
          { name: "East District Community Center", cap: 120, max: 300, manager: "David K.", status: "Accepting Intake" },
          { name: "North Stadium Temporary Camp", cap: 1850, max: 2000, manager: "Gov Taskforce", status: "Critical Fill" }
        ].map((s, i) => {
          const percent = Math.round((s.cap / s.max) * 100);
          return (
            <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl group hover:border-slate-700 transition-all flex flex-col justify-between">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h4 className="text-white font-bold text-lg">{s.name}</h4>
                   <p className="text-slate-400 text-sm flex items-center gap-1"><Users className="w-3.5 h-3.5"/> Manager: {s.manager}</p>
                 </div>
                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${percent > 90 ? 'bg-red-500/20 text-red-400' : percent > 75 ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{s.status}</span>
               </div>
               <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-400">Current Occupancy</span>
                    <span className="text-white">{s.cap} / {s.max} Individuals</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${percent > 90 ? 'bg-red-500' : percent > 75 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${percent}%` }}></div>
                  </div>
               </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  const renderComms = () => (
    <div className="space-y-6 animate-fade-in grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-[500px] flex flex-col">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-800 pb-4"><MessageSquare className="text-blue-400"/> Emergency Broadcast Radio</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
             <div className="bg-slate-800/50 p-4 rounded-xl rounded-tl-none border border-slate-700 w-4/5">
                <p className="text-xs text-blue-400 font-bold mb-1">HQ Command</p>
                <p className="text-slate-300 text-sm">All units be advised, severe flooding reported in Sector 4. Evacuation teams OP-DELTA-9 divert immediately.</p>
                <p className="text-[10px] text-slate-500 mt-2">10:42 AM</p>
             </div>
             <div className="bg-indigo-500/10 p-4 rounded-xl rounded-tr-none border border-indigo-500/20 w-4/5 ml-auto">
                <p className="text-xs text-indigo-400 font-bold mb-1">Unit FOXTROT-1</p>
                <p className="text-white text-sm">Copy HQ. Route 14 is blocked by debris, taking alternate path through East District.</p>
                <p className="text-[10px] text-indigo-300/50 mt-2 text-right">10:45 AM</p>
             </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input type="text" placeholder="Transmit to all units..." className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25">Send</button>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-rose-900/20 border border-rose-500/30 p-5 rounded-2xl">
           <h4 className="text-rose-400 font-bold flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5"/> Public SMS Alert</h4>
           <p className="text-slate-400 text-xs mb-4">Instantly broadcast an SMS emergency warning to all registered citizens in a selected danger zone.</p>
           <button className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20">Trigger Broadcast</button>
        </div>
      </div>
    </div>
  );

  const renderDonations = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
           <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Relief Fund</p>
           <h3 className="text-4xl font-black text-emerald-400">$1.24M</h3>
           <p className="text-xs text-emerald-500/50 mt-2">+12% this week</p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
           <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Funds Allocated</p>
           <h3 className="text-4xl font-black text-blue-400">$840K</h3>
           <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3"><div className="w-[68%] h-full bg-blue-500 rounded-full"></div></div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
           <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Active Donors</p>
           <h3 className="text-4xl font-black text-purple-400">8,402</h3>
        </div>
      </div>
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
         <div className="p-4 border-b border-slate-800 bg-slate-900/80"><h4 className="font-bold text-white">Recent Transactions</h4></div>
         <div className="divide-y divide-slate-800/50">
            {[
              { donor: "Anonymous", amt: "$5,000", dest: "Medical Supplies Drop OP-ECHO", date: "Today, 09:15 AM" },
              { donor: "Global Aid Corp", amt: "$50,000", dest: "Central City Shelter Fund", date: "Yesterday, 14:30 PM" },
              { donor: "Sarah Jenkins", amt: "$100", dest: "General Relief Fund", date: "Yesterday, 11:20 AM" },
            ].map((t, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                 <div>
                   <p className="text-white font-semibold text-sm">{t.donor}</p>
                   <p className="text-slate-500 text-xs mt-0.5">Allocated to: <span className="text-slate-400">{t.dest}</span></p>
                 </div>
                 <div className="text-right">
                   <p className="text-emerald-400 font-bold">{t.amt}</p>
                   <p className="text-slate-600 text-[10px] mt-0.5">{t.date}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderMonitor = () => (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in h-[calc(100vh-12rem)]">
      <div className="w-full md:w-1/3 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 font-bold text-white flex justify-between items-center">
          Active Incidents <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs">{reports.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 shadow-inner">
          {reports.map((r, i) => (
            <div key={i} className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white text-sm">{r.type}</span>
                <span className="text-[10px] text-slate-400">{r.time?.toDate ? new Date(r.time.toDate()).toLocaleTimeString() : 'Now'}</span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400"/> {r.location}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-2/3 bg-slate-900/80 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col">
         <DisasterMap embedded={true} />
      </div>
    </div>
  );

  const renderMissing = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><UserSearch className="text-indigo-400"/> Missing Person Database</h3>
        <div className="flex gap-2">
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Run Facial Scan</button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">Register Safe</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: "John Doe", age: 34, lastSeen: "Sector 4 Underpass", match: "85% AI Match", status: "Investigating" },
          { name: "Maria Garcia", age: 12, lastSeen: "East Relief Camp", match: "No Match", status: "Missing" },
          { name: "Samuel Lee", age: 67, lastSeen: "River Bank North", match: "Verified Safe", status: "Found" },
          { name: "Unknown Male", age: "approx 40", lastSeen: "Found at Shelter B", match: "Pending Scan", status: "Found" },
        ].map((m, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex flex-col items-center text-center group hover:border-slate-700 transition-all">
             <div className="w-20 h-20 bg-slate-800 rounded-full mb-4 border-2 border-slate-700 overflow-hidden flex items-center justify-center">
                <UserSearch className="w-8 h-8 text-slate-600" />
             </div>
             <h4 className="text-white font-bold">{m.name}</h4>
             <p className="text-slate-400 text-xs mb-3">Age: {m.age}</p>
             <p className="text-slate-300 text-xs mb-4"><MapPin className="w-3 h-3 inline text-slate-500"/> {m.lastSeen}</p>
             
             <div className="w-full mt-auto space-y-2">
               <div className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase w-full ${m.status === 'Found' ? 'bg-emerald-500/20 text-emerald-400' : m.status === 'Investigating' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                 {m.status}
               </div>
               <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 py-1.5 rounded-lg border border-indigo-500/20">
                 {m.match}
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><FileText className="text-rose-400"/> Citizen Verification Inbox</h3>
        <div className="space-y-4">
          {[
            { tag: "Flood", desc: "Water rapidly rising near the old bridge. People trapped.", verify: 4 },
            { tag: "Fire", desc: "Smoke coming from the warehouse district.", verify: 12 },
            { tag: "Medical", desc: "Group of 10 people need immediate first aid at the community hall.", verify: 2 },
          ].map((r, i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
               <div className="flex gap-4 items-start">
                 <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 shrink-0">
                   <AlertCircle className="w-6 h-6 text-rose-400" />
                 </div>
                 <div>
                   <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">{r.tag}</span>
                   <p className="text-white text-sm leading-relaxed">{r.desc}</p>
                   <div className="flex gap-2 mt-3">
                     <span className="text-xs text-blue-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> {r.verify} Citizens Verified This</span>
                   </div>
                 </div>
               </div>
               <div className="flex gap-2 w-full md:w-auto shrink-0">
                 <button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Verify & Escalate</button>
                 <button className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Dismiss</button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6 animate-fade-in grid lg:grid-cols-2 gap-6">
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
         <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><BarChart3 className="text-emerald-400"/> Response Time Metrics</h3>
         <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2"><span>Average Dispatch Time</span> <span className="text-white">4.2 Mins</span></div>
              <div className="w-full bg-slate-800 rounded-full h-2"><div className="w-[85%] h-full bg-emerald-500 rounded-full"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2"><span>Resource Delivery</span> <span className="text-white">18 Mins</span></div>
              <div className="w-full bg-slate-800 rounded-full h-2"><div className="w-[60%] h-full bg-blue-500 rounded-full"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2"><span>SOS Resolution</span> <span className="text-white">2.1 Hours</span></div>
              <div className="w-full bg-slate-800 rounded-full h-2"><div className="w-[90%] h-full bg-purple-500 rounded-full"></div></div>
            </div>
         </div>
      </div>
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
         <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><Activity className="text-rose-400"/> Impact Summary</h3>
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl text-center">
               <span className="text-3xl font-black text-white">1,402</span>
               <p className="text-xs text-slate-400 mt-1 uppercase">Lives Saved</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl text-center">
               <span className="text-3xl font-black text-white">84.5k</span>
               <p className="text-xs text-slate-400 mt-1 uppercase">Rations Dist.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl text-center">
               <span className="text-3xl font-black text-white">92%</span>
               <p className="text-xs text-slate-400 mt-1 uppercase">Success Rate</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl text-center">
               <span className="text-3xl font-black text-white">0</span>
               <p className="text-xs text-slate-400 mt-1 uppercase">Lost Units</p>
            </div>
         </div>
      </div>
    </div>
  );

  const renderDocs = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><FolderOpen className="text-amber-400"/> Evidence & Document Center</h3>
        <button className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Upload New File</button>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { name: "Sector 4 Damage Assessment.pdf", type: "PDF", size: "4.2 MB", date: "Today" },
          { name: "Global Aid Allocation Approval.doc", type: "DOC", size: "1.1 MB", date: "Yesterday" },
          { name: "Govt_Relief_Mandate_Q3.pdf", type: "PDF", size: "8.5 MB", date: "Mar 12" },
          { name: "Bridge_Collapse_Photos.zip", type: "ZIP", size: "142 MB", date: "Mar 10" },
        ].map((f, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors group cursor-pointer text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-amber-500/50 group-hover:text-amber-400 transition-colors">
               {f.type === 'PDF' ? <FileText className="w-8 h-8"/> : <FolderOpen className="w-8 h-8"/>}
             </div>
             <p className="text-white text-sm font-bold truncate w-full">{f.name}</p>
             <p className="text-slate-500 text-xs mt-1">{f.size} • Uploaded {f.date}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="space-y-6 animate-fade-in grid lg:grid-cols-2 gap-6">
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-full">
         <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><BrainCircuit className="text-purple-400"/> AI Resource Prediction</h3>
         <p className="text-slate-400 text-sm mb-6">Based on current weather patterns and active damage reports, the AI projects resource shortages in the following areas over the next 48 hours.</p>
         <div className="space-y-4">
           {['East Relief Camp (Water) - 92% Probable', 'Sector 7 (Trauma Kits) - 88% Probable', 'North High School (Blankets) - 75% Probable'].map((ai, i) => (
             <div key={i} className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex items-center justify-between">
                <span className="text-purple-300 font-semibold text-sm">{ai}</span>
                <button className="bg-purple-600/50 hover:bg-purple-500 text-white px-3 py-1 rounded text-xs font-bold">Auto-Allocate</button>
             </div>
           ))}
         </div>
      </div>
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
         <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><ShieldAlert className="text-red-400"/> AI Threat Analysis</h3>
         <div className="aspect-square bg-slate-800/50 rounded-xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-700 group hover:border-red-500/50 transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <BrainCircuit className="w-16 h-16 text-red-500/50 mb-4 animate-pulse"/>
            <p className="text-slate-300 font-bold text-center px-6 text-sm">Floodwaters projected to breach Sector 9 levys within 6 hours.</p>
            <button className="mt-6 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-500/25">Draft Evac Plan</button>
         </div>
      </div>
    </div>
  );

  const renderCommand = () => (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl h-[calc(100vh-12rem)] relative overflow-hidden animate-fade-in flex flex-col">
       <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
       </div>
       <div className="relative z-10 p-4 border-b border-slate-800 bg-slate-900/90 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><Globe className="text-blue-400"/> Macro Command View</h3>
          <div className="flex gap-2">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">Teams: 12 Active</span>
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">Routes: 8 Clear</span>
          </div>
       </div>
       <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
          {/* Simulated HUD elements */}
          <div className="absolute top-10 left-10 p-4 bg-black/50 backdrop-blur-md rounded-xl border border-slate-700/50 w-64">
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 border-b border-slate-700 pb-2">Unit FOXTROT Tracker</p>
             <p className="text-white text-sm">Heading: 145° South</p>
             <p className="text-emerald-400 text-sm">Speed: 45 km/h</p>
          </div>
          <div className="absolute bottom-10 right-10 p-4 bg-black/50 backdrop-blur-md rounded-xl border border-slate-700/50 w-64">
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 border-b border-slate-700 pb-2">Shelter C Occupancy</p>
             <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2"><div className="w-[95%] h-full bg-red-500 rounded-full animate-pulse"></div></div>
             <p className="text-red-400 text-xs mt-1 text-right">Critical Fill</p>
          </div>
          <Target className="w-32 h-32 text-blue-500/20 animate-[spin_10s_linear_infinite]" />
          <p className="mt-4 text-slate-500 font-mono text-sm tracking-widest">AWAITING SATELLITE UPLINK</p>
       </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return renderOverview();
      case 'volunteers': return renderVolunteers();
      case 'missions': return renderMissions();
      case 'inventory': return renderInventory();
      case 'shelter': return renderShelter();
      case 'comms': return renderComms();
      case 'donations': return renderDonations();
      case 'monitor': return renderMonitor();
      case 'missing': return renderMissing();
      case 'reports': return renderReports();
      case 'analytics': return renderAnalytics();
      case 'docs': return renderDocs();
      case 'ai': return renderAI();
      case 'command': return renderCommand();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden pt-16">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 h-auto md:h-[calc(100vh-4rem)] overflow-y-auto flex shrink-0">
        <div className="flex flex-col w-full py-6 px-4 gap-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">NGO Commands</div>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${
                  isActive 
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 shadow-inner' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-auto md:h-[calc(100vh-4rem)] overflow-y-auto relative p-4 md:p-8">
        <div className="fixed top-20 right-20 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-0 left-64 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-8 bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span className="bg-indigo-500 p-2 rounded-xl"><Activity className="w-6 h-6 text-white"/></span>
              {MENU_ITEMS.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <button className="relatve p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors border border-slate-700" title="Notifications">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <div className="hidden sm:block text-right">
               <div className="text-sm font-bold text-white">Global Relief Team</div>
               <div className="text-xs text-emerald-400 flex justify-end items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> System Online</div>
             </div>
          </div>
        </div>

        {/* Dynamic View */}
        {renderContent()}

        {/* Modals */}
        {showModal === 'assignMission' && activeVolunteer && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
                <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                <h3 className="text-xl font-bold text-white mb-2">Assign Volunteer</h3>
                <p className="text-slate-400 text-sm mb-6">Assign <span className="text-emerald-400 font-semibold">{activeVolunteer.name}</span> to an active emergency or relief effort.</p>
                <form onSubmit={handleAssignMission} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Location / Mission</label>
                    <input name="missionName" type="text" required placeholder="e.g. Sector 7 Evacuation" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 mt-4">Dispatch Volunteer</button>
                </form>
             </div>
          </div>
        )}

        {showModal === 'deployUnit' && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
                <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                <h3 className="text-xl font-bold text-white mb-6">Deploy Rescue Unit</h3>
                <form onSubmit={handleDeployUnit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Assigned Call Sign</label>
                    <input name="unitCode" type="text" required placeholder="e.g. ALPHA, BRAVO" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white uppercase focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mission Type</label>
                    <input name="missionType" type="text" required placeholder="e.g. Water Rescue" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Deployment Location</label>
                    <input name="location" type="text" required placeholder="GPS / Landmark" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Priority Level</label>
                     <select name="priority" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none">
                        <option value="CRITICAL">🔴 CRITICAL</option>
                        <option value="HIGH">🟠 HIGH</option>
                        <option value="MEDIUM">🟡 MEDIUM</option>
                     </select>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/25 mt-4">Authorized Deployment</button>
                </form>
             </div>
          </div>
        )}

        {showModal === 'requestSupply' && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
                <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                <h3 className="text-xl font-bold text-white mb-6">Request Relief Supplies</h3>
                <form onSubmit={handleRequestSupply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Item Classification</label>
                    <input name="itemName" type="text" required placeholder="e.g. Antibiotics, Flashlights" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Quantity Needed</label>
                    <input name="itemQty" type="number" required placeholder="Exact or estimate" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Drop Destination</label>
                    <input name="destination" type="text" required placeholder="Shelter / Camp / Coord" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/25 mt-4">Submit Requisition</button>
                </form>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;