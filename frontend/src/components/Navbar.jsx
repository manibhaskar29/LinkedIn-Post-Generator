import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, LogOut, LayoutDashboard, FileText, PenTool, Calendar, TrendingUp, Bookmark } from 'lucide-react';
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
            <div className="w-full max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo - LEFT */}
                    <Link to={token ? "/dashboard" : "/"} className="flex-shrink-0">
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            className="text-xl font-bold text-gradient flex items-center gap-2 cursor-pointer"
                        >
                            <PenTool className="w-6 h-6 text-blue-600" />
                            <span className="hidden sm:inline">LinkedIn Post Generator</span>
                            <span className="sm:hidden">LPG</span>
                        </motion.h1>
                    </Link>

                    {/* Navigation Links -CENTER (desktop only) */}
                    {token && (
                        <div className="hidden lg:flex items-center gap-5">
                            <NavLink to="/dashboard" icon={LayoutDashboard}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/generate" icon={PenTool}>
                                Generate
                            </NavLink>
                            <NavLink to="/posts" icon={FileText}>
                                Posts
                            </NavLink>
                            <NavLink to="/analytics" icon={TrendingUp}>
                                Analytics
                            </NavLink>
                            <NavLink to="/templates" icon={Bookmark}>
                                Templates
                            </NavLink>
                            <NavLink to="/scheduled" icon={Calendar}>
                                Scheduled
                            </NavLink>
                        </div>
                    )}

                    {/* Right Side - Theme + User + Logout */}
                    <div className="flex items-center gap-2 flex-shrink-0">
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

                        {token ? (
                            <>
                                {/* User Profile Circle */}
                                <Link to="/profile" className="hidden sm:block">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm cursor-pointer"
                                    >
                                        {user?.email?.[0]?.toUpperCase() || 'U'}
                                    </motion.div>
                                </Link>

                                {/* Logout Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg transition-all text-sm"
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
                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition-colors"
                                    >
                                        Login
                                    </motion.button>
                                </Link>
                                <Link to="/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                                    >
                                        Sign Up
                                    </motion.button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                {token && (
                    <div className="lg:hidden flex items-center justify-around mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 gap-1">
                        <MobileNavLink to="/dashboard" icon={LayoutDashboard}>
                            Dashboard
                        </MobileNavLink>
                        <MobileNavLink to="/generate" icon={PenTool}>
                            Generate
                        </MobileNavLink>
                        <MobileNavLink to="/posts" icon={FileText}>
                            Posts
                        </MobileNavLink>
                        <MobileNavLink to="/analytics" icon={TrendingUp}>
                            Analytics
                        </MobileNavLink>
                        <MobileNavLink to="/templates" icon={Bookmark}>
                            Templates
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

// Desktop Nav Link Component
function NavLink({ to, icon: Icon, children }) {
    return (
        <Link to={to}>
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all cursor-pointer"
            >
                <Icon className="w-4 h-4" />
                <span>{children}</span>
            </motion.div>
        </Link>
    );
}

// Mobile Nav Link Component
function MobileNavLink({ to, icon: Icon, children }) {
    return (
        <Link to={to}>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
            >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{children}</span>
            </motion.div>
        </Link>
    );
}