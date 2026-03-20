import { useState, useMemo } from "react";

const studentsData = [
  { id: "s001", name: "Alice Johnson", email: "alice@school.edu", attendance: 92, riskScore: 10, category: "Regular" },
  { id: "s002", name: "Bob Smith", email: "bob@school.edu", attendance: 78, riskScore: 40, category: "Irregular" },
  { id: "s003", name: "Charlie Brown", email: "charlie@school.edu", attendance: 88, riskScore: 20, category: "Regular" },
  { id: "s004", name: "Diana Prince", email: "diana@school.edu", attendance: 70, riskScore: 70, category: "At-risk" },
  { id: "s005", name: "Ethan Hunt", email: "ethan@school.edu", attendance: 95, riskScore: 5, category: "Regular" },
  { id: "s006", name: "Fiona Green", email: "fiona@school.edu", attendance: 82, riskScore: 35, category: "Irregular" },
  { id: "s007", name: "George Miller", email: "george@school.edu", attendance: 65, riskScore: 75, category: "At-risk" },
  { id: "s008", name: "Hannah White", email: "hannah@school.edu", attendance: 90, riskScore: 15, category: "Regular" },
  { id: "s009", name: "Ian Black", email: "ian@school.edu", attendance: 72, riskScore: 65, category: "At-risk" },
  { id: "s010", name: "Jessica Red", email: "jessica@school.edu", attendance: 87, riskScore: 20, category: "Regular" },
];

const CATEGORY_STYLES = {
  Regular: "bg-blue-500 text-white",
  Irregular: "bg-purple-500 text-white",
  "At-risk": "bg-red-500 text-white",
};

const FILTERS = ["All Students", "Regular", "Irregular", "At-risk"];

export default function Students() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Students");
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    return studentsData.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        activeFilter === "All Students" || s.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const avgAttendance = (
    studentsData.reduce((sum, s) => sum + s.attendance, 0) / studentsData.length
  ).toFixed(1);

  const atRiskCount = studentsData.filter((s) => s.category === "At-risk").length;

  const handleViewAtRisk = () => {
    setActiveFilter("At-risk");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8 font-sans">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-500 mt-1">Manage and monitor student attendance and behavior</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-0 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 divide-x divide-gray-100">
        <div className="px-8 py-6">
          <p className="text-sm text-gray-500 font-medium">Total Students</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{studentsData.length}</p>
        </div>
        <div className="px-8 py-6">
          <p className="text-sm text-gray-500 font-medium">Avg Attendance</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{avgAttendance}%</p>
        </div>
        <div className="px-8 py-6">
          <p className="text-sm text-gray-500 font-medium">At-Risk Students</p>
          <p className="text-4xl font-bold text-red-500 mt-1">{atRiskCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by name, ID, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all border ${
              activeFilter === filter
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Student Directory */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Student Directory</h2>
        <p className="text-sm text-gray-400 mb-4">
          Showing {filtered.length} of {studentsData.length} students
        </p>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-10 text-center text-gray-400">
              No students found
            </div>
          ) : (
            filtered.map((student) => (
              <div
                key={student.id}
                onClick={() => setSelectedId(selectedId === student.id ? null : student.id)}
                className={`bg-white rounded-2xl border shadow-sm px-6 py-5 flex items-center justify-between cursor-pointer transition-all hover:shadow-md ${
                  selectedId === student.id
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-100"
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-bold text-gray-900">{student.name}</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_STYLES[student.category]}`}>
                      {student.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">
                    ID: {student.id} • {student.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Attendance:{" "}
                    <span className="font-bold text-gray-900">{student.attendance}%</span>
                    {"   "}
                    Risk Score:{" "}
                    <span className="font-bold text-gray-900">{student.riskScore}%</span>
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${selectedId === student.id ? "rotate-90" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Intervention Required Banner */}
      {atRiskCount > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-6">
          <h3 className="text-lg font-bold text-red-700 mb-3">Intervention Required</h3>
          <div className="flex items-start gap-2 mb-4">
            <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">
              <span className="font-bold">{atRiskCount} student(s)</span> are flagged as at-risk. Consider reaching out to them or their guardians.
            </p>
          </div>
          <button
            onClick={handleViewAtRisk}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            View At-Risk Students
          </button>
        </div>
      )}
    </div>
  );
}