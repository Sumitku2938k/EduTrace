import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const navigationItems = [
    { to: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
    { to: "/tourists", label: "Attendance", Icon: AttendanceIcon },
    { to: "/alerts", label: "Students", Icon: StudentsIcon },
    { to: "/reports", label: "Analytics", Icon: AnalyticsIcon },
];

function DashboardIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <rect x="3" y="3" width="7" height="7" rx="1.2" />
            <rect x="14" y="3" width="7" height="5" rx="1.2" />
            <rect x="14" y="12" width="7" height="9" rx="1.2" />
            <rect x="3" y="14" width="7" height="7" rx="1.2" />
        </svg>
    );
}

function AttendanceIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    );
}

function StudentsIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
            <circle cx="9.5" cy="7" r="3.5" />
            <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M15.5 3.13a3.5 3.5 0 0 1 0 6.74" />
        </svg>
    );
}

function AnalyticsIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <path d="M4 20V10" />
            <path d="M10 20V4" />
            <path d="M16 20v-7" />
            <path d="M22 20H2" />
        </svg>
    );
}

function CapIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <path d="M2 9.5 12 4l10 5.5-10 5.5L2 9.5Z" />
            <path d="M6 11.75V16c0 .72 2.35 2.5 6 2.5s6-1.78 6-2.5v-4.25" />
            <path d="M22 10v4" />
        </svg>
    );
}

function LogoutIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <path d="M15 3h-6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
        </svg>
    );
}

const navLinkClassName = ({ isActive }) =>
    [
        "group flex items-center gap-3 rounded-2xl px-5 py-4 text-lg font-medium transition-all duration-200",
        isActive
            ? "bg-blue-600 text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)]"
            : "text-slate-800 hover:bg-slate-100",
    ].join(" ");

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-slate-100 p-1 sm:p-4">
            <div className="grid min-h-[calc(100vh-0.5rem)] grid-cols-1 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:min-h-[calc(100vh-2rem)] lg:grid-cols-[320px_1fr]">
                <aside className="flex min-h-full flex-col border-r border-slate-200 bg-slate-50/70">
                    <div className="border-b border-slate-200 px-7 py-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-200">
                                <CapIcon className="h-7 w-7" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="max-w-[160px] text-[2.15rem] font-bold leading-[0.95] tracking-[-0.04em] text-slate-900">
                                    AttendanceAI
                                </h1>
                                <p className="mt-2 text-lg text-slate-500">Smart System</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 px-5 py-8">
                        <div className="space-y-3">
                            {navigationItems.map(({ to, label, Icon }) => (
                                <NavLink key={to} to={to} className={navLinkClassName}>
                                    {React.createElement(Icon, { className: "h-6 w-6 shrink-0" })}
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </nav>

                    <div className="border-t border-slate-200 px-5 py-5">
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            <LogoutIcon className="h-6 w-6 text-slate-700" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4 sm:p-8 lg:min-h-full">
                    <div className="h-full rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-4 backdrop-blur-sm sm:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
