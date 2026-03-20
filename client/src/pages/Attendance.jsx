import { useState, useMemo } from "react";

const initialStudents = [
  { id: "STU001", name: "John Smith", status: null, time: null },
  { id: "STU002", name: "Emma Davis", status: null, time: null },
  { id: "STU003", name: "Michael Brown", status: null, time: null },
  { id: "STU004", name: "Sarah Wilson", status: null, time: null },
  { id: "STU005", name: "James Taylor", status: null, time: null },
  { id: "STU006", name: "Olivia Martinez", status: null, time: null },
  { id: "STU007", name: "Liam Anderson", status: null, time: null },
  { id: "STU008", name: "Sophia Thomas", status: null, time: null },
  { id: "STU009", name: "Noah Jackson", status: null, time: null },
  { id: "STU010", name: "Isabella White", status: null, time: null },
];

const STATUS_STYLES = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-600",
  Late: "bg-yellow-100 text-yellow-700",
};

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(initialStudents);

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.id.toLowerCase().includes(search.toLowerCase())
      ),
    [students, search]
  );

  const counts = useMemo(
    () => ({
      present: students.filter((s) => s.status === "Present").length,
      absent: students.filter((s) => s.status === "Absent").length,
      late: students.filter((s) => s.status === "Late").length,
      total: students.length,
    }),
    [students]
  );

  const setStatus = (id, status) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status, time: s.status === status ? s.time : now() } : s
      )
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, status: "Present", time: s.time || now() }))
    );
  };

  const exportCSV = () => {
    const rows = [
      ["Student Name", "Student ID", "Time", "Status"],
      ...students.map((s) => [s.name, s.id, s.time || "", s.status || ""]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (d) => {
    const [y, m, day] = d.split("-");
    return `${day}-${m}-${y}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8 font-sans">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Daily Attendance</h1>
        <p className="text-gray-500 mt-1">Mark and manage student attendance for the day</p>
      </div>

      {/* Date & Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            {/* Display formatted */}
            {date && (
              <p className="text-xs text-gray-400 mt-1 pl-1">{formatDate(date)}</p>
            )}
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Student</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Present", value: counts.present, color: "text-green-500" },
          { label: "Total Absent", value: counts.absent, color: "text-red-500" },
          { label: "Total Late", value: counts.late, color: "text-yellow-500" },
          { label: "Total Students", value: counts.total, color: "text-blue-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className={`text-4xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Attendance Records</h2>
        <p className="text-sm text-gray-400 mb-5">
          Showing {filtered.length} of {students.length} records
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {["Student Name", "Student ID", "Time", "Status", "Action"].map((h) => (
                  <th key={h} className="pb-3 text-sm font-bold text-gray-700 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-10">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-gray-800">{student.name}</td>
                    <td className="py-3 pr-4 text-gray-500 text-sm">{student.id}</td>
                    <td className="py-3 pr-4 text-gray-500 text-sm">{student.time || "—"}</td>
                    <td className="py-3 pr-4">
                      {student.status ? (
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[student.status]}`}>
                          {student.status}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Not marked</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {["Present", "Absent", "Late"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setStatus(student.id, s)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${
                              student.status === s
                                ? s === "Present"
                                  ? "bg-green-500 text-white border-green-500"
                                  : s === "Absent"
                                  ? "bg-red-500 text-white border-red-500"
                                  : "bg-yellow-500 text-white border-yellow-500"
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {s}
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
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-3">
        <button
          onClick={markAllPresent}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          Mark All Present
        </button>
        <button
          onClick={exportCSV}
          className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-xl border border-gray-200 transition-colors"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
}