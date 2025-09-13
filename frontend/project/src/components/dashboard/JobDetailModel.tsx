import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const JobDetailsModal = ({ job, onClose }: { job: any, onClose: () => void }) => {
  if (!job) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <X />
        </button>
        <h2 className="text-lg font-bold mb-4">Job Post Details</h2>

        <div className="space-y-2 text-sm text-slate-600">
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>From:</strong> {job.sourcePort}</p>
          <p><strong>To:</strong> {job.destinationPort}</p>
          <p><strong>Sailors Required:</strong> {job.sailorsRequired}</p>
          <p><strong>Salary Offered:</strong> ₹{job.salaryOffered.toLocaleString()}</p>
          <p><strong>Cargo Type:</strong> {job.cargoType}</p>
          <p><strong>Departure:</strong> {new Date(job.departureDate).toLocaleDateString()}</p>
          <p><strong>Applications:</strong> {job.applicationsCount}</p>
          <p><strong>Created On:</strong> {new Date(job.createdDate).toLocaleDateString()}</p>

          {job.crewAssigned?.length > 0 && (
            <div>
              <strong>Crew Assigned:</strong>
              <ul className="list-disc list-inside">
                {job.crewAssigned.map((sailor: any) => (
                  <li key={sailor._id}>{sailor._id}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JobDetailsModal;
