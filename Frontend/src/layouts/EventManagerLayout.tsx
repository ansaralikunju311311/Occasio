import { Outlet } from 'react-router-dom';
import EventManagerSidebar from '../components/eventManager/EventManagerSidebar';

const EventManagerLayout = () => {
  return (
    <div className="min-h-screen bg-[#070b14] flex text-slate-100 font-sans w-full overflow-x-hidden">
      <EventManagerSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-6 md:p-8 pt-20 md:pt-8 relative overflow-y-auto w-full min-h-screen custom-scrollbar">
        {/* Subtle background glow for main content area */}
        <div className="absolute top-[-20%] right-[-10%] w-125 h-125 bg-teal-600/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-150 h-150 bg-emerald-600/5 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EventManagerLayout;
