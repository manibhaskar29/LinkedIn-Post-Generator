import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
    FileText, TrendingUp, Calendar, Sparkles,
    PlusCircle, Eye, Edit, ArrowUp
} from "lucide-react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Navbar from "../components/Navbar";

export default function Dashboard() {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [recentPosts, setRecentPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch analytics
                const analytics = await apiRequest("/analytics/dashboard", "GET", null, token);
                setData(analytics);

                // Fetch recent posts
                const posts = await apiRequest("/posts/all", "GET", null, token);
                setRecentPosts(posts.slice(0, 5)); // Get last 5 posts
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [token]);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <LoadingSkeleton type="stat" />
                        <LoadingSkeleton type="stat" />
                        <LoadingSkeleton type="stat" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Welcome back! Here's your content performance overview
                    </p>
                </motion.div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Total Posts"
                        value={data.total_posts}
                        icon={FileText}
                        color="blue"
                        trend="+12%"
                        delay={0.1}
                    />
                    <StatCard
                        title="Avg Engagement"
                        value={data.average_engagement?.toFixed(2) || "0.00"}
                        icon={TrendingUp}
                        color="green"
                        trend="+8%"
                        delay={0.2}
                    />
                    <StatCard
                        title="Top Tone"
                        value={data.top_tone || "N/A"}
                        icon={Sparkles}
                        color="purple"
                        delay={0.3}
                    />
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <QuickAction
                                to="/generate"
                                icon={PlusCircle}
                                title="Generate New Post"
                                description="Create AI-powered content"
                                color="blue"
                            />
                            <QuickAction
                                to="/posts"
                                icon={Eye}
                                title="View All Posts"
                                description="Browse your library"
                                color="green"
                            />
                            <QuickAction
                                to="/scheduled"
                                icon={Calendar}
                                title="Scheduled Posts"
                                description="Manage your schedule"
                                color="purple"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Recent Posts
                            </h2>
                            <Link to="/posts">
                                <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                                    View All →
                                </button>
                            </Link>
                        </div>

                        {recentPosts.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    No posts yet. Start creating!
                                </p>
                                <Link to="/generate">
                                    <button className="btn btn-primary">
                                        Generate Your First Post
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentPosts.map((post, index) => (
                                    <RecentPostCard key={post._id} post={post} index={index} />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, trend, delay }) {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative overflow-hidden"
        >
            {/* Gradient Background Decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full -mr-16 -mt-16`}></div>

            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                            <ArrowUp className="w-4 h-4" />
                            {trend}
                        </div>
                    )}
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                    {title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {value}
                </p>
            </div>
        </motion.div>
    );
}

function QuickAction({ to, icon: Icon, title, description, color }) {
    const colorClasses = {
        blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
        purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    };

    return (
        <Link to={to}>
            <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer"
            >
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}

function RecentPostCard({ post, index }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString();
    };

    const getToneColor = (tone) => {
        const colors = {
            professional: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
            casual: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
            motivational: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
        };
        return colors[tone] || colors.professional;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all group"
        >
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getToneColor(post.tone)}`}>
                        {post.tone}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(post.created_at)}
                    </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                    {post.content}
                </p>
            </div>

            <Link to="/posts">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Edit className="w-4 h-4" />
                </motion.button>
            </Link>
        </motion.div>
    );
}
