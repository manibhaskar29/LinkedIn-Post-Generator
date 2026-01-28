import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

export default function Posts() {
    const { token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchPosts() {
            try {
                const data = await apiRequest(
                    "/posts/all",
                    "GET",
                    null,
                    token
                );
                setPosts(data);
            } catch (err) {
                setError(err.message || "Failed to load posts");
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, [token]);

    if (loading) {
        return (
            <div>
                <Navbar />
                <Loader message="Loading your posts..." />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="max-w-5xl mx-auto mt-10 p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-center font-medium">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-5xl mx-auto mt-10 px-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">
                        All Posts
                    </h1>
                    <span className="text-sm text-gray-500">
                        {posts.length} {posts.length === 1 ? "post" : "posts"}
                    </span>
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No posts yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by generating your first post!
                        </p>
                        <div className="mt-6">
                            <a
                                href="/generate"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Generate Post
                            </a>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {post.tone && (
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                                            {post.tone.toUpperCase()}
                                        </span>
                                    )}
                                    {post.engagement_score !== undefined && (
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                            ⭐ {post.engagement_score}/10
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(post.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>

                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {post.content}
                            </p>

                            <div className="mt-4 flex gap-2">
                                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    Edit
                                </button>
                                <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                                    Delete
                                </button>
                                <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                                    Copy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
