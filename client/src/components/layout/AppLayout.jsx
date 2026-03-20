import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Clock, Users, BarChart3, LogOut, GraduationCap } from "lucide-react";
import "./AppLayout.css";
import { useNavigate } from "react-router-dom";

const AppLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout logic here
        navigate("/login");
    };

    return (
        <div className="app-wrapper">

            {/* Sidebar */}
            <aside className="sidebar">

                {/* Logo Section */}
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <GraduationCap size={20} />
                    </div>
                    <div>
                        <h1 className="sidebar-logo-title">EduTrace</h1>
                        <p className="sidebar-logo-subtitle">Smart System</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/attendance" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                        <Clock size={18} />
                        <span>Attendance</span>
                    </NavLink>

                    <NavLink to="/students" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                        <Users size={18} />
                        <span>Students</span>
                    </NavLink>

                    <NavLink to="/analytics" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                        <BarChart3 size={18} />
                        <span>Analytics</span>
                    </NavLink>
                </nav>

                {/* Logout */}
                <div className="sidebar-logout">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;