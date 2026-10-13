import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Ship, Navigation, Activity, Radio, RadioTower } from 'lucide-react';
import toast from 'react-hot-toast';
import LiveMap from '../../MapComponent.tsx';
import PortLocation from "../../portLocations.ts";
import socket from '../../socket.ts';
import { formatShipName, formatCurrency } from '../../utils/formatters';

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
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [lastCoords, setLastCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Broadcast GPS coordinates when broadcasting is enabled
  useEffect(() => {
    if (!isBroadcasting || !sailorData.currentContract?.id) return;

    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported by your browser.');
      setIsBroadcasting(false);
      return;
    }

    const shipId = sailorData.currentContract.id;
    toast.success('Live GPS Broadcast Active! Emitting coordinates to port.');

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLastCoords({ lat: latitude, lng: longitude });
        socket.emit('sailorLocationUpdate', {
          shipId,
          latitude,
          longitude,
        });
      },
      (err) => {
        console.warn('Geolocation broadcast warning:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isBroadcasting, sailorData.currentContract?.id]);

  if (!sailorData.hasOngoingContract || !sailorData.currentContract) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-neutral-800 transition-colors duration-300 text-slate-900 dark:text-white"
      >
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-900/50">
            <Ship className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Active Contract</h2>
          <p className="text-slate-500 dark:text-neutral-400 text-xs sm:text-sm mb-6">You are currently unassigned and ready for offshore placement. Browse open shipments to submit your application.</p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold">
            <Activity className="w-4 h-4 mr-2 animate-pulse" />
            Ready for Assignment
          </div>
        </div>
      </motion.div>
    );
  }

  const contract = sailorData.currentContract!;

  const getPortCoords = (portName: string) => {
    const port = PortLocation[portName];
    if (!port) {
      return { latitude: 0, longitude: 0 };
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 text-slate-900 dark:text-white shadow-sm transition-colors duration-300 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-1.5" />
                ONGOING DEPLOYMENT
              </span>
              {isBroadcasting && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse">
                  <Radio className="w-3 h-3 mr-1" />
                  GPS TELEMETRY STREAMING LIVE
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Active Voyage Contract</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">Vessel in maritime transit to destination port</p>
          </div>
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <button
              onClick={() => setIsBroadcasting(!isBroadcasting)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                isBroadcasting
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200'
              }`}
            >
              <RadioTower className={`w-4 h-4 ${isBroadcasting ? 'animate-bounce' : ''}`} />
              <span>{isBroadcasting ? 'Broadcasting Live GPS (Active)' : 'Start Live GPS Broadcast'}</span>
            </button>
            <div className="sm:text-right">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">{contract.progress}%</div>
              <div className="text-xs text-slate-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">Journey Progress</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-neutral-800 text-xs relative z-10">
          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-black/40 p-3 rounded-xl border border-slate-200 dark:border-neutral-800">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-semibold">Source Port</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{contract.sourcePort}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-black/40 p-3 rounded-xl border border-slate-200 dark:border-neutral-800">
            <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-semibold">Destination Port</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{contract.destinationPort}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-black/40 p-3 rounded-xl border border-slate-200 dark:border-neutral-800">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-semibold">Estimated Arrival</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">{new Date(contract.estimatedArrival).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Journey Progress Bar */}
        <div className="mt-6 relative z-10">
          <div className="flex justify-between text-xs text-slate-500 dark:text-neutral-400 mb-1.5 font-medium">
            <span>Route Completion</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{contract.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-neutral-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-300 dark:border-neutral-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${contract.progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="bg-blue-600 h-full rounded-full shadow-md"
            />
          </div>
        </div>
      </motion.div>

      {/* Contract Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ship Information */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-sm text-slate-900 dark:text-white"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-neutral-800 pb-3">
            <Ship className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Vessel Details
          </h3>
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-neutral-400 font-medium">Vessel Name</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatShipName(contract.shipName, contract.sourcePort, contract.destinationPort)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-neutral-400 font-medium">IMO / Ship Number</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{contract.shipNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-neutral-400 font-medium">Contract Stipend</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(contract.salary)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-neutral-400 font-medium">Departure Date</span>
              <span className="font-semibold text-slate-900 dark:text-white">{new Date(contract.startDate).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Current Position Telemetry */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-sm text-slate-900 dark:text-white"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-neutral-800 pb-3">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Telemetry Position
          </h3>
          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-500 dark:text-neutral-400 block mb-0.5 font-medium">Current Sector / Region</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{contract.currentLocation?.region || 'International Waters'}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 dark:bg-black/40 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800">
                <span className="text-[10px] text-slate-500 dark:text-neutral-400 block uppercase font-medium">Latitude</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{contract.currentLocation?.lat?.toFixed(4) || '0.0000'}°</span>
              </div>
              <div className="bg-slate-50 dark:bg-black/40 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800">
                <span className="text-[10px] text-slate-500 dark:text-neutral-400 block uppercase font-medium">Longitude</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{contract.currentLocation?.lng?.toFixed(4) || '0.0000'}°</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500 dark:text-neutral-400 font-medium">AIS Status</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Live Feed Active ({currentTime.toLocaleTimeString()})
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Map Live Tracking Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-sm text-slate-900 dark:text-white"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-neutral-800 pb-3">
          <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Interactive Telemetry Route Map
        </h3>

        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-800 shadow-sm z-10 h-72">
          <LiveMap
            shipId={sailorData.currentContract?.id || ''}
            sourceCoords={getPortCoords(sailorData.currentContract?.sourcePort || '')}
            destinationCoords={getPortCoords(sailorData.currentContract?.destinationPort || '')}
          />
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 mt-4 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
              <span className="text-slate-600 dark:text-neutral-400 font-medium">Departure Port</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white rounded-full animate-ping"></div>
              <span className="text-slate-900 dark:text-white font-bold">Vessel Position</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full"></div>
              <span className="text-slate-600 dark:text-neutral-400 font-medium">Arrival Port</span>
            </div>
          </div>
          <div className="text-blue-600 dark:text-blue-400 font-semibold text-xs">GPS Stream Connected</div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatusOverview;