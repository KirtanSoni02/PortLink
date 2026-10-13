import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, DollarSign, Calendar, Package, ShieldCheck, CheckCircle2, Check, UserX, Clock, Phone, Mail, Award, FileText } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatters';

interface JobDetailsModalProps {
  job: any;
  onClose: () => void;
  onJobUpdated?: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onJobUpdated }) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchApplications = async () => {
    if (!job?._id && !job?.id) return;
    const jobId = job._id || job.id;
    setLoadingApps(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/shipment-applications/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch job applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [job]);

  const handleAccept = async (applicationId: string) => {
    setActionLoading(applicationId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/shipment-applications/${applicationId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Sailor accepted & assigned to voyage crew!');
      await fetchApplications();
      if (onJobUpdated) onJobUpdated();
    } catch (err: any) {
      console.error('Failed to accept application:', err);
      toast.error(err.response?.data?.error || 'Failed to accept application');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    setActionLoading(applicationId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/shipment-applications/${applicationId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Application marked as rejected');
      await fetchApplications();
      if (onJobUpdated) onJobUpdated();
    } catch (err: any) {
      console.error('Failed to reject application:', err);
      toast.error(err.response?.data?.error || 'Failed to reject application');
    } finally {
      setActionLoading(null);
    }
  };

  if (!job) return null;

  const currency = job.currency || 'USD';
  const sourcePort = job.sourcePort || 'Origin Port';
  const destinationPort = job.destinationPort || 'Destination Port';

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          className="w-full max-w-2xl h-full sm:h-auto max-h-none sm:max-h-[90vh] flex flex-col overflow-hidden rounded-none sm:rounded-2xl bg-white dark:bg-neutral-900 border-0 sm:border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white shadow-2xl my-auto"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
        >
          {/* Fixed Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-neutral-800 flex justify-between items-center shrink-0">
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
                  {job.status || 'ACTIVE'}
                </span>
                <span className="text-xs text-slate-500 dark:text-neutral-400">
                  Created {job.createdDate ? new Date(job.createdDate).toLocaleDateString() : 'recently'}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold flex items-center gap-2 min-w-0">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="break-words font-bold" title={`${sourcePort} → ${destinationPort}`}>
                  {sourcePort} → {destinationPort}
                </span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm bg-slate-50 dark:bg-black/60 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
              <div>
                <span className="text-slate-500 dark:text-neutral-400 block mb-0.5 font-medium">Sailors Required</span>
                <span className="font-bold flex items-center gap-1 text-slate-900 dark:text-white">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" /> {job.sailorsRequired} Crew
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-neutral-400 block mb-0.5 font-medium">Salary Offered</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 shrink-0" /> {formatCurrency(job.salaryOffered, currency)}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-neutral-400 block mb-0.5 font-medium">Cargo Category</span>
                <span className="font-semibold flex items-center gap-1 text-slate-900 dark:text-white break-words" title={job.cargoType || 'General Cargo'}>
                  <Package className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" /> {job.cargoType || 'General Cargo'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-neutral-400 block mb-0.5 font-medium">Expected Departure</span>
                <span className="font-semibold flex items-center gap-1 text-slate-900 dark:text-white">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" /> {job.departureDate ? new Date(job.departureDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Candidate Applications Review Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Candidate Applications ({applications.length})
                </h3>
                {loadingApps && <span className="text-xs text-slate-400">Loading candidates...</span>}
              </div>

              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/70 dark:bg-neutral-900/60 space-y-2 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-neutral-800 pb-2">
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            {app.sailorName}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                app.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                                  : app.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                              }`}
                            >
                              {app.status || 'pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-500 dark:text-neutral-400 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {app.sailorEmail}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {app.sailorPhone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3 text-amber-500" /> {app.sailorExperience} exp (★ {app.sailorRating})
                            </span>
                          </div>
                        </div>

                        {/* Acceptance / Rejection Actions */}
                        {app.status === 'pending' && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              disabled={actionLoading === app._id}
                              onClick={() => handleAccept(app._id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-50 text-xs"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button
                              disabled={actionLoading === app._id}
                              onClick={() => handleReject(app._id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 font-semibold hover:bg-rose-200 transition disabled:opacity-50 text-xs"
                            >
                              <UserX className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="text-slate-600 dark:text-neutral-300">
                        <span className="font-semibold text-slate-700 dark:text-neutral-200">Message: </span>
                        {app.personalMessage}
                      </div>

                      <div className="flex flex-wrap gap-4 text-slate-500 dark:text-neutral-400 text-[11px] pt-1">
                        <span>Certifications: <strong className="text-slate-700 dark:text-neutral-200">{app.certifications}</strong></span>
                        <span>Available: <strong className="text-slate-700 dark:text-neutral-200">{new Date(app.availabilityDate).toLocaleDateString()}</strong></span>
                        <span>Passport: <strong className="text-slate-700 dark:text-neutral-200">{app.passportNumber}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-neutral-800 text-center text-slate-500 dark:text-neutral-400 text-xs">
                  No sailor candidate applications received yet for this route.
                </div>
              )}
            </div>

            {/* Assigned Crew Section */}
            <div className="space-y-3 text-xs sm:text-sm">
              {job.crewAssigned && job.crewAssigned.length > 0 ? (
                <div>
                  <span className="text-slate-500 dark:text-neutral-400 block mb-2 font-medium">
                    Assigned Crew Members ({job.crewAssigned.length}/{job.sailorsRequired}):
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {job.crewAssigned.map((sailor: any, idx: number) => {
                      const sailorName = typeof sailor === 'object' && sailor.user ? `${sailor.user.firstName || ''} ${sailor.user.lastName || ''}`.trim() : (sailor.name || `Sailor #${idx + 1}`);
                      return (
                        <div key={sailor._id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-neutral-800 gap-1 sm:gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span className="font-semibold text-slate-900 dark:text-white break-words" title={sailorName}>
                              {sailorName}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono shrink-0">
                            ID: {sailor._id ? sailor._id.toString().slice(-6) : 'Assigned'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>Job post active on board. Accept candidates above to populate the crew.</span>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Action Footer */}
          <div className="p-4 sm:px-6 border-t border-slate-200 dark:border-neutral-800 shrink-0 bg-slate-50 dark:bg-black/40">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 text-white dark:bg-white dark:text-black font-semibold rounded-xl text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default JobDetailsModal;
