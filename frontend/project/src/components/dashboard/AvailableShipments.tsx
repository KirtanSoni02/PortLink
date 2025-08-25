import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Ship, Eye, Send, AlertCircle } from 'lucide-react';
import ShipmentApplicationModal from './ShipmentApplicationModal';
import axios from 'axios';
import { useEffect } from 'react';

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


const [AvailableShipmentsData, setAvailableShipmentsData] = useState(null);
const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);

  useEffect(() => {
  const fetchAvailableShipments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:3000/api/sailor/available-shipments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("📦 Available Shipments Data:", response.data);
      const { shipments, hasAlreadyApplied } = response.data;
      const sailorId = sailorData?.id


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
        company: job.createdBy?.companyName || "Unknown Shipping Co.",
        description: `Sailing from ${job.sourcePort} to ${job.destinationPort} carrying ${job.cargoType}. Departure: ${new Date(job.departureDate).toLocaleDateString()}.`,
        alreadyAssigned: job.crewAssigned?.includes(sailorId),
      }));

      setAvailableShipmentsData(mappedData);
      setHasAlreadyApplied(hasAlreadyApplied);
    } catch (error) {
      console.error("❌ Failed to fetch available shipments:", error);
    }
  };

  fetchAvailableShipments();
}, []);


  // Mock sailor data if not provided
  const defaultSailorData = {
    name: 'Captain James Rodriguez',
    email: 'james.rodriguez@websailor.com',
    phone: '+1 (555) 123-4567',
    experience: '8 years',
    rating: 4.8,
    hasOngoingContract: false,
    currentContract: undefined
  };

  const currentSailorData = sailorData || defaultSailorData;

  // Mock data - replace with API call
  const shipments: Shipment[] = AvailableShipmentsData || [];
 const displayedShipments = limit ? shipments.slice(0, limit) : shipments;

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
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const canApplyToShipment = (shipment: Shipment): { canApply: boolean; reason?: string } => {
    // Check if sailor has no ongoing contract
     if (hasAlreadyApplied) {
    return { canApply: false, reason: "You have already applied to a shipment. You cannot apply to others." };
  }


    // if (!currentSailorData.hasOngoingContract) {
    //   return { canApply: true };
    // }
      if (shipment.alreadyAssigned) {
    return { canApply: false, reason: "You are already assigned to this shipment." };
  }

    // Check if current contract is near completion (90% or more)
    if (currentSailorData.currentContract && (currentSailorData.currentContract.progress < 90)) {
      return { 
      canApply: false, 
      reason: 'You can only apply for new shipments when you have no ongoing contract, are near completion (90%+).' 
    };
  }
    else return { 
      canApply: true,  
    };
  };

  const handleApply = (shipment: Shipment) => {
    const { canApply, reason } = canApplyToShipment(shipment);
    
    if (!canApply) {
      alert(reason);
      return;
    }

    setSelectedShipmentForApplication(shipment);
    setApplicationModalOpen(true);
  };

  const handleSubmitApplication = (applicationData: any) => {
    setApplications(prev => [...prev, applicationData]);
    console.log('Application submitted:', applicationData);
    // Here you would typically send the application to your API
  };

  const hasApplied = (shipmentId: string) => {
    return applications.some(app => app.shipmentId === shipmentId);
  };


  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Ship className="w-7 h-7 mr-3 text-sky-500" />
            Available Shipments
          </h2>
          <div className="text-sm text-slate-600">
            {shipments.length} opportunities available
          </div>
        </div>

        {/* Application Status Info */}
        {currentSailorData.hasOngoingContract && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-800">Application Restrictions</h3>
                <p className="text-sm text-blue-700 mt-1">
                  You currently have an ongoing contract. You can only apply for new shipments that:
                </p>
                <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
                  <li>Start from your current destination ({currentSailorData.currentContract?.destinationPort}) and ETA of current ship is less than shipment departure time</li>
                  <li>Begin after your current contract is 90% complete</li>
                </ul>
                {currentSailorData.currentContract && (
                  <p className="text-sm text-blue-700 mt-2">
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                  canApply ? 'border-slate-200 hover:border-sky-300' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left side - Main info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-slate-800">{shipment.company}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(shipment.urgency)}`}>
                        {shipment.urgency.toUpperCase()} PRIORITY
                      </span>
                      {applied && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                          APPLIED
                        </span>
                      )}
                      {!canApply && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                          RESTRICTED
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <div>
                          <div className="text-xs text-slate-500">From</div>
                          <div className="text-sm font-medium text-slate-800">{shipment.sourcePort}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="text-xs text-slate-500">To</div>
                          <div className="text-sm font-medium text-slate-800">{shipment.destinationPort}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <div>
                          <div className="text-xs text-slate-500">Departure Date</div>
                          <div className="text-sm font-medium text-slate-800">{shipment.DepartureDate.toString().slice(0, 10)}</div>
                        </div>
                      </div> 
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <div>
                          <div className="text-xs text-slate-500">Crew Needed</div>
                          <div className="text-sm font-medium text-slate-800">{shipment.crewRequired} members</div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-3">{shipment.description}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Cargo: {shipment.cargoType}</span>
                      <span>Posted: {new Date(shipment.postedDate).toLocaleDateString()}</span>
                    </div>

                    {!canApply && reason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{reason}</p>
                      </div>
                    )}
                  </div>

                  {/* Right side - Salary and actions */}
                  <div className="flex flex-col items-end space-y-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">${shipment.salary.toLocaleString()}</div>
                      <div className="text-sm text-slate-500">Total compensation</div>
                    </div>

                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedShipment(selectedShipment === shipment.id ? null : shipment.id)}
                        className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View Details</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={canApply && !applied ? { scale: 1.05 } : {}}
                        whileTap={canApply && !applied ? { scale: 0.95 } : {}}
                        onClick={() => handleApply(shipment)}
                        disabled={!canApply || applied}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                          applied 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                            : canApply
                            ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-600 hover:to-emerald-600'
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span className="text-sm">
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
                    className="mt-4 pt-4 border-t border-slate-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Route Details</h4>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div>Departure: {shipment.sourcePort}</div>
                          <div>Destination: {shipment.destinationPort}</div>
                          <div>Departure Date: {shipment.DepartureDate.toLocaleDateString()}</div>
                          <div>Cargo type: {shipment.cargoType}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Requirements</h4>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div>Crew size: {shipment.crewRequired} members</div>
                          <div>Experience: Maritime certification required</div>
                          <div>Medical: Valid STCW medical certificate</div>
                          <div>Availability: Immediate start preferred</div>
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
            <Ship className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No shipments available</h3>
            <p className="text-slate-500">Check back later for new opportunities</p>
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