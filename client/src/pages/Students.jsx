import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBehaviorClassification, fetchDashboardSummary, fetchStudents } from "../services/api";
import { useAuth } from "../utils/auth";
import StudentForm from "../components/StudentForm";

const sortByRollNo = (students) =>
  [...students].sort((firstStudent, secondStudent) =>
    firstStudent.rollNo.localeCompare(secondStudent.rollNo, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );

export default function Students() {
  const [studentsData, setStudentsData] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [irregularStudents, setIrregularStudents] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({ totalStudents: 0, present: 0 });
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();

  const handleStudentAdded = async (student) => {
    if (!student || !student._id) {
      return;
    }

    setStudentsData((previous) => {
      const alreadyExists = previous.some((item) => item._id === student._id);
      if (alreadyExists) {
        return previous;
      }

      return sortByRollNo([student, ...previous]);
    });
    setError("");
    setShowAddForm(false);
    navigate("/students");
  };

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetchStudents(authorizationToken);
        let classificationMap = new Map();
        let nextAtRiskStudents = [];
        let nextIrregularStudents = [];
        let nextAttendanceSummary = { totalStudents: 0, present: 0 };

        try {
          const classificationResponse = await fetchBehaviorClassification(authorizationToken);
          const classifiedStudents = classificationResponse?.students || [];

          classificationMap = new Map(
            classifiedStudents.map((student) => [
              String(student.studentId),
              {
                attendancePercentage: Number(student.percentage) || 0,
                category: student.category || "Regular",
              },
            ])
          );

          nextAtRiskStudents = classifiedStudents.filter((student) => student.category === "At-Risk");
          nextIrregularStudents = classifiedStudents.filter((student) => student.category === "Irregular");
        } catch (percentageError) {
          console.error("Failed to load behavior classification:", percentageError);
        }

        try {
          const dashboardSummary = await fetchDashboardSummary(authorizationToken);
          nextAttendanceSummary = {
            totalStudents: dashboardSummary?.totalStudents ?? 0,
            present: dashboardSummary?.present ?? 0,
          };
        } catch (summaryError) {
          console.error("Failed to load dashboard attendance summary:", summaryError);
        }

        const normalizedStudents = Array.isArray(response)
          ? sortByRollNo(response).map((student) => ({
              ...student,
              attendancePercentage: classificationMap.get(String(student._id))?.attendancePercentage ?? 0,
              behaviorCategory: classificationMap.get(String(student._id))?.category ?? "Regular",
            }))
          : Array.isArray(response?.students)
            ? sortByRollNo(response.students).map((student) => ({
                ...student,
                attendancePercentage: classificationMap.get(String(student._id))?.attendancePercentage ?? 0,
                behaviorCategory: classificationMap.get(String(student._id))?.category ?? "Regular",
              }))
            : [];

        setStudentsData(normalizedStudents);
        setAtRiskStudents(sortByRollNo(nextAtRiskStudents));
        setIrregularStudents(sortByRollNo(nextIrregularStudents));
        setAttendanceSummary(nextAttendanceSummary);
      } catch (err) {
        const statusCode = err.response?.status || err.status || 500;
        const errorMessage = err.response?.data?.message || err.message || "Unable to load students right now.";

        if (statusCode === 401) {
          navigate("/login");
          return;
        }

        if (statusCode === 403) {
          setError(errorMessage || "You do not have permission to view students.");
          return;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [navigate, authorizationToken]);

  const filtered = useMemo(() => {
    return studentsData.filter((student) => {
      const searchValue = search.toLowerCase();
      return (
        student.name.toLowerCase().includes(searchValue) ||
        student.rollNo.toLowerCase().includes(searchValue) ||
        student.email.toLowerCase().includes(searchValue)
      );
    });
  }, [search, studentsData]);

  const totalDepartments = new Set(studentsData.map((student) => student.department)).size;
  const averageAttendance =
    attendanceSummary.totalStudents > 0
      ? Math.round((attendanceSummary.present / attendanceSummary.totalStudents) * 100)
      : 0;

  return (
    <div className="bg-gray-50 px-8 py-8 font-sans">
      <div className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="mt-1 text-gray-500">Browse the live student directory from the protected backend API</p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm((previous) => !previous)}
            className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-blue-600 hover:to-indigo-600"
          >
            {showAddForm ? "Close form" : "Add student"}
          </button>
        </div>
      </div>

      {showAddForm ? (
        <div className="mb-8">
          <StudentForm
            onStudentCreated={handleStudentAdded}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white px-8 py-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Students</p>
          <p className="mt-1 text-4xl font-bold text-gray-900">{studentsData.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white px-8 py-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Departments</p>
          <p className="mt-1 text-4xl font-bold text-gray-900">{totalDepartments}</p>
        </div>  
        <div className="rounded-2xl border border-gray-100 bg-white px-8 py-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Average Attendance</p>
          <p className="mt-1 text-4xl font-bold text-gray-900">{averageAttendance}%</p>
        </div>
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-red-100 bg-red-50/80 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-red-900">At-Risk Students</h2>
              <p className="mt-1 text-sm text-red-700">Attendance percentage below 60%.</p>
            </div>
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              {atRiskStudents.length}
            </span>
          </div>

          <div className="space-y-3">
            {atRiskStudents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-red-200 bg-white/70 px-4 py-6 text-center text-sm text-red-600">
                No at-risk students found right now.
              </div>
            ) : (
              atRiskStudents.map((student) => (
                <div
                  key={student.studentId}
                  className="rounded-2xl border border-red-100 bg-white px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">
                        Roll No: {student.rollNo} | {student.department}
                      </p>
                    </div>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                      {student.percentage}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-amber-50/80 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-amber-900">Irregular Students</h2>
              <p className="mt-1 text-sm text-amber-700">Attendance percentage from 60% to 84%.</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              {irregularStudents.length}
            </span>
          </div>

          <div className="space-y-3">
            {irregularStudents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-amber-200 bg-white/70 px-4 py-6 text-center text-sm text-amber-700">
                No irregular students found right now.
              </div>
            ) : (
              irregularStudents.map((student) => (
                <div
                  key={student.studentId}
                  className="rounded-2xl border border-amber-100 bg-white px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">
                        Roll No: {student.rollNo} | {student.department}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
                      {student.percentage}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by name, roll number, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center text-gray-500 shadow-sm">
          Loading students...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center text-red-600 shadow-sm">
          {error}
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">Student Directory</h2>
            <p className="mt-1 text-sm text-gray-400">
              Showing {filtered.length} of {studentsData.length} students
            </p>
          </div>

          <div className="space-y-3 p-4">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-10 text-center text-gray-400">
                No students found for your current search.
              </div>
            ) : (
              filtered.map((student) => (
                (() => {
                  const isAtRisk = student.behaviorCategory === "At-Risk";
                  const isIrregular = student.behaviorCategory === "Irregular";
                  const isRegular = student.behaviorCategory === "Regular";

                  return (
                <div
                  key={student._id}
                  onClick={() => navigate(`/students/${student._id}`)}
                  className={`cursor-pointer rounded-2xl border px-6 py-5 shadow-sm transition-all hover:shadow-md ${
                    isAtRisk
                      ? "border-red-200 bg-red-50/40"
                      : isIrregular
                        ? "border-amber-200 bg-amber-50/40"
                        : "border-emerald-200 bg-emerald-50/40"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-900">{student.name}</span>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {student.department}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Roll No: {student.rollNo} | {student.email}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>
                          Attendance: <b>{student.attendancePercentage ?? 0}%</b>
                        </span>
                        {isAtRisk ? (
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                            At-Risk
                          </span>
                        ) : null}
                        {isIrregular ? (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Irregular
                          </span>
                        ) : null}
                        {isRegular ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            Regular
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                  );
                })()
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
