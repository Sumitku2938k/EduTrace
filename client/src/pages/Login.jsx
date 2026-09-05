import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, UserCheck } from "lucide-react";
import { loginUser } from "../services/api";
import { useAuth } from "../utils/auth";
import { toast } from 'react-toastify';

const DEMO_LOGIN_EMAIL = import.meta.env.VITE_DEMO_LOGIN_EMAIL || "demo@edutrace.app";
const DEMO_LOGIN_PASSWORD = import.meta.env.VITE_DEMO_LOGIN_PASSWORD || "Demo@12345";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { storeTokenInLS, storeUserInLS } = useAuth();

    const submitLogin = async (credentials, successMessage = "Login Successful") => {
        setError("");
        setIsSubmitting(true);

        try {
            const res_data = await loginUser(credentials);
            console.log("Response from Server while login: ", res_data);
            storeTokenInLS(res_data.token);
            storeUserInLS(res_data.user);

            toast.success(successMessage);
            navigate("/");
        } catch (error) {
            console.log("Login Error: ", error);
            setError(error.message || "Unable to sign in. Please try again.");
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        await submitLogin({ email, password });
    };

    const handleDemoLogin = async () => {
        await submitLogin(
            { email: DEMO_LOGIN_EMAIL, password: DEMO_LOGIN_PASSWORD },
            "Demo Login Successful"
        );
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

                <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={isSubmitting}
                    className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-4 py-3.25 text-[15px] font-semibold text-white shadow-md shadow-slate-200 transition-all duration-200 hover:bg-[#0f172a] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                >
                    <UserCheck size={18} />
                    {isSubmitting ? "Logging In..." : "Continue with Demo Login"}
                </button>

                <div className="mb-5 flex items-center gap-3">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-medium uppercase text-slate-400">or</span>
                    <span className="h-px flex-1 bg-slate-200" />
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
