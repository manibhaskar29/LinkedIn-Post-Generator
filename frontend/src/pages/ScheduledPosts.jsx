import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ScheduledPosts() {
    const { token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchPosts() {
            try {
                const data = await apiRequest(
                    "/posts/scheduled",
                    "GET",
                    null,
                    token
                );
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, [token]);

    if (loading) {
        return <p className="text-center mt-10">Loading scheduled posts...</p>;
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
                Scheduled Posts
            </h1>

            {posts.length === 0 && (
                <p className="text-center text-gray-500">No scheduled posts yet</p>
            )}

            <div className="space-y-4">
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="border rounded p-4 bg-white shadow"
                    >
                        <p className="text-gray-700 whitespace-pre-line">{post.content}</p>

                        <div className="flex justify-between mt-3 text-sm">
                            <span>⏰ {new Date(post.scheduled_time).toLocaleString()}</span>

                            <StatusBadge status={post.status} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const colors = {
        scheduled: "bg-yellow-100 text-yellow-700",
        running: "bg-blue-100 text-blue-700",
        posted: "bg-green-100 text-green-700",
        failed: "bg-red-100 text-red-700",
    };

    return (
        <span className={`px-3 py-1 rounded text-xs font-semibold ${colors[status]}`}>
            {status.toUpperCase()}
        </span>
    );
}