import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Ship, DollarSign, Navigation, Activity } from 'lucide-react';
import LiveMap from '../../MapComponent.tsx';
import PortLocation from "../../portLocations.ts"

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
        region: string;
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
const sourceportname = contract.sourcePort;
const destportname = contract.destinationPort;
const currentCordinates = contract.currentLocation.lng.toFixed(4)



const getPortCoords = (portName: string) => {
  const port = PortLocation[portName];
  if (!port) {
    console.warn(`Port not found: ${portName}`);
    return { latitude: 0, longitude: 0 }; // fallback
  }

  return {
    latitude: parseFloat(port.latitude),
    longitude: parseFloat(port.longitude)
  };
};



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
              <div className="font-semibold">{new Date(contract.estimatedArrival).toLocaleDateString()}</div>
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
              <div className="font-semibold text-slate-800">{contract.currentLocation.region}</div>
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






{/* <ShipTrackerMap
  sourceCoords={sourceportCordiantes}
  destinationCoords={destportCordiantes}
  currentCoords={"latitude":contract.currentLocation.lat.toFixed(4),"longitude":}  // Comes from socket update
/> */}






















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

  {/* Leaflet Map Container */}
  <div className="rounded-xl overflow-hidden border border-blue-100 shadow-inner z-10">
    <LiveMap
      shipId={sailorData.currentContract?.id || ''}
      sourceCoords={getPortCoords(sailorData.currentContract?.sourcePort || '')}
  destinationCoords={getPortCoords(sailorData.currentContract?.destinationPort || '')}
    /> 
  </div>

  {/* Legend and Status */}
  <div className="flex justify-between items-center mt-4 text-sm text-slate-600">
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span>Source</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping-fast"></div>
        <span>Live Position</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span>Destination</span>
      </div>
    </div>
    <div className="text-emerald-600 font-medium">Real-time tracking active</div>
  </div>
</motion.div>
    </div>
  );
};

export default StatusOverview;