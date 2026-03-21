import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
  ScatterChart, Scatter, ReferenceLine,
} from "recharts";

// ── Data ──────────────────────────────────────────────────────────────────────

const monthlyData = [
  { month: "January",  present: 31, late: 11, absent: 2 },
  { month: "February", present: 29, late: 11, absent: 5 },
  { month: "March",    present: 27, late: 11, absent: 7 },
  { month: "April",    present: 30, late: 11, absent: 4 },
  { month: "May",      present: 33, late: 10, absent: 2 },
  { month: "June",     present: 28, late: 11, absent: 6 },
];

const weeklyTrendData = [
  { week: "Week 1", attendance: 91, target: 90 },
  { week: "Week 2", attendance: 88, target: 90 },
  { week: "Week 3", attendance: 85, target: 90 },
  { week: "Week 4", attendance: 88.5, target: 90 },
];

const riskDistribution = [
  { name: "Low Risk",    value: 28, color: "#10b981" },
  { name: "Medium Risk", value: 12, color: "#f59e0b" },
  { name: "High Risk",   value: 5,  color: "#ef4444" },
];

const behaviorData = [
  { category: "Regular",   count: 32 },
  { category: "Irregular", count: 8  },
  { category: "At-risk",   count: 5  },
];

const scatterData = [
  // Low Risk
  { x: 95, y: 19, risk: "Low" }, { x: 94, y: 17, risk: "Low" }, { x: 96, y: 17, risk: "Low" },
  { x: 97, y: 16, risk: "Low" }, { x: 95, y: 15, risk: "Low" }, { x: 96, y: 10, risk: "Low" },
  { x: 97, y: 9,  risk: "Low" }, { x: 96, y: 9,  risk: "Low" }, { x: 97, y: 6,  risk: "Low" },
  { x: 98, y: 19, risk: "Low" }, { x: 98, y: 9,  risk: "Low" }, { x: 97, y: 4,  risk: "Low" },
  // Medium Risk
  { x: 92, y: 18, risk: "Medium" }, { x: 93, y: 10, risk: "Medium" }, { x: 92, y: 9, risk: "Medium" },
  { x: 91, y: 7,  risk: "Medium" }, { x: 93, y: 7,  risk: "Medium" }, { x: 94, y: 14, risk: "Medium" },
  { x: 95, y: 14, risk: "Medium" }, { x: 96, y: 13, risk: "Medium" }, { x: 94, y: 4, risk: "Medium" },
  // High Risk
  { x: 90, y: 17, risk: "High" }, { x: 91, y: 17, risk: "High" }, { x: 93, y: 17, risk: "High" },
  { x: 94, y: 12, risk: "High" }, { x: 93, y: 16, risk: "High" }, { x: 95, y: 16, risk: "High" },
  { x: 96, y: 16, risk: "High" }, { x: 97, y: 8,  risk: "High" }, { x: 98, y: 8,  risk: "High" },
  { x: 96, y: 3,  risk: "High" }, { x: 97, y: 3,  risk: "High" }, { x: 98, y: 3,  risk: "High" },
];

const SCATTER_COLORS = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444" };

const metrics = [
  { label: "Average Attendance:", value: "88.3%" },
  { label: "Variance:",           value: "8.5%"  },
  { label: "Std Deviation:",      value: "18.2%" },
  { label: "Total Late Count:",   value: "64"    },
];

const recommendations = [
  "Implement punctuality intervention for 11 habitually late students",
  "Provide additional support to 5 at-risk students immediately",
  "Maintain current strategies for 32 regular students",
  "Schedule follow-ups for 8 irregular students",
  "Target attendance goal: 92% by next quarter",
];

// ── Custom Legend ─────────────────────────────────────────────────────────────

const DotLegend = ({ items }) => (
  <div className="flex justify-center gap-6 mt-3">
    {items.map(({ color, label }) => (
      <span key={label} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
        <span className="w-3 h-3 rounded-sm inline-block" style={{ background: color }} />
        {label}
      </span>
    ))}
  </div>
);

