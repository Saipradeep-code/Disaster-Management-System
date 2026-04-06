import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  AlertTriangle, Map, Home, PlusCircle, LifeBuoy, Menu,
  Bell, Activity, MapPin, User, Settings, FileText, 
  MessageSquare, HeartHandshake, ShieldCheck, ChevronRight, DollarSign
} from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import DisasterMap from "./DisasterMap";

function UserHome() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeAlert, setActiveAlert] = useState(null);
  const [showModal, setShowModal] = useState(null);
  
  // --- Form & Feature States ---
  const [gpsAcquired, setGpsAcquired] = useState(false);
  const [reportType, setReportType] = useState('Flood');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [zone, setZone] = useState("Central District");
  const [activeRequests, setActiveRequests] = useState([
    { title: "Food / Water Supply", time: "2 hours ago", status: "Pending review" }
  ]);
  const [chatMessages, setChatMessages] = useState([
    { sender: "NGO Command", msg: "Hello, this is NGO Central. How can we assist you today?", time: "10:00 AM" }
  ]);
  const [selectedHelpType, setSelectedHelpType] = useState(null);

  const [aidFeed, setAidFeed] = useState([
    { name: "Sarah M.", action: "Offering", item: "Transport (SUV)", loc: "West End", time: "10m ago" },
    { name: "John D.", action: "Needs", item: "Baby Formula", loc: "Sector 4 Shelter", time: "25m ago" },
    { name: "Local Deli", action: "Offering", item: "Hot Meals (50)", loc: "Main Street", time: "1h ago" },
    { name: "Dr. Amy", action: "Offering", item: "First Aid Triage", loc: "Central Plaza", time: "2h ago" }
  ]);

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

  const handlePostAid = (e) => {
    e.preventDefault();
    const newPost = {
      name: "You",
      action: e.target.aidAction.value,
      item: e.target.aidItem.value,
      loc: zone,
      time: "Just now"
    };
    setAidFeed([newPost, ...aidFeed]);
    setShowModal(null);
  };

  const handleReportHazard = async (e) => {
    e.preventDefault();
    const finalReportType = reportType === 'Other' ? (e.target.customHazard?.value || 'Unknown Hazard') : reportType;
    try {
      await addDoc(collection(db, "disasters"), {
        type: `Hazard: ${finalReportType}`,
        location: (typeof gpsAcquired === 'string') ? gpsAcquired : (e.target.manualLocation?.value || zone),
        needs: `Investigate reported ${finalReportType}`,
        priority: "HIGH",
        status: "Pending",
        time: serverTimestamp()
      });
      alert(`Hazard report (${finalReportType}) successfully submitted to emergency services.`);
      setGpsAcquired(false);
      setPhotoUploaded(false);
      setActiveTab("home");
    } catch (error) {
      alert("Error submitting map hazard: " + error.message);
    }
  };

  const handleRequestHelpSubmit = async (e) => {
    e.preventDefault();
    const notes = e.target.notes?.value || "General assistance";
    try {
      await addDoc(collection(db, "disasters"), {
        type: `Assistance: ${selectedHelpType}`,
        location: zone || "Unknown Zone",
        needs: notes,
        priority: selectedHelpType === "Medical Emergency" ? "CRITICAL" : "HIGH",
        status: "Pending",
        time: serverTimestamp()
      });
      alert('Help request transmitted securely to the NGO network!');
      setShowModal(null);
    } catch (error) {
      console.error(error);
      alert('Error transmitting help request.');
    }
  };

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "donations"), {
        donor: "Generous Citizen",
        amt: e.target.amount.value,
        dest: e.target.ngoEmail.value,
        method: e.target.method.value,
        time: serverTimestamp()
      });
      alert('Donation successfully logged and routed to the central registry. Thank you!');
      setShowModal(null);
    } catch (err) {
      console.error(err);
      alert('Failed to process donation.');
    }
  };
  
  const handleChatSubmit = (e) => {
    e.preventDefault();
    const msg = e.target.chatMsg.value;
    if (!msg) return;
    setChatMessages([...chatMessages, { sender: "You", msg, time: "Just now" }]);
    e.target.reset();
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "volunteers"), {
        name: e.target.volName.value,
        skill: e.target.volSkill.value,
        loc: e.target.volLoc.value,
        ngoEmail: e.target.ngoEmail.value,
        status: "Pending",
        time: serverTimestamp()
      });
      alert(`Volunteer request successfully submitted to ${e.target.ngoEmail.value}.`);
      setShowModal(null);
    } catch (error) {
      alert("Failed to submit volunteer request: " + error.message);
    }
  };

  /* ------------------------------------- */
  /* TAB COMPONENTS                        */
  /* ------------------------------------- */

  const renderHome = () => (
    <div className="animate-fade-in pb-24 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Welcome & Quick Stats */}
        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h2 className="text-2xl font-bold text-white mb-1">Hello, Citizen</h2>
               <p className="text-sm text-slate-400 flex items-center gap-1"><MapPin className="w-4 h-4"/> {zone} (Home Zone)</p>
            </div>
            <div className="w-14 h-14 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center relative shadow-xl">
               <User className="w-7 h-7 text-slate-400" />
               <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
             <div className="bg-slate-950/50 rounded-2xl p-4 text-center border border-slate-800/50 shadow-inner">
                <span className="block text-3xl font-black text-rose-400 mb-1">2</span>
                <span className="text-[10px] md:text-xs uppercase font-bold text-slate-500">Active<br className="md:hidden"/> Hazards</span>
             </div>
             <div className="bg-slate-950/50 rounded-2xl p-4 text-center border border-slate-800/50 shadow-inner">
                <span className="block text-3xl font-black text-blue-400 mb-1">1</span>
                <span className="text-[10px] md:text-xs uppercase font-bold text-slate-500">My<br className="md:hidden"/> Reports</span>
             </div>
             <div className="bg-slate-950/50 rounded-2xl p-4 text-center border border-slate-800/50 shadow-inner">
                <span className="block text-3xl font-black text-emerald-400 mb-1">8</span>
                <span className="text-[10px] md:text-xs uppercase font-bold text-slate-500">Safe<br className="md:hidden"/> Zones</span>
             </div>
          </div>
        </div>

        {/* Critical Alerts Banner */}
        {activeAlert && (
          <div className="bg-red-950/40 border-l-4 border-red-500 p-5 rounded-2xl relative overflow-hidden group shadow-lg shadow-red-900/20 backdrop-blur-sm">
             <div className="flex gap-4 relative z-10">
               <div className="bg-red-500/20 p-3 rounded-xl h-fit animate-pulse border border-red-500/30">
                 <AlertTriangle className="w-8 h-8 text-red-500" />
               </div>
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-red-400 text-base flex items-center gap-2">
                     {activeAlert.type} 
                     <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse">{activeAlert.level}</span>
                   </h3>
                   <span className="text-xs font-bold text-red-500/60">{activeAlert.time}</span>
                 </div>
                 <p className="text-slate-300 text-sm leading-relaxed">{activeAlert.desc}</p>
               </div>
             </div>
          </div>
        )}

        {/* Emergency Quick Actions */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1 flex items-center gap-2"><Activity className="w-4 h-4"/> Emergency Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setActiveTab('report')} className="bg-rose-900/20 hover:bg-rose-900/40 border border-rose-500/30 p-6 rounded-3xl transition-all flex flex-col items-center justify-center gap-3 text-center group shadow-lg hover:shadow-rose-500/10">
               <AlertTriangle className="w-10 h-10 text-rose-400 group-hover:scale-110 transition-transform"/>
               <span className="text-sm md:text-base font-bold text-rose-300">Report Hazard</span>
            </button>
            <button onClick={() => setActiveTab('help')} className="bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/30 p-6 rounded-3xl transition-all flex flex-col items-center justify-center gap-3 text-center group shadow-lg hover:shadow-blue-500/10">
               <LifeBuoy className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform"/>
               <span className="text-sm md:text-base font-bold text-blue-300">Request Help</span>
            </button>
          </div>
        </div>

        {/* Volunteer Enlistment */}
        <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 group mb-4">
          <div>
             <h3 className="text-emerald-400 font-bold flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5"/> Join the Relief Force</h3>
             <p className="text-slate-400 text-sm mt-1 max-w-sm">Register your skills to a specific NGO command center to assist in active operations.</p>
          </div>
          <button onClick={() => setShowModal('registerVolunteer')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all w-full md:w-auto whitespace-nowrap group-hover:scale-105">
            Register as Volunteer
          </button>
        </div>

        {/* Global Donation Portal */}
        <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 group">
          <div>
             <h3 className="text-purple-400 font-bold flex items-center gap-2 text-lg"><DollarSign className="w-5 h-5"/> Emergency Relief Fund</h3>
             <p className="text-slate-400 text-sm mt-1 max-w-sm">Directly fund critical medical, food, and evacuation logistics for verified NGOs.</p>
          </div>
          <button onClick={() => setShowModal('donateToNgo')} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/25 transition-all w-full md:w-auto whitespace-nowrap group-hover:scale-105">
            Make a Donation
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Community Mutual Aid Feed */}
        <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800">
           <div className="flex justify-between items-center mb-4 px-1 border-b border-slate-800/50 pb-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><HeartHandshake className="w-4 h-4"/> Mutual Aid</h3>
              <button onClick={() => setShowModal('postAid')} className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/20">Post</button>
           </div>
           <div className="space-y-3">
              {aidFeed.map((feed, i) => (
                 <div key={i} className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between transition-colors cursor-pointer group">
                    <div className="flex gap-3 items-center">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border border-transparent group-hover:border-slate-600 transition-colors ${feed.action === 'Offering' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {feed.name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm text-white font-semibold">
                            <span className={feed.action === 'Offering' ? 'text-emerald-400' : 'text-orange-400'}>{feed.action}</span> {feed.item}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{feed.name} • {feed.loc}</p>
                       </div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500">{feed.time}</div>
                 </div>
              ))}
           </div>
        </div>

        {/* Preparedness / Local News Feed */}
        <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800">
           <div className="flex justify-between items-center mb-4 px-1 border-b border-slate-800/50 pb-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Bell className="w-4 h-4"/> Area Updates</h3>
           </div>
           <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-3">
                 <h4 className="text-sm font-bold text-white mb-1">Bridge Maintenance Ongoing</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">The old East River bridge will remain closed through Friday. Evacuation route diverted to Route 14.</p>
                 <span className="text-[10px] text-slate-500 font-bold mt-2 block">GOVT ALERT • TODAY 08:00 AM</span>
              </div>
              <div className="border-l-2 border-amber-500 pl-3">
                 <h4 className="text-sm font-bold text-white mb-1">Incoming Storm Warning</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">Category 2 storm expected to hit coast within 48 hrs. Secure loose outdoor property.</p>
                 <span className="text-[10px] text-slate-500 font-bold mt-2 block">WEATHER DEPT • YESTERDAY</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderReport = () => (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="bg-slate-900/50 backdrop-blur-md p-5 rounded-3xl border border-slate-800">
         <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><PlusCircle className="text-rose-400"/> Report Hazard</h2>
         <p className="text-slate-400 text-sm mb-6">Your report will be immediately visible to emergency services and nearby citizens.</p>
         
         <form onSubmit={handleReportHazard} className="space-y-4">
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hazard Type</label>
             <div className="grid grid-cols-2 gap-2">
                {['Flood', 'Fire', 'Collapse', 'Medical', 'Road Block', 'Other'].map(type => (
                  <div onClick={() => setReportType(type)} key={type} className={`bg-slate-950/50 border rounded-xl p-3 text-center cursor-pointer transition-colors ${reportType === type ? 'border-rose-500 bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'border-slate-700/50 hover:border-rose-500/50 hover:bg-rose-500/10'}`}>
                     <span className="text-sm font-semibold text-slate-300">{type}</span>
                  </div>
                ))}
             </div>
             {reportType === 'Other' && (
                <input name="customHazard" type="text" placeholder="Specify the exact hazard..." required className="w-full mt-2 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-rose-500 shadow-inner block animate-fade-in" />
             )}
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Location</label>
             <div className="flex gap-2 relative">
               <input type="text" name="manualLocation" placeholder="Enter specific address, city or landmark..." className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none transition-colors ${typeof gpsAcquired === 'string' ? 'border-emerald-500/50 opacity-50 cursor-not-allowed' : 'border-slate-700/50 focus:border-blue-500'}`} disabled={typeof gpsAcquired === 'string'} />
               <button onClick={() => {
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => setGpsAcquired(`Latitude: ${pos.coords.latitude}, Longitude: ${pos.coords.longitude}`),
                      (err) => { 
                        alert("⚠️ Hardware GPS request timed out or was blocked by OS settings.\n\nPlease type your location manually in the textbox."); 
                      },
                      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
                    );
                  }
               }} type="button" title="Acquire GPS coordinates directly from device" className={`shrink-0 px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg ${typeof gpsAcquired === 'string' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
                 <MapPin className="w-5 h-5" />
               </button>
             </div>
             {typeof gpsAcquired === 'string' && <p className="text-xs text-emerald-400 mt-2 font-semibold">✓ Exact GPS tracking locked. Manual input is ignored.</p>}
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Photo Evidence</label>
             <label className={`w-full relative bg-slate-950/50 border border-dashed rounded-xl h-24 flex items-center justify-center cursor-pointer transition-colors overflow-hidden ${photoUploaded ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-slate-700 text-slate-500 hover:bg-slate-800'}`}>
               <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setPhotoUploaded(e.target.files.length > 0)} />
               <span className="text-sm font-bold z-10 pointer-events-none">{photoUploaded ? "✓ Photo Evidence Attached" : "+ Tap to Upload Image/Document"}</span>
             </label>
            </div>
           <button type="submit" className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/25 transition-all">
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
               <div onClick={() => { 
                   if (r.title === "Report Missing Person") {
                     window.location.href = '/report-missing';
                   } else {
                     setSelectedHelpType(r.title); 
                     setShowModal('requestHelp'); 
                   }
                 }} key={i} className={`p-4 rounded-2xl border ${r.border} ${r.bg} flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity`}>
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
            <div className="space-y-3">
               {activeRequests.map((req, i) => (
                 <div key={i} className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex justify-between items-center text-left">
                    <div>
                       <span className="text-sm font-bold text-white">{req.title}</span>
                       <p className="text-xs text-slate-400">{req.time}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${req.status === 'Submitted' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>{req.status}</span>
                 </div>
               ))}
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
         <div onClick={() => setShowModal('guides')} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-slate-800/50 transition-colors">
            <FileText className="text-amber-400 w-8 h-8"/>
            <span className="text-sm font-bold text-slate-200">Survival Guides</span>
            <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Available Offline</span>
         </div>
         <div onClick={() => setShowModal('chat')} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-slate-800/50 transition-colors">
            <MessageSquare className="text-blue-400 w-8 h-8"/>
            <span className="text-sm font-bold text-slate-200">NGO Chat</span>
            <span className="text-[10px] text-slate-500">2 Unread</span>
         </div>
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden">
         <div onClick={() => setShowModal('contacts')} className="p-4 border-b border-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-3">
               <ShieldCheck className="text-slate-400 w-5 h-5"/>
               <span className="text-white font-semibold text-sm">Emergency Contacts</span>
            </div>
            <ChevronRight className="text-slate-600 w-5 h-5"/>
         </div>
         <div onClick={() => setShowModal('zone')} className="p-4 border-b border-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-3">
               <MapPin className="text-slate-400 w-5 h-5"/>
               <span className="text-white font-semibold text-sm">Zone Preferences</span>
            </div>
            <ChevronRight className="text-slate-600 w-5 h-5"/>
         </div>
         <div onClick={() => setShowModal('settings')} className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors">
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

      {/* Main Constraints */}
      <div className="w-full max-w-5xl h-full relative z-10 px-4 md:px-8 mx-auto flex flex-col">
         
         {/* Top Branding Header */}
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <ShieldCheck className="w-6 h-6 text-emerald-400"/>
              </div>
              Citizen Portal
            </h1>
            <div className="flex items-center gap-4">
              <span className="hidden md:flex text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">System Online</span>
              <button className="relative w-12 h-12 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg">
                 <Bell className="w-5 h-5 text-slate-400" />
                 <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              </button>
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 w-full relative">
           {renderContent()}
         </div>

         {/* Floating Centered Dock Nav Bar */}
         <div className="fixed bottom-0 left-0 w-full md:relative md:w-full z-50 pointer-events-none pb-6 md:pb-8">
            <div className="absolute inset-0 -top-16 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex pointer-events-none"></div>
            
            <div className="max-w-xl mx-auto bg-slate-900/90 backdrop-blur-xl border-t md:border border-slate-700 md:rounded-3xl p-3 md:p-4 shadow-2xl relative z-10 pointer-events-auto shadow-indigo-900/20">
               <div className="flex justify-around items-center px-2">
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
                        className={`flex flex-col items-center justify-center w-16 transition-all group ${item.special ? '-mt-10 relative z-20' : ''}`}
                      >
                         {item.special ? (
                           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 group-hover:rotate-3 ${isActive ? 'bg-gradient-to-tr from-rose-600 to-rose-400 shadow-rose-500/40 border border-rose-400/50' : 'bg-slate-800 border-2 border-slate-700 shadow-slate-900'}`}>
                             <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-400'}`} />
                           </div>
                         ) : (
                           <>
                             <div className={`p-2.5 rounded-2xl mb-1.5 transition-all w-full flex items-center justify-center group-hover:bg-slate-800 ${isActive ? 'bg-indigo-500/15 shadow-inner border border-indigo-500/20' : ''}`}>
                               <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                             </div>
                             <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`}>{item.label}</span>
                           </>
                         )}
                      </button>
                    )
                  })}
               </div>
            </div>
         </div>

         {/* Modals */}
         {showModal === 'postAid' && (
           <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                 <h3 className="text-xl font-bold text-white mb-6">Post to Mutual Aid</h3>
                 <form onSubmit={handlePostAid} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">I am...</label>
                     <select name="aidAction" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:border-indigo-500 focus:outline-none">
                       <option value="Offering">Offering Help</option>
                       <option value="Needs">Requesting Help</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Details (e.g. Blankets, Transport)</label>
                     <input name="aidItem" type="text" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:border-indigo-500 focus:outline-none" />
                   </div>
                   <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 mt-4">Post to Feed</button>
                 </form>
              </div>
           </div>
         )}
         
         {showModal === 'contacts' && (
           <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                 <h3 className="text-xl font-bold text-white mb-6">Emergency Contacts</h3>
                 <div className="space-y-3">
                   {['112 - National Emergency', '102 - Ambulance', '1078 - Disaster Response'].map(c => (
                     <div key={c} className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl flex justify-between items-center group cursor-pointer hover:border-slate-600 transition-colors">
                       <span className="text-white font-bold">{c}</span>
                       <span className="text-xs text-blue-400">Call Now</span>
                     </div>
                   ))}
                 </div>
              </div>
           </div>
         )}

         {showModal === 'settings' && (
           <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                 <h3 className="text-xl font-bold text-white mb-6">App Settings</h3>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center">
                     <span className="text-slate-300 font-semibold">Push Notifications</span>
                     <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-slate-300 font-semibold">Location Tracking</span>
                     <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-slate-300 font-semibold">Offline Caching</span>
                     <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
                   </div>
                 </div>
              </div>
           </div>
         )}

         {showModal === 'requestHelp' && (
           <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                 <h3 className="text-xl font-bold text-white mb-2">Request Priority Help</h3>
                 <p className="text-sm font-bold text-blue-400 mb-6 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">Category: {selectedHelpType}</p>
                 <form onSubmit={handleRequestHelpSubmit} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Additional Notes / Precise Location</label>
                     <textarea name="notes" rows="3" placeholder="I am on the second floor, need medical help..." required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:border-blue-500 focus:outline-none placeholder:text-slate-600"></textarea>
                   </div>
                   <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all mt-4">Submit Request to EMT/NGO</button>
                 </form>
              </div>
           </div>
         )}

         {showModal === 'guides' && (
           <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                 <h3 className="text-xl font-bold text-white mb-6">Survival Guides</h3>
                 <div className="space-y-3">
                   {['Flood Evacuation Protocol', 'First Aid: Severe Bleeding', 'Making Water Safe to Drink', 'Earthquake Safe Zones'].map(guide => (
                     <div key={guide} className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl flex justify-between items-center group cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors">
                       <span className="text-sm font-semibold text-white">{guide}</span>
                       <span className="text-[10px] text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded font-bold uppercase">Cached</span>
                     </div>
                   ))}
                 </div>
              </div>
           </div>
         )}

         {showModal === 'chat' && (
           <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
              <div className="bg-slate-900 border border-slate-700 p-0 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col h-[70vh]">
                 <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center relative z-10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> NGO Secure Chat</h3>
                    <button onClick={() => setShowModal(null)} className="text-slate-400 hover:text-white font-bold text-xl">✕</button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                         <span className="text-[10px] text-slate-500 mb-1 px-1">{msg.sender} • {msg.time}</span>
                         <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.sender === 'You' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}`}>
                           {msg.msg}
                         </div>
                      </div>
                    ))}
                 </div>
                 <form onSubmit={handleChatSubmit} className="p-4 border-t border-slate-800 bg-slate-900 flex gap-2">
                    <input name="chatMsg" type="text" placeholder="Type a message to command..." autoComplete="off" className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-xl font-bold shadow-lg shadow-indigo-500/20">Send</button>
                 </form>
              </div>
           </div>
         )}

         {showModal === 'zone' && (
           <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                 <h3 className="text-xl font-bold text-white mb-2">Zone Preferences</h3>
                 <p className="text-sm text-slate-400 mb-6">Select your primary evacuation zone for targeted local alerts.</p>
                 <div className="space-y-3">
                   {['Central District', 'North West Block', 'East End', 'South Sector'].map(z => (
                     <div onClick={() => { setZone(z); setShowModal(null); }} key={z} className={`p-4 rounded-xl flex justify-between items-center cursor-pointer transition-colors border ${zone === z ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-950/50 border-slate-800 text-white hover:border-emerald-500/50'}`}>
                       <span className="font-semibold text-sm">{z}</span>
                       {zone === z && <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>}
                     </div>
                   ))}
                 </div>
              </div>
           </div>
         )}

         {showModal === 'registerVolunteer' && (
           <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                 <h3 className="text-xl font-bold text-white mb-2"><ShieldCheck className="inline text-emerald-400 w-6 h-6 mr-2"/> Volunteer Registration</h3>
                 <p className="text-sm text-slate-400 mb-6">Your request will be placed in the Pending queue of the specified NGO.</p>
                 <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Legal Name</label>
                     <input name="volName" type="text" required placeholder="John Doe" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:border-emerald-500 focus:outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Primary Skill / Role</label>
                     <input name="volSkill" type="text" required placeholder="e.g. Paramedic, Heavy Transport" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:border-emerald-500 focus:outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Zone Location</label>
                     <input name="volLoc" type="text" required placeholder="Central District" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:border-emerald-500 focus:outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target NGO Email</label>
                     <input name="ngoEmail" type="email" required placeholder="central@ngo.com" className="w-full bg-emerald-950/30 border border-emerald-500/50 rounded-xl px-4 py-3 text-emerald-400 focus:border-emerald-400 focus:outline-none placeholder:text-emerald-700" />
                   </div>
                   <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all mt-4">Submit Volunteer Request</button>
                 </form>
              </div>
           </div>
         )}
         
         {showModal === 'donateToNgo' && (
           <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
                 <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">✕</button>
                 <h3 className="text-xl font-bold text-white mb-2"><DollarSign className="inline text-purple-400 w-6 h-6 mr-1"/> Fund Relief Operation</h3>
                 <p className="text-sm text-slate-400 mb-6 border-b border-slate-800 pb-4">Instantly inject monetary funds to a designated NGO for active distribution.</p>

                 <form onSubmit={handleDonateSubmit} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target NGO Email *</label>
                     <input name="ngoEmail" type="email" required placeholder="central@ngo.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:border-purple-500 focus:outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Donation Amount *</label>
                     <input name="amount" type="number" required placeholder="1000" className="w-full bg-purple-950/30 border border-purple-500/50 rounded-xl px-4 py-3 text-purple-400 focus:border-purple-400 focus:outline-none font-bold placeholder:font-normal placeholder:text-purple-700" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Selected Payment Protocol</label>
                     <select name="method" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:border-purple-500 focus:outline-none appearance-none">
                       <option value="PhonePe/UPI">PhonePe / UPI</option>
                       <option value="Credit Card">Credit/Debit Card</option>
                       <option value="NetBanking">Net Banking</option>
                     </select>
                   </div>
                   <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/25 transition-all mt-4">Confirm & Transfer Funds</button>
                 </form>
              </div>
           </div>
         )}

      </div>
    </div>
  );
}

export default UserHome;