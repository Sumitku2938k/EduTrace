import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { loginUser } from "../services/api";
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await loginUser({ email, password });
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to sign in. Please try again.");
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#eef2ff] via-[#f5f7ff] to-[#f0f4ff] px-4">
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-[20px] bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-4">
                    <GraduationCap size={34} />
                </div>
                <h1 className="text-[32px] font-extrabold text-[#1a1d2e] tracking-tight">EduTrace</h1>
                <p className="text-[15px] text-[#6b7280] mt-1">Smart Attendance &amp; Behavior Analysis</p>
            </div>

            <div className="w-full max-w-110 rounded-3xl bg-white rounded-5xl border border-slate-100 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06),0_2px_10px_rgba(0,0,0,0.04)]">
                <div className="mb-6">
                    <h2 className="text-[24px] font-bold text-[#1a1d2e]">Teacher Login</h2>
                    <p className="text-[14px] text-[#6b7280] mt-1">Enter your credentials to access the dashboard</p>
                </div>

                <form onSubmit={handleSignIn} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[14px] font-medium text-[#374151]">Email</label>
                        <input
                            type="email"
                            placeholder="your.email@school.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.75 rounded-xl border border-[#e5e7eb] text-[14.5px] text-[#1a1d2e] placeholder-[#b0b7c3] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[14px] font-medium text-[#374151]">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.75 rounded-xl border border-[#e5e7eb] text-[14.5px] text-[#1a1d2e] placeholder-[#b0b7c3] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                        />
                    </div>

                    {error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.25 rounded-xl cursor-pointer bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-[15px] font-semibold shadow-md shadow-indigo-200 transition-all duration-200 mt-1 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>
                </form>
            </div>

            <p className="mt-6 mb-2 text-[14px] text-[#6b7280] text-center">Smart attendance system for modern classrooms</p>
        </div>
    );
};

export default Login;
