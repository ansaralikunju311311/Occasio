
const UserBookings = () => {
    return (
        <div className="animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    My <span className="text-purple-400">Bookings</span>
                </h1>
                <p className="text-slate-400 mt-2">View and manage all your event registrations and tickets.</p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-12 shadow-xl min-h-80 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                    <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Bookings Found</h3>
                <p className="text-slate-400 max-w-sm">You haven't booked any events yet. Explore upcoming events to get started.</p>
                <button className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20">
                    Browse Events
                </button>
            </div>
        </div>
    );
};

export default UserBookings;
