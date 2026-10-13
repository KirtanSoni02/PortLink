import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, User, LogOut, Anchor, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface DashboardHeaderProps {
  sailorData: {
    name: string;
    email: string;
    rating: number;
  };
  onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ sailorData, onMenuClick }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800 z-40 transition-colors duration-300"
      style={{ pointerEvents: 'auto', zIndex: 40 }}
    >
      <div className="flex items-center justify-between h-16 px-3 sm:px-6 max-w-full">
        {/* Left side - Logo and Mobile Drawer Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            onClick={onMenuClick}
            aria-label="Open mobile menu"
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300 transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center space-x-2 sm:space-x-2.5 group min-w-0">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 dark:bg-neutral-900 border border-slate-800 dark:border-neutral-700 group-hover:border-slate-600 transition-colors shrink-0">
              <Anchor className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors block truncate">
                PortLink
              </span>
              <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-neutral-400 hidden sm:block">
                Sailor Console
              </div>
            </div>
          </Link>
        </div>

        {/* Right side - Theme Toggle and Profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-800 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-neutral-700"
            >
              <div className="w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden md:block text-left min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight max-w-[120px] truncate">
                  {sailorData?.name || 'Sailor'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">Rating: {sailorData?.rating || 5.0}/5.0</div>
              </div>
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-800 py-2 transition-colors z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-neutral-800">
                    <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">{sailorData?.name || 'Sailor Member'}</div>
                    <div className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">{sailorData?.email || 'sailor@portlink.com'}</div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/"
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                      }}
                      className="flex items-center space-x-2.5 w-full px-4 py-2 text-left text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors text-xs font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;