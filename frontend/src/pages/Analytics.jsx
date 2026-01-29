import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Eye, MousePointerClick, Share2, FileText } from "lucide-react";

export default function Analytics() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState(30);
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAnalytics();
    }, [token, dateRange]);

    async function fetchAnalytics() {
        setLoading(true);
        try {
            const data = await apiRequest(
                `/analytics/overview?days=${dateRange}`,
                "GET",
                null,
                token
            );
            setAnalytics(data);
        } catch (err) {
            setError(err.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div>
                <Navbar />
                <Loader message="Loading analytics..." />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="max-w-7xl mx-auto mt-10 p-6">
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
            <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 pb-10 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Analytics Dashboard
                    </h1>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(Number(e.target.value))}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value={7}>Last 7 days</option>
                        <option value={30}>Last 30 days</option>
                        <option value={90}>Last 90 days</option>
                        <option value={365}>Last year</option>
                    </select>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Posts"
                        value={analytics?.total_posts || 0}
                        icon={FileText}
                        color="blue"
                    />
                    <StatCard
                        title="Total Views"
                        value={analytics?.total_views || 0}
                        icon={Eye}
                        color="green"
                    />
                    <StatCard
                        title="Total Clicks"
                        value={analytics?.total_clicks || 0}
                        icon={MousePointerClick}
                        color="purple"
                    />
                </div>

                {/* Average Engagement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            Average Engagement Score
                        </h2>
                    </div>
                    <div className="text-5xl font-bold text-green-600 dark:text-green-400">
                        {analytics?.avg_engagement?.toFixed(2) || "0.00"}
                        <span className="text-2xl text-gray-500 dark:text-gray-400">/10</span>
                    </div>
                </motion.div>

                {/* Engagement Trend Chart */}
                {analytics?.engagement_trend && analytics.engagement_trend.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden"
                    >
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">
                            Engagement Trend Over Time
                        </h2>
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[300px]">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={analytics.engagement_trend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#9CA3AF"
                                            tick={{ fill: '#9CA3AF' }}
                                        />
                                        <YAxis
                                            stroke="#9CA3AF"
                                            tick={{ fill: '#9CA3AF' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1F2937',
                                                border: '1px solid #374151',
                                                borderRadius: '8px',
                                                color: '#F3F4F6'
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            name="Engagement Score"
                                            dot={{ fill: '#3B82F6', r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {analytics?.total_posts === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            No analytics data yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Start generating posts to see your analytics!
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
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    const colorClasses = {
        blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
        green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
        purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
        orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                        {value.toLocaleString()}
                    </p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </motion.div>
    );
}
