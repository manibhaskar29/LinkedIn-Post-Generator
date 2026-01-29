import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, LogOut, LayoutDashboard, FileText, PenTool, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { token, logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800"
        >
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <Link to={token ? "/dashboard" : "/"}>
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            className="text-2xl font-bold text-gradient flex items-center gap-2 cursor-pointer"
                        >
                            <PenTool className="w-7 h-7 text-blue-600" />
                            <span className="hidden sm:inline">LinkedIn Post Generator</span>
                            <span className="sm:hidden">LPG</span>
                        </motion.h1>
                    </Link>

                    {/* Navigation Links (when logged in) */}
                    {token && (
                        <div className="hidden md:flex items-center gap-6">
                            <NavLink to="/dashboard" icon={LayoutDashboard}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/generate" icon={PenTool}>
                                Generate
                            </NavLink>
                            <NavLink to="/posts" icon={FileText}>
                                Posts
                            </NavLink>
                            <NavLink to="/scheduled" icon={Calendar}>
                                Scheduled
                            </NavLink>
                        </div>
                    )}

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </motion.button>

                        {/* Auth Buttons */}
                        {token ? (
                            <>
                                {/* User Badge */}
                                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                                        {user?.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {user?.email?.split('@')[0] || 'User'}
                                    </span>
                                </div>

                                {/* Logout Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow-md transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-5 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg"
                                    >
                                        Login
                                    </motion.button>
                                </Link>
                                <Link to="/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-2.5 bg-gradient-primary text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                                    >
                                        Sign Up
                                    </motion.button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                {token && (
                    <div className="md:hidden flex items-center justify-around mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <MobileNavLink to="/dashboard" icon={LayoutDashboard}>
                            Dashboard
                        </MobileNavLink>
                        <MobileNavLink to="/generate" icon={PenTool}>
                            Generate
                        </MobileNavLink>
                        <MobileNavLink to="/posts" icon={FileText}>
                            Posts
                        </MobileNavLink>
                        <MobileNavLink to="/scheduled" icon={Calendar}>
                            Scheduled
                        </MobileNavLink>
                    </div>
                )}
            </div>
        </motion.nav>
    );
}

function NavLink({ to, icon: Icon, children }) {
    const location = window.location.pathname;
    const isActive = location === to;

    return (
        <Link to={to}>
            <motion.div
                whileHover={{ y: -2 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
            >
                <Icon className="w-4 h-4" />
                <span>{children}</span>
            </motion.div>
        </Link>
    );
}

function MobileNavLink({ to, icon: Icon, children }) {
    const location = window.location.pathname;
    const isActive = location === to;

    return (
        <Link to={to}>
            <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                    }`}
            >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{children}</span>
            </motion.div>
        </Link>
    );
}