import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-[#070b14] flex text-slate-100 font-sans">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 relative overflow-y-auto w-full max-h-screen custom-scrollbar">
                {/* Subtle background glow for main content area */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-teal-600/5 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0"></div>

                <div className="relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
