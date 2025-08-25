import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PortDashboardHeader from './PortDashboardHeader';
import PortDashboardSidebar from './PortDashboardSidebar';
import PortDashboardOverview from './PortDashboardOverview';
import LiveShipTracker from './LiveShipTracker';
import JobPostingForm from './JobPostingForm';
import JobPostsManagement from './JobPostsManagement';
import  CompletedContracts   from './CompletedContracts';
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

const PortAuthorityDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<PortActiveSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [activeShips, setActiveShips] = useState([]);
  const [incomingShips, setIncomingShips] = useState([]);
  const [completedContracts, setCompletedContracts] = useState([]);


  // Mock port authority data - replace with API call
  // const [portData] = useState<PortAuthorityData>({
  //   id: 'port_001',
  //   name: 'Captain Maria Santos',
  //   email: 'maria.santos@portofmiami.com',
  //   portName: 'Port of Miami',
  //   location: {
  //     city: 'Miami',
  //     state: 'Florida',
  //     country: 'United States'
  //   },
  //   totalShipsInTransit: 24,
  //   totalContractsCompleted: 156,
  //   activeJobPosts: 8,
  //   registeredSailors: 342
  // });

const [portData, setPortData] = useState<PortAuthorityData>({
  id: '',
  name: '',
  email: '',
  portName: '',
  location: { city: '', state: '', country: '' },
  totalShipsInTransit: 0,
  totalContractsCompleted: 0,
  activeJobPosts: 0,
  registeredSailors: 0
});





  const fetchPortData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('https://portlink-ml31.onrender.com/api/port/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Port Data API Response:", response.data); // Debugging line
      // setPortData(response.data);

      setPortData({
      ...response.data,
      id: response.data._id, // ✅ normalize to always have `id`
    });
    } catch (err) {
      console.error("Error fetching port data:", err);
    }
  };

  

useEffect(() => {
    const interval = setInterval(fetchPortData, 40000); // Fetch every 40 seconds
    return () => clearInterval(interval);
  
},[]);

  // Initialize with mock job posts



useEffect(() => {
  const fetchJobPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('https://portlink-ml31.onrender.com/api/activejob/activejobpost', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("JobPost API Response:", res.data); // Add this to debug
      // Case 1: if it's an array
      if (Array.isArray(res.data)) {
        const formatted = res.data.map((job: any) => ({
          ...job,
          id: job._id, // 👈 convert Mongo _id to id
        }));
        setJobPosts(formatted);
      }
      // Case 2: if it's an object with array inside
      else if (Array.isArray(res.data.jobs)) {
        const formatted = res.data.jobs.map((job: any) => ({
          ...job,
          id: job._id, // 👈 convert Mongo _id to id
        }));
        setJobPosts(formatted);
      } else {
        console.error("Unexpected job post data format");
      }
    } catch (err) {
      console.error("Failed to fetch job posts:", err);
    }
  };

  fetchJobPosts();
}, []);

 useEffect(() => {
  if (activeSection === 'dashboard') {
    fetchPortData(); // ⬅️ This is your solution
  }
}, [activeSection]);


//For the disply information of active ships (outgoing)
useEffect(() => {
  const fetchActiveShips = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://portlink-ml31.onrender.com/api/ship/active", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Active Ships API Response:", res.data); // Debugging line
      setActiveShips(res.data);
    } catch (err) {
      console.error("Error fetching active ships:", err);
      setActiveShips([]);
    }
  };

  fetchActiveShips();
  const interval = setInterval(fetchActiveShips, 300000); // every 60 seconds
  return () => clearInterval(interval);
}, []);

//this is to display the incoming ships


useEffect(() => {
  const fetchIncomingShips = async () => {
    try {
      const token = localStorage.getItem("token"); // or from context if you use AuthProvider

      const res = await axios.get("https://portlink-ml31.onrender.com/api/ship/incoming", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API response:", res.data); // Add this line
      setIncomingShips(res.data); // assuming res.data is an array
    } catch (error) {
      console.error("Failed to fetch ships:", error);
      setIncomingShips([]); // fallback to empty array on error to avoid crashing
    }
  };

  fetchIncomingShips(); // fetch once initially

  const interval = setInterval(fetchIncomingShips, 300000); // refetch every 30 sec

  return () => clearInterval(interval);
}, []);


useEffect(() => {
  const fetchCompletedContracts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://portlink-ml31.onrender.com/api/contract/completed", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log("Completed Contracts API Response:", res.data); // Debugging line
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
      console.error("Failed to fetch completed contracts:", err);
    }
  };

  fetchCompletedContracts();
}, []);



  // This runs **only after** portData is ready




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

  // Optionally update port stats if needed
  setPortData(prev => ({
    ...prev,
    activeJobPosts: prev.activeJobPosts - 1,
  }));
};

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <PortDashboardOverview portData={portData} jobPosts={jobPosts} />
            <LiveShipTracker ships={activeShips}/>
            <IncomingShipTracker ships={incomingShips}/>
          </div>
        );
      case 'create-job':
        return <JobPostingForm onCreateJob={handleCreateJobPost} portData={portData} />;
      case 'active-shipments':
        return <LiveShipTracker ships={activeShips}/>;
      case 'completed-contracts':
        return <CompletedContracts contracts={completedContracts} />;
      case 'profile':
        return <PortProfileSettings portData={portData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      {portData && (
  <PortDashboardHeader 
    portData={portData}
    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
  />
    )}

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
              {portData && renderActiveSection()}

            </motion.div>
          </div>
        </main>

        {/* Job Posts Management - Always visible when there are job posts */}
        {activeSection === 'dashboard' && (
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