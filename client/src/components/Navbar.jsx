import React from "react";
import { getStoredUser } from "../services/api";

const Navbar = () => {
    const user = getStoredUser();
    const displayName = user?.name || user?.fullName || user?.username || user?.email?.split("@")[0] || "Teacher";
    const roleLabel = user?.role || "Teacher";

    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-end">
            <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                <p className="text-xs text-gray-400 capitalize">{roleLabel}</p>
            </div>
        </header>
    );
};

export default Navbar;
