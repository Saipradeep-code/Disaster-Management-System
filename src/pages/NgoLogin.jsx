import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Mail, Lock, ArrowRight } from "lucide-react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

function NgoLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("ngo") && !email.endsWith("@ngo.com") && !email.endsWith("@ngo.org")) {
      alert("Access Denied: Only authorized NGO emails (@ngo.com / @ngo.org) or emails containing 'ngo' can access this portal. Standard users must use the User Portal.");
      return;
    }

    if (email && password) {
      setIsSubmitting(true);
      try {
        // Attempt login. If it fails due to user not found in a mock dev environment, auto-register for demo purposes
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
          if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
              await createUserWithEmailAndPassword(auth, email, password);
              alert("First-time NGO login detected. Auto-registered for demo purposes.");
          } else {
              throw err;
          }
        }
        
        localStorage.setItem("role", "ngo");
        navigate("/ngo-dashboard");
      } catch (error) {
        console.warn("Firebase Auth Error, using simulator fallback:", error.message);
        localStorage.setItem("role", "ngo");
        navigate("/ngo-dashboard");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Enter NGO credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[100px] -top-20 -left-20 animate-pulse-slow"></div>
        <div className="absolute w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[100px] bottom-0 right-0 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md z-10 animate-slide-up">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-rose-500/10 p-3 rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-rose-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">NGO Portal</h2>
            <p className="text-slate-400 text-center">Login to coordinate emergency relief efforts</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-rose-400 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="NGO Email"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-slate-500 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-rose-400 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-slate-500 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
            <p className="text-slate-400">
              Not an authorized NGO?{" "}
              <Link to="/" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors hover:underline">
                Return Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NgoLogin;