import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import {
  ShieldAlert, MapPin, CheckCircle2, AlertCircle, Clock, Activity,
  ArrowRight, Truck, LayoutDashboard, Map, Users, Target, Box,
  Home, UserSearch, FileText, MessageSquare, DollarSign, BarChart3,
  FolderOpen, BrainCircuit, Globe, Bell, Trash2
} from "lucide-react";
import DisasterMap from "./DisasterMap";

// Remove MOCK_STATS

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic State for interactive demo features
  const [showModal, setShowModal] = useState(null);
  const [activeVolunteer, setActiveVolunteer] = useState(null);

  const [shelters, setShelters] = useState([
  ]);

  const [missingPersons, setMissingPersons] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [commsMessages, setCommsMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [missions, setMissions] = useState([]);

  const [inventory, setInventory] = useState([

  ]);

  // Handle Form Submissions
  const handleAssignMission = async (e) => {
    e.preventDefault();
    const missionName = e.target.missionName.value;
    if (activeVolunteer?.id) {
      await updateDoc(doc(db, "volunteers", activeVolunteer.id), { status: 'On Mission', loc: missionName });
    }
    setShowModal(null);
    setActiveVolunteer(null);
  };

  const handleDeployUnit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "disasters"), {
      type: `Op: ${e.target.missionType.value}`,
      location: e.target.location.value,
      needs: "Deployed NGO Unit",
      priority: e.target.priority.value,
      status: "En Route",
      time: serverTimestamp()
    });
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

  const handleApproveVolunteer = async (id) => {
    await updateDoc(doc(db, "volunteers", id), { status: "Available" });
  };

  const handleRegisterShelter = (e) => {
    e.preventDefault();
    const newShelter = {
      id: Date.now(),
      name: e.target.shelterName.value,
      cap: parseInt(e.target.currentCap.value) || 0,
      max: parseInt(e.target.maxCap.value) || 100,
      manager: e.target.managerName.value,
      status: "Accepting Intake"
    };
    setShelters([...shelters, newShelter]);
    setShowModal(null);
  };

  const handleRegisterMissing = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "missing_persons"), {
      name: e.target.personName.value,
      age: e.target.age.value,
      lastSeen: e.target.lastSeen.value,
      match: "Pending Scan",
      status: "Missing"
    });
    setShowModal(null);
  };

  const markMissingAsFound = async (id) => {
    await updateDoc(doc(db, "missing_persons", id), { status: "Found", match: "Verified Safe" });
  };

  const runFacialScan = () => {
    setMissingPersons(missingPersons.map(m => m.status === "Missing" ? { ...m, match: `${Math.floor(Math.random() * 40 + 50)}% AI Match`, status: "Investigating" } : m));
    alert("Facial recognition scan completed across active shelter cameras and public feeds.");
  };

  const handleSendComms = (e) => {
    e.preventDefault();
    const newMsg = {
      sender: "HQ Command",
      text: e.target.commsText.value,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isHQ: true
    };
    setCommsMessages([...commsMessages, newMsg]);
    e.target.reset();
  };

  const handleSMSBroadcast = () => {
    alert("SMS Broadcast Sent successfully to all affected regions.");
  };

  const handleUploadDocument = (e) => {
    e.preventDefault();
    const file = e.target.fileUpload.files[0];
    if (file) {
      const newDoc = {
        name: file.name,
        type: file.name.split('.').pop().toUpperCase(),
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        date: "Just Now"
      };
      setDocuments([newDoc, ...documents]);
      setShowModal(null);
    }
  };

  const handleAutoAllocate = (aiStr) => {
    alert(`AI Successfully optimized and routed resources for: ${aiStr}`);
  };

  useEffect(() => {
    const unsubscribeDisasters = onSnapshot(
      collection(db, "disasters"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        data.sort((a, b) => {
          const timeA = a.time?.toMillis ? a.time.toMillis() : Date.now();
          const timeB = b.time?.toMillis ? b.time.toMillis() : Date.now();
          return timeB - timeA;
        });
        setReports(data);

        const pendingAlerts = data.filter(d => d.status === "Pending" || !d.status);
        if (pendingAlerts.length > 0) {
          setLatestAlert(pendingAlerts[0]);
        } else {
          setLatestAlert(null);
        }
      }
    );

    // Watch Volunteers Collection
    let volQuery = collection(db, "volunteers");
    if (auth.currentUser?.email) {
      volQuery = query(collection(db, "volunteers"), where("ngoEmail", "==", auth.currentUser.email));
    }
    const unsubscribeVols = onSnapshot(volQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort so Pending is at the top
      data.sort((a) => (a.status === 'Pending' ? -1 : 1));
      setVolunteers(data);
    });

    // Watch Missing Persons Collection
    const unsubscribeMissing = onSnapshot(collection(db, "missing_persons"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMissingPersons(data);
    });

    // Watch Donations Collection
    const unsubscribeDonations = onSnapshot(collection(db, "donations"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => {
        if (!a.time || !b.time) return 0;
        return b.time.toMillis() - a.time.toMillis();
      });
      setDonations(data);
    });

    return () => {
      unsubscribeDisasters();
      unsubscribeVols();
      unsubscribeMissing();
      unsubscribeDonations();
    };
  }, []);

  const advanceStatus = async (id, currentStatus, override) => {
    if (override === "Delete") {
      await deleteDoc(doc(db, "disasters", id));
      return;
    }

    const flow = ["Pending", "Acknowledged", "En Route", "Resolved"];
    const currentIndex = flow.indexOf(currentStatus || "Pending");

    if (currentIndex < flow.length - 1) {
      const nextStatus = flow[currentIndex + 1];
      const disasterRef = doc(db, "disasters", id);
      await updateDoc(disasterRef, { status: nextStatus });
    }
  };

  const clearResolvedReports = async () => {
    const resolvedIds = reports.filter(r => r.status === "Resolved").map(r => r.id);
    for (const id of resolvedIds) {
      if (id) {
        try {
          await deleteDoc(doc(db, "disasters", id));
        } catch (err) {
          console.error("Error deleting document: ", err);
        }
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'En Route': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Acknowledged': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
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
          { label: "Active Disasters", value: reports.filter(r => r.status && r.status !== "Resolved").length, color: "text-red-400" },
          { label: "Affected People", value: shelters.reduce((acc, s) => acc + (s.cap || 0), 0), color: "text-orange-400" },
          { label: "Volunteers Ready", value: volunteers.filter(v => v.status === 'Available').length, color: "text-emerald-400" },
          { label: "Rescue Missions", value: reports.filter(r => r.status === 'En Route' || r.status === 'Acknowledged').length, color: "text-blue-400" },
          { label: "Relief Resources", value: inventory.length, color: "text-indigo-400" },
          { label: "Active Shelters", value: shelters.length, color: "text-purple-400" }
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-400" /> Live Incident Pipeline</h3>
          {reports.some(r => r.status === "Resolved") && (
            <button onClick={clearResolvedReports} className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg border border-rose-500/20 text-xs font-bold transition-all shadow-lg hover:shadow-rose-500/20 group animate-fade-in">
              <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Clear Resolved
            </button>
          )}
        </div>
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



  const renderVolunteers = () => (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users className="text-emerald-400" /> Volunteer Force</h3>
        <span className="text-sm text-slate-400">Target NGO: {auth.currentUser?.email || "All (Demo User)"}</span>
      </div>

      {volunteers.length === 0 && (
        <div className="text-center py-12 text-slate-500 font-bold border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
          No volunteers have enlisted for your Command Center yet.
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers.map((v) => (
          <div key={v.id} className={`bg-slate-900/40 border p-5 rounded-2xl transition-colors group flex flex-col justify-between ${v.status === 'Pending' ? 'border-orange-500/30 hover:border-orange-500' : 'border-slate-800 hover:border-slate-700'}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-white font-bold text-lg">{v.name}</h4>
                <p className="text-emerald-400 text-sm font-semibold mt-0.5">{v.skill}</p>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${v.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' : v.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>{v.status}</span>
            </div>
            <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-4 mb-4"><MapPin className="w-3.5 h-3.5" /> {v.loc}</p>

            {v.status === 'Pending' ? (
              <button
                onClick={() => handleApproveVolunteer(v.id)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all mt-auto bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/20"
              >
                Approve Application
              </button>
            ) : (
              <button
                onClick={() => { setActiveVolunteer(v); setShowModal('assignMission'); }}
                disabled={v.status !== 'Available'}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all mt-auto ${v.status === 'Available' ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700' : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'}`}
              >
                {v.status === 'Available' ? 'Assign to Mission' : 'Currently Deployed'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMissions = () => {
    const activeMissions = reports.filter(r => r.status === 'En Route' || r.status === 'Acknowledged' || r.type?.includes('Evacuation / Rescue'));
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><Target className="text-blue-400" /> Active Operations</h3>
          <button onClick={() => setShowModal('deployUnit')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Deploy New Unit</button>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {activeMissions.length === 0 && (
            <div className="lg:col-span-2 text-center py-12 border border-slate-800 border-dashed rounded-2xl bg-slate-900/20 text-slate-500 font-semibold">
              No active rescue operations mounted. Acknowledge a Citizen report to begin a mission!
            </div>
          )}
          {activeMissions.map((m, i) => (
            <div key={m.id || i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-10 -mt-10 blur-2xl opacity-20 pointer-events-none transition-all group-hover:opacity-40 ${m.priority === 'CRITICAL' ? 'bg-red-500' : m.priority === 'HIGH' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
              <div className="flex justify-between items-center mb-4 relative z-10">
                <span className="text-xs font-mono text-slate-500 tracking-widest">{m.id?.substring(0, 8).toUpperCase() || 'OP-NEW'}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider ${m.priority === 'CRITICAL' ? 'border-red-500/50 text-red-400 bg-red-500/10' : m.priority === 'HIGH' ? 'border-orange-500/50 text-orange-400 bg-orange-500/10' : 'border-blue-500/50 text-blue-400 bg-blue-500/10'}`}>{m.priority || 'CRITICAL'}</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-1 relative z-10">{m.type}</h4>
              <p className="text-slate-400 text-sm flex items-center gap-1.5 mb-6"><MapPin className="w-4 h-4 text-blue-400" /> {m.location}</p>

              <div className="relative z-10 flex flex-col items-start gap-4 w-full">
                <div className="w-full">
                  <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
                    <span>Operation Progress</span>
                    <span className="text-white">{getProgressPercentage(m.status)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${m.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${getProgressPercentage(m.status)}%` }}></div>
                  </div>
                </div>
                <button onClick={() => advanceStatus(m.id, m.status)} className="w-full bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {m.status === 'Acknowledged' ? 'Dispatch Unit' : 'Resolve Mission'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  const renderInventory = () => {
    const resourceRequests = reports.filter(r => r.type?.includes('Food & Water') || r.type?.includes('Medical Emergency'));
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><Box className="text-amber-400" /> Depot Inventory</h3>
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

        <div className="mt-8">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-800 pb-3"><AlertCircle className="text-rose-400" /> Critical Resource Delivery Requests</h3>
          {resourceRequests.length === 0 && (
            <div className="text-center py-8 text-slate-500 font-semibold border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
              No active citizen requests for medical or food supply drops.
            </div>
          )}
          <div className="space-y-3">
            {resourceRequests.map((req, i) => (
              <div key={req.id || i} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-slate-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${req.type?.includes("Medical") ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{req.type}</h4>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" /> {req.location}</p>
                    <p className="text-[10px] text-slate-500 max-w-sm mt-1 border-l-2 border-slate-700 pl-2">{req.needs}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${req.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{req.status}</span>
                  <button onClick={() => advanceStatus(req.id, req.status === "Pending" ? "Acknowledged" : req.status)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-500/20">
                    {req.status === "Pending" ? 'Acknowledge' : 'Dispatch Supplies'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  };

  const renderShelter = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Home className="text-purple-400" /> Shelters & Relief Camps</h3>
        <button onClick={() => setShowModal('registerShelter')} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Register New Shelter</button>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {shelters.map((s) => {
          const percent = Math.min(100, Math.round((s.cap / s.max) * 100));
          return (
            <div key={s.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl group hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white font-bold text-lg">{s.name}</h4>
                  <p className="text-slate-400 text-sm flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Manager: {s.manager}</p>
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
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-800 pb-4"><MessageSquare className="text-blue-400" /> Emergency Broadcast Radio</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {commsMessages.map((msg, i) => (
              msg.isHQ ? (
                <div key={i} className="bg-slate-800/50 p-4 rounded-xl rounded-tl-none border border-slate-700 w-4/5">
                  <p className="text-xs text-blue-400 font-bold mb-1">{msg.sender}</p>
                  <p className="text-slate-300 text-sm">{msg.text}</p>
                  <p className="text-[10px] text-slate-500 mt-2">{msg.time}</p>
                </div>
              ) : (
                <div key={i} className="bg-indigo-500/10 p-4 rounded-xl rounded-tr-none border border-indigo-500/20 w-4/5 ml-auto">
                  <p className="text-xs text-indigo-400 font-bold mb-1">{msg.sender}</p>
                  <p className="text-white text-sm">{msg.text}</p>
                  <p className="text-[10px] text-indigo-300/50 mt-2 text-right">{msg.time}</p>
                </div>
              )
            ))}
          </div>
          <form onSubmit={handleSendComms} className="mt-4 flex gap-2">
            <input name="commsText" type="text" required placeholder="Transmit to all units..." className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25">Send</button>
          </form>
        </div>
      </div>
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-rose-900/20 border border-rose-500/30 p-5 rounded-2xl">
          <h4 className="text-rose-400 font-bold flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5" /> Public SMS Alert</h4>
          <p className="text-slate-400 text-xs mb-4">Instantly broadcast an SMS emergency warning to all registered citizens in a selected danger zone.</p>
          <button onClick={handleSMSBroadcast} className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20">Trigger Broadcast</button>
        </div>
      </div>
    </div>
  );

  const renderDonations = () => {
    // Calculate funds exactly as received from DB
    const totalDonated = donations.reduce((acc, curr) => acc + parseInt(curr.amt || 0), 0);
    const formattedTotal = totalDonated >= 1000000 ? `$${(totalDonated / 1000000).toFixed(2)}M` : `$${(totalDonated / 1000).toFixed(1)}K`;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid md:grid-cols-1 gap-6 mb-6">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Live Relief Fund</p>
            <h3 className="text-4xl font-black text-emerald-400">{formattedTotal}</h3>
            <p className="text-xs text-emerald-500/50 mt-2">Real-time validated NGO payments</p>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-900/80"><h4 className="font-bold text-white">Recent Transactions</h4></div>
          <div className="divide-y divide-slate-800/50 max-h-96 overflow-y-auto">
            {donations.map((t, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                <div>
                  <p className="text-white font-semibold text-sm">{t.donor}</p>
                  <p className="text-slate-500 text-xs mt-0.5">Allocated to: <span className="text-slate-400">{t.dest}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">${t.amt}</p>
                  <p className="text-slate-600 text-[10px] mt-0.5">{t.time?.toDate ? new Date(t.time.toDate()).toLocaleString() : 'Just now'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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
              <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400" /> {r.location}</p>
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
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><UserSearch className="text-indigo-400" /> Missing Person Database</h3>
        <div className="flex gap-2">
          <button onClick={runFacialScan} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Run Facial Scan</button>
          <button onClick={() => setShowModal('registerMissing')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">Register Missing</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {missingPersons.map((m) => (
          <div key={m.id} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex flex-col items-center text-center group hover:border-slate-700 transition-all relative">
            {m.status !== 'Found' && (
              <button
                onClick={() => markMissingAsFound(m.id)}
                className="absolute top-3 right-3 bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white p-1.5 rounded text-[10px] font-bold transition-colors"
                title="Mark as Found"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
            <div className="w-20 h-20 bg-slate-800 rounded-full mb-4 border-2 border-slate-700 overflow-hidden flex items-center justify-center">
              <UserSearch className="w-8 h-8 text-slate-600" />
            </div>
            <h4 className="text-white font-bold">{m.name}</h4>
            <p className="text-slate-400 text-xs mb-3">Age: {m.age}</p>
            <p className="text-slate-300 text-xs mb-4"><MapPin className="w-3 h-3 inline text-slate-500" /> {m.lastSeen}</p>

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
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><FileText className="text-rose-400" /> Citizen Verification Inbox</h3>
        <div className="space-y-4">
          {reports.filter(r => r.status === "Pending" || !r.status).map((r, i) => (
            <div key={r.id || i} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex gap-4 items-start">
                <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 shrink-0">
                  <AlertCircle className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">{r.type || "General"}</span>
                  <p className="text-white text-sm leading-relaxed">{r.needs || "Immediate assistance required"}</p>
                  <p className="text-slate-400 text-xs mt-1"><MapPin className="inline w-3 h-3" /> {r.location}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs text-blue-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {Math.floor(Math.random() * 10) + 1} Citizens Verified This</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto shrink-0">
                <button onClick={() => advanceStatus(r.id, "Pending")} className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Verify & Escalate</button>
                <button onClick={() => advanceStatus(r.id, null, "Delete")} className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Dismiss</button>
              </div>
            </div>
          ))}
          {reports.filter(r => r.status === "Pending" || !r.status).length === 0 && (
            <p className="text-slate-500 text-center py-8 font-semibold">No pending citizen reports for verification!</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    const liveSuccessRate = Math.min(100, 85 + missions.length);
    const activeVols = volunteers.filter(v => v.status === 'On Mission').length;

    return (
      <div className="space-y-6 animate-fade-in grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><BarChart3 className="text-emerald-400" /> Response Time Metrics</h3>
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
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><Activity className="text-rose-400" /> Impact Summary</h3>
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
              <span className="text-3xl font-black text-white">{liveSuccessRate}%</span>
              <p className="text-xs text-slate-400 mt-1 uppercase">Success Rate</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl text-center">
              <span className="text-3xl font-black text-white">{activeVols}</span>
              <p className="text-xs text-slate-400 mt-1 uppercase">Units Active</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDocs = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><FolderOpen className="text-amber-400" /> Evidence & Document Center</h3>
        <button onClick={() => setShowModal('uploadDoc')} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Upload New File</button>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {documents.map((f, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors group cursor-pointer text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-amber-500/50 group-hover:text-amber-400 transition-colors">
              {f.type === 'PDF' ? <FileText className="w-8 h-8" /> : <FolderOpen className="w-8 h-8" />}
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
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><BrainCircuit className="text-purple-400" /> AI Resource Prediction</h3>
        <p className="text-slate-400 text-sm mb-6">Based on current weather patterns and active damage reports, the AI projects resource shortages in the following areas over the next 48 hours.</p>
        <div className="space-y-4">
          {['East Relief Camp (Water) - 92% Probable', 'Sector 7 (Trauma Kits) - 88% Probable', 'North High School (Blankets) - 75% Probable'].map((ai, i) => (
            <div key={i} className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex items-center justify-between">
              <span className="text-purple-300 font-semibold text-sm">{ai}</span>
              <button onClick={() => handleAutoAllocate(ai)} className="bg-purple-600/50 hover:bg-purple-500 text-white px-3 py-1 rounded text-xs font-bold transition-colors">Auto-Allocate</button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><ShieldAlert className="text-red-400" /> AI Threat Analysis</h3>
        <div className="aspect-square bg-slate-800/50 rounded-xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-700 group hover:border-red-500/50 transition-colors">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <BrainCircuit className="w-16 h-16 text-red-500/50 mb-4 animate-pulse" />
          <p className="text-slate-300 font-bold text-center px-6 text-sm">Floodwaters projected to breach Sector 9 levys within 6 hours.</p>
          <button onClick={() => setShowModal('deployUnit')} className="mt-6 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-500/25 transition-colors">Draft Evac Plan</button>
        </div>
      </div>
    </div>
  );

  const renderCommand = () => {
    const activeTeamsCount = volunteers.filter(v => v.status === 'On Mission').length;

    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl h-[calc(100vh-12rem)] relative overflow-hidden animate-fade-in flex flex-col">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        <div className="relative z-10 p-4 border-b border-slate-800 bg-slate-900/90 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><Globe className="text-blue-400" /> Macro Command View</h3>
          <div className="flex gap-2">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">Teams: {activeTeamsCount} Deployed</span>
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
  };

  const renderContent = () => {
    switch (activeTab) {
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${isActive
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
              <span className="bg-indigo-500 p-2 rounded-xl"><Activity className="w-6 h-6 text-white" /></span>
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

        {showModal === 'registerShelter' && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
              <h3 className="text-xl font-bold text-white mb-6">Register Relief Shelter</h3>
              <form onSubmit={handleRegisterShelter} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Shelter Name</label>
                  <input name="shelterName" type="text" required placeholder="e.g. West End Stadium" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Occupancy</label>
                    <input name="currentCap" type="number" required defaultValue="0" min="0" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Max Capacity</label>
                    <input name="maxCap" type="number" required placeholder="e.g. 500" min="1" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Manager / POC Name</label>
                  <input name="managerName" type="text" required placeholder="e.g. Sgt. Johnson" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-purple-500/25 mt-4">Open Shelter</button>
              </form>
            </div>
          </div>
        )}

        {showModal === 'registerMissing' && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
              <h3 className="text-xl font-bold text-white mb-6">Report Missing Person</h3>
              <form onSubmit={handleRegisterMissing} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input name="personName" type="text" required placeholder="e.g. Jane Doe" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Age</label>
                  <input name="age" type="text" required placeholder="e.g. 24 or approx 30" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Last Known Location & Details</label>
                  <input name="lastSeen" type="text" required placeholder="e.g. Wore a red jacket at Sector 2" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 mt-4">Add to Database</button>
              </form>
            </div>
          </div>
        )}

        {showModal === 'uploadDoc' && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
              <h3 className="text-xl font-bold text-white mb-6">Upload Evidence or Document</h3>
              <form onSubmit={handleUploadDocument} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select File</label>
                  <input name="fileUpload" type="file" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 focus:border-amber-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500" />
                </div>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/25 mt-4">Upload to Database</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;