import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Mail, Lock, ArrowRight } from "lucide-react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function NgoRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@ngo.com") && !email.endsWith("@ngo.org")) {
      alert("Access Denied: Only authorized NGO emails (@ngo.com / @ngo.org) can register here. Standard users must use the User portal.");
      return;
    }

    if (email && password) {
      setIsSubmitting(true);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        localStorage.setItem("role", "ngo");
        alert("NGO Account Registered Successfully. Welcome to the Command Center.");
        navigate("/ngo-dashboard");
      } catch (error) {
        console.warn("Firebase Auth Error:", error.message);
        alert(`Registration Failed: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Please enter NGO credentials to register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[100px] -top-20 -left-20 animate-pulse-slow"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] bottom-0 right-0 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md z-10 animate-slide-up">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-rose-500/10 p-3 rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-rose-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">NGO Registration</h2>
            <p className="text-slate-400 text-center text-sm">Register a new Command Center terminal. Requires verified @ngo.com or @ngo.org domain.</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-rose-400 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Official NGO Email (@ngo.com)"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-slate-500 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-rose-400 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Secure Password"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-slate-500 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-2 w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-rose-500/25 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-rose-500/40'}`}
            >
              Initialize NGO Node
              {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
            <p className="text-slate-400 text-sm">
              Already possess an NGO terminal ID?{" "}
              <Link to="/ngo-login" className="text-rose-400 font-semibold hover:text-rose-300 transition-colors hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NgoRegister;
