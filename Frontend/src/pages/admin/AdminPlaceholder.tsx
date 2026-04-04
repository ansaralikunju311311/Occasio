import { useLocation } from "react-router-dom";

const AdminPlaceholder = () => {
    const location = useLocation();
    const pageName = location.pathname.split('/').pop() || 'Page';

    const formattedName = pageName === 'eventmanagers'
        ? 'Event Managers'
        : pageName.charAt(0).toUpperCase() + pageName.slice(1);

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center animate-fade-in-up">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-6 shadow-[0_0_30px_rgb(16,185,129,0.15)]">
                <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
                {formattedName} <span className="text-emerald-400">Management</span>
            </h1>
            <p className="text-slate-400 max-w-md mx-auto text-lg">
                This admin module is currently under construction. Features will be available here soon.
            </p>
        </div>
    );
};

export default AdminPlaceholder;
