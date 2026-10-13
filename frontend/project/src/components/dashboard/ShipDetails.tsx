import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ship, Package, Calendar, Clock, Anchor, Navigation } from 'lucide-react';

interface ShipDetailsProps {
  ship: {
    id: string;
    name: string;
    number: string;
    cargoType: string;
    capacity: string;
    departureTime: string;
    arrivalTime: string;
    weather: string;
    ContactdetailsOfPortAuthority: string;
    createdBy: string;
  };
}

const ShipDetails: React.FC<ShipDetailsProps> = ({ ship }) => {
  const [showContact, setShowContact] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white transition-colors duration-300 min-w-0"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center tracking-tight">
        <Ship className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-blue-600 dark:text-blue-400 shrink-0" />
        Current Ship Details
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ship Information & Status */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-black/60 rounded-xl p-5 border border-slate-200/80 dark:border-neutral-800">
            <h3 className="text-base font-bold mb-4 flex items-center tracking-tight">
              <Anchor className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 shrink-0" />
              Vessel Information
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-neutral-400 font-medium">Ship Name</span>
                <span className="font-bold truncate ml-2">{ship.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-neutral-400 font-medium">Registration Number</span>
                <span className="font-mono font-semibold truncate ml-2">{ship.number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-neutral-400 font-medium">Cargo Type</span>
                <span className="font-semibold truncate ml-2">{ship.cargoType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-neutral-400 font-medium">Capacity</span>
                <span className="font-semibold truncate ml-2">{ship.capacity}</span>
              </div>
            </div>
          </div>

          {/* Ship Status */}
          <div className="bg-slate-50 dark:bg-black/60 rounded-xl p-5 border border-slate-200/80 dark:border-neutral-800">
            <h3 className="text-base font-bold mb-3 flex items-center tracking-tight">
              <Navigation className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 shrink-0" />
              Current Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm">En Route</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-neutral-400">
                Vessel is currently sailing towards destination port under active telemetry tracking.
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Cargo Information */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-black/60 rounded-xl p-5 border border-slate-200/80 dark:border-neutral-800">
            <h3 className="text-base font-bold mb-4 flex items-center tracking-tight">
              <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 shrink-0" />
              Schedule
            </h3>
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Departure</div>
                  <div className="font-semibold">
                    {new Date(ship.departureTime).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="ml-3.5 border-l-2 border-dashed border-slate-300 dark:border-neutral-700 h-6"></div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 bg-slate-900 text-white dark:bg-white dark:text-black rounded-lg flex items-center justify-center shrink-0">
                  <Anchor className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Expected Arrival</div>
                  <div className="font-semibold">
                    {new Date(ship.arrivalTime).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Details */}
          <div className="bg-slate-50 dark:bg-black/60 rounded-xl p-5 border border-slate-200/80 dark:border-neutral-800">
            <h3 className="text-base font-bold mb-4 flex items-center tracking-tight">
              <Package className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 shrink-0" />
              Cargo Details
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-neutral-400 font-medium">Type</span>
                <span className="font-semibold truncate ml-2">{ship.cargoType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-neutral-400 font-medium">Capacity</span>
                <span className="font-semibold truncate ml-2">{ship.capacity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-neutral-400 font-medium">Load Status</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">Fully Loaded</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-neutral-400 font-medium">Weather Conditions</span>
                <span className="font-semibold truncate ml-2">{ship.weather || 'Normal Maritime Conditions'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-neutral-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-colors"
            onClick={() => setShowContact(!showContact)}
          >
            {showContact ? 'Hide Contact Info' : 'Contact Port Authority'}
          </motion.button>
        </div>

        {showContact && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-slate-50 dark:bg-black/60 rounded-xl border border-slate-200 dark:border-neutral-800 text-xs space-y-1.5"
          >
            <div><span className="font-semibold text-slate-500 dark:text-neutral-400">Created By:</span> <strong className="text-slate-900 dark:text-white">{ship.createdBy}</strong></div>
            <div><span className="font-semibold text-slate-500 dark:text-neutral-400">Port Authority Phone:</span> <strong className="text-blue-600 dark:text-blue-400 font-mono">{ship.ContactdetailsOfPortAuthority || 'N/A'}</strong></div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ShipDetails;