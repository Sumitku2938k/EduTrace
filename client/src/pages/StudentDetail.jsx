import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentById, fetchStudentAttendance, fetchStudentAttendancePercentages } from "../services/api";
import { useAuth } from "../utils/auth";

const monthlyTrendData = [
  { month: "Jan", value: 96 },
  { month: "Feb", value: 93 },
  { month: "Mar", value: 91 },
  { month: "Apr", value: 95 },
  { month: "May", value: 98 },
  { month: "Jun", value: 88 },
];

const statusStyles = {
  Present: { bg: "#2563EB", color: "#fff" },
  Late: { bg: "#7C3AED", color: "#fff" },
  Absent: { bg: "#DC2626", color: "#fff" },
  Regular: { bg: "#059669", color: "#fff" },
  Irregular: { bg: "#D97706", color: "#fff" },
  "At-Risk": { bg: "#DC2626", color: "#fff" },
};

const formatDisplayDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const isPastOrToday = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
};

const isSunday = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getDay() === 0;
};

const getStudentStatus = (attendancePercentage, absentCountLast7Days) => {
  if (attendancePercentage < 75) {
    return "At-Risk";
  }

  if (absentCountLast7Days >= 3) {
    return "Irregular";
  }

  return "Regular";
};

const getRiskScore = (attendancePercentage, absentCount, lateCount) => {
  const score = Math.round((100 - attendancePercentage) * 0.7 + absentCount * 8 + lateCount * 4);
  return Math.max(0, Math.min(100, score));
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

function StatCard({ label, children, subtitle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span style={{ fontSize: "13px", color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </span>
      <div>{children}</div>
      {subtitle ? (
        <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
          {subtitle}
        </span>
      ) : null}
    </div>
  );
}

export default function StudentDetail() {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [student, setStudent] = useState(null);
  const [studentStats, setStudentStats] = useState({
    attendancePercentage: 0,
    present: 0,
    absent: 0,
    late: 0,
    absentCountLast7Days: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { authorizationToken } = useAuth();

  useEffect(() => {
    const loadStudentDetail = async () => {
      setLoading(true);
      setError("");

      try {
        const [studentResponse, percentagesResponse, attendanceResponse] = await Promise.all([
          getStudentById(id, authorizationToken),
          fetchStudentAttendancePercentages(authorizationToken),
          fetchStudentAttendance(id, authorizationToken),
        ]);

        const currentStudent = studentResponse?.student ?? null;
        const currentStudentStats =
          percentagesResponse?.students?.find((item) => String(item.studentId) === String(id)) || null;

        const lastSevenDaysAttendance = (attendanceResponse?.attendance || [])
          .filter((record) => isPastOrToday(record.date) && !isSunday(record.date))
          .sort((firstRecord, secondRecord) => new Date(secondRecord.date) - new Date(firstRecord.date))
          .slice(0, 7);

        setStudent(currentStudent);
        setStudentStats({
          attendancePercentage: currentStudentStats?.attendancePercentage ?? 0,
          present: currentStudentStats?.present ?? 0,
          absent: currentStudentStats?.absent ?? 0,
          late: currentStudentStats?.late ?? 0,
          absentCountLast7Days: currentStudentStats?.absentCountLast7Days ?? 0,
        });
        setRecentAttendance(lastSevenDaysAttendance);
      } catch (err) {
        const message = err?.message || "Failed to load student details.";
        if (message.toLowerCase().includes("unauthorized")) {
          navigate("/login");
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadStudentDetail();
  }, [authorizationToken, id, navigate]);

  const derivedStatus = useMemo(
    () => getStudentStatus(studentStats.attendancePercentage, studentStats.absentCountLast7Days),
    [studentStats.attendancePercentage, studentStats.absentCountLast7Days]
  );

  const riskScore = useMemo(
    () => getRiskScore(studentStats.attendancePercentage, studentStats.absent, studentStats.late),
    [studentStats.attendancePercentage, studentStats.absent, studentStats.late]
  );

  const aiInsights = useMemo(
    () => [
      {
        label: "Attendance Status",
        value: `${studentStats.attendancePercentage}% attendance with ${derivedStatus.toLowerCase()} standing.`,
      },
      {
        label: "Recent Pattern",
        value: `${studentStats.absentCountLast7Days} absences recorded in the last 7 days and ${studentStats.late} late entries overall.`,
      },
      {
        label: "Risk Assessment",
        value: `Current risk score is ${riskScore}% based on attendance percentage, absences, and late count.`,
      },
    ],
    [derivedStatus, riskScore, studentStats.absentCountLast7Days, studentStats.attendancePercentage, studentStats.late]
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center text-gray-500 shadow-sm">
        Loading student details...
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center text-red-600 shadow-sm">
        {error || "Student not found."}
      </div>
    );
  }

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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
        <button
          onClick={() => navigate("/students")}
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
          <p style={{ margin: 0, fontSize: "14px", color: "#6B7280" }}>ID: {student._id}</p>
        </div>
      </div>

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
        <StatCard label="Attendance %" subtitle="Overall attendance">
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#111827" }}>
            {studentStats.attendancePercentage}%
          </span>
        </StatCard>

        <StatCard label="Status" subtitle="Behavior classification">
          <Badge label={derivedStatus} />
        </StatCard>

        <StatCard label="Late Count" subtitle="Overall recorded">
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#F59E0B" }}>
            {studentStats.late}
          </span>
        </StatCard>

        <StatCard label="Risk Score" subtitle="0-100 scale">
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#111827" }}>
            {riskScore}%
          </span>
        </StatCard>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          marginBottom: "32px",
        }}
      >
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
              data={monthlyTrendData}
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
                formatter={(value) => [`${value}%`, "Attendance"]}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                onMouseEnter={(_, index) => setHoveredBar(index)}
              >
                {monthlyTrendData.map((_, index) => (
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
          <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#6B7280" }}>Last 7 attendance days</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentAttendance.length === 0 ? (
              <div
                style={{
                  border: "1px dashed #D1D5DB",
                  borderRadius: "12px",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#6B7280",
                  fontSize: "14px",
                }}
              >
                No attendance records found in the last 7 attendance days.
              </div>
            ) : (
              recentAttendance.map((record) => (
                <div
                  key={`${record.date}-${record.status}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #E5E7EB",
                    borderRadius: "10px",
                    padding: "10px 16px",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#374151" }}>{formatDisplayDate(record.date)}</span>
                  <Badge label={record.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#6B7280" }}>Roll Number</p>
            <p style={{ margin: 0, fontSize: "15px", color: "#111827", fontWeight: 500 }}>
              {student.rollNo}
            </p>
          </div>
          <div>
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#6B7280" }}>Email</p>
            <p style={{ margin: 0, fontSize: "15px", color: "#111827", fontWeight: 500 }}>
              {student.email}
            </p>
          </div>
          <div>
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#6B7280" }}>Department</p>
            <p style={{ margin: 0, fontSize: "15px", color: "#111827", fontWeight: 500 }}>
              {student.department}
            </p>
          </div>
          <div>
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#6B7280" }}>Present Count</p>
            <p style={{ margin: 0, fontSize: "15px", color: "#059669", fontWeight: 700 }}>
              {studentStats.present}
            </p>
          </div>
          <div>
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#6B7280" }}>Absent Count</p>
            <p style={{ margin: 0, fontSize: "15px", color: "#DC2626", fontWeight: 700 }}>
              {studentStats.absent}
            </p>
          </div>
        </div>
      </div>

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
          {aiInsights.map((insight) => (
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
