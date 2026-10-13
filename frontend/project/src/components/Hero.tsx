import React from 'react';
import { motion } from 'framer-motion';
import { Anchor, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Hero: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-[85vh] bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden flex items-center justify-center pt-28 pb-16 border-b border-slate-200 dark:border-neutral-800 transition-colors duration-300">
      {/* Dynamic Maritime AIS Radar Scope Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Concentric Radar Distance Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[480px] md:w-[650px] h-[320px] sm:h-[480px] md:h-[650px] border border-slate-300 dark:border-white/20 rounded-full flex items-center justify-center">
          <div className="w-[70%] h-[70%] border border-slate-200 dark:border-white/15 rounded-full flex items-center justify-center">
            <div className="w-[50%] h-[50%] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>

        {/* 360-Degree Rotating Radar Sweep Beam */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[480px] md:w-[650px] h-[320px] sm:h-[480px] md:h-[650px] rounded-full overflow-hidden animate-[spin_10s_linear_infinite]">
          <div className="w-1/2 h-1/2 bg-gradient-to-br from-slate-400/20 dark:from-white/25 via-slate-400/5 dark:via-white/5 to-transparent origin-bottom-right rounded-tl-full" />
        </div>

        {/* Crosshair Compass Bearing Lines */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[480px] md:w-[650px] h-[320px] sm:h-[480px] md:h-[650px]">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-slate-300 dark:bg-white/15" />
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-300 dark:bg-white/15" />

          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-500 dark:text-neutral-400">000° N</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-500 dark:text-neutral-400">180° S</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-500 dark:text-neutral-400">090° E</span>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-500 dark:text-neutral-400">270° W</span>
        </div>

        {/* AIS Vessel Target Blips */}
        <div className="absolute inset-0 max-w-4xl mx-auto pointer-events-none">
          <div className="absolute top-1/4 left-1/4 flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-mono text-slate-600 dark:text-neutral-400 hidden sm:inline">MV TITAN [18.4 KTS]</span>
          </div>

          <div className="absolute top-1/3 right-1/4 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-[9px] font-mono text-slate-600 dark:text-neutral-400 hidden sm:inline">APL NAVIGATOR</span>
          </div>

          <div className="absolute bottom-1/3 right-1/3 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
            <span className="text-[9px] font-mono text-slate-600 dark:text-neutral-400 hidden sm:inline">EVER MARITIME</span>
          </div>
        </div>

        {/* Ambient Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: theme === 'dark'
              ? `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`
              : `linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-neutral-900/90 border border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-neutral-200 text-xs font-medium mb-6 shadow-sm backdrop-blur-md"
        >
          <Anchor className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
          <span>Real-Time Maritime Intelligence</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight"
        >
          Vessel Tracking & Sailor Contract Management
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed"
        >
          Connecting sailors, vessel managers, and port authorities through real-time AIS tracking, verified contract execution, and live port logistics.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-black font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2 text-sm shadow-md"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#tracking"
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-neutral-900/90 text-slate-900 dark:text-white font-medium rounded-lg border border-slate-300 dark:border-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 text-sm backdrop-blur-md"
          >
            <Compass className="w-4 h-4 text-slate-500 dark:text-neutral-400" />
            <span>Live AIS Radar</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;