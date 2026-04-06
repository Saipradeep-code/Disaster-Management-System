import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, UserPlus, MapPin, AlertCircle, Camera, CheckCircle2 } from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

function MissingPersons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "missing_persons"), (snapshot) => {
      setPersons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const filtered = persons.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.lastSeen?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 pt-24 pb-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20">
              <Search className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Missing Persons Portal
              </h1>
              <p className="text-slate-400 mt-1">AI-powered facial recognition matching active</p>
            </div>
          </div>
          <Link
            to="/report-missing"
            className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2 whitespace-nowrap group"
          >
            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Report Missing Person
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by name or last known location..."
            className="w-full pl-11 pr-4 py-4 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-500 transition-all outline-none shadow-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* AI Notice */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8 flex items-start gap-3 backdrop-blur-sm animate-fade-in">
          <Camera className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-200">
            <strong>Facial Recognition Active:</strong> Uploading a clear photo when reporting significantly increases the chances of an automatic match against shelter registries and public sighting reports.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((person, i) => (
            <div 
              key={person.id} 
              className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-xl hover:border-slate-600 transition-all group hover:-translate-y-1 overflow-hidden relative"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Status Banner */}
              <div className={`absolute top-0 left-0 w-full h-1.5 ${person.status === 'Found' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

              <div className="flex gap-4 items-start">
                <img src={person.image} alt={person.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{person.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-slate-400">Age: {person.age}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${person.status === 'Found' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {person.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 flex items-start gap-1.5 mt-2">
                    <MapPin className="w-4 h-4 text-purple-400 shrink-0" /> {person.lastSeen || person.location}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/50 flex gap-2">
                {person.status === 'Missing' || person.status === 'Investigating' ? (
                  <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" /> I have info
                  </button>
                ) : (
                  <button className="flex-1 bg-emerald-500/10 text-emerald-400 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-default">
                    <CheckCircle2 className="w-4 h-4" /> Reunited
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/20 rounded-2xl border border-slate-800/50 border-dashed">
              No matching records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MissingPersons;
