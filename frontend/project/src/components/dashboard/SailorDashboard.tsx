import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import StatusOverview from './StatusOverview';
import AvailableShipments from './AvailableShipments';
import ShipDetails from './ShipDetails';
import ContractHistory from './ContractHistory';
import ProfileSettings from './ProfileSettings';
import axios from 'axios';
import socket from '../../socket.ts';

export type ActiveSection = 'dashboard' | 'contracts' | 'shipments' | 'profile';

interface SailorData {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  rating: number;
  location: string;
  completedContracts: number;
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
  currentShip?: {
    id: string;
    name: string;
    number: string;
    cargoType: string;
    capacity: string;
    departureTime: string;
    arrivalTime: string;
    weather: string;
    createdBy: string;
    ContactdetailsOfPortAuthority: string;
  };
}

const SailorDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sailorData, setSailorData] = useState<SailorData | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSailorData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/sailor/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSailorData(response.data);
      } catch (error) {
        console.error('❌ Failed to fetch sailor dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSailorData();
  }, []);

  useEffect(() => {
    if (sailorData?.currentShip?.id) {
      const watchId = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('sailorLocationUpdate', {
          shipId: sailorData.currentShip!.id,
          latitude,
          longitude,
        });
      });

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [sailorData]);

  const renderActiveSection = () => {
    if (loading) return <div className="text-center mt-10">Loading dashboard...</div>;
    if (!sailorData) return <div className="text-center mt-10 text-red-500">Failed to load dashboard data.</div>;

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <StatusOverview sailorData={sailorData} />
            <AvailableShipments sailorData={sailorData} limit={2} />
            {sailorData.currentShip && <ShipDetails ship={sailorData.currentShip} />}
          </div>
        );
      case 'contracts':
        return <ContractHistory sailorId={sailorData.id} />;
      case 'shipments':
        return <AvailableShipments sailorData={sailorData} />;
      case 'profile':
        return <ProfileSettings sailorData={sailorData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-300 relative overflow-x-hidden">
      {/* Background Radar & Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {!sailorData ? (
        <div className="flex items-center justify-center h-screen relative z-10">
          <p className="text-slate-500 dark:text-neutral-400 text-lg animate-pulse font-medium">Loading sailor dashboard...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <DashboardHeader
            sailorData={{
              name: sailorData.name,
              email: sailorData.email,
              rating: sailorData.rating,
            }}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className="flex relative z-10">
            {/* Sidebar */}
            <DashboardSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Main Content */}
            <main
              className={`flex-1 min-w-0 w-full ${
                isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
              } pt-16 transition-all duration-300`}
            >
              <div className="p-3 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {renderActiveSection()}
                </motion.div>
              </div>
            </main>
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SailorDashboard;