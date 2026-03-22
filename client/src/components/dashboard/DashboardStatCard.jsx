export default function DashboardStatCard({ label, value, icon, valueColor, bgColor }) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className={`mt-1 text-3xl font-bold ${valueColor}`}>{value}</p>
            </div>
            <div className={`ml-auto flex h-12 w-12 items-center justify-center rounded-2xl ${bgColor}`}>
                {icon}
            </div>
        </div>
    );
}
