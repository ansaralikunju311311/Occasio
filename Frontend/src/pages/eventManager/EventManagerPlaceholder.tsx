import { useLocation } from 'react-router-dom';
import HomeButton from '../../components/common/HomeButton';

const EventManagerPlaceholder = () => {
  const location = useLocation();

  // Extract title from path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || 'Page';

  // Format title
  const title = lastSegment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="animate-fade-in-up h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-12 max-w-2xl w-full text-center relative overflow-hidden group">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] group-hover:bg-teal-500/20 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-colors duration-700"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-800/80 border border-slate-700/50 mb-8 shadow-2xl group-hover:scale-105 transition-transform duration-500">
            <svg
              className="w-12 h-12 text-teal-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            {title} <span className="text-teal-400">Section</span>
          </h2>

          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed mb-8">
            The interface for <span className="text-white font-medium">{title.toLowerCase()}</span>{' '}
            is currently under development. Please check back later for updates.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Work in Progress
          </div>

          <div className="mt-10 flex justify-center">
            <HomeButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagerPlaceholder;
