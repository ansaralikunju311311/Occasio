import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { toast } from "sonner";
import { Table } from "../../components/common/Table";
import { SearchBar } from "../../components/common/SearchBar";

const AdminEvents = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const filteredEvents = events.filter((event) => {
        const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;
        return matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
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

    
        const fetchEvent =async ()=>{
            try {
                setLoading(true);
                const response = await api.get("/events/allevents",
                    
                    {
                        params:{
                            search:searchTerm
                        }
                    }
                );


                console.log(response)
                if (response.data && response.data.events) {
                    setEvents(response.data.events);
                } else if (Array.isArray(response.data)) {
                    setEvents(response.data);
                } else {
                    setEvents([]);
                }
            } catch (error: any) {
                console.error("Error fetching events", error)
                toast.error(error.response?.data?.message || "Failed to load events list.");
            } finally {
                setLoading(false);
            }
        }
   
   useEffect(() => {
  const delay = setTimeout(() => {
    fetchEvent();
  }, 1000); 

  return () => clearTimeout(delay);
}, [searchTerm]);



    return (
        <div className="p-8 w-full min-h-screen bg-[#070b14]">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        Event Management
                    </h1>
                    <p className="text-slate-400 mt-2 font-light">Monitor, manage, and analyze all events across the Occasio platform.</p>
                </div>

               a
            </div>

            {/* Filters & Search */}
            <div className="bg-[#0a0f16]/80 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search events by ID or Title..."
                />

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
                    <Table
                        tableClassName="w-full text-left border-collapse min-w-[800px]"
                        theadClassName=""
                        trHeadClassName="bg-slate-900/60 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold"
                        tbodyClassName="divide-y divide-slate-800/60"
                        columns={[
                            { header: "Event Info", className: "px-6 py-4" },
                            { header: "Creator", className: "px-6 py-4" },
                            { header: "Date & Format", className: "px-6 py-4" },
                            { header: "Ticket Price", className: "px-6 py-4" },
                            { header: "Status", className: "px-6 py-4" },
                            { header: "Actions", className: "px-6 py-4 text-right" }
                        ]}
                        data={filteredEvents}
                        loading={loading}
                        emptyState={
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="w-10 h-10 mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p>No events found matching your criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        }
                        renderRow={(event) => (
                            <tr key={event.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 flex flex-col justify-center">
                                    <div className="text-white font-semibold text-sm truncate max-w-[200px] mb-1 group-hover:text-emerald-400 transition-colors">
                                        {event.title}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-slate-500 font-mono" title={event.id}>
                                            {event.id ? `${event.id.substring(0, 8)}...` : 'N/A'}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                        <span className="text-slate-400 capitalize">{event.eventType?.toLowerCase() || 'Event'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {event.creatorDetails ? (
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-slate-200 text-sm whitespace-nowrap">{event.creatorDetails.name || 'Unknown User'}</span>
                                            <span className="text-slate-500 text-xs truncate max-w-[150px]" title={event.creatorDetails.email}>{event.creatorDetails.email || 'No email'}</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-500 text-xs italic">Not available</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-slate-300 mb-2 flex items-start gap-2">
                                        <svg className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <div className="flex flex-col">
                                            <span>{event.startTime ? `${new Date(event.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${new Date(event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : 'N/A'}</span>
                                            {event.endTime && (
                                                <span className="text-xs text-slate-500 mt-0.5">
                                                    to {new Date(event.endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(event.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${getFormatStyle(event.eventType)}`}>
                                        {event.eventType || 'UNKNOWN'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {(() => {
                                        const type = event.eventType?.toUpperCase();
                                        const blocks =
                                            event?.SeatLayout?.blocks ??
                                            event?.seatLayout?.blocks ??
                                            event?.seatLayoutDetails?.blocks ??
                                            event?.layout?.blocks ??
                                            [];
                                        const onlinePrice = event.price ?? 0;

                                        if (type === "ONLINE") {
                                            return (
                                                <div className="text-sm font-medium text-emerald-400">
                                                    {onlinePrice > 0 ? `₹${onlinePrice}` : "Free"}
                                                </div>
                                            );
                                        }

                                        if (type === "OFFLINE") {
                                            if (blocks.length > 0) {
                                                return (
                                                    <div className="flex flex-col gap-1">
                                                        {blocks.map((b: any, i: number) => {
                                                            const name = b.category?.name || b.blockName || b.blocName || `Block ${i + 1}`;
                                                            const price = b.category?.price;
                                                            return (
                                                                <div key={i} className="flex items-center gap-2 text-xs">
                                                                    <span className="text-slate-400">{name}:</span>
                                                                    <span className="font-semibold text-emerald-400">
                                                                        {typeof price === "number" ? `₹${price}` : "—"}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div className="text-sm font-medium text-emerald-400">
                                                    {onlinePrice > 0 ? `₹${onlinePrice}` : "Free"}
                                                </div>
                                            );
                                        }

                                        if (type === "HYBRID") {
                                            return (
                                                <div className="flex flex-col gap-1.5">
                                                    {/* Online ticket */}
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="px-1.5 py-0.5 rounded bg-sky-400/10 text-sky-400 font-bold text-[9px] uppercase">Online</span>
                                                        <span className="font-semibold text-emerald-400">
                                                            {onlinePrice > 0 ? `₹${onlinePrice}` : "Free"}
                                                        </span>
                                                    </div>
                                                    {/* Offline categories */}
                                                    {blocks.length > 0 && (
                                                        <div className="flex flex-col gap-1 pt-1 border-t border-slate-800/50">
                                                            {blocks.map((b: any, i: number) => {
                                                                const name = b.category?.name || b.blockName || b.blocName || `Block ${i + 1}`;
                                                                const price = b.category?.price;
                                                                return (
                                                                    <div key={i} className="flex items-center gap-2 text-xs">
                                                                        <span className="text-slate-500">{name}:</span>
                                                                        <span className="font-semibold text-amber-400">
                                                                            {typeof price === "number" ? `₹${price}` : "—"}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        // Fallback
                                        return (
                                            <div className="text-sm font-medium text-emerald-400">
                                                {onlinePrice > 0 ? `₹${onlinePrice}` : "Free"}
                                            </div>
                                        );
                                    })()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(event.status)}`}>
                                        {event.status || 'UNKNOWN'}
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
                                    <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors inline-block cursor-not-allowed opacity-50" title="Delete event">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        )}
                    />
                </div>
            </div>
        );
    };

export default AdminEvents;
