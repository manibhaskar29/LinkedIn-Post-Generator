import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, Bookmark, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function Templates() {
    const { token } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, [token]);

    async function fetchTemplates() {
        setLoading(true);
        try {
            const data = await apiRequest("/templates", "GET", null, token);
            setTemplates(data);
        } catch (err) {
            setError(err.message || "Failed to load templates");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (templateId) => {
        try {
            await apiRequest(`/templates/${templateId}`, "DELETE", null, token);
            setTemplates(templates.filter(t => t._id !== templateId));
            toast.success("Template deleted successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to delete template");
        }
    };

    const handleCreate = async (newTemplate) => {
        try {
            const response = await apiRequest("/templates", "POST", newTemplate, token);
            setTemplates([response.template, ...templates]);
            setShowCreateModal(false);
            toast.success("Template created successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to create template");
        }
    };

    const handleCopyContent = async (content) => {
        try {
            await navigator.clipboard.writeText(content);
            toast.success("Content copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy content");
        }
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <Loader message="Loading templates..." />
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
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Post Templates
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Save and reuse your best post patterns
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        New Template
                    </motion.button>
                </div>

                {/* Templates Grid */}
                {templates.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            No templates yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Create your first template to save time on future posts!
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4" />
                                Create Template
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <TemplateCard
                                key={template._id}
                                template={template}
                                onDelete={handleDelete}
                                onCopy={handleCopyContent}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Template Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <CreateTemplateModal
                        onClose={() => setShowCreateModal(false)}
                        onCreate={handleCreate}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function TemplateCard({ template, onDelete, onCopy }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {template.name}
                    </h3>
                    {template.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {template.description}
                        </p>
                    )}
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                    {template.tone.toUpperCase()}
                </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                {template.content}
            </p>

            <div className="flex gap-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCopy(template.content)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                    <Copy className="w-4 h-4" />
                    Copy
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(template._id)}
                    className="px-3 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}

function CreateTemplateModal({ onClose, onCreate }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [tone, setTone] = useState("professional");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onCreate({ name, description, content, tone });
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
                        Create Template
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
                            Template Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="e.g., Product Launch Template"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Brief description of when to use this template"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tone *
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
                            Content *
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Write your template content here..."
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
                            {saving ? "Creating..." : "Create Template"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
