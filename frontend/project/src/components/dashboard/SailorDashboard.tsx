import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import StatusOverview from './StatusOverview';
import AvailableShipments from './AvailableShipments';
import ShipDetails from './ShipDetails';
import ContractHistory from './ContractHistory';
import ProfileSettings from './ProfileSettings';

export type ActiveSection = 'dashboard' | 'contracts' | 'shipments' | 'profile';

interface SailorData {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  rating: number;
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
  const [sailorData] = useState<SailorData>({
    id: 'sailor_001',
    name: 'Captain James Rodriguez',
    email: 'james.rodriguez@websailor.com',
    phone: '+1 (555) 123-4567',
    experience: '8 years',
    rating: 4.8,
    completedContracts: 47,
    hasOngoingContract: true,
    currentContract: {
      id: 'contract_789',
      sourcePort: 'Port of Los Angeles',
      destinationPort: 'Port of Tokyo',
      shipName: 'Ocean Navigator',
      shipNumber: 'ON-2024-001',
      estimatedArrival: '8 hours 32 minutes',
      currentLocation: {
        lat: 35.6762,
        lng: 139.6503,
        name: 'Pacific Ocean - 120 nautical miles from Tokyo'
      },
      progress: 85,
      salary: 15000,
      startDate: '2024-01-15'
    },
    currentShip: {
      id: 'ship_001',
      name: 'Ocean Navigator',
      number: 'ON-2024-001',
      cargoType: 'Container Cargo',
      capacity: '14,000 TEU',
      departureTime: '2024-01-15 08:00',
      arrivalTime: '2024-01-28 14:30'
    }
  });

  const renderActiveSection = () => {
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
      {/* Header */}
      <DashboardHeader 
        sailorData={sailorData}
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
    </div>
  );
};

export default SailorDashboard;