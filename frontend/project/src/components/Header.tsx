import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import   {HashLink}  from 'react-router-hash-link';

// import { useThemeToggle } from '../hooks/useTheme'
// import { Sun, Moon } from 'lucide-react';
const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
// const { theme, toggleTheme } = useThemeToggle(); // Place this inside the component

  // Don't show header on auth pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-sky-500 to-emerald-500' 
                  : 'bg-white/10 backdrop-blur-md border border-white/20'
              }`}>
                <Anchor className={`w-6 h-6 ${isScrolled ? 'text-white' : 'text-white'}`} />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-slate-800' : 'text-white'
              }`}>
                PortLink
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Features', 'How It Works', 'About', 'Contact'].map((item) => (
              <HashLink 
  key={item}
  smooth 
  to={`/#${item.toLowerCase().replace(/\s+/g, '-')}`}
  className={`font-medium transition-colors duration-300 hover:text-sky-500 ${
    isScrolled ? 'text-slate-600' : 'text-white/90'
  }`} 
>
  {item}
</HashLink>

            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className={`px-4 py-2 font-medium rounded-full transition-all duration-300 ${
                  isScrolled 
                    ? 'text-slate-600 hover:text-sky-600' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Register
              </Link>
            </motion.div>
          </div>
    {/* <motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  onClick={toggleTheme}
  className="p-2 rounded-full border border-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
>
  {theme === 'dark' ? (
    <Sun className="w-5 h-5 text-yellow-400" />
  ) : (
    <Moon className="w-5 h-5 text-slate-600" />
  )}
</motion.button> */}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled ? 'text-slate-600' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/50 mt-2 rounded-lg shadow-lg"
          >
            <div className="p-4 space-y-4">
              {['Features', 'How It Works', 'About', 'Contact'].map((item) => (
                <HashLink
  smooth
  to={`/#${item.toLowerCase().replace(' ', '-')}`}
  className="block text-slate-600 font-medium hover:text-sky-600 transition-colors"
  onClick={() => setIsMobileMenuOpen(false)}
>
  {item}
</HashLink>

              ))}
              <div className="flex space-x-4 pt-4 border-t border-slate-200">
                <Link
                  to="/login"
                  className="flex-1 px-4 py-2 text-slate-600 font-medium rounded-full border border-slate-300 hover:border-sky-500 hover:text-sky-600 transition-all text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-medium rounded-full shadow-lg text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;