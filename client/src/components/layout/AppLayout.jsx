import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Clock, Users, BarChart3, LogOut, GraduationCap } from "lucide-react";

const AppLayout = () => {
    return (
        <div className="min-h-screen grid grid-cols-[260px_1fr] bg-gray-100">
            
            {/* Sidebar */}
            <aside className="bg-white border-r p-4 flex flex-col h-screen sticky top-0">
        
                {/* Logo Section */}
                <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                        <GraduationCap size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-tight">AttendancAI</h1>
                        <p className="text-sm text-gray-500">Smart System</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="mt-6 space-y-2">

                    {/* Dashboard */}
                    <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${ isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100" }`}>
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/attendance" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${ isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                        <Clock size={18} />
                        <span>Attendance</span>
                    </NavLink>

                    <NavLink to="/students" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${ isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                        <Users size={18} />
                        <span>Students</span>
                    </NavLink>

                    <NavLink to="/analytics" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${ isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                        <BarChart3 size={18} />
                        <span>Analytics</span>
                    </NavLink>
                </nav>

                {/* Logout */}
                <div className="mt-auto pt-4 border-t">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-gray-700">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;