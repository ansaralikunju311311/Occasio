import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Dummy data specific to the event manager
const myDummyEvents = [
    {
        id: "EVT-8291",
        title: "Global Tech Summit 2026",
        date: "2026-05-15T09:00:00Z",
        format: "HYBRID",
        ticketsSold: 1250,
        revenue: 125000,
        status: "UPCOMING",
        category: "Technology"
    },
    {
        id: "EVT-4421",
        title: "Web3 Developer Workshop",
        date: "2026-04-10T14:30:00Z",
        format: "ONLINE",
        ticketsSold: 450,
        revenue: 0,
        status: "ACTIVE",
        category: "Workshop"
    },
    {
        id: "EVT-1102",
        title: "Leadership Masterclass",
        date: "2026-03-01T10:00:00Z",
        format: "ONLINE",
        ticketsSold: 500,
        revenue: 25000,
        status: "ENDED",
        category: "Business"
    }
];

const EventManagerMyEvents = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const navigate = useNavigate();

    const filteredEvents = myDummyEvents.filter((event) => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
            case 'UPCOMING': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'ENDED': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getFormatStyle = (format: string) => {
        switch (format) {
            case 'ONLINE': return 'text-sky-400 bg-sky-400/10';
            case 'OFFLINE': return 'text-amber-400 bg-amber-400/10';
            case 'HYBRID': return 'text-purple-400 bg-purple-400/10';
            default: return 'text-slate-400 bg-slate-400/10';
        }
    };

    return (
        <div className="p-8 w-full min-h-screen bg-[#070b14]">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                            <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        My Events
                    </h1>
                    <p className="text-slate-400 mt-2 font-light">Manage your hosted events, track ticket sales, and view analytics.</p>
                </div>

                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-white text-sm font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-not-allowed opacity-50">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Export Data
                    </button>
                    <button onClick={() => navigate('/eventmanager/create-event')} className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Event
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-[#0a0f16]/80 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search your events..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 w-full md:w-auto">
                    {['ALL', 'ACTIVE', 'UPCOMING', 'ENDED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                statusFilter === status
                                    ? 'bg-slate-800 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-[#0a0f16]/80 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4">Event Info</th>
                                <th className="px-6 py-4">Date & Format</th>
                                <th className="px-6 py-4">Tickets & Revenue</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4 flex flex-col justify-center">
                                        <div className="text-white font-semibold text-sm truncate max-w-[200px] mb-1 group-hover:text-teal-400 transition-colors">
                                            {event.title}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-slate-500 font-mono">{event.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-300 mb-1 flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${getFormatStyle(event.format)}`}>
                                            {event.format}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white mb-1">
                                            {event.ticketsSold.toLocaleString()} <span className="text-slate-500 font-normal text-xs">sold</span>
                                        </div>
                                        <div className="text-xs font-mono text-indigo-400">
                                            ${event.revenue.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors inline-block cursor-not-allowed opacity-50" title="View details">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors inline-block cursor-not-allowed opacity-50" title="Edit event">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredEvents.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-10 h-10 mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p>No events found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EventManagerMyEvents;
