
const Settings = () => {
    return (
        <div className="animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Account <span className="text-slate-400">Settings</span>
                </h1>
                <p className="text-slate-400 mt-2">Manage your preferences and notification settings.</p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl max-w-3xl">
                <div className="space-y-8">
                    <section>
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Notifications</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-950/30 rounded-xl border border-slate-800/60">
                                <div>
                                    <div className="text-white font-medium">Email Notifications</div>
                                    <div className="text-slate-400 text-sm">Receive event updates and reminders via email</div>
                                </div>
                                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer shadow-inner shadow-black/20">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Privacy</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-950/30 rounded-xl border border-slate-800/60">
                                <div>
                                    <div className="text-white font-medium">Public Profile</div>
                                    <div className="text-slate-400 text-sm">Allow others to see your upcoming events</div>
                                </div>
                                <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <button className="mt-10 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;
