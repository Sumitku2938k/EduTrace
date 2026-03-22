import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Clock, Users, BarChart3, LogOut, GraduationCap } from "lucide-react";
import "./AppLayout.css";
import { clearAuthSession, getStoredUser } from "../../services/api";
import Navbar from "../Navbar";
import { toast } from 'react-toastify';

const AppLayout = () => {
    const navigate = useNavigate();
    const user = getStoredUser();

    const handleLogout = () => {
        clearAuthSession();
        navigate("/login");
        toast.success("Logout successful!");
    };

    return (
        <div className="app-wrapper">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <GraduationCap size={20} />
                    </div>
                    <div>
                        <h1 className="sidebar-logo-title">EduTrace</h1>
                        <p className="sidebar-logo-subtitle">{user?.role ? `${user.role} access` : "Smart System"}</p>
                    </div>
                </div>

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

                <div className="sidebar-logout">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Navbar />
                <section className="page-content">
                    <Outlet />
                </section>
            </main>
        </div>
    );
};

export default AppLayout;
