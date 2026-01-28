import { useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function GeneratePost() {
    const { token } = useAuth();

    const [topic, setTopic] = useState("");
    const [tone, setTone] = useState("professional");
    const [hook, setHook] = useState("question");
    const [cta, setCta] = useState("comment");

    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        setResult("");

        try {
            const data = await apiRequest(
                "/ai/generate",
                "POST",
                {
                    topic,
                    tone,
                    hook,
                    cta
                },
                token
            );

            setResult(data.generated_post);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await apiRequest(
                "/posts/create",
                "POST",
                {
                    content: result,
                    tone: tone,
                },
                token
            );
            setSuccess("Post saved successfully");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
            <h1 className="text-2xl font-bold text-center">
                AI LinkedIn Post Generator
            </h1>

            <textarea
                id="topic"
                name="topic"
                className="border p-3 w-full rounded"
                placeholder="Enter your topic or idea..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Tone" value={tone} setValue={setTone} options={[
                    "professional", "casual", "motivational"
                ]} />

                <Select label="Hook" value={hook} setValue={setHook} options={[
                    "question", "statistic", "story"
                ]} />

                <Select label="CTA" value={cta} setValue={setCta} options={[
                    "comment", "like", "share"
                ]} />
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading || !topic}
                className={`w-full px-6 py-2 rounded text-white 
                    ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
                {loading ? "Generating..." : "Generate Post"}
            </button>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded">
                    {success}
                </div>
            )}

            {result && (
                <div className="bg-gray-100 p-4 rounded space-y-4">
                    <p className="whitespace-pre-line">{result}</p>

                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Save Post
                    </button>
                </div>
            )}
        </div>
    );
}

function Select({ label, value, setValue, options }) {
    const id = label.toLowerCase().replace(/\s+/g, '-');
    return (
        <div>
            <label htmlFor={id} className="block mb-1 text-sm text-gray-600">{label}</label>
            <select
                id={id}
                name={id}
                className="border p-2 w-full rounded"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}
