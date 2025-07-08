import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Ship, DollarSign, Navigation, Activity } from 'lucide-react';

interface StatusOverviewProps {
  sailorData: {
    hasOngoingContract: boolean;
    currentContract?: {
      id: string;
      sourcePort: string;
      destinationPort: string;
      shipName: string;
      shipNumber: string;
      estimatedArrival: string;
      currentLocation: {
        lat: number;
        lng: number;
        name: string;
      };
      progress: number;
      salary: number;
      startDate: string;
    };
  };
}

const StatusOverview: React.FC<StatusOverviewProps> = ({ sailorData }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!sailorData.hasOngoingContract) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ship className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">No Active Contract</h2>
          <p className="text-slate-600 mb-6">You're currently available for new assignments. Check out the available shipments below.</p>
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            <Activity className="w-4 h-4 mr-2" />
            Available for Work
          </div>
        </div>
      </motion.div>
    );
  }

  const contract = sailorData.currentContract!;

  return (
    <div className="space-y-6">
      {/* Contract Status Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Active Contract</h2>
            <p className="text-sky-100">Currently en route to destination</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{contract.progress}%</div>
            <div className="text-sky-100">Complete</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-sky-200" />
            <div>
              <div className="text-sm text-sky-200">From</div>
              <div className="font-semibold">{contract.sourcePort}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Navigation className="w-6 h-6 text-sky-200" />
            <div>
              <div className="text-sm text-sky-200">To</div>
              <div className="font-semibold">{contract.destinationPort}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-sky-200" />
            <div>
              <div className="text-sm text-sky-200">ETA</div>
              <div className="font-semibold">{contract.estimatedArrival}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-sky-200 mb-2">
            <span>Journey Progress</span>
            <span>{contract.progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${contract.progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-white h-3 rounded-full shadow-lg"
            />
          </div>
        </div>
      </motion.div>

      {/* Contract Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ship Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Ship className="w-6 h-6 mr-3 text-sky-500" />
            Ship Information
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Ship Name</span>
              <span className="font-semibold text-slate-800">{contract.shipName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Ship Number</span>
              <span className="font-semibold text-slate-800">{contract.shipNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Contract Value</span>
              <span className="font-semibold text-emerald-600">${contract.salary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Start Date</span>
              <span className="font-semibold text-slate-800">{new Date(contract.startDate).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Current Location */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <MapPin className="w-6 h-6 mr-3 text-emerald-500" />
            Current Location
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-slate-600 mb-1">Position</div>
              <div className="font-semibold text-slate-800">{contract.currentLocation.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-600 mb-1">Latitude</div>
                <div className="font-mono text-slate-800">{contract.currentLocation.lat.toFixed(4)}°</div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Longitude</div>
                <div className="font-mono text-slate-800">{contract.currentLocation.lng.toFixed(4)}°</div>
              </div>
            </div>
            <div className="pt-2">
              <div className="text-sm text-slate-600 mb-2">Last Updated</div>
              <div className="text-sm text-emerald-600 font-medium">
                {currentTime.toLocaleTimeString()} (Live)
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <Navigation className="w-6 h-6 mr-3 text-blue-500" />
          Route Tracking
        </h3>
        
        {/* Map Container */}
        <div className="relative bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl h-80 overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          {/* Route Path */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.path
              d="M50,250 Q200,100 350,150 Q500,200 650,120"
              stroke="#3B82F6"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: contract.progress / 100 }}
              transition={{ duration: 2 }}
            />
          </svg>

          {/* Source Port */}
          <div className="absolute left-12 bottom-16 flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
            <span className="text-sm font-medium text-slate-700">{contract.sourcePort}</span>
          </div>

          {/* Current Position */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
            className="absolute"
            style={{
              left: `${50 + (contract.progress / 100) * 550}px`,
              top: `${250 - Math.sin((contract.progress / 100) * Math.PI) * 100}px`
            }}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 w-6 h-6 bg-red-400 rounded-full"
              />
            </div>
          </motion.div>

          {/* Destination Port */}
          <div className="absolute right-12 top-16 flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-slate-700">{contract.destinationPort}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-slate-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>Source</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Current Position</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Destination</span>
            </div>
          </div>
          <div className="text-emerald-600 font-medium">
            Real-time tracking active
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatusOverview;