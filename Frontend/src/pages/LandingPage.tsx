import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hook";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "../services/api"
import EventMap from "../components/eventManager/EventMap";
// import LocationFinder from "../components/user/LocationFinder";
import CurrentLocation from "../components/user/CurrentLocation";

const LandingPage = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await api.get("/events/events");
                // The backend returns an object with an 'events' property: { events: [...] }
                const fetchedEvents = response.data.events || [];
                setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
                console.log("Fetched Events:", fetchedEvents);
            } catch (err: any) {
                setError("Failed to fetch events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);
    const viewEventDetails = async (id: string) => {
        try {
            setLoading(true);
            const response = await api.get(`/events/eventDetails/${id}`);
            // The backend returns { events: { ... } }
            const eventData = response.data.events;
            setSelectedEvent(eventData);
            setIsDetailsModalOpen(true);
        } catch (err: any) {
            console.error("Failed to fetch event details:", err);
            setError("Could not load event details. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedEvent(null);
    };
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const openInMaps = (lat: number, lng: number) => {
        const url = `https://www.google.com/maps?q=${lat},${lng}`;
        window.open(url, "_blank");
    };
    return (
        <div className="min-h-screen bg-slate-950 pt-16">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden flex items-center justify-center min-h-[80vh] px-6 text-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-90"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold mb-6 shadow-sm border border-indigo-500/20">
                        {user ? `Welcome Back to Occasio - ${user.email}` :
                            "The New Standard for Events"
                        }
                    </span>

                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-8 text-white">
                        {user ? (
                            <>
                                Hello, <span className="bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">{user.name}</span>! <br />
                                Ready for your next event?
                            </>
                        ) : (
                            <>
                                Discover & Book <br />
                                <span className="bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Amazing Events</span>
                            </>
                        )}
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        {user
                            ? "Browse through the latest events, manage your bookings, and never miss a moment of excitement."
                            : "Occasio makes event booking seamless with real-time seat selection, secure payments, and instant confirmations."
                        }
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
                        {user ? (
                            <>
                                <button
                                    onClick={() => navigate(user.role === "ADMIN" ? "/admin/dashboard" : user.role === "EVENT_MANAGER" ? "/eventmanager" : "/events")}
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg shadow-[0_0_40px_-5px_rgb(99,102,241,0.4)] hover:shadow-[0_0_60px_-10px_rgb(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300 border border-white/10"
                                >
                                    {user.role === "USER" ? "Explore Events" : "Go to Dashboard"}
                                </button>
                                {user.role === "USER" ? (
                                    <button
                                        onClick={() => navigate("/bookings")}
                                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/50 backdrop-blur-sm text-white font-semibold text-lg border border-slate-700 shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        My Bookings
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate("/")}
                                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/50 backdrop-blur-sm text-white font-semibold text-lg border border-slate-700 shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        View Site
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg shadow-[0_0_40px_-5px_rgb(99,102,241,0.4)] hover:shadow-[0_0_60px_-10px_rgb(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300 border border-white/10"
                                >
                                    Get Started
                                </button>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/50 backdrop-blur-sm text-white font-semibold text-lg border border-slate-700 shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
                    <CurrentLocation />
                </div>
            </section>
            {/* FEATURES SECTION */}
            <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Why Choose Occasio?
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">Everything you need for the perfect event experience.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="group p-10 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-slate-800 hover:border-indigo-500/30 hover:shadow-[0_0_40px_-10px_rgb(99,102,241,0.15)] hover:-translate-y-2 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 group-hover:bg-indigo-500 group-hover:border-transparent transition-all duration-300">
                            <svg className="w-7 h-7 text-indigo-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                            Real-Time Seat Booking
                        </h3>
                        <p className="text-slate-400 leading-relaxed font-light">
                            Select your exact seat with dynamic layouts and live availability updates ensuring no double bookings.
                        </p>
                    </div>
                    {/* Feature 2 */}
                    <div className="group p-10 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-slate-800 hover:border-purple-500/30 hover:shadow-[0_0_40px_-10px_rgb(168,85,247,0.15)] hover:-translate-y-2 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 group-hover:bg-purple-500 group-hover:border-transparent transition-all duration-300">
                            <svg className="w-7 h-7 text-purple-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                            Secure Payments
                        </h3>
                        <p className="text-slate-400 leading-relaxed font-light">
                            Stripe-powered secure transactions with instant booking confirmation and encrypted data processing.
                        </p>
                    </div>
                    {/* Feature 3 */}
                    <div className="group p-10 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-slate-800 hover:border-pink-500/30 hover:shadow-[0_0_40px_-10px_rgb(236,72,153,0.15)] hover:-translate-y-2 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-8 group-hover:bg-pink-500 group-hover:border-transparent transition-all duration-300">
                            <svg className="w-7 h-7 text-pink-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                            Event Management
                        </h3>
                        <p className="text-slate-400 leading-relaxed font-light">
                            Powerful dashboard for managers to create events, track analytics, and handle attendees effortlessly.
                        </p>
                    </div>
                </div>
            </section>
            {/* EVENTS SECTION */}
            <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 text-center md:text-left">
                            Upcoming <span className="bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Events</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-xl text-center md:text-left font-light">
                            Discover local and international events across online, offline, and hybrid formats.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/events")}
                        className="px-6 py-3 rounded-xl bg-slate-900/50 text-white font-medium border border-slate-800 hover:border-slate-500 hover:bg-slate-800 transition-all duration-300"
                    >
                        View All Events
                    </button>
                </div>
                {error && (
                    <div className="text-center py-10 bg-red-500/10 border border-red-500/20 rounded-2xl mb-12">
                        <p className="text-red-400 font-light">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-indigo-400 text-sm mt-2 hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 animate-pulse font-light">Fetching amazing experiences...</p>
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[2rem] overflow-hidden hover:border-indigo-500/40 hover:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.2)] transition-all duration-500 flex flex-col h-full"
                            >
                                <div className="aspect-video w-full overflow-hidden relative">
                                    <img
                                        src={event.picture || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                                            {event.eventType}
                                        </span>
                                    </div>
                                    {event.price === 0 && (
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                                                Free
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-bold mb-4 uppercase tracking-[0.2em]">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {formatDate(event.startTime)}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:text-indigo-400 transition-colors tracking-tight">
                                        {event.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-8 font-light leading-relaxed">
                                        {event.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800/60">
                                        <div className="text-white font-bold text-lg">
                                            {event.price > 0 ? `$${event.price}` : <span className="text-emerald-400">Join Free</span>}
                                        </div>
                                        <button
                                            onClick={() => viewEventDetails(event.id)}
                                            className="text-indigo-400 hover:text-white text-sm font-semibold flex items-center transition-colors group/btn"
                                        >
                                            View Details
                                            <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-900/20 backdrop-blur-sm border border-slate-800/40 rounded-[3rem]">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-700 shadow-inner">
                            <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">No Upcoming Events</h3>
                        <p className="text-slate-400 max-w-md mx-auto font-light">Check back later for new and exciting experiences coming your way.</p>
                    </div>
                )}
            </section>
            {/* CTA SECTION */}
            {!user && (
                <section className="py-32 px-6">
                    <div className="max-w-5xl mx-auto bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_0_50px_-15px_rgb(99,102,241,0.3)]">
                        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-100"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">
                                Ready to step into the future of events?
                            </h2>
                            <button
                                onClick={() => navigate("/signup")}
                                className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgb(255,255,255,0.2)]"
                            >
                                Join Occasio Today
                            </button>
                        </div>
                    </div>
                </section>
            )}
            {/* EVENT DETAILS MODAL */}
            {isDetailsModalOpen && selectedEvent && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300 animate-in fade-in"
                    onClick={closeDetailsModal}
                >
                    <div
                        className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_-20px_rgba(99,102,241,0.3)] transform transition-all animate-in zoom-in-95 duration-300 flex flex-col md:flex-row relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeDetailsModal}
                            className="absolute top-6 right-6 z-50 p-2.5 bg-slate-950/50 backdrop-blur-md text-white/70 hover:text-white hover:bg-slate-800 rounded-full transition-all border border-white/10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>





                        {/* ncncn */}
                        {/* Image Section */}
                        <div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative group">
                            <img
                                src={selectedEvent.picture || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"}
                                alt={selectedEvent.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8">
                                <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 backdrop-blur-md text-xs font-bold text-indigo-400 border border-indigo-500/30 uppercase tracking-[0.2em]">
                                    {selectedEvent.eventType}
                                </span>
                            </div>
                        </div>
                        {/* Content Section */}
                        <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent)]">
                            <div className="mb-8">
                                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-4 uppercase tracking-[0.3em]">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(selectedEvent.startTime)}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                                    {selectedEvent.title}
                                </h2>
                                <p className="text-slate-400 text-lg font-light leading-relaxed mb-8">
                                    {selectedEvent.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pricing</p>
                                    <p className="text-2xl font-bold text-white">
                                        {selectedEvent.price > 0 ? `$${selectedEvent.price}` : <span className="text-emerald-400 font-extrabold">FREE</span>}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Attendance</p>
                                    <p className="text-lg font-medium text-slate-200">
                                        {selectedEvent.eventType === 'ONLINE' ? `${selectedEvent.maxOnlineUsers} Slots` : 'In-Person'}
                                    </p>
                                </div>
                                {selectedEvent.location && (
                                    <div className="col-span-2 space-y-2">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location</p>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium text-slate-300 leading-relaxed">
                                                {selectedEvent.location.address}
                                            </p>
                                        </div>



                                        {/* Map Integration */}
                                        {(() => {
                                            const lng = selectedEvent.location.coordinates[0];
                                            const lat = selectedEvent.location.coordinates[1];
                                            
                                            // Debug log to verify coordinates
                                            console.log("Rendering Map with Coordinates:", { lat, lng });

                                            return (
                                                <>
                                                    <div className="mt-4 rounded-2xl overflow-hidden border border-slate-700/50 shadow-inner group/map h-[200px] relative">
                                                        <EventMap
                                                            lat={lat}
                                                            lng={lng}
                                                            locationName={selectedEvent.location.address}
                                                        />
                                                    </div>

                                                    <button
                                                        onClick={() => openInMaps(lat, lng)}
                                                        className="mt-4 w-full py-2 bg-slate-800/50 hover:bg-slate-700/50 text-indigo-400 text-xs font-bold rounded-xl border border-slate-700/50 transition-all flex items-center justify-center gap-2 group/mapbtn"
                                                    >
                                                        <svg className="w-4 h-4 group-hover/mapbtn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        Open in Google Maps
                                                    </button>
                                                </>
                                            );
                                        })()}

                                    </div>
                                )}
                            </div>

                            <div className="mt-auto flex gap-4">
                                <button
                                    onClick={() => navigate(`/checkout/${selectedEvent.id}`)}
                                    className="flex-1 py-4 bg-linear-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300 active:scale-95"
                                >
                                    Book This Experience
                                </button>
                                <button
                                    onClick={closeDetailsModal}
                                    className="px-8 py-4 bg-slate-800/50 text-white font-bold rounded-2xl border border-slate-700 hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default LandingPage;