import React from 'react';
import { motion } from 'framer-motion';
import { Ship, FileText, Users, Briefcase, TrendingUp, Activity } from 'lucide-react';

interface PortDashboardOverviewProps {
  portData: {
    totalShipsInTransit: number;
    totalContractsCompleted: number;
    activeJobPosts: number;
    registeredSailors: number;
  };
  jobPosts: Array<{
    id: string;
    status: string;
    applicationsCount: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'ship_arrival' | 'job_application' | 'contract_completed' | 'weather_alert';
    title: string;
    description: string;
    timestamp: string;
    color: string;
  }>;
  variant?: 'summary' | 'quick-stats' | 'all';
}

const PortDashboardOverview: React.FC<PortDashboardOverviewProps> = ({
  portData,
  jobPosts,
  recentActivity,
  variant = 'all',
}) => {
  const summaryCards = [
    {
      title: 'Ships In Transit',
      value: portData.totalShipsInTransit,
      icon: Ship,
      description: 'Currently active vessels',
    },
    {
      title: 'Contracts Completed',
      value: portData.totalContractsCompleted,
      icon: FileText,
      description: 'All time verified total',
    },
    {
      title: 'Active Job Posts',
      value: portData.activeJobPosts,
      icon: Briefcase,
      description: 'Open recruitment positions',
    },
    {
      title: 'Registered Sailors',
      value: portData.registeredSailors,
      icon: Users,
      description: 'Connected in network',
    },
  ];

  const totalApplications = jobPosts.reduce((sum, job) => sum + job.applicationsCount, 0);
  const activeJobs = jobPosts.filter((job) => job.status === 'active').length;

  return (
    <div className={variant === 'quick-stats' ? 'space-y-4' : 'space-y-5 sm:space-y-8'}>
      {/* Summary Cards */}
      {(variant === 'all' || variant === 'summary') && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-6 border border-slate-200 dark:border-neutral-800 shadow-sm hover:border-blue-500/40 transition-all duration-300 min-w-0"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-11 sm:h-11 bg-slate-900 text-white dark:bg-white dark:text-black rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <card.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">{card.value}</div>
                </div>
              </div>
              <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white mb-0.5 truncate">{card.title}</h3>
              <p className="hidden sm:block text-slate-500 dark:text-neutral-400 text-xs font-medium truncate">{card.description}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {(variant === 'all' || variant === 'quick-stats') && (
        <div className={`grid grid-cols-1 ${variant === 'quick-stats' ? 'gap-4' : 'lg:grid-cols-2 gap-4 sm:gap-6'}`}>
          {/* Job Applications Overview */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-neutral-800 shadow-sm"
          >
            <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2.5 text-blue-600 dark:text-blue-400 shrink-0" />
              Job Applications Overview
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-neutral-800">
                <span className="font-medium text-slate-700 dark:text-neutral-300">Total Applications</span>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400">{totalApplications}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-neutral-800">
                <span className="font-medium text-slate-700 dark:text-neutral-300">Active Job Posts</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{activeJobs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700 dark:text-neutral-300">Avg. applications / active job</span>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                  {activeJobs > 0 ? Math.round(totalApplications / activeJobs) : 0}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-neutral-800 shadow-sm"
          >
            <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2.5 text-blue-600 dark:text-blue-400 shrink-0" />
              Recent Activity
            </h3>

            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors min-w-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">{activity.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5 break-words">{activity.description} • {activity.timestamp}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">No recent activity logged.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PortDashboardOverview;