import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import { MapPin, Navigation, Compass, Wind, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { formatShipName } from '../utils/formatters';

const createVesselIcon = (status: string, heading = 0, isSelected = false) => {
  let color = '#10B981'; // emerald for sailing
  let glowColor = 'rgba(16, 185, 129, 0.4)';

  if (status === 'docked') {
    color = '#0284C7'; // sky for docked
    glowColor = 'rgba(2, 132, 199, 0.4)';
  } else if (status === 'anchored') {
    color = '#64748B'; // slate for anchored
    glowColor = 'rgba(100, 116, 139, 0.4)';
  }

  const svgContent = `
    <div style="transform: rotate(${heading}deg); transition: transform 0.5s ease; width: 28px; height: 28px;" class="flex items-center justify-center">
      <div style="background-color: ${glowColor}; box-shadow: ${isSelected ? `0 0 12px 3px ${color}` : `0 0 6px ${color}`};" class="rounded-full p-1 border border-white/80">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L19 21L12 17L5 21L12 2Z" fill="${color}" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'vessel-marker-icon',
    html: svgContent,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

interface VesselData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'sailing' | 'docked' | 'anchored';
  speed: number;
  heading: number;
  destination: string;
  eta: string;
  flag: string;
  vesselType: string;
  weather?: string;
}

const initialVessels: VesselData[] = [
  {
    id: 'v-101',
    name: 'MV Ocean Titan',
    lat: 18.9667,
    lng: 72.8333,
    status: 'sailing',
    speed: 18.4,
    heading: 145,
    destination: 'Port of Colombo',
    eta: '14 Hours',
    flag: '🇮🇳 India',
    vesselType: 'Container Ship',
    weather: 'Wind: 12 kts WNW | Waves: 1.1m'
  },
  {
    id: 'v-102',
    name: 'Ever Maritime',
    lat: 22.8420,
    lng: 69.7042,
    status: 'docked',
    speed: 0,
    heading: 90,
    destination: 'Port of Mundra',
    eta: 'Docked (Berth 4)',
    flag: '🇸🇬 Singapore',
    vesselType: 'Bulk Carrier',
    weather: 'Wind: 8 kts N | Calm Waters'
  },
  {
    id: 'v-103',
    name: 'Sea Empress III',
    lat: 13.0827,
    lng: 80.2707,
    status: 'anchored',
    speed: 0.5,
    heading: 210,
    destination: 'Port of Chennai',
    eta: 'Awaiting Berth',
    flag: '🇱🇷 Liberia',
    vesselType: 'Oil Tanker',
    weather: 'Wind: 15 kts E | Waves: 1.5m'
  },
  {
    id: 'v-104',
    name: 'APL Navigator',
    lat: 9.9667,
    lng: 76.2833,
    status: 'sailing',
    speed: 16.2,
    heading: 320,
    destination: 'Port of Cochin',
    eta: '3 Hours',
    flag: '🇵🇦 Panama',
    vesselType: 'Container Vessel',
    weather: 'Wind: 10 kts SW | Waves: 0.9m'
  },
  {
    id: 'v-105',
    name: 'Pacific Voyager',
    lat: 17.6943,
    lng: 83.2186,
    status: 'sailing',
    speed: 14.8,
    heading: 45,
    destination: 'Port of Visakhapatnam',
    eta: '6 Hours',
    flag: '🇲🇭 Marshall Is.',
    vesselType: 'LNG Tanker',
    weather: 'Wind: 11 kts SE | Waves: 1.0m'
  }
];

const MapViewController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.0 });
  }, [center, zoom, map]);
  return null;
};

const RealTimeTracking: React.FC = () => {
  const [vessels, setVessels] = useState<VesselData[]>(initialVessels);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchVesselData = async () => {
    const targetUrl = API_URL || 'http://localhost:5000';
    setIsUpdating(true);
    try {
      const response = await axios.get(`${targetUrl}/api/ship/realtimetracking`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const formatted = response.data.map((v: any) => ({
          ...v,
          name: formatShipName(v.name, v.source, v.destination),
        }));
        setVessels(formatted);
      }
    } catch (error) {
      console.warn("Could not fetch live telemetry from server, using active dataset.", error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchVesselData();
    const interval = setInterval(() => {
      setVessels(prev =>
        prev.map(v => {
          if (v.status === 'sailing') {
            const latDelta = (Math.random() - 0.5) * 0.006;
            const lngDelta = (Math.random() - 0.5) * 0.006;
            return {
              ...v,
              lat: v.lat + latDelta,
              lng: v.lng + lngDelta,
              speed: Math.max(8, Number((v.speed + (Math.random() - 0.5) * 0.3).toFixed(1)))
            };
          }
          return v;
        })
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const filteredVessels = vessels.filter(
    v => filterStatus === 'all' || v.status === filterStatus
  );

  const activeVessel = vessels[selectedIndex] || vessels[0];

  return (
    <section id="tracking" className="py-10 md:py-16 bg-slate-50 dark:bg-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 text-slate-800 dark:text-neutral-300 text-xs font-medium mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live AIS Tracking</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Real-Time Vessel Telemetry
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 max-w-lg mx-auto text-xs sm:text-sm mt-1">
            Monitor active vessel locations, speeds, destinations, and weather status live.
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Fleet Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col h-[280px] sm:h-[340px] md:h-[480px] shadow-sm"
          >
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-neutral-800 mb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-slate-900 dark:text-white" /> Active Fleet
              </h3>

              <button
                onClick={fetchVesselData}
                className="p-1.5 rounded bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin text-slate-900 dark:text-white' : ''}`} />
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-black p-1 rounded-lg mb-3 text-[11px] font-medium border border-slate-200 dark:border-neutral-800">
              {['all', 'sailing', 'docked', 'anchored'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`py-1 capitalize rounded transition-colors ${
                    filterStatus === st
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Vessel Cards */}
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {filteredVessels.map((vessel) => {
                const globalIndex = vessels.findIndex(v => v.id === vessel.id);
                const isSelected = globalIndex === selectedIndex;

                return (
                  <div
                    key={vessel.id}
                    onClick={() => setSelectedIndex(globalIndex)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-100 border-slate-400 dark:bg-neutral-800 dark:border-white text-slate-900 dark:text-white shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-black/60 dark:border-neutral-800 dark:hover:border-neutral-700 text-slate-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          vessel.status === 'sailing' ? 'bg-emerald-500' :
                          vessel.status === 'docked' ? 'bg-sky-500' : 'bg-slate-400'
                        }`} />
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">{vessel.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-neutral-400 capitalize">{vessel.status}</span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-600 dark:text-neutral-400">
                      <span className="truncate max-w-[130px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 dark:text-neutral-400 shrink-0" /> {vessel.destination}
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white font-semibold">{vessel.speed} kts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Map Canvas */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-8 relative bg-slate-200 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 rounded-xl overflow-hidden shadow-md h-[360px] sm:h-[420px] md:h-[480px]"
          >
            {/* Map Status Header */}
            <div className="absolute top-3 left-3 z-20 bg-white/95 dark:bg-black/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-800 flex items-center space-x-2 text-[11px] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-slate-900 dark:text-white">Live AIS Feed</span>
              <span className="text-slate-400 dark:text-neutral-700">|</span>
              <span className="text-slate-600 dark:text-neutral-400 flex items-center gap-1 font-mono">
                <Compass className="w-3 h-3 text-slate-500 dark:text-neutral-400" /> {activeVessel.lat.toFixed(2)}°, {activeVessel.lng.toFixed(2)}°
              </span>
            </div>

            {/* Selected Telemetry Card */}
            <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:w-72 z-20 bg-white/95 dark:bg-black/95 p-3 rounded-lg border border-slate-200 dark:border-neutral-800 shadow-xl text-xs space-y-1.5">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-neutral-800 pb-1.5">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{activeVessel.name}</h4>
                  <p className="text-slate-500 dark:text-neutral-400 text-[10px]">{activeVessel.flag} • {activeVessel.vesselType}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold capitalize bg-slate-100 text-slate-900 border border-slate-300 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
                  {activeVessel.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-neutral-300 pt-0.5 text-[11px]">
                <div>
                  <span className="text-slate-500 dark:text-neutral-500 text-[10px] block">Speed</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{activeVessel.speed} Knots</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-neutral-500 text-[10px] block">Destination</span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate block">{activeVessel.destination}</span>
                </div>
              </div>

              {activeVessel.weather && (
                <div className="pt-1.5 border-t border-slate-200 dark:border-neutral-800 flex items-center text-slate-700 dark:text-neutral-300 gap-1 text-[10px]">
                  <Wind className="w-3 h-3 text-slate-500 dark:text-neutral-400 shrink-0" />
                  <span className="truncate">{activeVessel.weather}</span>
                </div>
              )}
            </div>

            {/* Map Component */}
            <MapContainer
              center={[activeVessel.lat, activeVessel.lng]}
              zoom={5}
              zoomControl={false}
              style={{ height: '100%', width: '100%' }}
            >
              <MapViewController center={[activeVessel.lat, activeVessel.lng]} zoom={5} />

              <TileLayer
                attribution='&copy; CARTO'
                url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${import.meta.env.VITE_CARTO_API_KEY || ''}`}
                maxZoom={19}
              />

              {vessels.map((vessel, idx) => (
                <Marker
                  key={vessel.id}
                  position={[vessel.lat, vessel.lng]}
                  icon={createVesselIcon(vessel.status, vessel.heading, idx === selectedIndex)}
                  eventHandlers={{
                    click: () => setSelectedIndex(idx)
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans text-xs">
                      <div className="font-bold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-neutral-700 pb-1 mb-1">
                        {vessel.name}
                      </div>
                      <div className="text-slate-700 dark:text-neutral-300 space-y-0.5 text-[11px]">
                        <div><strong>Status:</strong> {vessel.status}</div>
                        <div><strong>Speed:</strong> {vessel.speed} kts</div>
                        <div><strong>Destination:</strong> {vessel.destination}</div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default RealTimeTracking;