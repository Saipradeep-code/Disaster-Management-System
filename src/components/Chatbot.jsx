import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your AI Emergency Assistant. I can provide real-time survival protocols, local shelter statuses, and triage guidance. How can I assist you?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const generateAIResponse = (query) => {
    const q = query.toLowerCase();
    
    // Complex Simulated Knowledge Base
    if (q.includes("volunteer")) return "You can register for volunteer operations directly from the User Dashboard. Command HQ will route you to the appropriate incident response sector.";
    if (q.includes("shelter") || q.includes("where to go")) return "The nearest fully equipped safe zones are Central City High School (currently at 90% capacity) and East District Community Center (currently accepting intake). Would you like me to map the safest route bypassing the flood zone?";
    if (q.includes("flood") || q.includes("water") || q.includes("drowning")) return "WATER HAZARD PROTOCOL:\n1. Move to the highest ground safely reachable.\n2. Do not attempt to walk through moving water (6 inches can knock you down).\n3. Avoid driving into flooded areas; vehicles can be swept away in 12 inches of water.\n4. Disconnect electrical appliances.";
    if (q.includes("fire") || q.includes("burn")) return "FIRE EMERGENCY PROTOCOL:\n1. Evacuate immediately. Stay low to the ground to avoid smoke inhalation.\n2. Do NOT use elevators.\n3. Before opening any door, feel the handle for heat.\nIf trapped, seal door gaps with wet cloth and signal from a window.";
    if (q.includes("medical") || q.includes("hurt") || q.includes("bleeding") || q.includes("injured")) return "TRIAGE PROTOCOL:\nIf facing severe arterial bleeding, apply firm, direct pressure with a clean cloth immediately. If someone is unconscious but breathing, place them in the recovery position. I advise utilizing the SOS Broadcast button for immediate EMT dispatch.";
    if (q.includes("missing") || q.includes("lost")) return "To locate a missing individual, please submit their details and last known location via the 'Request Help' -> 'Missing Person' panel. We will initiate an active facial recognition scan against all connected shelter security matrices.";
    if (q.includes("supplies") || q.includes("food") || q.includes("water")) return "If you are stranded without life-sustaining supplies, please use the 'Request Help' tile on your dashboard. You can also view the 'Mutual Aid' feed to see if community members nearby have excess supplies to offer.";
    if (q.includes("offline") || q.includes("internet")) return "The app caches critical data. Even if you lose internet, you can access Survival Guides and Emergency Contacts. Your SOS signals will be queued and pushed out via background SMS routing if data drops.";
    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) return "Hello, citizen. Time is critical during emergencies. Please clearly state your situation, requested resources, or query.";

    return "I am unable to parse a specific protocol for that query. I operate optimally with keywords like 'shelter', 'medical', 'flood', 'fire', 'missing', or 'supplies'. For immediate critical emergencies, always trigger the top-right SOS beacon.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Dynamic typing delay based on query complexity to simulate actual processing
    const delay = Math.floor(Math.random() * 800) + 700;

    setTimeout(() => {
      const responseText = generateAIResponse(userMsg.text);
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: responseText, sender: "bot" }]);
      setIsTyping(false);
    }, delay);
  };

  return (
    <>
      {!isOpen && (
        <button
          className="fixed bottom-24 right-6 z-[60] bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all duration-300 group flex items-center justify-center animate-fade-in"
          title="AI Assistant"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[70] w-80 md:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex items-center justify-between relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3 text-white relative z-10">
              <div className="bg-white/20 p-1.5 rounded-lg border border-white/30 shadow-inner">
                 <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Disaster AI Core</h3>
                <p className="text-[10px] text-indigo-200 font-mono tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition-colors relative z-10 p-1 bg-black/10 rounded-md hover:bg-black/20">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-950/80 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-md">
                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 relative">
            <input
              type="text"
              placeholder="Query the AI..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors shadow-inner"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white p-2.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
