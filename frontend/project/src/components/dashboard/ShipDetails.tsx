import React from 'react';
import { motion } from 'framer-motion';
import { Ship, Package, Calendar, Clock, Anchor, Navigation } from 'lucide-react';
import { useState } from 'react';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <Ship className="w-7 h-7 mr-3 text-blue-500" />
        Current Ship Details
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ship Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Anchor className="w-5 h-5 mr-2 text-blue-500" />
              Vessel Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Ship Name</span>
                <span className="font-semibold text-slate-800">{ship.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Registration Number</span>
                <span className="font-semibold text-slate-800">{ship.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Cargo Type</span>
                <span className="font-semibold text-slate-800">{ship.cargoType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Capacity</span>
                <span className="font-semibold text-slate-800">{ship.capacity}</span>
              </div>
            </div>
          </div>

          {/* Ship Status */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Navigation className="w-5 h-5 mr-2 text-emerald-500" />
              Current Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-700 font-medium">En Route</span>
              </div>
              <div className="text-sm text-slate-600">
                Vessel is currently sailing towards destination port
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-amber-500" />
              Schedule
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Departure</div>
                  <div className="font-semibold text-slate-800">
                    {new Date(ship.departureTime).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="ml-4 border-l-2 border-dashed border-slate-300 h-8"></div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Anchor className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Expected Arrival</div>
                  <div className="font-semibold text-slate-800">
                    {new Date(ship.arrivalTime).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Information */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-purple-500" />
              Cargo Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Type</span>
                <span className="font-semibold text-slate-800">{ship.cargoType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Capacity</span>
                <span className="font-semibold text-slate-800">{ship.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Load Status</span>
                <span className="text-emerald-600 font-medium">Fully Loaded</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">Weather</span>
                <span className="font-semibold text-slate-800">{ship.weather|| 'N/A'}</span>
               </div>
            </div>
          </div>

         


        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            onClick={() => setShowContact(!showContact)}
          >
            Contact Port Authority
          </motion.button>
    
        </div>
        {showContact && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 text-slate-800">
            <div><span className="font-semibold">Created By:</span> {ship.createdBy}</div>
            <div><span className="font-semibold">Port Authority Phone:</span> {ship.ContactdetailsOfPortAuthority}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ShipDetails;