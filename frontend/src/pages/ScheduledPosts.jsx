import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, X, Calendar, Loader2, Filter, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ScheduledPosts() {
    const { token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [editingPost, setEditingPost] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [token, filterStatus]);

    async function fetchPosts() {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus) params.append("status", filterStatus);

            const queryString = params.toString();
            const data = await apiRequest(
                `/posts/scheduled/all${queryString ? `?${queryString}` : ""}`,
                "GET",
                null,
                token
            );
            setPosts(data);
        } catch (err) {
            setError(err.message || "Failed to load scheduled posts");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (postId) => {
        try {
            await apiRequest(`/posts/scheduled/${postId}`, "DELETE", null, token);
            setPosts(posts.filter(p => p._id !== postId));
            setDeleteConfirm(null);
            toast.success("Scheduled post deleted successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to delete scheduled post");
        }
    };

    const handleUpdateSchedule = async () => {
        if (!editingPost) return;

        if (!scheduleDate || !scheduleTime) {
            toast.error("Please select date and time");
            return;
        }

        setUpdating(true);
        try {
            const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

            if (scheduledDateTime <= new Date()) {
                toast.error("Scheduled time must be in the future");
                setUpdating(false);
                return;
            }

            await apiRequest(
                `/posts/scheduled/${editingPost._id}?schedule_time=${scheduledDateTime.toISOString()}`,
                "PUT",
                null,
                token
            );

            toast.success("Scheduled time updated successfully!");
            setEditingPost(null);
            setScheduleDate("");
            setScheduleTime("");
            fetchPosts(); // Refresh the list
        } catch (err) {
            toast.error(err.message || "Failed to update scheduled time");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <Loader message="Loading scheduled posts..." />
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
            <Navbar />
            <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <Clock className="w-8 h-8 text-blue-600" />
                        Scheduled Posts
                    </h1>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {posts.length} {posts.length === 1 ? "post" : "posts"}
                    </span>
                </div>

                {/* Filter Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="published">Published</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <Clock className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            No scheduled posts
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Get started by scheduling your first post!
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    {posts.map((post) => (
                        <motion.div
                            key={post._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <StatusBadge status={post.status} />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    📅 {new Date(post.scheduled_time).toLocaleString()}
                                </span>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed mb-4">
                                {post.content}
                            </p>

                            {post.last_error && (
                                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-sm text-red-800 dark:text-red-300">
                                        ⚠️ Error: {post.last_error}
                                    </p>
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                        Retry count: {post.retry_count || 0}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                {post.status === "scheduled" && (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setEditingPost(post);
                                                // Pre-fill with current scheduled time
                                                const dt = new Date(post.scheduled_time);
                                                setScheduleDate(dt.toISOString().split('T')[0]);
                                                setScheduleTime(dt.toTimeString().slice(0, 5));
                                            }}
                                            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Reschedule
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
                                    </>
                                )}
                                {post.status !== "scheduled" && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setDeleteConfirm(post._id)}
                                        className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Edit Schedule Modal */}
            <AnimatePresence>
                {editingPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
                        onClick={() => setEditingPost(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Reschedule Post
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setEditingPost(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        📅 New Date
                                    </label>
                                    <input
                                        type="date"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        🕐 New Time
                                    </label>
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                                    />
                                </div>

                                {scheduleDate && scheduleTime && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                        <p className="text-sm text-blue-800 dark:text-blue-300">
                                            📍 New scheduled time: {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setEditingPost(null)}
                                    className="flex-1 py-3 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateSchedule}
                                    disabled={updating || !scheduleDate || !scheduleTime}
                                    className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${updating || !scheduleDate || !scheduleTime
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {updating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Calendar className="w-5 h-5" />
                                            Update
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                Delete Scheduled Post?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Are you sure you want to delete this scheduled post? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatusBadge({ status }) {
    const colors = {
        scheduled: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };

    const icons = {
        scheduled: "⏰",
        published: "✅",
        failed: "❌",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
            {icons[status]} {status.toUpperCase()}
        </span>
    );
}