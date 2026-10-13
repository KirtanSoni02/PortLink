import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show header on auth pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800 py-2.5 sm:py-3 shadow-md'
          : 'bg-transparent py-3 sm:py-4'
      }`}
    >
      <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-2.5 group shrink-0">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 dark:bg-neutral-900 border border-slate-800 dark:border-neutral-700 group-hover:border-slate-600 transition-colors">
              <Anchor className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
              PortLink
            </span>
          </Link>

          {/* Actions & Theme Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 transition-all"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800 transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>

            <Link
              to="/login"
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-neutral-200 rounded-lg sm:rounded-xl transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;