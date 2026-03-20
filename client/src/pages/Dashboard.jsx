import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import DashboardHeader from "../components/dashboard/DashboardHeader";

const attendanceData = [
    { month: "Jan", attendance: 95 },
    { month: "Feb", attendance: 91 },
    { month: "Mar", attendance: 85 },
    { month: "Apr", attendance: 89 },
    { month: "May", attendance: 93 },
    { month: "Jun", attendance: 87 },
];

const categoryData = [
    { name: "Regular", value: 32 },
    { name: "Irregular", value: 8 },
    { name: "At-risk", value: 5 },
];

const COLORS = ["#22b8cf", "#845ef7", "#fa5252"];

const alerts = [
    {
        name: "John Smith",
        date: "2024-01-15",
        tag: "Low Attendance",
        tagColor: "bg-red-500",
    },
    {
        name: "Emma Davis",
        date: "2024-01-14",
        tag: "Frequent Late",
        tagColor: "bg-purple-500",
    },
    {
        name: "Michael Brown",
        date: "2024-01-13",
        tag: "Attendance Drop",
        tagColor: "bg-violet-500",
    },
];

const StatCard = ({ label, value, icon, valueColor, bgColor }) => (
    <div className="flex items-center gap-4">
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${valueColor}`}>{value}</p>
        </div>
        <div className={`ml-auto w-12 h-12 rounded-2xl flex items-center justify-center ${bgColor}`}>
            {icon}
        </div>
    </div>
);

export default function Dashboard() {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            {/* <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-end">
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">Dr. Sarah Johnson</p>
                    <p className="text-xs text-gray-400">Teacher</p>
                </div>
            </header> */}
            <DashboardHeader />

            <main className="max-w-6xl mx-auto px-8 py-8 space-y-8">
                {/* Title */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's your classroom overview.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <StatCard
                        label="Total Students"
                        value="45"
                        valueColor="text-gray-900"
                        bgColor="bg-blue-50"
                        icon={
                            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Present Today"
                        value="42"
                        valueColor="text-green-500"
                        bgColor="bg-green-50"
                        icon={
                            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Absent Today"
                        value="2"
                        valueColor="text-red-500"
                        bgColor="bg-red-50"
                        icon={
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Late Today"
                        value="1"
                        valueColor="text-yellow-500"
                        bgColor="bg-yellow-50"
                        icon={
                            <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Avg. Attendance"
                        value="88%"
                        valueColor="text-blue-600"
                        bgColor="bg-blue-50"
                        icon={
                            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Line Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Monthly Attendance Trend</h2>
                        <p className="text-sm text-gray-400 mb-4">Last 6 months overview</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                                    formatter={(v) => [`${v}%`, "Attendance"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="attendance"
                                    stroke="#22b8cf"
                                    strokeWidth={2.5}
                                    dot={{ r: 4, fill: "#22b8cf", strokeWidth: 0 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-4 h-0.5 bg-cyan-400" />
                            <span className="text-xs text-cyan-500 font-medium">attendance</span>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Student Categories</h2>
                        <p className="text-sm text-gray-400 mb-4">Distribution by behavior status</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={100}
                                    dataKey="value"
                                    onMouseEnter={(_, index) => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                >
                                    {categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index]} opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}/>))}
                                </Pie>
                                <Legend
                                    formatter={(value, entry) => (
                                        <span style={{ color: entry.color, fontSize: 13, fontWeight: 500 }}>
                                            {value} ({entry.payload.value})
                                        </span>
                                    )}
                                />
                                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* At-risk Banner */}
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                    <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-700">
                        <span className="font-bold text-gray-900">5 students</span> are flagged as at-risk due to low attendance. Consider reaching out to them.
                    </p>
                </div>

                {/* Recent Alerts */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Recent Alerts</h2>
                            <p className="text-sm text-gray-400">Students needing attention</p>
                        </div>
                        <button className="text-sm text-gray-500 border border-gray-200 rounded-xl px-4 py-1.5 hover:bg-gray-50 transition-colors">View All</button>
                    </div>
                    <div className="space-y-3">
                        {alerts.map((alert) => (
                            <div key={alert.name} className="flex items-center justify-between border border-gray-100 rounded-xl px-5 py-4 hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-800">{alert.name}</p>
                                    <p className="text-sm text-gray-400">{alert.date}</p>
                                </div>
                                <span className={`text-white text-xs font-semibold px-4 py-1.5 rounded-full ${alert.tagColor}`}>{alert.tag}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}