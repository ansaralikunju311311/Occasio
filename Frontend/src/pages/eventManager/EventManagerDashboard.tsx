import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hook";
import { useNavigate } from "react-router-dom";
import HomeButton from "../../components/common/HomeButton";
import { api } from "../../services/api";
import { Table } from "../../components/common/Table";
import { toast } from "sonner";

const EventManagerDashboard = () => {
    const navigate = useNavigate();
    const [recentEvents, setRecentEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useAppSelector((state) => state.auth.user);

    const stats = [
        { title: "Total Events", value: recentEvents.length.toString(), icon: "🎟️", trend: "+0" },
        { title: "Active Events", value: recentEvents.filter(e => e.status === 'ACTIVE').length.toString(), icon: "✨", trend: "0" },
        { title: "Total Bookings", value: "0", icon: "🎫", trend: "+0%" },
        { title: "Total Revenue", value: "₹0", icon: "💰", trend: "+0%" }
    ];

    useEffect(() => {
        const fetchRecentEvents = async () => {
            try {
                const response = await api.get("/events/myevents");
                if (response.data && response.data.events) {
                    // Sort by newest first and take top 5
                    const sorted = [...response.data.events].sort((a, b) => 
                        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                    ).slice(0, 5);
                    setRecentEvents(sorted);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard events:", error);
                toast.error("Failed to load recent events.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecentEvents();
    }, []);

    const getFormatStyle = (type: string) => {
        switch (type?.toUpperCase()) {
            case 'ONLINE': return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
            case 'OFFLINE': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
            case 'HYBRID': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'UPCOMING': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'ENDED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'DRAFT': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

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

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800/60 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Recent Events</h3>
                    <button onClick={() => navigate('/eventmanager/my-events')} className="text-teal-400 text-sm hover:text-teal-300 transition-colors">View All</button>
                </div>
                
                <Table
                    tableClassName="w-full text-left border-collapse"
                    trHeadClassName="bg-slate-900/60 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold"
                    columns={[
                        { header: "Event Info", className: "px-6 py-4" },
                        { header: "Format", className: "px-6 py-4" },
                        { header: "Status", className: "px-6 py-4" },
                        { header: "Price", className: "px-6 py-4 text-right" }
                    ]}
                    data={recentEvents}
                    loading={loading}
                    emptyState={
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                <p>No events found. Start by creating your first event!</p>
                            </td>
                        </tr>
                    }
                    renderRow={(event) => (
                        <tr key={event.id} className="hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="text-white font-semibold text-sm group-hover:text-teal-400 transition-colors">
                                    {event.title}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                    {event.startTime ? new Date(event.startTime).toLocaleDateString() : 'N/A'}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getFormatStyle(event.eventType)}`}>
                                    {event.eventType || 'UNKNOWN'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${getStatusStyle(event.status)}`}>
                                    {event.status || 'UNKNOWN'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-sm font-medium text-emerald-400 font-mono">
                                    {event.price > 0 ? `₹${event.price}` : "Free"}
                                </span>
                            </td>
                        </tr>
                    )}
                />
            </div>
        </div>
    );
};

export default EventManagerDashboard;
