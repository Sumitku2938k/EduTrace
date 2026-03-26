import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudents } from "../services/api";
import { useAuth } from "../utils/auth";

const STATUS_STYLES = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-600",
  Late: "bg-yellow-100 text-yellow-700",
};

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const sortByRollNo = (students) =>
  [...students].sort((firstStudent, secondStudent) =>
    firstStudent.rollNo.localeCompare(secondStudent.rollNo, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetchStudents(authorizationToken);
        const normalizedStudents = Array.isArray(response?.students)
          ? sortByRollNo(
              response.students.map((student) => ({
                id: student._id,
                name: student.name,
                rollNo: student.rollNo,
                status: null,
                time: null,
              }))
            )
          : [];

        setStudents(normalizedStudents);
      } catch (err) {
        const statusCode = err.response?.status || err.status || 500;
        const errorMessage = err.response?.data?.message || err.message || "Unable to load students right now.";

        if (statusCode === 401) {
          navigate("/login");
          return;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [authorizationToken, navigate]);

  const filtered = useMemo(
    () =>
      students.filter(
        (student) =>
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.rollNo.toLowerCase().includes(search.toLowerCase())
      ),
    [students, search]
  );

  const counts = useMemo(
    () => ({
      present: students.filter((student) => student.status === "Present").length,
      absent: students.filter((student) => student.status === "Absent").length,
      late: students.filter((student) => student.status === "Late").length,
      total: students.length,
    }),
    [students]
  );

  const setStatus = (id, status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, status, time: student.status === status ? student.time : now() }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, status: "Present", time: student.time || now() }))
    );
  };

  const exportCSV = () => {
    const rows = [
      ["Student Name", "Student ID", "Time", "Status"],
      ...students.map((student) => [student.name, student.rollNo, student.time || "", student.status || ""]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `attendance_${date}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const submitAttendance = () => {
    window.location.reload();
  };

  const formatDate = (value) => {
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="bg-gray-50 px-8 py-8 font-sans">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Daily Attendance</h1>
        <p className="mt-1 text-gray-500">Mark and manage student attendance for the day</p>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Select Date</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            {date ? <p className="mt-1 pl-1 text-xs text-gray-400">{formatDate(date)}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Search Student</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Name or Roll No..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Present", value: counts.present, color: "text-green-500" },
          { label: "Total Absent", value: counts.absent, color: "text-red-500" },
          { label: "Total Late", value: counts.late, color: "text-yellow-500" },
          { label: "Total Students", value: counts.total, color: "text-blue-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className={`mt-1 text-4xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Attendance Records</h2>
        <p className="mb-5 text-sm text-gray-400">
          Showing {filtered.length} of {students.length} records
        </p>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading students...</div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-8 text-center text-red-600">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Student Name", "Roll No", "Time", "Status", "Action"].map((heading) => (
                    <th key={heading} className="pr-4 pb-3 text-sm font-bold text-gray-700">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-400">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  filtered.map((student) => (
                    <tr key={student.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-800">{student.name}</td>
                      <td className="py-3 pr-4 text-sm text-gray-500">{student.rollNo}</td>
                      <td className="py-3 pr-4 text-sm text-gray-500">{student.time || "-"}</td>
                      <td className="py-3 pr-4">
                        {student.status ? (
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[student.status]}`}>
                            {student.status}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Not marked</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          {["Present", "Absent", "Late"].map((status) => (
                            <button
                              key={status}
                              onClick={() => setStatus(student.id, status)}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                                student.status === status
                                  ? status === "Present"
                                    ? "border-green-500 bg-green-500 text-white"
                                    : status === "Absent"
                                      ? "border-red-500 bg-red-500 text-white"
                                      : "border-yellow-500 bg-yellow-500 text-white"
                                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={markAllPresent}
          className="rounded-xl bg-blue-600 px-6 py-2.5 cursor-pointer font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Mark All Present
        </button>
        <button
          onClick={submitAttendance}
          className="rounded-xl bg-emerald-600 px-6 py-2.5 cursor-pointer font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Submit Attendance
        </button>
        <button
          onClick={exportCSV}
          className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 cursor-pointer font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
}
