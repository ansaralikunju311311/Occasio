// import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const UpgradePrompt = () => {
  const upgrade = () => {
    navigate('/applyasmanager');
  };
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl shadow-2xl animate-fade-in max-w-2xl mx-auto mt-20">
      <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
        <svg
          className="w-10 h-10 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>

      <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
        Unlock{' '}
        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-500">
          Manager Features
        </span>
      </h2>

      <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
        Want to host your own events? Upgrade your account to an Event Manager to start creating and
        managing premium experiences today.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        <button
          onClick={upgrade}
          className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:-translate-y-1 active:scale-95"
        >
          Upgrade Now
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl transition-all border border-slate-700"
        >
          Back to Exploration
        </button>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-800/60 w-full grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-indigo-400 font-bold text-xl mb-1">Create</div>
          <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold text-[10px]">
            Events
          </div>
        </div>
        <div className="text-center border-x border-slate-800/60">
          <div className="text-purple-400 font-bold text-xl mb-1">Manage</div>
          <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold text-[10px]">
            Bookings
          </div>
        </div>
        <div className="text-center">
          <div className="text-teal-400 font-bold text-xl mb-1">Earn</div>
          <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold text-[10px]">
            Revenue
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;
