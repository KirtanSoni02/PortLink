import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Ship, Clock, Activity } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

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

const shipIcon = createCustomIcon('bg-blue-500', true);
// Custom Ship Icon
// const shipIcon = new L.Icon({
//   iconUrl: '/ship-icon.png', // Put ship icon in public folder
//   iconSize: [30, 30],
//   iconAnchor: [15, 15],
//   popupAnchor: [0, -15],
// });


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
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchVesselData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/ship/realtimetracking`);
        console.log('Fetched vessel data:', response.data);
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
            <div className="relative bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl h-80 overflow-hidden z-0">
              <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="container mx-auto px-4">

                  {/* <h2 className="text-4xl font-bold text-center mb-8">Real-Time Maritime Tracking</h2> */}

                  {/* Leaflet Map */}
                  <MapContainer
                    center={[20, 0]} // Initial map center
                    zoom={2}
                    style={{ height: '500px', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {vessels.map(vessel => (
                      <Marker
                        key={vessel.id}
                        position={[vessel.lat, vessel.lng]}
                        icon={shipIcon}
                      >
                        <Popup>
                          <strong>{vessel.name}</strong><br />
                          Status: {vessel.status}<br />
                          Speed: {vessel.speed} knots
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </section>
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

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
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
                        <div className={`w-3 h-3 rounded-full ${vessel.status === 'sailing' ? 'bg-emerald-500' :
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RealTimeTracking;