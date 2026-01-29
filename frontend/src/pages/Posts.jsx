import { useEffect, useState, useRef } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Copy, X, Star, Search, Filter, Download } from "lucide-react";
import toast from "react-hot-toast";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

export default function Posts() {
    const { token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingPost, setEditingPost] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTone, setFilterTone] = useState("");
    const [filterFavorite, setFilterFavorite] = useState(false);
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");

    const trackedViews = useRef(new Set()); // Track which posts have been viewed

    useEffect(() => {
        fetchPosts();
    }, [token, searchTerm, filterTone, filterFavorite, sortBy, sortOrder]);

    async function fetchPosts() {
        setLoading(true);
        try {
            // Build query string
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);
            if (filterTone) params.append("tone", filterTone);
            if (filterFavorite) params.append("is_favorite", "true");
            params.append("sort_by", sortBy);
            params.append("sort_order", sortOrder);

            const queryString = params.toString();
            const data = await apiRequest(
                `/posts/all${queryString ? `?${queryString}` : ""}`,
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


    const handleCopy = async (content, postId) => {
        try {
            await navigator.clipboard.writeText(content);

            // Track click analytics (views are tracked automatically when post is visible)
            try {
                await apiRequest(`/analytics/posts/${postId}/click`, "POST", null, token);
            } catch (analyticsErr) {
                console.error("Failed to track analytics:", analyticsErr);
                // Don't show error to user - analytics failure shouldn't block copy
            }

            toast.success("Post copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy post");
        }
    };

    const trackView = async (postId) => {
        // Only track if not already tracked this session
        if (trackedViews.current.has(postId)) {
            return;
        }

        try {
            await apiRequest(`/analytics/posts/${postId}/view`, "POST", null, token);
            trackedViews.current.add(postId); // Mark as tracked
        } catch (err) {
            // Silent fail - don't show error for analytics tracking
            console.error("Failed to track view:", err);
        }
    };

    // Setup IntersectionObserver for automatic view tracking
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const postId = entry.target.getAttribute('data-post-id');
                        if (postId) {
                            trackView(postId);
                        }
                    }
                });
            },
            {
                threshold: 0.5, // Track when 50% of post is visible
                rootMargin: '0px'
            }
        );

        // Observe all post cards
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach((card) => observer.observe(card));

        return () => {
            postCards.forEach((card) => observer.unobserve(card));
        };
    }, [posts]); // Re-run when posts change

    const handleDelete = async (postId) => {
        try {
            await apiRequest(`/posts/${postId}`, "DELETE", null, token);
            setPosts(posts.filter(p => p._id !== postId));
            setDeleteConfirm(null);
            toast.success("Post deleted successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to delete post");
        }
    };

    const handleEditSubmit = async (postId, content, tone) => {
        try {
            const response = await apiRequest(
                `/posts/${postId}`,
                "PUT",
                { content, tone },
                token
            );
            setPosts(posts.map(p => p._id === postId ? response.post : p));
            setEditingPost(null);
            toast.success("Post updated successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to update post");
        }
    };

    const handleToggleFavorite = async (postId) => {
        try {
            const response = await apiRequest(
                `/posts/${postId}/favorite`,
                "POST",
                null,
                token
            );
            setPosts(posts.map(p =>
                p._id === postId ? { ...p, is_favorite: response.is_favorite } : p
            ));
            toast.success(response.message);
        } catch (err) {
            toast.error(err.message || "Failed to toggle favorite");
        }
    };

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
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-600 dark:text-red-400 text-center font-medium">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
            <Navbar />
            <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        All Posts
                    </h1>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {posts.length} {posts.length === 1 ? "post" : "posts"}
                    </span>
                </div>

                {/* Search and Filter Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 text-sm"
                            />
                        </div>

                        {/* Tone Filter */}
                        <select
                            value={filterTone}
                            onChange={(e) => setFilterTone(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 text-sm"
                        >
                            <option value="">All Tones</option>
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                            <option value="inspirational">Inspirational</option>
                            <option value="humorous">Humorous</option>
                        </select>

                        {/* Sort By */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 text-sm"
                        >
                            <option value="created_at">Date Created</option>
                            <option value="engagement_score">Engagement</option>
                        </select>

                        {/* Sort Order */}
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 text-sm"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>

                    {/* Favorites Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filterFavorite}
                            onChange={(e) => setFilterFavorite(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Show only favorites</span>
                    </label>
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
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
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            No posts yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
                        <motion.div
                            key={post._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="post-card border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                            data-post-id={post._id}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {post.tone && (
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                            {post.tone.toUpperCase()}
                                        </span>
                                    )}
                                    {post.engagement_score !== undefined && (
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                            ⭐ {post.engagement_score}/10
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(post.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                {post.content}
                            </p>

                            <div className="mt-4 flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleToggleFavorite(post._id)}
                                    className={`flex items-center gap-1 text-sm font-medium ${post.is_favorite
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
                                        }`}
                                >
                                    <Star
                                        className="w-4 h-4"
                                        fill={post.is_favorite ? 'currentColor' : 'none'}
                                    />
                                    {post.is_favorite ? 'Favorited' : 'Favorite'}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setEditingPost(post)}
                                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setDeleteConfirm(post._id)}
                                    className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCopy(post.content, post._id)}
                                    className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 font-medium"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingPost && (
                    <EditPostModal
                        post={editingPost}
                        onClose={() => setEditingPost(null)}
                        onSubmit={handleEditSubmit}
                    />
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <DeleteConfirmModal
                        onConfirm={() => handleDelete(deleteConfirm)}
                        onCancel={() => setDeleteConfirm(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function EditPostModal({ post, onClose, onSubmit }) {
    const [content, setContent] = useState(post.content);
    const [tone, setTone] = useState(post.tone);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSubmit(post._id, content, tone);
        setSaving(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Edit Post
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tone
                        </label>
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        >
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                            <option value="inspirational">Inspirational</option>
                            <option value="humorous">Humorous</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Content
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            required
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

function DeleteConfirmModal({ onConfirm, onCancel }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
            >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Delete Post?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete this post? This action cannot be undone.
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
