import { useAppSelector } from "../../redux/hook";
import HomeButton from "../../components/common/HomeButton";


const EventManagerDashboard = () => {
    const user = useAppSelector((state) => state.auth.user);

    const stats = [
        { title: "Total Events", value: "0", icon: "🎟️", trend: "+0" },
        { title: "Active Events", value: "0", icon: "✨", trend: "0" },
        { title: "Total Bookings", value: "0", icon: "🎫", trend: "+0%" },
        { title: "Total Revenue", value: "₹0", icon: "💰", trend: "+0%" }
    ];

    return (
        <div className="animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Manager <span className="text-teal-400">Dashboard</span>
                    <p className="text-sm font-normal text-slate-500 mt-1">{user?.email}</p>
                </h1>
                <p className="text-slate-400 mt-2">Overview of your events and earnings on Occasio.</p>
                <div className="mt-4">
                    <HomeButton />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6 shadow-xl hover:border-teal-500/30 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-teal-500/10 rounded-xl text-xl border border-teal-500/20 group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <span className="text-teal-400 text-sm font-semibold flex items-center bg-teal-500/10 px-2 py-1 rounded-lg border border-teal-500/20">
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default EventManagerDashboard;
