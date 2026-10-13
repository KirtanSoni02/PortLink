import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Ship, Eye, Send, AlertCircle } from 'lucide-react';
import ShipmentApplicationModal from './ShipmentApplicationModal';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Shipment {
  id: string;
  sourcePort: string;
  destinationPort: string;
  DepartureDate: Date;
  salary: number;
  crewRequired: number;
  cargoType: string;
  urgency: 'low' | 'medium' | 'high';
  postedDate: string;
  company: string;
  description: string;
  alreadyAssigned: boolean;
}

interface AvailableShipmentsProps {
  sailorData?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    experience: string;
    rating: number;
    hasOngoingContract: boolean;
    currentContract?: {
      progress: number;
      destinationPort: string;
      estimatedArrival: string;
    };
  };
  limit?: number;
}

const AvailableShipments: React.FC<AvailableShipmentsProps> = ({ sailorData, limit }) => {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedShipmentForApplication, setSelectedShipmentForApplication] = useState<Shipment | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [availableShipmentsData, setAvailableShipmentsData] = useState<Shipment[] | null>(null);
  const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  function estimateDays(departureDate: string): number {
    const now = new Date();
    const departure = new Date(departureDate);
    const diffMs = Math.abs(departure.getTime() - now.getTime());
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  function getUrgencyLevel(departureDate: string): 'low' | 'medium' | 'high' {
    const daysUntilDeparture = estimateDays(departureDate);
    if (daysUntilDeparture <= 3) return 'high';
    if (daysUntilDeparture <= 7) return 'medium';
    return 'low';
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white font-bold';
      case 'medium':
        return 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'low':
      default:
        return 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-700';
    }
  };

  useEffect(() => {
    const fetchAvailableShipments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/sailor/available-shipments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { shipments, hasAlreadyApplied } = response.data;
        const sailorId = sailorData?.id;

        const mappedData: Shipment[] = shipments.map((job: any) => ({
          id: job._id,
          sourcePort: job.sourcePort,
          destinationPort: job.destinationPort,
          DepartureDate: new Date(job.departureDate),
          salary: job.salaryOffered,
          crewRequired: job.sailorsRequired,
          cargoType: job.cargoType,
          urgency: getUrgencyLevel(job.departureDate),
          postedDate: new Date(job.createdDate).toISOString(),
          company: job.createdBy?.companyName || 'Unknown Shipping Co.',
          description: `Sailing from ${job.sourcePort} to ${job.destinationPort} carrying ${job.cargoType}. Departure: ${new Date(job.departureDate).toLocaleDateString()}.`,
          alreadyAssigned: job.crewAssigned?.includes(sailorId),
        }));

        setAvailableShipmentsData(mappedData);
        setHasAlreadyApplied(hasAlreadyApplied);
      } catch (error) {
        console.error('❌ Failed to fetch available shipments:', error);
      }
    };

    fetchAvailableShipments();
  }, [sailorData?.id]);

  const defaultSailorData = {
    name: 'Captain James Rodriguez',
    email: 'james.rodriguez@websailor.com',
    phone: '+1 (555) 123-4567',
    experience: '8 years',
    rating: 4.8,
    hasOngoingContract: false,
    currentContract: undefined,
  };

  const currentSailorData = sailorData || defaultSailorData;
  const shipments: Shipment[] = availableShipmentsData || [];
  const displayedShipments = limit ? shipments.slice(0, limit) : shipments;

  const canApplyToShipment = (shipment: Shipment): { canApply: boolean; reason?: string } => {
    if (hasAlreadyApplied) {
      return { canApply: false, reason: 'You have already applied to a shipment. You cannot apply to others.' };
    }

    if (shipment.alreadyAssigned) {
      return { canApply: false, reason: 'You are already assigned to this shipment.' };
    }

    if (currentSailorData.currentContract && currentSailorData.currentContract.progress < 90) {
      return {
        canApply: false,
        reason: 'You can only apply for new shipments when you have no ongoing contract or are near completion (90%+).',
      };
    }

    return { canApply: true };
  };

  const handleApply = (shipment: Shipment) => {
    const { canApply, reason } = canApplyToShipment(shipment);

    if (!canApply) {
      toast.error(reason || 'Cannot apply to this shipment.');
      return;
    }

    setSelectedShipmentForApplication(shipment);
    setApplicationModalOpen(true);
  };

  const handleSubmitApplication = (applicationData: any) => {
    setApplications((prev) => [...prev, applicationData]);
  };

  const hasApplied = (shipmentId: string) => {
    return applications.some((app) => app.shipmentId === shipmentId);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white transition-colors duration-300 min-w-0"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center tracking-tight">
            <Ship className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-blue-600 dark:text-blue-400 shrink-0" />
            Available Shipments
          </h2>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium">
            {shipments.length} opportunities available
          </div>
        </div>

        {/* Application Status Info */}
        {currentSailorData.hasOngoingContract && (
          <div className="mb-6 p-4 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="text-xs sm:text-sm">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">Application Restrictions</h3>
                <p className="text-blue-800 dark:text-blue-400 mt-1">
                  You currently have an ongoing contract. You can only apply for new shipments that:
                </p>
                <ul className="text-blue-800 dark:text-blue-400 mt-1.5 ml-4 list-disc space-y-0.5">
                  <li>
                    Start from your current destination ({currentSailorData.currentContract?.destinationPort}) and ETA of current ship is less than shipment departure time
                  </li>
                  <li>Begin after your current contract is 90% complete</li>
                </ul>
                {currentSailorData.currentContract && (
                  <p className="text-blue-900 dark:text-blue-300 font-medium mt-2">
                    Current progress: {currentSailorData.currentContract.progress}%
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {displayedShipments.map((shipment, index) => {
            const { canApply, reason } = canApplyToShipment(shipment);
            const applied = hasApplied(shipment.id);

            return (
              <motion.div
                key={shipment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
                  canApply
                    ? 'border-slate-200 dark:border-neutral-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 bg-white/60 dark:bg-black/40'
                    : 'border-slate-200/80 dark:border-neutral-800/80 bg-slate-50/50 dark:bg-black/20 opacity-80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  {/* Left side - Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">{shipment.company}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${getUrgencyColor(shipment.urgency)}`}>
                        {shipment.urgency.toUpperCase()} PRIORITY
                      </span>
                      {applied && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                          APPLIED
                        </span>
                      )}
                      {!canApply && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border border-slate-300 dark:border-neutral-700">
                          RESTRICTED
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center space-x-2 bg-slate-50 dark:bg-black/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                        <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase font-semibold text-slate-400">From</div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{shipment.sourcePort}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-50 dark:bg-black/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                        <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase font-semibold text-slate-400">To</div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{shipment.destinationPort}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-50 dark:bg-black/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase font-semibold text-slate-400">Departure</div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{shipment.DepartureDate.toString().slice(0, 10)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-50 dark:bg-black/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase font-semibold text-slate-400">Crew Needed</div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{shipment.crewRequired} members</div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 mb-3">{shipment.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-neutral-400">
                      <span>Cargo: <strong className="text-slate-700 dark:text-neutral-200">{shipment.cargoType}</strong></span>
                      <span>Posted: <strong className="text-slate-700 dark:text-neutral-200">{new Date(shipment.postedDate).toLocaleDateString()}</strong></span>
                    </div>

                    {!canApply && reason && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{reason}</p>
                      </div>
                    )}
                  </div>

                  {/* Right side - Salary and actions */}
                  <div className="flex flex-col lg:items-end justify-between gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-neutral-800">
                    <div className="lg:text-right">
                      <div className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">${shipment.salary.toLocaleString()}</div>
                      <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Stipend / Compensation</div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedShipment(selectedShipment === shipment.id ? null : shipment.id)}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </motion.button>

                      <motion.button
                        whileHover={canApply && !applied ? { scale: 1.02 } : {}}
                        whileTap={canApply && !applied ? { scale: 0.98 } : {}}
                        onClick={() => handleApply(shipment)}
                        disabled={!canApply || applied}
                        className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 ${
                          applied
                            ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 cursor-not-allowed'
                            : canApply
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-slate-200 dark:bg-neutral-800 text-slate-400 dark:text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span>
                          {applied ? 'Applied' : canApply ? 'Apply Now' : 'Cannot Apply'}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {selectedShipment === shipment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-200 dark:border-neutral-800"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-50 dark:bg-black/40 p-4 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">Route Details</h4>
                        <div className="space-y-1.5 text-slate-600 dark:text-neutral-300">
                          <div><strong className="text-slate-900 dark:text-white">Departure Port:</strong> {shipment.sourcePort}</div>
                          <div><strong className="text-slate-900 dark:text-white">Destination Port:</strong> {shipment.destinationPort}</div>
                          <div><strong className="text-slate-900 dark:text-white">Departure Date:</strong> {shipment.DepartureDate.toLocaleDateString()}</div>
                          <div><strong className="text-slate-900 dark:text-white">Cargo Category:</strong> {shipment.cargoType}</div>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-black/40 p-4 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">Deployment Requirements</h4>
                        <div className="space-y-1.5 text-slate-600 dark:text-neutral-300">
                          <div><strong className="text-slate-900 dark:text-white">Crew Quota:</strong> {shipment.crewRequired} members</div>
                          <div><strong className="text-slate-900 dark:text-white">Certifications:</strong> Maritime STCW certification</div>
                          <div><strong className="text-slate-900 dark:text-white">Medical Clearance:</strong> Valid ENG1 medical certificate</div>
                          <div><strong className="text-slate-900 dark:text-white">Availability:</strong> Immediate deployment readiness</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {shipments.length === 0 && (
          <div className="text-center py-12">
            <Ship className="w-12 h-12 text-slate-300 dark:text-neutral-700 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-neutral-300 mb-1">No shipments available</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">Check back later for new deployment opportunities</p>
          </div>
        )}
      </motion.div>

      {/* Application Modal */}
      {selectedShipmentForApplication && (
        <ShipmentApplicationModal
          isOpen={applicationModalOpen}
          onClose={() => {
            setApplicationModalOpen(false);
            setSelectedShipmentForApplication(null);
          }}
          shipment={selectedShipmentForApplication}
          sailorData={currentSailorData}
          onSubmitApplication={handleSubmitApplication}
        />
      )}
    </>
  );
};

export default AvailableShipments;