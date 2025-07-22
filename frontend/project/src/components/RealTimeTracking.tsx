import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Ship, Clock, Activity } from 'lucide-react';
import axios from 'axios';

interface VesselData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: string;
  speed: number;
}

const RealTimeTracking: React.FC = () => {
  const [vessels, setVessels] = useState<VesselData[]>([
    { id: '1', name: 'Ocean Explorer', lat: 40.7128, lng: -74.0060, status: 'sailing', speed: 12.5 },
    { id: '2', name: 'Maritime Star', lat: 34.0522, lng: -118.2437, status: 'docked', speed: 0 },
    { id: '3', name: 'Sea Navigator', lat: 51.5074, lng: -0.1278, status: 'anchored', speed: 0 },
    { id: '4', name: 'Port Runner', lat: 35.6762, lng: 139.6503, status: 'sailing', speed: 8.3 },
  ]);

  const [activeVessel, setActiveVessel] = useState(0);

  useEffect(() => {
  const fetchVesselData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/ship/realtimetracking');
      if (Array.isArray(response.data)) {
        setVessels(response.data);
      } else {
        console.warn("Expected an array of vessels, got:", response.data);
      }
    } catch (error) {
      console.error('Failed to fetch vessel data:', error);
    }
  };

  fetchVesselData();
  
  const interval = setInterval(() => {
    fetchVesselData();
    setActiveVessel(prev => (prev + 1) % Math.max(1, vessels.length));
  }, 10000);

  return () => clearInterval(interval);
}, [vessels.length]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sailing': return 'text-emerald-500';
      case 'docked': return 'text-blue-500';
      case 'anchored': return 'text-amber-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'sailing': return 'bg-emerald-500/20';
      case 'docked': return 'bg-blue-500/20';
      case 'anchored': return 'bg-amber-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Real-Time Maritime Tracking
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Monitor vessel movements, port activities, and maritime operations in real-time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Live Map Simulation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Live Vessel Tracking</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600">Live</span>
              </div>
            </div>

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

              {/* Vessel Markers */}
              {vessels.map((vessel, index) => (
                <motion.div
                  key={vessel.id}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: activeVessel === index ? 1.2 : 1,
                    x: (vessel.lng + 180) * 2,
                    y: (90 - vessel.lat) * 2
                  }}
                  transition={{ duration: 0.5 }}
                  className={`absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                    activeVessel === index ? 'z-10' : 'z-5'
                  } ${getStatusBg(vessel.status)} border-2 ${
                    activeVessel === index ? 'border-white shadow-lg' : 'border-white/50'
                  }`}
                  style={{
                    left: `${Math.min(Math.max((vessel.lng + 180) / 360 * 100, 5), 90)}%`,
                    top: `${Math.min(Math.max((90 - vessel.lat) / 180 * 100, 5), 90)}%`
                  }}
                >
                  <Ship className={`w-4 h-4 ${getStatusColor(vessel.status)}`} />
                  
                  {/* Pulse Animation for Active Vessel */}
                  {activeVessel === index && (
                    <motion.div
                      animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-sky-400/30"
                    />
                  )}
                </motion.div>
              ))}

              {/* Route Lines */}
              <svg className="absolute inset-0 w-full h-full">
                <motion.path
                  d="M50,200 Q150,100 250,150 T350,120"
                  stroke="rgba(59, 130, 246, 0.4)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </svg>
            </div>
          </motion.div>

          {/* Vessel Information Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Active Vessels</h3>
              
              <div className="space-y-4">
                {vessels.map((vessel, index) => (
                  <motion.div
                    key={vessel.id}
                    animate={{
                      scale: activeVessel === index ? 1.02 : 1,
                      backgroundColor: activeVessel === index ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                    }}
                    className="p-4 rounded-xl border border-slate-200 cursor-pointer transition-all duration-300"
                    onClick={() => setActiveVessel(index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          vessel.status === 'sailing' ? 'bg-emerald-500' :
                          vessel.status === 'docked' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}></div>
                        <span className="font-semibold text-slate-800">{vessel.name}</span>
                      </div>
                      <span className={`text-sm font-medium capitalize ${getStatusColor(vessel.status)}`}>
                        {vessel.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{vessel.lat.toFixed(4)}, {vessel.lng.toFixed(4)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4" />
                        <span>{vessel.speed.toFixed(1)} knots</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Real-time Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8" />
                  <motion.span
                    key={vessels.filter(v => v.status === 'sailing').length}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold"
                  >
                    {vessels.filter(v => v.status === 'sailing').length}
                  </motion.span>
                </div>
                <p className="text-emerald-100">Vessels Sailing</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <MapPin className="w-8 h-8" />
                  <motion.span
                    key={vessels.filter(v => v.status === 'docked').length}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold"
                  >
                    {vessels.filter(v => v.status === 'docked').length}
                  </motion.span>
                </div>
                <p className="text-blue-100">Vessels Docked</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RealTimeTracking;