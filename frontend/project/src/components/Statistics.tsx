import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Ship, Anchor, FileCheck, ShieldCheck } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  number: number;
  suffix?: string;
  label: string;
  subLabel: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, number, suffix = '+', label, subLabel, delay }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let start = 0;
        const increment = Math.max(1, Math.floor(number / 50));
        const counter = setInterval(() => {
          start += increment;
          if (start >= number) {
            setCount(number);
            clearInterval(counter);
          } else {
            setCount(start);
          }
        }, 20);
        return () => clearInterval(counter);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, number, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      className="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-slate-200 dark:border-neutral-800 shadow-sm relative overflow-hidden transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white flex items-center justify-center">
          {icon}
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-700 dark:text-neutral-300 bg-slate-100 dark:bg-black px-2 py-0.5 rounded border border-slate-200 dark:border-neutral-800">
          <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified
        </span>
      </div>

      <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">
        {count.toLocaleString()}{suffix}
      </div>

      <div className="text-xs font-semibold text-slate-800 dark:text-neutral-200">{label}</div>
      <div className="text-[11px] text-slate-500 dark:text-neutral-400 font-normal">{subLabel}</div>
    </motion.div>
  );
};

const Statistics: React.FC = () => {
  const [stats, setStats] = useState({
    registeredSailors: 2450,
    portAuthorities: 380,
    activeShips: 1200,
    completedContracts: 98,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL || 'http://localhost:5000'}/api/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.warn('Using default metrics', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="py-10 md:py-16 bg-slate-50 dark:bg-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 text-slate-800 dark:text-neutral-300 text-xs font-medium mb-2">
            <span>Platform Metrics</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Trusted Across Maritime Hubs
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto mt-1">
            Real-time scale powered by integrated port systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            number={stats.registeredSailors}
            label="Registered Sailors"
            subLabel="Verified crew profiles"
            delay={100}
          />
          <StatCard
            icon={<Anchor className="w-5 h-5" />}
            number={stats.portAuthorities}
            label="Port Authorities"
            subLabel="Active port partners"
            delay={200}
          />
          <StatCard
            icon={<Ship className="w-5 h-5" />}
            number={stats.activeShips}
            label="Tracked Vessels"
            subLabel="Live telemetry streams"
            delay={300}
          />
          <StatCard
            icon={<FileCheck className="w-5 h-5" />}
            number={stats.completedContracts}
            suffix="%"
            label="Contract Rate"
            subLabel="Verified compliance"
            delay={400}
          />
        </div>
      </div>
    </section>
  );
};

export default Statistics;