import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import StatusOverview from './StatusOverview';
import AvailableShipments from './AvailableShipments';
import ShipDetails from './ShipDetails';
import ContractHistory from './ContractHistory';
import ProfileSettings from './ProfileSettings';
import axios from "axios";

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
      name: string;
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
  };
}

const SailorDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock sailor data - replace with API call


// State and effect for loading real data
const [sailorData, setSailorData] = useState<SailorData | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchSailorData = async () => {
    try {
      const token = localStorage.getItem("token"); // or however you store auth
      const response = await axios.get('http://localhost:3000/api/sailor/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSailorData(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch sailor dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSailorData();
}, []);


  const renderActiveSection = () => {
    if (loading) return <div className="text-center mt-10">Loading dashboard...</div>;
if (!sailorData) return <div className="text-center mt-10 text-red-500">Failed to load dashboard data.</div>;

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <StatusOverview sailorData={sailorData} />
            <AvailableShipments sailorData={sailorData} />
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
  <div className="min-h-screen bg-slate-50">
    {/* Render nothing until sailorData is loaded */}
    {!sailorData ? (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-500 text-lg animate-pulse">Loading dashboard...</p>
      </div>
    ) : (
      <>
        {/* Header */}
        <DashboardHeader 
          sailorData={{
            name: sailorData.name,
            email: sailorData.email,
            rating: sailorData.rating
          }}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex">
          {/* Sidebar */}
          <DashboardSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main Content */}
          <main className="flex-1 lg:ml-64 pt-16">
            <div className="p-6">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {renderActiveSection()}
              </motion.div>
            </div>
          </main>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </>
    )}
  </div>
);

};

export default SailorDashboard;