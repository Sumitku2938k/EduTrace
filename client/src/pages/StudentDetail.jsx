import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, } from "recharts";

// ── Sample Data ────────────────────────────────────────────────────────────────
const studentData = {
    name: "Alice Johnson",
    id: "s001",
    email: "alice.johnson@school.edu",
    attendancePercent: 92,
    status: "Regular",
    lateCount: 2,
    riskScore: 10,
    absentCount: 2,
    monthlyTrend: [
        { month: "Jan", value: 96 },
        { month: "Feb", value: 93 },
        { month: "Mar", value: 91 },
        { month: "Apr", value: 95 },
        { month: "May", value: 98 },
        { month: "Jun", value: 88 },
    ],
    recentAttendance: [
        { date: "2024-01-15", status: "Present" },
        { date: "2024-01-14", status: "Present" },
        { date: "2024-01-13", status: "Late" },
        { date: "2024-01-12", status: "Present" },
        { date: "2024-01-11", status: "Present" },
        { date: "2024-01-10", status: "Absent" },
        { date: "2024-01-09", status: "Present" },
        { date: "2024-01-08", status: "Present" },
    ],
    aiInsights: [
        { label: "Attendance Status", value: "Good attendance record" },
        { label: "Pattern Analysis", value: "Punctual attendance" },
        { label: "Risk Assessment", value: "Risk score of 10% indicates low risk of dropout" },
    ],
};

// ── Status Badge ───────────────────────────────────────────────────────────────
const statusStyles = {
    Present: { bg: "#2563EB", color: "#fff" },
    Late: { bg: "#7C3AED", color: "#fff" },
    Absent: { bg: "#DC2626", color: "#fff" },
    Regular: { bg: "#2563EB", color: "#fff" },
};

function Badge({ label }) {
  const style = statusStyles[label] || { bg: "#6B7280", color: "#fff" };
  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: "4px 16px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 600,
        display: "inline-block",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
    </span>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, children, subtitle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span style={{ fontSize: "13px", color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </span>
      <div>{children}</div>
      {subtitle && (
        <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StudentDetail({ student = studentData, onBack }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        fontFamily: "'DM Sans', sans-serif",
        padding: "32px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Google Font import via style tag */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: "#374151",
            padding: "4px 8px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Go back"
        >
          ←
        </button>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            {student.name}
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#6B7280" }}>ID: {student.id}</p>
        </div>
      </div>

      {/* ── Stat Row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "32px",
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "28px 32px",
          marginBottom: "32px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <StatCard label="Attendance %" subtitle="Current month">
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#111827" }}>
            {student.attendancePercent}%
          </span>
        </StatCard>

        <StatCard label="Status" subtitle="Behavior classification">
          <Badge label={student.status} />
        </StatCard>

        <StatCard label="Late Count" subtitle="This month">
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#F59E0B" }}>
            {student.lateCount}
          </span>
        </StatCard>

        <StatCard label="Risk Score" subtitle="0-100 scale">
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#111827" }}>
            {student.riskScore}%
          </span>
        </StatCard>
      </div>

      {/* ── Charts & Recent Attendance ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          marginBottom: "32px",
        }}
      >
        {/* Attendance Trend */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "28px 32px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: 700, color: "#111827" }}>
            Attendance Trend
          </h2>
          <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "#6B7280" }}>
            Monthly attendance percentage
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={student.monthlyTrend}
              barCategoryGap="30%"
              onMouseLeave={() => setHoveredBar(null)}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: "#6B7280" }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip
                cursor={{ fill: "rgba(37,99,235,0.06)" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                }}
                formatter={(v) => [`${v}%`, "Attendance"]}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                onMouseEnter={(_, index) => setHoveredBar(index)}
              >
                {student.monthlyTrend.map((_, index) => (
                  <Cell
                    key={index}
                    fill={hoveredBar === index ? "#1D4ED8" : "#38BDF8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "12px",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                backgroundColor: "#38BDF8",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: "13px", color: "#6B7280" }}>Attendance %</span>
          </div>
        </div>

        {/* Recent Attendance */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "28px 32px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: 700, color: "#111827" }}>
            Recent Attendance
          </h2>
          <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#6B7280" }}>Last 8 days</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {student.recentAttendance.map((rec) => (
              <div
                key={rec.date}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  padding: "10px 16px",
                }}
              >
                <span style={{ fontSize: "14px", color: "#374151" }}>{rec.date}</span>
                <Badge label={rec.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Student Information ── */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "28px 32px",
          marginBottom: "32px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ margin: "0 0 24px 0", fontSize: "20px", fontWeight: 700, color: "#111827" }}>
          Student Information
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#6B7280" }}>Full Name</p>
            <p style={{ margin: 0, fontSize: "15px", color: "#111827", fontWeight: 500 }}>
              {student.name}
            </p>
          </div>
          <div>
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#6B7280" }}>Student ID</p>
            <p style={{ margin: 0, fontSize: "15px", color: "#111827", fontWeight: 500 }}>
              {student.id}
            </p>
          </div>
          <div>
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#6B7280" }}>Email</p>
            <p style={{ margin: 0, fontSize: "15px", color: "#111827", fontWeight: 500 }}>
              {student.email}
            </p>
          </div>
          <div>
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#6B7280" }}>Absent Count</p>
            <p style={{ margin: 0, fontSize: "15px", color: "#DC2626", fontWeight: 700 }}>
              {student.absentCount}
            </p>
          </div>
        </div>
      </div>

      {/* ── AI Insights ── */}
      <div
        style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "16px",
          padding: "28px 32px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <h2
          style={{
            margin: "0 0 20px 0",
            fontSize: "20px",
            fontWeight: 700,
            color: "#1E3A8A",
          }}
        >
          AI Insights
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {student.aiInsights.map((insight) => (
            <div key={insight.label} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ color: "#2563EB", fontWeight: 700, marginTop: "1px" }}>✓</span>
              <p style={{ margin: 0, fontSize: "14px", color: "#1E40AF" }}>
                <strong>{insight.label}:</strong>{" "}
                <span style={{ color: "#374151" }}>{insight.value}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}