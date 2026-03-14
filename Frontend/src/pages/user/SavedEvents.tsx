
const SavedEvents = () => {
    return (
        <div className="animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Saved <span className="text-pink-400">Events</span>
                </h1>
                <p className="text-slate-400 mt-2">Catch up with the events you're interested in.</p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-12 shadow-xl min-h-80 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 border border-pink-500/20">
                    <svg className="w-10 h-10 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your Wishlist is Empty</h3>
                <p className="text-slate-400 max-w-sm">Save events to keep track of them and never miss out on updates.</p>
            </div>
        </div>
    );
};

export default SavedEvents;
