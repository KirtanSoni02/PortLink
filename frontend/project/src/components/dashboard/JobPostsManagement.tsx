import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Users, DollarSign, Calendar, Eye, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import JobDetailsModal from './JobDetailModel';

interface JobPost {
  id: string;
  sourcePort: string;
  destinationPort: string;
  sailorsRequired: number;
  salaryOffered: number;
  departureDate: string;
  cargoType: string;
  status: 'active' | 'filled' | 'expired';
  applicationsCount: number;
  createdDate: string;
}

interface JobPostsManagementProps {
  jobPosts: JobPost[];
  onDeleteJob: (jobId: string) => void;
}

const JobPostsManagement: React.FC<JobPostsManagementProps> = ({ jobPosts, onDeleteJob }) => {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50';
      case 'filled': return 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-800/50';
      case 'expired': return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/50';
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700';
    }
  };

  const [selectedJob, setSelectedJob] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const handleViewApplications = async (jobId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/activejob/view/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Job post details:", response.data);
      setSelectedJob(response.data);
    } catch (err) {
      console.error("Failed to fetch job post details", err);
    }
  };

  const closeModal = () => setSelectedJob(null);

  const handleDeleteJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/activejob/delete/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Job post deleted successfully");
      onDeleteJob(jobId);

    } catch (err) {
      console.error("Failed to delete job post:", err);
      toast.error("Failed to delete job post");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors duration-300 h-fit min-w-0"
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center">
        <Briefcase className="w-5 h-5 mr-2.5 text-purple-500" />
        Active Job Posts
      </h3>

      <div className="space-y-4">
        {jobPosts.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 rounded-xl p-4 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStatusColor(job.status)}`}>
                    {job.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[140px] sm:max-w-none" title={job.sourcePort}>{job.sourcePort}</span>
                    <span className="text-slate-400 shrink-0">→</span>
                    <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[140px] sm:max-w-none" title={job.destinationPort}>{job.destinationPort}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline text-[11px] text-slate-500 dark:text-neutral-400">{job.applicationsCount} apps</span>
                <button
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  aria-expanded={expandedJob === job.id}
                  aria-label={`${expandedJob === job.id ? 'Hide' : 'Show'} details for ${job.destinationPort}`}
                  className="p-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  {expandedJob === job.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {expandedJob === job.id && (
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-neutral-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-neutral-400 mb-3">
                  <div className="flex items-center gap-1.5"><Users className="w-3 h-3 text-purple-400" />{job.sailorsRequired} sailors</div>
                  <div className="flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-emerald-400" />${job.salaryOffered.toLocaleString()}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-amber-400" />{new Date(job.departureDate).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewApplications(job.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-black rounded-lg"
                  >
                    <Eye className="w-3 h-3" /> View applications
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteJob(job.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 rounded-lg"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {jobPosts.length === 0 && (
        <div className="text-center py-8">
          <Briefcase className="w-10 h-10 text-slate-300 dark:text-neutral-700 mx-auto mb-2" />
          <p className="text-slate-500 dark:text-neutral-400 text-xs">No job posts yet</p>
        </div>
      )}

      {/* View Application / Details Modal Portal Root */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={closeModal}
          onJobUpdated={() => {
            if ((selectedJob as any)._id || (selectedJob as any).id) {
              handleViewApplications((selectedJob as any)._id || (selectedJob as any).id);
            }
          }}
        />
      )}
    </motion.div>
  );
};

export default JobPostsManagement;