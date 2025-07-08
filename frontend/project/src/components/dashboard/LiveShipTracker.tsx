import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, MapPin, Clock, Users, Package, Cloud, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface CrewMember {
  id: string;
  name: string;
  role: string;
  experience: string;
}

interface ActiveShip {
  id: string;
  name: string;
  number: string;
  currentLocation: {
    lat: number;
    lng: number;
    region: string;
  };
  source: string;
  destination: string;
  eta: string;
  crewCount: number;
  cargoType: string;
  weatherStatus: 'Clear' | 'Cloudy' | 'Stormy' | 'Foggy';
  crew: CrewMember[];
  progress: number;
}

const LiveShipTracker: React.FC = () => {
  const [ships, setShips] = useState<ActiveShip[]>([]);
  const [expandedShip, setExpandedShip] = useState<string | null>(null);

  // Mock data - replace with API call
  useEffect(() => {
    const mockShips: ActiveShip[] = [
      {
        id: 'ship_001',
        name: 'Ocean Navigator',
        number: 'ON-2024-001',
        currentLocation: {
          lat: 35.6762,
          lng: 139.6503,
          region: 'Pacific Ocean - 120 nautical miles from Tokyo'
        },
        source: 'Port of Los Angeles',
        destination: 'Port of Tokyo',
        eta: '8 hours 32 minutes',
        crewCount: 12,
        cargoType: 'Container Cargo',
        weatherStatus: 'Clear',
        progress: 85,
        crew: [
          { id: 'crew_001', name: 'Captain James Rodriguez', role: 'Captain', experience: '8 years' },
          { id: 'crew_002', name: 'Sarah Chen', role: 'First Officer', experience: '5 years' },
          { id: 'crew_003', name: 'Miguel Santos', role: 'Engineer', experience: '6 years' },
          { id: 'crew_004', name: 'Anna Kowalski', role: 'Navigator', experience: '4 years' }
        ]
      },
      {
        id: 'ship_002',
        name: 'Atlantic Star',
        number: 'AS-2024-002',
        currentLocation: {
          lat: 40.7128,
          lng: -30.0000,
          region: 'North Atlantic - 800 nautical miles from Barcelona'
        },
        source: 'Port of Miami',
        destination: 'Port of Barcelona',
        eta: '2 days 14 hours',
        crewCount: 8,
        cargoType: 'General Cargo',
        weatherStatus: 'Cloudy',
        progress: 45,
        crew: [
          { id: 'crew_005', name: 'Captain Elena Vasquez', role: 'Captain', experience: '12 years' },
          { id: 'crew_006', name: 'Tom Wilson', role: 'First Officer', experience: '7 years' },
          { id: 'crew_007', name: 'Liu Wei', role: 'Engineer', experience: '5 years' }
        ]
      },
      {
        id: 'ship_003',
        name: 'Nordic Wind',
        number: 'NW-2024-003',
        currentLocation: {
          lat: 60.1699,
          lng: 24.9384,
          region: 'Baltic Sea - Approaching Helsinki'
        },
        source: 'Port of Rotterdam',
        destination: 'Port of Helsinki',
        eta: '4 hours 15 minutes',
        crewCount: 6,
        cargoType: 'Bulk Cargo',
        weatherStatus: 'Foggy',
        progress: 92,
        crew: [
          { id: 'crew_008', name: 'Captain Lars Andersen', role: 'Captain', experience: '15 years' },
          { id: 'crew_009', name: 'Ingrid Larsson', role: 'First Officer', experience: '8 years' }
        ]
      }
    ];
    setShips(mockShips);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setShips(prevShips => 
        prevShips.map(ship => ({
          ...ship,
          currentLocation: {
            ...ship.currentLocation,
            lat: ship.currentLocation.lat + (Math.random() - 0.5) * 0.01,
            lng: ship.currentLocation.lng + (Math.random() - 0.5) * 0.01
          },
          progress: Math.min(ship.progress + Math.random() * 0.5, 100)
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherColor = (weather: string) => {
    switch (weather) {
      case 'Clear': return 'text-emerald-600 bg-emerald-100';
      case 'Cloudy': return 'text-blue-600 bg-blue-100';
      case 'Stormy': return 'text-red-600 bg-red-100';
      case 'Foggy': return 'text-amber-600 bg-amber-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'Clear': return '☀️';
      case 'Cloudy': return '☁️';
      case 'Stormy': return '⛈️';
      case 'Foggy': return '🌫️';
      default: return '🌤️';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Ship className="w-7 h-7 mr-3 text-blue-500" />
          Live Ship Tracker
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-600">Live Tracking</span>
        </div>
      </div>

      <div className="space-y-4">
        {ships.map((ship, index) => (
          <motion.div
            key={ship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Ship Header */}
            <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-slate-800">{ship.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {ship.number}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getWeatherColor(ship.weatherStatus)}`}>
                      {getWeatherIcon(ship.weatherStatus)} {ship.weatherStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="text-xs text-slate-500">From</div>
                        <div className="text-sm font-medium text-slate-800">{ship.source}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-slate-500">To</div>
                        <div className="text-sm font-medium text-slate-800">{ship.destination}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="text-xs text-slate-500">ETA</div>
                        <div className="text-sm font-medium text-slate-800">{ship.eta}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <div>
                        <div className="text-xs text-slate-500">Crew</div>
                        <div className="text-sm font-medium text-slate-800">{ship.crewCount} members</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span>Journey Progress</span>
                      <span>{ship.progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${ship.progress}%` }}
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Current Location</div>
                    <div className="font-medium text-slate-800">{ship.currentLocation.region}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {ship.currentLocation.lat.toFixed(4)}°, {ship.currentLocation.lng.toFixed(4)}°
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setExpandedShip(expandedShip === ship.id ? null : ship.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Details</span>
                    {expandedShip === ship.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedShip === ship.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-slate-200"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Ship Details */}
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <Package className="w-5 h-5 mr-2 text-blue-500" />
                          Ship Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Cargo Type</span>
                            <span className="font-medium text-slate-800">{ship.cargoType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Weather Status</span>
                            <span className={`px-2 py-1 rounded text-sm ${getWeatherColor(ship.weatherStatus)}`}>
                              {getWeatherIcon(ship.weatherStatus)} {ship.weatherStatus}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Current Speed</span>
                            <span className="font-medium text-slate-800">
                              {(Math.random() * 10 + 15).toFixed(1)} knots
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Last Update</span>
                            <span className="font-medium text-emerald-600">
                              {new Date().toLocaleTimeString()} (Live)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Crew List */}
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-purple-500" />
                          Crew Members ({ship.crewCount})
                        </h4>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {ship.crew.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div>
                                <div className="font-medium text-slate-800">{member.name}</div>
                                <div className="text-sm text-slate-600">{member.role}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-slate-500">Experience</div>
                                <div className="text-sm font-medium text-slate-700">{member.experience}</div>
                              </div>
                            </div>
                          ))}
                          {ship.crew.length < ship.crewCount && (
                            <div className="text-center text-slate-500 text-sm py-2">
                              +{ship.crewCount - ship.crew.length} more crew members
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-emerald-500" />
                        Current Position
                      </h4>
                      <div className="relative bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl h-64 overflow-hidden">
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

                        {/* Ship Position */}
                        <motion.div
                          animate={{
                            x: [200, 220, 200],
                            y: [100, 120, 100]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute"
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

                        {/* Route Path */}
                        <svg className="absolute inset-0 w-full h-full">
                          <motion.path
                            d="M50,200 Q200,100 350,150 Q500,120 650,100"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="8,4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: ship.progress / 100 }}
                            transition={{ duration: 2 }}
                          />
                        </svg>

                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                          <div className="text-sm font-medium text-slate-800">{ship.currentLocation.region}</div>
                          <div className="text-xs text-slate-600">
                            {ship.currentLocation.lat.toFixed(4)}°, {ship.currentLocation.lng.toFixed(4)}°
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {ships.length === 0 && (
        <div className="text-center py-12">
          <Ship className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No active ships</h3>
          <p className="text-slate-500">All ships have reached their destinations</p>
        </div>
      )}
    </motion.div>
  );
};

export default LiveShipTracker;