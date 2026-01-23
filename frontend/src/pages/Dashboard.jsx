import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { token, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const data = await apiRequest(
                    "/analytics/dashboard",
                    "GET",
                    null,
                    token
                );
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, [token]);

    if (loading) {
        return <p className="text-center mt-10">Loading dashboard...</p>;
    }

    if (error) {
        return (
            <div className="text-center mt-10">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={logout}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 space-y-6">
            <h1 className="text-2xl font-bold text-center">
                Analytics Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Posts" value={stats.total_posts} />
                <StatCard
                    title="Avg Engagement"
                    value={stats.average_engagement}
                />
                <StatCard title="Top Tone" value={stats.top_tone || "N/A"} />
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white shadow rounded p-6 text-center">
            <h2 className="text-gray-500">{title}</h2>
            <p className="text-3xl font-semibold mt-2">{value}</p>
        </div>
    );
}