// ── Export handler ────────────────────────────────────────────────────────────

const handleExport = () => {
  const rows = [
    ["Month", "Present", "Late", "Absent"],
    ...monthlyData.map((r) => [r.month, r.present, r.late, r.absent]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "analytics_report.csv";
  a.click();
  URL.revokeObjectURL(url);
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function Analytics() {
  return (
    <div className="bg-gray-50 px-8 py-8 font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Deep insights into attendance and behavior patterns</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Monthly Attendance Overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Monthly Attendance Overview</h2>
        <p className="text-sm text-gray-400 mb-4">Attendance statistics for the last 6 months</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
            <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="late"    name="Late"    fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent"  name="Absent"  fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <DotLegend items={[{ color: "#10b981", label: "Present" }, { color: "#f59e0b", label: "Late" }, { color: "#ef4444", label: "Absent" }]} />
      </div>

      {/* Weekly Attendance Trend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Weekly Attendance Trend</h2>
        <p className="text-sm text-gray-400 mb-4">Current month performance vs target (90%)</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={weeklyTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis domain={[80, 95]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} formatter={(v) => [`${v}%`]} />
            <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#22b8cf" strokeWidth={2.5} dot={{ r: 4, fill: "#22b8cf", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="target" name="Target %" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
        <DotLegend items={[{ color: "#22b8cf", label: "Attendance %" }, { color: "#f59e0b", label: "Target %" }]} />
      </div>

      {/* Risk Distribution + Behavior Classification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900">Risk Distribution</h2>
          <p className="text-sm text-gray-400 mb-2">Students by risk level</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={riskDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={true}>
                {riskDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Horizontal Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900">Behavior Classification</h2>
          <p className="text-sm text-gray-400 mb-4">Students grouped by attendance behavior</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={behaviorData} layout="vertical" barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" domain={[0, 36]} ticks={[0, 8, 16, 24, 32]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="count" name="Student Count" fill="#22b8cf" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <DotLegend items={[{ color: "#22b8cf", label: "Student Count" }]} />
        </div>
      </div>

      {/* Student Clustering Analysis */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Student Clustering Analysis</h2>
        <p className="text-sm text-gray-400 mb-4">Attendance vs Late Count - K-means clustering visualization</p>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" dataKey="x" domain={[85, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis type="number" dataKey="y" domain={[0, 22]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} formatter={(v, name) => [v, name === "x" ? "Attendance" : "Late Count"]} />
            {["Low", "Medium", "High"].map((risk) => (
              <Scatter
                key={risk}
                name={`${risk} Risk`}
                data={scatterData.filter((d) => d.risk === risk)}
                fill={SCATTER_COLORS[risk]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        <DotLegend items={[{ color: "#10b981", label: "Low Risk" }, { color: "#f59e0b", label: "Medium Risk" }, { color: "#ef4444", label: "High Risk" }]} />
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 className="text-base font-bold text-blue-800 mb-2">Overall Trend</h3>
          <p className="text-sm text-blue-700">
            Attendance is <strong>slightly declining</strong> from January to March, then shows recovery. May had the highest attendance at 91%.
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
          <h3 className="text-base font-bold text-yellow-800 mb-2">Late Pattern</h3>
          <p className="text-sm text-yellow-700">
            Consistent late arrivals (~11 students/month). This is the <strong>primary behavior issue</strong> after absences.
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <h3 className="text-base font-bold text-green-800 mb-2">Success Rate</h3>
          <p className="text-sm text-green-700">
            <strong>71% of students</strong> are in the "Regular" category with consistent attendance above 85%.
          </p>
        </div>
      </div>

      {/* Statistical Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900">Statistical Summary</h2>
        <p className="text-sm text-gray-400 mb-6">Overall metrics and recommendations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Metrics */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-4">Metrics</h3>
            <div className="space-y-3">
              {metrics.map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* AI Recommendations */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-4">AI Recommendations</h3>
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}