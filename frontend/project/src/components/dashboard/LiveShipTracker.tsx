import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  MapPin,
  Clock,
  Users,
  Package,
  Cloud,
  Eye,
  ChevronDown,
  ChevronUp,
  Navigation,
} from "lucide-react";
import LiveMap from "../../MapComponent.tsx";
import PortLocation from "../../portLocations.ts";
import socket from "../../socket.ts"; // path to your socket instance
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import portLocations from "../../portLocations.ts";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const createCustomIcon = (color: string, withPulse = false) =>
  L.divIcon({
    className: "custom-div-icon",
    html: `
      <div class="marker-wrapper">
        <div class="marker-dot ${color} ${withPulse ? "pulse" : ""}"></div>
      </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

const shipIcon = createCustomIcon("bg-red-500", true);
const sourceIcon = createCustomIcon("bg-blue-500", true);
const destinationIcon = createCustomIcon("bg-green-500", true);

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  experience: string;
  // Add other fields if needed
}

export interface Sailor {
  _id: string;
  user: User;
  // Add other sailor fields if needed
}

export interface CrewMember {
  _id: string;
  sailorId: Sailor;
}

interface ActiveShip {
  _id: string;
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
  weatherStatus: "Clear" | "Cloudy" | "Stormy" | "Foggy";
  crew: CrewMember[];
  progress: number;
}

interface LiveShipTrackerProps {
  ships: ActiveShip[];
}

const LiveShipTracker: React.FC<LiveShipTrackerProps> = ({ ships }) => {
  const [expandedShip, setExpandedShip] = useState<string | null>(null);

  // Mock data - replace with API call

  const getPortCoords = (portName: string) => {
    const port = PortLocation[portName];
    if (!port) {
      console.warn(`Port not found: ${portName}`);
      return { latitude: 0, longitude: 0 }; // fallback
    }

    return {
      latitude: parseFloat(port.latitude),
      longitude: parseFloat(port.longitude),
    };
  };

  const getWeatherColor = (weather: string) => {
    switch (weather) {
      case "Clear":
        return "text-emerald-600 bg-emerald-100";
      case "Cloudy":
        return "text-blue-600 bg-blue-100";
      case "Stormy":
        return "text-red-600 bg-red-100";
      case "Foggy":
        return "text-amber-600 bg-amber-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "Clear":
        return "☀️";
      case "Cloudy":
        return "☁️";
      case "Stormy":
        return "⛈️";
      case "Foggy":
        return "🌫️";
      default:
        return "🌤️";
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
            key={ship._id}
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
                    <h3 className="text-xl font-bold text-slate-800">
                      {ship.name}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {ship.number}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getWeatherColor(
                        ship.weatherStatus
                      )}`}
                    >
                      {getWeatherIcon(ship.weatherStatus)} {ship.weatherStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="text-xs text-slate-500">From</div>
                        <div className="text-sm font-medium text-slate-800">
                          {ship.source}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-slate-500">To</div>
                        <div className="text-sm font-medium text-slate-800">
                          {ship.destination}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="text-xs text-slate-500">ETA</div>
                        <div className="text-sm font-medium text-slate-800">
                          {new Date(ship.eta).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <div>
                        <div className="text-xs text-slate-500">Crew</div>
                        <div className="text-sm font-medium text-slate-800">
                          {ship.crewCount} members
                        </div>
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
                    <div className="text-sm text-slate-500">
                      Current Location
                    </div>
                    <div className="font-medium text-slate-800">
                      {ship.currentLocation.region}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {ship.currentLocation.lat.toFixed(4)}°,{" "}
                      {ship.currentLocation.lng.toFixed(4)}°
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedShip(
                        expandedShip === ship._id ? null : ship._id
                      )
                    }
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Details</span>
                    {expandedShip === ship._id ? (
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
              {expandedShip === ship._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
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
                            <span className="font-medium text-slate-800">
                              {ship.cargoType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">
                              Weather Status
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-sm ${getWeatherColor(
                                ship.weatherStatus
                              )}`}
                            >
                              {getWeatherIcon(ship.weatherStatus)}{" "}
                              {ship.weatherStatus}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">
                              Current Speed
                            </span>
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
                            <div
                              key={member._id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                            >
                              <div>
                                <div className="font-medium text-slate-800">
                                  {member.sailorId?.user?.firstName ??
                                    "Unknown"}{" "}
                                  {member.sailorId?.user?.lastName ?? ""}
                                </div>
                                <div className="text-sm text-slate-800"></div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-slate-500">
                                  Experience
                                </div>
                                <div className="text-sm font-medium text-slate-700">
                                  {member.sailorId?.user?.experience ?? "N/A"}
                                </div>
                              </div>
                            </div>
                          ))}

                          {ship.crew.length < ship.crewCount && (
                            <div className="text-center text-slate-500 text-sm py-2">
                              +{ship.crewCount - ship.crew.length} more crew
                              members
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Map Placeholder */}
                    {/* <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
> */}

                    <h3 className="text-xl font-semibold text-slate-800 mb-4 mt-6 flex items-center">
                      <Navigation className="w-6 h-6 mr-3 text-blue-500" />
                      Route Tracking
                    </h3>

                    {/* Leaflet Map Container */}
                    <div className="rounded-xl overflow-hidden border border-blue-100 shadow-inner">
                      {/* <LiveMap
  shipId={ship._id}
  sourceCoords={getPortCoords(ship.source || '')}
  destinationCoords={getPortCoords(ship.destination || '')}
/> */}

                      <MapContainer
                        center={[20, 0]} // Initial map center
                        zoom={2}
                        style={{ height: "500px", width: "100%" }}
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {ship.source && portLocations[ship.source] && (
                          <Marker
                            position={[
                              parseFloat(portLocations[ship.source].latitude),
                              parseFloat(portLocations[ship.source].longitude),
                            ]}
                            icon={sourceIcon} // you can create a green icon for source
                          />
                        )}

                        <Marker
                          key={ship._id}
                          position={[
                            ship.currentLocation.lat,
                            ship.currentLocation.lng,
                          ]}
                          icon={shipIcon}
                        ></Marker>
                        {ship.destination &&
                          portLocations[ship.destination] && (
                            <Marker
                              position={[
                                parseFloat(
                                  portLocations[ship.destination].latitude
                                ),
                                parseFloat(
                                  portLocations[ship.destination].longitude
                                ),
                              ]}
                              icon={destinationIcon} // you can create a red icon for destination
                            />
                          )}
                      </MapContainer>
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
                      <div className="text-emerald-600 font-medium">
                        Real-time tracking active
                      </div>
                    </div>
                    {/* </motion.div> */}
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
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            No active ships
          </h3>
          <p className="text-slate-500">
            All ships have reached their destinations
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default LiveShipTracker;
