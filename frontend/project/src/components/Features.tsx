import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, FileText, Calendar, ShoppingBag, Bell, ShieldCheck } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, badge, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-slate-200 dark:border-neutral-800 hover:border-slate-400 dark:hover:border-neutral-600 shadow-sm transition-all h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white flex items-center justify-center">
              {icon}
            </div>
            <span className="text-[10px] font-medium text-slate-600 dark:text-neutral-400 bg-slate-100 dark:bg-black px-2 py-0.5 rounded border border-slate-200 dark:border-neutral-800">
              {badge}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
            {title}
          </h3>

          <p className="text-slate-600 dark:text-neutral-400 text-xs leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="w-4 h-4" />,
      title: "Real-Time Vessel Tracking",
      description: "Monitor vessel positions, speed, course, and port congestion live with real-time AIS radar telemetry.",
      badge: "Live AIS"
    },
    {
      icon: <FileText className="w-4 h-4" />,
      title: "Digital Sailor Contracts",
      description: "Create, execute, and sign legally binding maritime crew agreements electronically with instant verification.",
      badge: "Contracts"
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      title: "Port Berthing & Scheduling",
      description: "Coordinate docking windows, berth requests, and port pilotage directly with port authorities.",
      badge: "Logistics"
    },
    {
      icon: <ShoppingBag className="w-4 h-4" />,
      title: "Maritime Service Marketplace",
      description: "Book provisioning, bunkering, maintenance, and crew transfer services from verified port vendors.",
      badge: "Services"
    },
    {
      icon: <Bell className="w-4 h-4" />,
      title: "Weather & Hazard Alerts",
      description: "Receive proactive alerts regarding sea conditions, wave heights, and weather disruptions.",
      badge: "Safety"
    },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      title: "Compliance & Security",
      description: "Maintain verified sailor logbooks, license credentials, and port security clearances hassle-free.",
      badge: "Security"
    }
  ];

  return (
    <section id="features" className="py-10 md:py-16 bg-slate-50 dark:bg-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 text-slate-800 dark:text-neutral-300 text-xs font-medium mb-2">
            <span>Core Capabilities</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Platform Capabilities
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto mt-1">
            Built for sailors, vessel operators, and port authorities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              badge={feature.badge}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;