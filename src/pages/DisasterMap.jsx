import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from "react-leaflet";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix Leaflet icon issue */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Routes removed as per user request

function DisasterMap({ embedded = false }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "disasters"),
      async (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        const resolvedReports = await Promise.all(
          docs.map(async (r) => {
            const coords = await getCoordinates(r.location);
            return {
              ...r,
              coords
            };
          })
        );
        setReports(resolvedReports);
      }
    );
    return () => unsubscribe();
  }, []);

  const getCoordinates = async (location) => {
    if (!location) return null;
    const match = location.match(/Latitude:\s*([0-9.\-]+),\s*Longitude:\s*([0-9.\-]+)/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { q: location, format: "json", limit: 1 }
      });
      if (response.data.length > 0) {
        return { lat: parseFloat(response.data[0].lat), lng: parseFloat(response.data[0].lon) };
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return null;
  };

  const getRiskColor = (type) => {
    if (!type) return "#3b82f6";
    const disaster = type.toLowerCase();
    if (disaster.includes("earthquake") || disaster.includes("fire")) return "#ef4444";
    if (disaster.includes("flood") || disaster.includes("storm") || disaster.includes("hurricane")) return "#f59e0b";
    return "#3b82f6";
  };

  return (
    <div className={`relative w-full flex flex-col items-center z-0 ${embedded ? 'h-full bg-transparent' : 'h-screen bg-slate-950 pt-20'}`}>
      {/* Legend overlay */}
      <div className={`absolute right-4 z-[400] bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shadow-2xl animate-fade-in text-white/90 min-w-[200px] ${embedded ? 'top-4 pointer-events-none scale-90 origin-top-right' : 'top-24'}`}>
        <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-slate-300">Live Map Legend</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> <span>High Risk Zone</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div> <span>Hazard Zone</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> <span>Reported Emergency</span></div>
        </div>
      </div>

      <div className={`w-full h-full relative z-0 ${embedded ? 'p-0' : 'p-4'}`}>
        <div className={`w-full h-full overflow-hidden bg-slate-900 ${embedded ? 'rounded-none border-none' : 'rounded-3xl border border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.5)]'}`}>
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }} className="z-0">
             <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="map-tiles"
             />

            {/* Render Disasters */}
            {reports.map((r, i) => {
              if (!r.coords) return null;
              const riskColor = getRiskColor(r.type);

              return (
                <div key={`marker-group-${r.id || i}`}>
                  <Marker position={[r.coords.lat, r.coords.lng]}>
                    <Popup className="dms-popup font-sans">
                      <div className="p-1">
                        <strong className="text-base text-slate-800 block mb-1 border-b pb-1">{r.type}</strong>
                        <div className="text-sm text-slate-600 mt-2">
                          <b>Loc:</b> {r.location}<br />
                          <b>Needs:</b> {r.needs}<br />
                          <b className="mt-1 inline-block px-2 py-0.5 bg-slate-100 rounded text-slate-700 border border-slate-200 uppercase text-xs">Status: {r.status || 'Pending'}</b>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={[r.coords.lat, r.coords.lng]}
                    radius={5000}
                    pathOptions={{ color: riskColor, fillColor: riskColor, fillOpacity: 0.35, weight: 2 }}
                  />
                  <Circle
                    center={[r.coords.lat, r.coords.lng]}
                    radius={15000}
                    pathOptions={{ color: riskColor, fillColor: riskColor, fillOpacity: 0.1, weight: 0 }}
                  />
                </div>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Inject Dark Mode filter for the map tiles */}
      <style>{`
        .leaflet-layer,
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out,
        .leaflet-control-attribution {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
    </div>
  );
}

export default DisasterMap;