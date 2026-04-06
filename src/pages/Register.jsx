import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, ArrowRight } from "lucide-react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (!email.endsWith("@gmail.com")) {
      alert("Registration is strictly limited to @gmail.com accounts for standard users.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("role", "user");
      navigate("/user-home");
    } catch (error) {
      alert(`Registration Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result.user.email.endsWith("@gmail.com")) {
        alert("Only @gmail.com accounts are permitted to register.");
        await auth.signOut();
        return;
      }
      localStorage.setItem("role", "user");
      navigate("/user-home");
    } catch (error) {
      alert(`Google Sign-up Failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px] -top-20 -left-20 animate-pulse-slow"></div>
        <div className="absolute w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[100px] bottom-0 right-0 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md z-10 animate-slide-up">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-emerald-500/10 p-3 rounded-2xl mb-4">
              <UserPlus className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-slate-400 text-center">Join the network to report and monitor disasters</p>
          </div>

          <form onSubmit={handleEmailRegister} className="flex flex-col gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Email Address (@gmail.com)"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-slate-500 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-slate-500 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/25 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-emerald-500/40'}`}
            >
              Sign Up
              {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Social Auth Separator */}
          <div className="my-6 flex items-center">
             <div className="flex-grow border-t border-slate-800"></div>
             <span className="px-3 text-xs text-slate-500 font-bold uppercase tracking-wider">or</span>
             <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleRegister}
            className="w-full bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700/50 font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
            Sign up with Google
          </button>

          <div className="mt-6 pt-6 border-t border-slate-800/50 text-center">
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;