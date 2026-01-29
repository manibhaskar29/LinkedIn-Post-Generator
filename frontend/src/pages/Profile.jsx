import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { User, Lock, Settings, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({ name: "", bio: "", email: "" });
    const [preferences, setPreferences] = useState({
        default_tone: "professional",
        default_length: "medium",
        notifications_enabled: true,
        timezone: "UTC"
    });
    const [passwords, setPasswords] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        fetchProfile();
        fetchPreferences();
    }, [token]);

    async function fetchProfile() {
        try {
            const data = await apiRequest("/profile", "GET", null, token);
            setProfile(data);
        } catch (err) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }

    async function fetchPreferences() {
        try {
            const data = await apiRequest("/profile/preferences", "GET", null, token);
            setPreferences(data);
        } catch (err) {
            console.error("Failed to load preferences");
        }
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await apiRequest("/profile", "PUT", { name: profile.name, bio: profile.bio }, token);
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to update profile");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm_password) {
            toast.error("Passwords don't match!");
            return;
        }
        try {
            await apiRequest("/profile/change-password", "POST", {
                old_password: passwords.old_password,
                new_password: passwords.new_password
            }, token);
            toast.success("Password changed successfully!");
            setPasswords({ old_password: "", new_password: "", confirm_password: "" });
        } catch (err) {
            toast.error(err.message || "Failed to change password");
        }
    };

    const handlePreferencesUpdate = async (e) => {
        e.preventDefault();
        try {
            await apiRequest("/profile/preferences", "PUT", preferences, token);
            toast.success("Preferences updated successfully!");
        } catch (err) {
            toast.error("Failed to update preferences");
        }
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <Loader message="Loading profile..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
            <Navbar />
            <div className="max-w-4xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 pb-10">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Profile & Settings
                </h1>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === "profile"
                            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            }`}
                    >
                        <User className="w-4 h-4 inline mr-2" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === "security"
                            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            }`}
                    >
                        <Lock className="w-4 h-4 inline mr-2" />
                        Security
                    </button>
                    <button
                        onClick={() => setActiveTab("preferences")}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === "preferences"
                            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            }`}
                    >
                        <Settings className="w-4 h-4 inline mr-2" />
                        Preferences
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Profile Information
                        </h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email || user}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                                    placeholder="Tell us about yourself"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                <Save className="w-4 h-4" />
                                Save Profile
                            </motion.button>
                        </form>
                    </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Change Password
                        </h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwords.old_password}
                                    onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwords.new_password}
                                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwords.confirm_password}
                                    onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                <Lock className="w-4 h-4" />
                                Change Password
                            </motion.button>
                        </form>
                    </motion.div>
                )}

                {/* Preferences Tab */}
                {activeTab === "preferences" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Preferences
                        </h2>
                        <form onSubmit={handlePreferencesUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Default Tone
                                </label>
                                <select
                                    value={preferences.default_tone}
                                    onChange={(e) => setPreferences({ ...preferences, default_tone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                                >
                                    <option value="professional">Professional</option>
                                    <option value="casual">Casual</option>
                                    <option value="inspirational">Inspirational</option>
                                    <option value="humorous">Humorous</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Default Length
                                </label>
                                <select
                                    value={preferences.default_length}
                                    onChange={(e) => setPreferences({ ...preferences, default_length: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                                >
                                    <option value="short">Short</option>
                                    <option value="medium">Medium</option>
                                    <option value="long">Long</option>
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.notifications_enabled}
                                        onChange={(e) => setPreferences({ ...preferences, notifications_enabled: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Enable notifications
                                    </span>
                                </label>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                <Save className="w-4 h-4" />
                                Save Preferences
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
