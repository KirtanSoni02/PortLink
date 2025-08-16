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
  
}

const PortDashboardOverview: React.FC<PortDashboardOverviewProps> = ({ portData, jobPosts }) => {
  const summaryCards = [
    {
      title: 'Ships In Transit',
      value: portData.totalShipsInTransit,
      icon: Ship,
      color: 'from-blue-500 to-blue-600',
      // change: '+12%',
      description: 'Currently active'
    },
    {
      title: 'Contracts Completed',
      value: portData.totalContractsCompleted,
      icon: FileText,
      color: 'from-emerald-500 to-emerald-600',
      // change: '+8%',
      description: 'All time total'
    },
    {
      title: 'Active Job Posts',
      value: portData.activeJobPosts,
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      // change: '+3',
      description: 'Open positions'
    },
    {
      title: 'Registered Sailors',
      value: portData.registeredSailors,
      icon: Users,
      color: 'from-amber-500 to-amber-600',
      // change: '+24%',
      description: 'In our network'
    }
  ];

  const totalApplications = jobPosts.reduce((sum, job) => sum + job.applicationsCount, 0);
  const activeJobs = jobPosts.filter(job => job.status === 'active').length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-800">{card.value}</div>
                {/* <div className="text-sm text-emerald-600 font-medium">{card.change}</div> */}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">{card.title}</h3>
            <p className="text-slate-600 text-sm">{card.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Applications Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-11 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-blue-500" />
            Job Applications Overview
          </h3>
          
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <span className="text-xl font-medium text-slate-800">Total Applications</span>
              <span className="text-xl font-bold text-blue-600">{totalApplications}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-medium text-slate-800">Active Job Posts</span>
              <span className="text-xl font-bold text-emerald-600">{activeJobs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-medium text-slate-800">Average Applications per Job</span>
              <span className="text-xl font-bold text-purple-600">
                {activeJobs > 0 ? Math.round(totalApplications / activeJobs) : 0}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-3 text-emerald-500" />
            Recent Activity 
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-slate-800">New ship arrival request</div>
                <div className="text-xs text-slate-500">Ocean Navigator requesting docking - 5 min ago</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-slate-800">Job application received</div>
                <div className="text-xs text-slate-500">Captain Rodriguez applied for Barcelona route - 15 min ago</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-slate-800">Contract completed</div>
                <div className="text-xs text-slate-500">Atlantic Star completed Hamburg route - 1 hour ago</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-slate-800">Weather alert issued</div>
                <div className="text-xs text-slate-500">Storm warning for Atlantic routes - 2 hours ago</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortDashboardOverview;