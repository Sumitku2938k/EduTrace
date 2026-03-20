import React from 'react';

const DashboardHeader = () => {
    return (
        <div>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-end">
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">Dr. Sarah Johnson</p>
                    <p className="text-xs text-gray-400">Teacher</p>
                </div>
            </header>
        </div>
    );
}

export default DashboardHeader;
