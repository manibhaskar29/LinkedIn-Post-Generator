import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { token } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const res = await apiRequest(
                    "/analytics/dashboard",
                    "GET",
                    null,
                    token
                );
                setData(res);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
    }, [token]); // [token] means if user logs out and logs in again, then dashboard will be reloaded

    if (loading) {
        return <p className="text-center mt-10">Loading dashboard...</p>;
    }

    if (error) {
        return (
            <p className="text-center mt-10 text-red-600">
                {error}
            </p>
        );
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 space-y-6">
            <h1 className="text-3xl font-bold text-center">
                Analytics Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Total Posts" value={data.total_posts} />
                <Card
                    title="Avg Engagement"
                    value={data.average_engagement}
                />
                <Card
                    title="Top Tone"
                    value={data.top_tone || "N/A"}
                />
            </div>
        </div>
    );
}

function Card({ title, value }) {
    return (
        <div className="bg-white shadow rounded p-6 text-center">
            <p className="text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
    );
}
