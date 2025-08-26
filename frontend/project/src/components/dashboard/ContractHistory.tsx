import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, DollarSign, MapPin, Star, Eye, Download } from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';
interface Contract {
  id: string;
  sourcePort: string;
  destinationPort: string;
  shipName: string;
  startDate: string;
  endDate: string;
  salary: number;
  status: 'completed' | 'ongoing' | 'cancelled';
  rating: number;
  company: string;
  duration: string;
}

interface ContractHistoryProps {
  sailorId: string;
}

const ContractHistory: React.FC<ContractHistoryProps> = ({ sailorId }) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'ongoing' | 'cancelled'>('all');
 const [contracts, setContracts] = useState<Contract[]>([]);
const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        console.log("Fetching contract history for sailor ID:", sailorId); // Debugging line
        const response = await axios.get(`${API_URL}/api/sailor/contractshistory/${sailorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setContracts(response.data);
      } catch (error) {
        console.error('Error fetching contract history:', error);
      }
    };

    if (sailorId) fetchContracts();
  }, [sailorId]);
  // Mock data - replace with API call
  

  const filteredContracts = filter === 'all' 
    ? contracts 
    : contracts.filter(contract => contract.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ongoing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const totalEarnings = contracts
    .filter(c => c.status === 'completed')
    .reduce((sum, contract) => sum + contract.salary, 0);

  const averageRating = contracts
    .filter(c => c.status === 'completed' && c.rating > 0)
    .reduce((sum, contract, _, arr) => sum + contract.rating / arr.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-slate-800">{contracts.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Total Contracts</h3>
          <p className="text-slate-600">All time contracts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-800">${totalEarnings.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Total Earnings</h3>
          <p className="text-slate-600">From completed contracts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-amber-500" />
            <span className="text-2xl font-bold text-slate-800">{averageRating.toFixed(1)}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Average Rating</h3>
          <p className="text-slate-600">Client satisfaction</p>
        </motion.div>
      </div>

      {/* Contract History */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 sm:mb-0">Contract History</h2>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {(['all', 'completed', 'ongoing', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredContracts.map((contract, index) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Contract Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-slate-800">{contract.company}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                      {contract.status.toUpperCase()}
                    </span>
                    {contract.status === 'completed' && contract.rating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <span className="text-sm font-medium text-amber-600">{contract.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="text-xs text-slate-500">From</div>
                        <div className="text-sm font-medium text-slate-800">{contract.sourcePort}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-slate-500">To</div>
                        <div className="text-sm font-medium text-slate-800">{contract.destinationPort}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <div>
                        <div className="text-xs text-slate-500">Duration</div>
                        <div className="text-sm font-medium text-slate-800">{contract.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="text-xs text-slate-500">Ship</div>
                        <div className="text-sm font-medium text-slate-800">{contract.shipName}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Start: {new Date(contract.startDate).toLocaleDateString()}</span>
                    <span>End: {new Date(contract.endDate).toLocaleDateString()}</span>
                    <span>Contract ID: {contract.id}</span>
                  </div>
                </div>

                {/* Salary and Actions */}
                <div className="flex flex-col items-end space-y-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">${contract.salary.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">Total payment</div>
                  </div>

                  <div className="flex space-x-2">
                    
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredContracts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No contracts found</h3>
            <p className="text-slate-500">No contracts match the selected filter</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContractHistory;