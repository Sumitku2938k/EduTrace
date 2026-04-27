import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import DashboardStatCard from "../components/dashboard/DashboardStatCard";
import { useNavigate } from "react-router-dom";
import { fetchBehaviorAlerts, fetchBehaviorClassification, fetchDashboardSummary } from "../services/api";
import { useAuth } from "../utils/auth";

const attendanceData = [
    { month: "Jan", attendance: 95 },
    { month: "Feb", attendance: 91 },
    { month: "Mar", attendance: 85 },
    { month: "Apr", attendance: 89 },
    { month: "May", attendance: 93 },
    { month: "Jun", attendance: 87 },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const getCategoryBadgeClass = (category) => {
    if (category === "Regular") {
        return "bg-green-50 text-green-700 border-green-200";
    }

    if (category === "Irregular") {
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
};

const getAlertBadgeClass = (type) => {
    if (type === "At-Risk") {
        return "bg-red-500";
    }

    if (type === "Frequent Late") {
        return "bg-yellow-500";
    }

    return "bg-violet-500";
};

export default function Dashboard() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [summary, setSummary] = useState({ totalStudents: 0, present: 0, absent: 0, late: 0 });
    const [behaviorSummary, setBehaviorSummary] = useState({ Regular: 0, Irregular: 0, "At-Risk": 0 });
    const [classifiedStudents, setClassifiedStudents] = useState([]);
    const [behaviorAlerts, setBehaviorAlerts] = useState([]);
    const navigate = useNavigate();
    const { authorizationToken } = useAuth();

    useEffect(() => {
        const loadDashboardSummary = async () => {
            try {
                const data = await fetchDashboardSummary(authorizationToken);
                setSummary({
                    totalStudents: data.totalStudents ?? 0,
                    present: data.present ?? 0,
                    absent: data.absent ?? 0,
                    late: data.late ?? 0,
                });
            } catch (error) {
                console.error("Failed to load dashboard summary:", error);
            }
        };

        loadDashboardSummary();
    }, [authorizationToken]);

    useEffect(() => {
        const loadBehaviorInsights = async () => {
            try {
                const [classificationData, alertData] = await Promise.all([
                    fetchBehaviorClassification(authorizationToken),
                    fetchBehaviorAlerts(authorizationToken),
                ]);

                setBehaviorSummary(classificationData.summary || { Regular: 0, Irregular: 0, "At-Risk": 0 });
                setClassifiedStudents(classificationData.students || []);
                setBehaviorAlerts(alertData.alerts || []);
            } catch (error) {
                console.error("Failed to load behavior insights:", error);
            }
        };

        loadBehaviorInsights();
    }, [authorizationToken]);

    const attendancePercentage =
        summary.totalStudents > 0 ? Math.round((summary.present / summary.totalStudents) * 100) : 0;

    const categoryData = [
        { name: "Regular", value: behaviorSummary.Regular || 0 },
        { name: "Irregular", value: behaviorSummary.Irregular || 0 },
        { name: "At-risk", value: behaviorSummary["At-Risk"] || 0 },
    ];

    const statCards = [
        {
            label: "Total Students",
            value: String(summary.totalStudents),
            valueColor: "text-gray-900",
            bgColor: "bg-blue-50",
            icon: (
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
            ),
        },
        {
            label: "Present Today",
            value: String(summary.present),
            valueColor: "text-green-500",
            bgColor: "bg-green-50",
            icon: (
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            label: "Absent Today",
            value: String(summary.absent),
            valueColor: "text-red-500",
            bgColor: "bg-red-50",
            icon: (
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: "Late Today",
            value: String(summary.late),
            valueColor: "text-yellow-500",
            bgColor: "bg-yellow-50",
            icon: (
                <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: "Avg. Attendance",
            value: `${attendancePercentage}%`,
            valueColor: "text-blue-600",
            bgColor: "bg-blue-50",
            icon: (
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
    ];
    
    return (
        <div className="bg-gray-50 px-8 py-8 font-sans">

            <main className="max-w-6xl mx-auto space-y-8">
                {/* Title */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's your classroom overview.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {statCards.map((card) => (
                        <DashboardStatCard
                            key={card.label}
                            label={card.label}
                            value={card.value}
                            valueColor={card.valueColor}
                            bgColor={card.bgColor}
                            icon={card.icon}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
                        <p className="text-sm font-medium text-gray-500">Regular Students</p>
                        <p className="mt-2 text-3xl font-bold text-green-600">{behaviorSummary.Regular || 0}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-yellow-100">
                        <p className="text-sm font-medium text-gray-500">Irregular Students</p>
                        <p className="mt-2 text-3xl font-bold text-yellow-600">{behaviorSummary.Irregular || 0}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
                        <p className="text-sm font-medium text-gray-500">At-risk Students</p>
                        <p className="mt-2 text-3xl font-bold text-red-600">{behaviorSummary["At-Risk"] || 0}</p>
                    </div>
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

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Student Attendance Classification</h2>
                            <p className="text-sm text-gray-400">Computed from present, late, absent, and total records</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">%</th>
                                    <th className="px-4 py-3">Category</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {classifiedStudents.slice(0, 8).map((student) => (
                                    <tr key={student.studentId} className="text-sm text-gray-700">
                                        <td className="px-4 py-3 font-semibold text-gray-900">{student.name}</td>
                                        <td className="px-4 py-3">{student.percentage}%</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryBadgeClass(student.category)}`}>
                                                {student.category}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {classifiedStudents.length === 0 && (
                                    <tr>
                                        <td className="px-4 py-6 text-center text-sm text-gray-400" colSpan={3}>
                                            No attendance classification available yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* At-risk Banner */}
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                    <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-700">
                        <span className="font-bold text-gray-900">{behaviorSummary["At-Risk"] || 0} students</span> are flagged as at-risk due to low attendance. Consider reaching out to them.
                    </p>
                </div>

                {/* Recent Alerts */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Recent Alerts</h2>
                            <p className="text-sm text-gray-400">Students needing attention</p>
                        </div>
                        <button onClick={() => {navigate('/analytics')}} className="text-sm text-gray-500 cursor-pointer border border-gray-200 rounded-xl px-4 py-1.5 hover:bg-gray-50 transition-colors">View All</button>
                    </div>
                    <div className="space-y-3">
                        {behaviorAlerts.slice(0, 6).map((alert, index) => (
                            <div key={`${alert.studentId}-${alert.type}-${index}`} className="flex items-center justify-between border border-gray-100 rounded-xl px-5 py-4 hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-800">{alert.name}</p>
                                    <p className="text-sm text-gray-400">{alert.message}</p>
                                </div>
                                <span className={`text-white text-xs font-semibold px-4 py-1.5 rounded-full ${getAlertBadgeClass(alert.type)}`}>{alert.type}</span>
                            </div>
                        ))}
                        {behaviorAlerts.length === 0 && (
                            <div className="border border-gray-100 rounded-xl px-5 py-6 text-center text-sm text-gray-400">
                                No behavior alerts generated yet.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
