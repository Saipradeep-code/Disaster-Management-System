// Replaced with a placeholder just in case it's used elsewhere, but AuthHome is the real landing page.
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-white">Disaster Management System</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link to="/login" className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all font-medium">
          Login
        </Link>
        <Link to="/register" className="w-full text-center bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-all font-medium">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;