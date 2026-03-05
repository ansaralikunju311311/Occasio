const AdminDashboard = () => {
    const stats = [
        { title: "Total Users", value: "1,248", icon: "👥", trend: "+12%" },
        { title: "Active Events", value: "45", icon: "📅", trend: "+5%" },
        { title: "Event Managers", value: "124", icon: "👔", trend: "+18%" },
        { title: "Total Revenue", value: "$45,231", icon: "💰", trend: "+24%" }
    ];

    return (
        <div className="animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Admin <span className="text-emerald-400">Dashboard</span>
                </h1>
                <p className="text-slate-400 mt-2">Overview of Occasio platform statistics and activities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Sample Stat Cards */}
                {stats.map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6 shadow-xl hover:border-emerald-500/30 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <span className="text-emerald-400 text-sm font-semibold flex items-center bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Additional space for charts or recent activity */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl min-h-[400px] flex items-center justify-center relative overflow-hidden group">

                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 mb-4 shadow-inner">
                        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Platform Analytics</h3>
                    <p className="text-slate-400 max-w-sm mx-auto">Detailed charts and activity logs will populate here once backend integration is complete.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
