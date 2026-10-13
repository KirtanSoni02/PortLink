import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, MapPin, Clock, Users, Package, Eye, ChevronDown, ChevronUp, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import portLocations from '../../portLocations.ts';
import socket from '../../socket.ts';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const createCustomIcon = (color: string, withPulse = false) =>
  L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="marker-wrapper">
        <div class="marker-dot ${color} ${withPulse ? 'pulse' : ''}"></div>
      </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

const shipIcon = createCustomIcon('bg-red-500', true);
const sourceIcon = createCustomIcon('bg-blue-500', true);
const destinationIcon = createCustomIcon('bg-green-500', true);

interface CrewMember {
  id: string;
  name: string;
  role: string;
  experience: string;
}

interface ActiveShip {
  id: string;
  _id?: string;
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
  currentspeed?: number;
}

interface IncomingShipTrackerProps {
  ships: ActiveShip[];
}

const IncomingShipTracker: React.FC<IncomingShipTrackerProps> = ({ ships }) => {
  const [liveShips, setLiveShips] = useState<ActiveShip[]>(ships);
  const [expandedShip, setExpandedShip] = useState<string | null>(null);

  useEffect(() => {
    setLiveShips(ships);
  }, [ships]);

  useEffect(() => {
    const handleLocationUpdate = (data: any) => {
      if (!data || !data.shipId) return;
      setLiveShips((prev) =>
        prev.map((s) => {
          const shipId = s.id || s._id;
          if (shipId === data.shipId) {
            return {
              ...s,
              currentLocation: {
                lat: data.latitude,
                lng: data.longitude,
                region: s.currentLocation?.region || 'At Sea',
              },
              currentspeed: data.speed ?? s.currentspeed,
            };
          }
          return s;
        })
      );
    };

    socket.on('shipLocationUpdate', handleLocationUpdate);
    return () => {
      socket.off('shipLocationUpdate', handleLocationUpdate);
    };
  }, []);

  const getWeatherColor = (weather: string) => {
    switch (weather) {
      case 'Clear': return 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/50';
      case 'Cloudy': return 'text-sky-700 bg-sky-100 dark:bg-sky-950/60 dark:text-sky-400 dark:border dark:border-sky-800/50';
      case 'Stormy': return 'text-rose-700 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 dark:border dark:border-rose-800/50';
      case 'Foggy': return 'text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400 dark:border dark:border-amber-800/50';
      default: return 'text-slate-700 bg-slate-100 dark:bg-neutral-800 dark:text-neutral-300';
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors duration-300 min-w-0"
    >
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center min-w-0">
          <Ship className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-sky-500 dark:text-sky-400 shrink-0" />
          Incoming Ship Tracker
        </h2>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2 sm:px-3 py-1 rounded-full shrink-0">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="hidden sm:inline text-xs font-semibold text-emerald-700 dark:text-emerald-400">Incoming Tracking</span>
        </div>
      </div>

      <div className="space-y-4">
        {liveShips.map((ship, index) => (
          <motion.div
            key={ship.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 min-w-0"
          >
            {/* Ship Header */}
            <div className="p-4 sm:p-6 bg-slate-50/70 dark:bg-neutral-900/60">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-none" title={ship.name}>{ship.name}</h3>
                    <span className="px-2.5 py-0.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold shrink-0">
                      {ship.number}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${getWeatherColor(ship.weatherStatus)}`}>
                      {getWeatherIcon(ship.weatherStatus)} {ship.weatherStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-none" title={ship.source}>{ship.source}</span>
                    <span className="text-slate-400 shrink-0">→</span>
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-none" title={ship.destination}>{ship.destination}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-neutral-800">
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] text-slate-500 dark:text-neutral-400">ETA</div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white whitespace-nowrap">
                      {new Date(ship.eta).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedShip(expandedShip === ship.id ? null : ship.id)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 text-white dark:bg-white dark:text-black font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors text-xs shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                    {expandedShip === ship.id ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
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
                  className="border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Ship Details */}
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                          <Package className="w-4 h-4 mr-2 text-sky-500" />
                          Ship Details
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-neutral-800">
                            <span className="text-slate-500 dark:text-neutral-400">Cargo Type</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{ship.cargoType}</span>
                          </div>
                          <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-neutral-800">
                            <span className="text-slate-500 dark:text-neutral-400">Weather Status</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${getWeatherColor(ship.weatherStatus)}`}>
                              {getWeatherIcon(ship.weatherStatus)} {ship.weatherStatus}
                            </span>
                          </div>
                          <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-neutral-800">
                            <span className="text-slate-500 dark:text-neutral-400">ETA</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {new Date(ship.eta).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                            </span>
                          </div>
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-neutral-300">
                              <span>Journey Progress</span>
                              <span>{ship.progress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-neutral-800 rounded-full h-2">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${ship.progress}%` }} className="bg-slate-900 dark:bg-white h-2 rounded-full" />
                            </div>
                          </div>
                          <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-neutral-800">
                            <span className="text-slate-500 dark:text-neutral-400">Current Speed</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {(ship.currentspeed ?? 20).toFixed(1)} knots
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-neutral-400">Last Update</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {new Date().toLocaleTimeString()} (Live)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Crew List */}
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-purple-500" />
                          Crew Members ({ship.crewCount})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {ship.crew.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-neutral-800/60 rounded-lg text-sm border border-slate-100 dark:border-neutral-800">
                              <div>
                                <div className="font-semibold text-slate-900 dark:text-white">{member.name}</div>
                                <div className="text-xs text-slate-500 dark:text-neutral-400">{member.role}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-slate-500 dark:text-neutral-400">Experience</div>
                                <div className="text-xs font-semibold text-slate-700 dark:text-neutral-300">{member.experience}</div>
                              </div>
                            </div>
                          ))}
                          {ship.crew.length < ship.crewCount && (
                            <div className="text-center text-slate-500 dark:text-neutral-400 text-xs py-2">
                              +{ship.crewCount - ship.crew.length} more crew members
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 mt-6 flex items-center">
                      <Navigation className="w-4 h-4 mr-2 text-sky-500" />
                      Route Tracking Map
                    </h3>

                    {/* Leaflet Map Container */}
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-800 shadow-inner">
                      <MapContainer
                        center={[20, 0]}
                        zoom={2}
                        style={{ height: '400px', width: '100%' }}
                      >
                        <TileLayer
                          attribution='&copy; OpenStreetMap contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {ship.source && portLocations[ship.source] && (
                          <Marker
                            position={[
                              parseFloat(portLocations[ship.source].latitude),
                              parseFloat(portLocations[ship.source].longitude)
                            ]}
                            icon={sourceIcon}
                          />
                        )}

                        <Marker
                          key={ship.id}
                          position={[ship.currentLocation.lat, ship.currentLocation.lng]}
                          icon={shipIcon}
                        />
                        {ship.destination && portLocations[ship.destination] && (
                          <Marker
                            position={[
                              parseFloat(portLocations[ship.destination].latitude),
                              parseFloat(portLocations[ship.destination].longitude)
                            ]}
                            icon={destinationIcon}
                          />
                        )}
                      </MapContainer>
                    </div>

                    {/* Legend and Status */}
                    <div className="flex flex-wrap justify-between items-center mt-3 text-xs text-slate-600 dark:text-neutral-400 gap-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                          <span>Source</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
                          <span>Live Position</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                          <span>Destination</span>
                        </div>
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">Real-time tracking active</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {liveShips.length === 0 && (
        <div className="text-center py-12">
          <Ship className="w-12 h-12 text-slate-400 dark:text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-neutral-300 mb-1">No active ships</h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">All ships have reached their destinations</p>
        </div>
      )}
    </motion.div>
  );
};

export default IncomingShipTracker;