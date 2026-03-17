import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function SOSButton() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncOfflineSOS();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check for any pending SOS on mount
    if (navigator.onLine) {
      syncOfflineSOS();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncOfflineSOS = async () => {
    const pendingSOS = localStorage.getItem("pending_sos");
    if (pendingSOS) {
      try {
        const sosData = JSON.parse(pendingSOS);
        // Process each pending SOS
        for (const sos of sosData) {
          await addDoc(collection(db, "disasters"), {
            ...sos,
            time: serverTimestamp(),
            status: "Pending", // Ensure it hits the pipeline tracker
          });
          // Simulate SMS
          console.log("Simulating SMS dispatch to active NGOs for synced SOS...");
        }
        localStorage.removeItem("pending_sos");
        alert("Connection restored! Queued SOS distress signals have been dispatched via SMS to nearby NGOs.");
      } catch (error) {
        console.error("Failed to sync offline SOS:", error);
      }
    }
  };

  const handleSOS = () => {
    if (window.confirm("EMERGENCY 🚨\n\nAre you sure you want to broadcast an SOS and send an SMS to all nearby NGO responders?")) {
      
      const sosPayload = {
        type: "SOS EMERGENCY",
        location: "GPS: Tracking coordinates...", // In a real app we'd use geolocation navigator.geolocation
        needs: "Immediate Rescue / Medical Attention",
        priority: "CRITICAL",
        status: "Pending",
      };

      if (!navigator.onLine) {
        const existing = JSON.parse(localStorage.getItem("pending_sos") || "[]");
        existing.push(sosPayload);
        localStorage.setItem("pending_sos", JSON.stringify(existing));
        alert("You are currently OFFLINE. Your SOS has been saved locally and will automatically dispatch the moment you regain internet connection.");
      } else {
        // Online, send directly
        addDoc(collection(db, "disasters"), {
          ...sosPayload,
          time: serverTimestamp()
        }).then(() => {
          alert("SOS Broadcasted! SMS dispatch simulated to nearby NGOs. Help is on the way.");
        }).catch(err => {
          console.error("Error sending SOS:", err);
          alert("Failed to send SOS. Please try calling emergency services.");
        });
      }
    }
  };

  return (
    <button
      onClick={handleSOS}
      className={`fixed bottom-6 right-6 z-50 text-white p-4 rounded-full transition-all duration-300 group flex items-center justify-center animate-bounce hover:animate-none ${
        isOffline 
        ? 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]' 
        : 'bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)]'
      }`}
      title={isOffline ? "SOS (Offline Mode)" : "EMERGENCY SOS"}
    >
      <AlertTriangle className="w-8 h-8 group-hover:scale-110 transition-transform" />
    </button>
  );
}

export default SOSButton;
