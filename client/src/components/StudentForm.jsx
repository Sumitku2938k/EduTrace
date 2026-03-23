import { useMemo, useState } from "react";
import { createStudent } from "../services/api";
import { useAuth } from "../utils/auth";

const initialFormState = {
    name: "",
    rollNo: "",
    email: "",
    department: "",
};

const initialStatus = {
    loading: false,
    error: "",
    success: "",
};

export default function StudentForm({ onStudentCreated }) {
    const [formState, setFormState] = useState(initialFormState);
    const [status, setStatus] = useState(initialStatus);
    const { authorizationToken, user } = useAuth();
    const isAdmin = user?.role === "admin";

    const isFormComplete = useMemo(() => {
        return Object.values(formState).every((value) => value.trim().length > 0);
    }, [formState]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isAdmin) {
            setStatus({ loading: false, error: "Only admins can add students.", success: "" });
            return;
        }

        if (!isFormComplete) {
            setStatus({ loading: false, error: "Please complete every field before submitting.", success: "" });
            return;
        }

        setStatus({ ...initialStatus, loading: true });

        try {
            const payload = {
                name: formState.name.trim(),
                rollNo: formState.rollNo.trim(),
                email: formState.email.trim(),
                department: formState.department.trim(),
            };

            const data = await createStudent(payload, authorizationToken);
            const nextStudent = data.student || data;

            setFormState(initialFormState);
            setStatus({ loading: false, error: "", success: data.message || "Student added successfully." });
            await onStudentCreated?.(nextStudent);
        } catch (error) {
            setStatus({
                loading: false,
                error: error.message || "Unable to add the student right now.",
                success: "",
            });
        }
    };

    return (
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Add a student</h2>
                <p className="text-sm text-gray-500">Use this form to keep the student directory up to date. Admin access required.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm text-gray-600"> 
                        Student name
                        <input
                            name="name"
                            type="text"
                            value={formState.name}
                            onChange={handleChange}
                            placeholder="e.g. Ayesha Rao"
                            className="mt-1 rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm text-gray-600">
                        Roll number
                        <input
                            name="rollNo"
                            type="text"
                            value={formState.rollNo}
                            onChange={handleChange}
                            placeholder="Roll No."
                            className="mt-1 rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm text-gray-600">
                        Email
                        <input
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleChange}
                            placeholder="student@school.edu"
                            className="mt-1 rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm text-gray-600">
                        Department
                        <input
                            name="department"
                            type="text"
                            value={formState.department}
                            onChange={handleChange}
                            placeholder="e.g. Computer Science"
                            className="mt-1 rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="submit"
                        disabled={status.loading || !isAdmin || !isFormComplete}
                        className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition duration-150 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {status.loading ? "Saving..." : "Add student"}
                    </button>
                    <p className="text-xs text-gray-500">
                        {isAdmin ? "All fields are required." : "Only admins can add students."}
                    </p>
                </div>

                {status.error && (
                    <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600">
                        {status.error}
                    </p>
                )}
                {status.success && (
                    <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                        {status.success}
                    </p>
                )}
            </form>
        </div>
    );
}
