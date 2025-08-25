import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Users, DollarSign, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
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

const JobPostsManagement: React.FC<JobPostsManagementProps> = ({ jobPosts, onDeleteJob}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'filled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };



const [selectedJob, setSelectedJob] = useState(null);

const handleViewApplications = async (jobId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`https://portlink-ml31.onrender.com/api/activejob/view/${jobId}`, {
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





  const handleEditJob = (jobId: string) => {
    console.log('Editing job:', jobId);
    // Handle edit job logic
  };


   const handleDeleteJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://portlink-ml31.onrender.com/api/activejob/delete/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Job post deleted successfully");
      onDeleteJob(jobId); // ⬅️ Remove from UI list

    } catch (err) {
      console.error("Failed to delete job post:", err);
      toast.error("Failed to delete job post");
    }
  };
    
  



  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 h-fit"
    >
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <Briefcase className="w-6 h-6 mr-3 text-purple-500" />
        Active Job Posts
      </h3>

      <div className="space-y-4">
        {jobPosts.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                    {job.status.toUpperCase()}
                  </span>
                  {job.applicationsCount > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {job.applicationsCount} applications
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    <span className="text-slate-600">{job.sourcePort}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-slate-600">{job.destinationPort}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{job.sailorsRequired} sailors</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{job.salaryOffered.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>Departs: {new Date(job.departureDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => handleViewApplications(job.id)}
  className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
>
  <Eye className="w-3 h-3" />
  <span>View</span>
</motion.button>
                {selectedJob && <JobDetailsModal job={selectedJob} onClose={closeModal} />}

              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditJob(job.id)}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </motion.button> */}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteJob(job.id)}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {jobPosts.length === 0 && (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No job posts yet</p>
        </div>
      )}
    </motion.div>
    
  );

};

export default JobPostsManagement;