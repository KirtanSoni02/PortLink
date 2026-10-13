import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Handshake } from 'lucide-react';

interface StepProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Step: React.FC<StepProps> = ({ step, icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-slate-200 dark:border-neutral-800 h-full flex flex-col justify-between shadow-sm transition-colors">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white flex items-center justify-center">
              {icon}
            </div>
            <span className="text-[11px] font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-black px-2 py-0.5 rounded border border-slate-200 dark:border-neutral-800">
              0{step}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
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

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-10 md:py-16 bg-slate-50 dark:bg-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 text-slate-800 dark:text-neutral-300 text-xs font-medium mb-2">
            <span>Simple Workflow</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            How PortLink Works
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto mt-1">
            Three simple steps to manage your maritime operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          <Step
            step={1}
            icon={<UserPlus className="w-4 h-4" />}
            title="Register & Profile"
            description="Sign up as a Sailor or Port Authority Administrator to access your custom dashboard."
            delay={0.1}
          />
          <Step
            step={2}
            icon={<Search className="w-4 h-4" />}
            title="Track Telemetry & Ports"
            description="Monitor live vessel movements, port berth schedules, and weather reports."
            delay={0.2}
          />
          <Step
            step={3}
            icon={<Handshake className="w-4 h-4" />}
            title="Execute Contracts"
            description="Manage digital crew contracts, berth allocations, and verified logbooks."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;