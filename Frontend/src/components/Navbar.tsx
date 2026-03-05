import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-lg shadow-sm border-b border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          <Link to="/">Occasio</Link>
        </h1>
        <nav className="space-x-8 flex items-center pr-4">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</Link>
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
          <Link to="/signup" className="text-sm font-medium px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
