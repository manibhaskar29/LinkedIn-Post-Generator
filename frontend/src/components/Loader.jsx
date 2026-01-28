export default function Loader({ size = "md", message = "Loading..." }) {
    const sizeClasses = {
        sm: "w-6 h-6 border-2",
        md: "w-12 h-12 border-4",
        lg: "w-16 h-16 border-4",
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <div className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`} />
            {message && (
                <p className="text-gray-600 text-sm font-medium">{message}</p>
            )}
        </div>
    );
}
