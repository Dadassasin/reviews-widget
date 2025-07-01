// src/app/components/StatCard.js
export default function StatCard({ title, value }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="mt-1 text-2xl font-medium text-gray-800">{value}</div>
        </div>
    );
}
