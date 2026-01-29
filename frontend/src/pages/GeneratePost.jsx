import { useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, Copy, Save, RefreshCw, Loader2,
    Check, AlertCircle, ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const POST_TEMPLATES = [
    { name: "Success Story", topic: "Share a recent achievement or milestone in your professional journey" },
    { name: "Industry Insight", topic: "Discuss a trending topic or change in your industry" },
    { name: "How-to Guide", topic: "Teach your network something valuable they can apply today" },
    { name: "Personal Update", topic: "Share a personal reflection or career update" },
];

const MAX_CHARS = 3000;

export default function GeneratePost() {
    const { token } = useAuth();

    const [topic, setTopic] = useState("");
    const [tone, setTone] = useState("professional");
    const [hook, setHook] = useState("question");
    const [cta, setCta] = useState("comment");

    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);

    const charCount = result.length;
    const isNearLimit = charCount > MAX_CHARS * 0.9;
    const isOverLimit = charCount > MAX_CHARS;

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error("Please enter a topic");
            return;
        }

        setLoading(true);
        setResult("");
        setSaved(false);

        try {
            const data = await apiRequest(
                "/ai/generate",
                "POST",
                { topic, tone, hook, cta },
                token
            );

            setResult(data.generated_post);
            toast.success("Post generated successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to generate post");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy");
        }
    };

    const handleSave = async () => {
        if (!result) {
            toast.error("No post to save");
            return;
        }

        try {
            await apiRequest(
                "/posts/create",
                "POST",
                { content: result, tone },
                token
            );
            setSaved(true);
            toast.success("Post saved successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to save post");
        }
    };

    const loadTemplate = (template) => {
        setTopic(template.topic);
        toast.success(`Template "${template.name}" loaded`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
                        <Sparkles className="w-10 h-10 text-blue-600" />
                        AI Post Generator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create engaging LinkedIn posts powered by AI
                    </p>
                </motion.div>

                {/* Templates */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Quick Start Templates:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {POST_TEMPLATES.map((template, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => loadTemplate(template)}
                                className="p-3 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
                            >
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                    {template.name}
                                </p>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Main Content - Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Panel - Input Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Post Details
                            </h2>

                            {/* Topic Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Topic or Idea *
                                </label>
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="What do you want to talk about? E.g., 'How I improved my productivity by 50%'"
                                    className="input min-h-[120px] resize-none"
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {topic.length}/500 characters
                                </p>
                            </div>

                            {/* Tone, Hook, CTA Selects */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SelectWithIcon
                                    label="Tone"
                                    value={tone}
                                    onChange={setTone}
                                    options={[
                                        { value: "professional", label: "Professional" },
                                        { value: "casual", label: "Casual" },
                                        { value: "motivational", label: "Motivational" },
                                    ]}
                                />

                                <SelectWithIcon
                                    label="Hook Style"
                                    value={hook}
                                    onChange={setHook}
                                    options={[
                                        { value: "question", label: "Question" },
                                        { value: "statistic", label: "Statistic" },
                                        { value: "story", label: "Story" },
                                    ]}
                                />

                                <SelectWithIcon
                                    label="Call-to-Action"
                                    value={cta}
                                    onChange={setCta}
                                    options={[
                                        { value: "comment", label: "Comment" },
                                        { value: "like", label: "Like" },
                                        { value: "share", label: "Share" },
                                    ]}
                                />
                            </div>

                            {/* Generate Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGenerate}
                                disabled={loading || !topic.trim()}
                                className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${loading || !topic.trim()
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-primary hover:shadow-lg"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate Post
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right Panel - Preview & Result */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 sticky top-24">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    LinkedIn Preview
                                </h2>

                                {result && (
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleCopy}
                                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            {copied ? (
                                                <Check className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                            )}
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleGenerate}
                                            disabled={loading}
                                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            title="Regenerate"
                                        >
                                            <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleSave}
                                            className={`p-2 rounded-lg transition-colors ${saved
                                                    ? "bg-green-100 dark:bg-green-900/30"
                                                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                            title="Save post"
                                        >
                                            <Save className={`w-5 h-5 ${saved ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'}`} />
                                        </motion.button>
                                    </div>
                                )}
                            </div>

                            {/* LinkedIn-style Post Preview */}
                            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[400px]">
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center h-full space-y-4"
                                        >
                                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Crafting your perfect post...
                                            </p>
                                        </motion.div>
                                    ) : result ? (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-4"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                                                    U
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        Your Name
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Your Title • Now
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="prose dark:prose-invert max-w-none">
                                                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                                    {result}
                                                </p>
                                            </div>

                                            {/* Character Count */}
                                            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                {isOverLimit ? (
                                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                                ) : isNearLimit ? (
                                                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                                                ) : (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                )}
                                                <span className={`text-sm font-medium ${isOverLimit
                                                        ? "text-red-600"
                                                        : isNearLimit
                                                            ? "text-yellow-600"
                                                            : "text-green-600"
                                                    }`}>
                                                    {charCount} / {MAX_CHARS} characters
                                                </span>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center h-full text-center space-y-4"
                                        >
                                            <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-700" />
                                            <div>
                                                <p className="text-gray-900 dark:text-white font-medium mb-2">
                                                    Your post will appear here
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Enter a topic and click Generate to create your LinkedIn post
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function SelectWithIcon({ label, value, onChange, options }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="input appearance-none pr-10"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
}
