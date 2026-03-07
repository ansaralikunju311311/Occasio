import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hook";
import { logout } from "../../redux/slices/authSlice";

const EventManagerSidebar = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useAppDispatch();


    const handlelogout =()=>{
        dispatch(
            logout()
        )
        navigate("/login")
    }

    const navLinks = [
        {
            name: "Dashboard",
            path: "/eventmanager",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: "Create Event",
            path: "/eventmanager/create-event",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            )
        },
        {
            name: "My Events",
            path: "/eventmanager/my-events",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            name: "Bookings",
            path: "/eventmanager/bookings",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
            )
        },
        {
            name: "Wallet",
            path: "/eventmanager/wallet",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        }
    ];

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-[#070b14] border-r border-slate-800/60 flex flex-col z-50">

            {/* Brand / Logo */}
            <div className="h-20 flex items-center justify-center border-b border-slate-800/60">
                <div className="inline-flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30">
                        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        Occasio <span className="text-teal-400">Manager</span>
                    </span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
                {navLinks.map((link) => {
                    const isActive = location.pathname.includes(link.path);
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${isActive
                                ? "bg-linear-to-r from-teal-500/10 to-emerald-600/10 text-teal-400 border border-teal-500/20 shadow-[0_0_15px_rgb(20,184,166,0.05)]"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent"
                                }`}
                        >
                            {/* Optional Active Indent Bar */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full shadow-[0_0_10px_rgb(20,184,166,0.5)]"></div>
                            )}

                            <div className={`${isActive ? "text-teal-400" : "text-slate-500 group-hover:text-teal-400 transition-colors"}`}>
                                {link.icon}
                            </div>

                            {link.name}

                            {/* Optional Hover Arrow */}
                            {!isActive && (
                                <svg className="w-4 h-4 ml-auto text-slate-600 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Account / Logout */}
            <div className="p-4 border-t border-slate-800/60">
                <button className="flex w-full items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-200 group"
                onClick={handlelogout}>
                    <svg className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>

        </aside>
    );
};

export default EventManagerSidebar;
