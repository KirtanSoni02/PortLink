import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PortDashboardHeader from './PortDashboardHeader';
import PortDashboardSidebar from './PortDashboardSidebar';
import PortDashboardOverview from './PortDashboardOverview';
import LiveShipTracker from './LiveShipTracker';
import JobPostingForm from './JobPostingForm';
import JobPostsManagement from './JobPostsManagement';
import CompletedContracts from './CompletedContracts';
import PortProfileSettings from './PortProfileSettings';

export type PortActiveSection = 'dashboard' | 'create-job' | 'active-shipments' | 'completed-contracts' | 'profile';

interface PortAuthorityData {
  id: string;
  name: string;
  email: string;
  portName: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  totalShipsInTransit: number;
  totalContractsCompleted: number;
  activeJobPosts: number;
  registeredSailors: number;
}

interface JobPost {
  id: string;
  sourcePort: string;
  destinationPort: string;
  sailorsRequired: number;
  salaryOffered: number;
  departureDate: string;
  cargoType: string;
  status: 'active' | 'filled' | 'expired';
  applicationsCount: number;
  createdDate: string;
}

const PortAuthorityDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<PortActiveSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);

  // Mock port authority data - replace with API call
  const [portData] = useState<PortAuthorityData>({
    id: 'port_001',
    name: 'Captain Maria Santos',
    email: 'maria.santos@portofmiami.com',
    portName: 'Port of Miami',
    location: {
      city: 'Miami',
      state: 'Florida',
      country: 'United States'
    },
    totalShipsInTransit: 24,
    totalContractsCompleted: 156,
    activeJobPosts: 8,
    registeredSailors: 342
  });

  // Initialize with mock job posts
  useEffect(() => {
    const mockJobPosts: JobPost[] = [
      {
        id: 'job_001',
        sourcePort: 'Port of Miami',
        destinationPort: 'Port of Barcelona',
        sailorsRequired: 8,
        salaryOffered: 18000,
        departureDate: '2024-02-15',
        cargoType: 'Container Cargo',
        status: 'active',
        applicationsCount: 12,
        createdDate: '2024-01-20'
      },
      {
        id: 'job_002',
        sourcePort: 'Port of Miami',
        destinationPort: 'Port of Rotterdam',
        sailorsRequired: 6,
        salaryOffered: 16000,
        departureDate: '2024-02-20',
        cargoType: 'General Cargo',
        status: 'active',
        applicationsCount: 8,
        createdDate: '2024-01-19'
      },
      {
        id: 'job_003',
        sourcePort: 'Port of Miami',
        destinationPort: 'Port of Hamburg',
        sailorsRequired: 10,
        salaryOffered: 20000,
        departureDate: '2024-02-25',
        cargoType: 'Bulk Cargo',
        status: 'filled',
        applicationsCount: 15,
        createdDate: '2024-01-18'
      }
    ];
    setJobPosts(mockJobPosts);
  }, []);

  const handleCreateJobPost = (newJobPost: Omit<JobPost, 'id' | 'status' | 'applicationsCount' | 'createdDate'>) => {
    const jobPost: JobPost = {
      ...newJobPost,
      id: `job_${Date.now()}`,
      status: 'active',
      applicationsCount: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setJobPosts(prev => [jobPost, ...prev]);
  };

  const handleDeleteJobPost = (jobId: string) => {
    setJobPosts(prev => prev.filter(job => job.id !== jobId));
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <PortDashboardOverview portData={portData} jobPosts={jobPosts} />
            <LiveShipTracker />
          </div>
        );
      case 'create-job':
        return <JobPostingForm onCreateJob={handleCreateJobPost} portData={portData} />;
      case 'active-shipments':
        return <LiveShipTracker />;
      case 'completed-contracts':
        return <CompletedContracts portId={portData.id} />;
      case 'profile':
        return <PortProfileSettings portData={portData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <PortDashboardHeader 
        portData={portData}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        {/* Sidebar */}
        <PortDashboardSidebar
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

        {/* Job Posts Management - Always visible when there are job posts */}
        {activeSection === 'dashboard' && jobPosts.length > 0 && (
          <div className="hidden xl:block w-80 pt-16">
            <div className="p-6">
              <JobPostsManagement 
                jobPosts={jobPosts} 
                onDeleteJob={handleDeleteJobPost}
              />
            </div>
          </div>
        )}
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

export default PortAuthorityDashboard;