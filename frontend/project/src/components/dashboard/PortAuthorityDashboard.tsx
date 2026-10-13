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
import IncomingShipTracker from './IncomingShipTracker';
import axios from 'axios';

export type PortActiveSection = 'dashboard' | 'create-job' | 'active-shipments' | 'completed-contracts' | 'profile';

interface PortAuthorityData {
  _id?: string;
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

interface RecentActivity {
  id: string;
  type: 'ship_arrival' | 'job_application' | 'contract_completed' | 'weather_alert';
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

const PortAuthorityDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<PortActiveSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [activeShips, setActiveShips] = useState([]);
  const [incomingShips, setIncomingShips] = useState([]);
  const [completedContracts, setCompletedContracts] = useState([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const [portData, setPortData] = useState<PortAuthorityData>({
    id: '',
    name: '',
    email: '',
    portName: '',
    location: { city: '', state: '', country: '' },
    totalShipsInTransit: 0,
    totalContractsCompleted: 0,
    activeJobPosts: 0,
    registeredSailors: 0,
  });

  const fetchPortData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/port/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPortData({
        ...response.data,
        id: response.data._id || response.data.id,
      });
    } catch (err) {
      console.error('Error fetching port data:', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchPortData, 40000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/activejob/activejobpost`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(res.data)) {
          const formatted = res.data.map((job: any) => ({
            ...job,
            id: job._id || job.id,
          }));
          setJobPosts(formatted);
        } else if (Array.isArray(res.data.jobs)) {
          const formatted = res.data.jobs.map((job: any) => ({
            ...job,
            id: job._id || job.id,
          }));
          setJobPosts(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch job posts:', err);
      }
    };

    fetchJobPosts();
  }, []);

  useEffect(() => {
    if (activeSection === 'dashboard') {
      fetchPortData();
    }
  }, [activeSection]);

  useEffect(() => {
    const fetchActiveShips = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/ship/active`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setActiveShips(res.data);
      } catch (err) {
        console.error('Error fetching active ships:', err);
        setActiveShips([]);
      }
    };

    fetchActiveShips();
    const interval = setInterval(fetchActiveShips, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchIncomingShips = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/ship/incoming`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIncomingShips(res.data);
      } catch (error) {
        console.error('Failed to fetch ships:', error);
        setIncomingShips([]);
      }
    };

    fetchIncomingShips();
    const interval = setInterval(fetchIncomingShips, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCompletedContracts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/contract/completed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const formatted = res.data.map((contract: any) => ({
          id: contract._id,
          shipNumber: contract.shipNumber,
          shipName: contract.shipName,
          startDate: contract.startDate,
          endDate: contract.endDate,
          sailorsCount: contract.sailorsCount,
          route: contract.route,
          cargoType: contract.cargoType,
          totalPayment: contract.totalPayment,
          duration: contract.duration,
        }));

        setCompletedContracts(formatted);
      } catch (err) {
        console.error('Failed to fetch completed contracts:', err);
      }
    };

    fetchCompletedContracts();
  }, []);

  useEffect(() => {
    const activities: RecentActivity[] = [];

    incomingShips.forEach((ship: any) => {
      activities.push({
        id: `ship_${ship._id}`,
        type: 'ship_arrival',
        title: 'New ship arrival request',
        description: `${ship.name} requesting docking`,
        timestamp: new Date(ship.arrivalDate || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: 'bg-blue-500',
      });
    });

    jobPosts.forEach((job) => {
      if (job.applicationsCount > 0) {
        activities.push({
          id: `job_${job.id}`,
          type: 'job_application',
          title: 'Job application update',
          description: `${job.applicationsCount} applicants for ${job.destinationPort} route`,
          timestamp: 'Today',
          color: 'bg-blue-600',
        });
      }
    });

    completedContracts.forEach((contract: any) => {
      activities.push({
        id: `contract_${contract.id}`,
        type: 'contract_completed',
        title: 'Contract completed',
        description: `${contract.shipName} completed ${contract.route?.destination} route`,
        timestamp: new Date(contract.endDate || Date.now()).toLocaleDateString(),
        color: 'bg-slate-900',
      });
    });

    setRecentActivity(activities.slice(0, 5));
  }, [incomingShips, jobPosts, completedContracts]);

  const handleCreateJobPost = (newJobPost: Omit<JobPost, 'id' | 'status' | 'applicationsCount' | 'createdDate'>) => {
    const jobPost: JobPost = {
      ...newJobPost,
      id: `job_${Date.now()}`,
      status: 'active',
      applicationsCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setJobPosts((prev) => [jobPost, ...prev]);
  };

  const handleDeleteJobPost = (jobId: string) => {
    setJobPosts((prev) => prev.filter((job) => job.id !== jobId));
    setPortData((prev) => ({
      ...prev,
      activeJobPosts: Math.max(0, prev.activeJobPosts - 1),
    }));
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-4 sm:space-y-8">
            <PortDashboardOverview variant="summary" portData={portData} jobPosts={jobPosts} recentActivity={recentActivity} />
            <LiveShipTracker ships={activeShips} />
            <IncomingShipTracker ships={incomingShips} />
          </div>
        );
      case 'create-job':
        return <JobPostingForm onCreateJob={handleCreateJobPost} portData={portData} />;
      case 'active-shipments':
        return <LiveShipTracker ships={activeShips} />;
      case 'completed-contracts':
        return <CompletedContracts contracts={completedContracts} />;
      case 'profile':
        return <PortProfileSettings portData={portData} onUpdate={fetchPortData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-300 relative overflow-x-hidden">
      {/* Dynamic Maritime Grid & Radar Overlay Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header */}
      {portData && (
        <PortDashboardHeader
          portData={portData}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      <div className="flex flex-col lg:flex-row relative z-10">
        {/* Sidebar */}
        <PortDashboardSidebar
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
              {portData && renderActiveSection()}
            </motion.div>
          </div>
        </main>

        {/* Job Posts Management - Secondary Sidebar on Dashboard view */}
        {activeSection === 'dashboard' && (
          <aside className="w-full lg:w-80 xl:w-96 shrink-0 min-w-0 pt-0 lg:pt-16">
            <div className="p-3 sm:p-6 lg:pl-0 lg:pr-6">
              <JobPostsManagement jobPosts={jobPosts} onDeleteJob={handleDeleteJobPost} />
              <div className="mt-4">
                <PortDashboardOverview
                  variant="quick-stats"
                  portData={portData}
                  jobPosts={jobPosts}
                  recentActivity={recentActivity}
                />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PortAuthorityDashboard;