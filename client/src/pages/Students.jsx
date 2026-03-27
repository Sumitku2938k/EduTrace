import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudentAttendancePercentages, fetchStudents } from "../services/api";
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
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
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
        let percentageMap = new Map();

        try {
          const percentageResponse = await fetchStudentAttendancePercentages(authorizationToken);
          percentageMap = new Map(
            (percentageResponse?.students || []).map((student) => [
              String(student.studentId),
              Number(student.attendancePercentage) || 0,
            ])
          );
        } catch (percentageError) {
          console.error("Failed to load attendance percentages:", percentageError);
        }

        const normalizedStudents = Array.isArray(response)
          ? sortByRollNo(response).map((student) => ({
              ...student,
              attendancePercentage: percentageMap.get(String(student._id)) ?? 0,
            }))
          : Array.isArray(response?.students)
            ? sortByRollNo(response.students).map((student) => ({
                ...student,
                attendancePercentage: percentageMap.get(String(student._id)) ?? 0,
              }))
            : [];

        setStudentsData(normalizedStudents);
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
          <p className="text-sm font-medium text-gray-500">Results Shown</p>
          <p className="mt-1 text-4xl font-bold text-gray-900">{filtered.length}</p>
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
                <div
                  key={student._id}
                  onClick={() => setSelectedId(selectedId === student._id ? null : student._id)}
                  className={`cursor-pointer rounded-2xl border px-6 py-5 shadow-sm transition-all hover:shadow-md ${
                    selectedId === student._id ? "border-blue-300 bg-blue-50" : "border-gray-100 bg-white"
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
                      <p className="mt-2 text-s text-gray-500">
                        Attendance: <b>{student.attendancePercentage ?? 0}%</b>
                      </p>
                    </div>

                    <svg
                      className={`h-5 w-5 text-gray-400 transition-transform ${selectedId === student._id ? "rotate-90" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {selectedId === student._id ? (
                    <div className="mt-4 grid gap-3 border-t border-blue-100 pt-4 text-sm text-gray-600 md:grid-cols-3">
                      <div className="rounded-xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Student ID</p>
                        <p className="mt-1 font-semibold text-gray-900">{student._id}</p>
                      </div>
                      <div className="rounded-xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Email</p>
                        <p className="mt-1 font-semibold text-gray-900">{student.email}</p>
                      </div>
                      <div className="rounded-xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Department</p>
                        <p className="mt-1 font-semibold text-gray-900">{student.department}</p>
                      </div>
                      <div className="rounded-xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Attendance</p>
                        <p className="mt-1 font-semibold text-gray-900">{student.attendancePercentage ?? 0}%</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
