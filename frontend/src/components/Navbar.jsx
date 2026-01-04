export default function Navbar() {
    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo/Brand */}
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900 transition-all duration-300 cursor-pointer">
                    LinkedIn Post Generator
                </h1>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:bg-blue-50 rounded-lg">
                        Login
                    </button>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:-translate-y-0.5">
                        Sign Up
                    </button>
                </div>
            </div>
        </nav>
    );
}