import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, DollarSign, MapPin, Star, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

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
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchContracts = async () => {
      try {
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

  const filteredContracts = filter === 'all'
    ? contracts
    : contracts.filter((contract) => contract.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'ongoing':
        return 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white';
      case 'cancelled':
      default:
        return 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-700';
    }
  };

  const totalEarnings = contracts
    .filter((c) => c.status === 'completed')
    .reduce((sum, contract) => sum + contract.salary, 0);

  const averageRating = contracts
    .filter((c) => c.status === 'completed' && c.rating > 0)
    .reduce((sum, contract, _, arr) => sum + contract.rating / arr.length, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 min-w-0">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-neutral-800 shadow-sm text-slate-900 dark:text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold tracking-tight">{contracts.length}</span>
          </div>
          <h3 className="text-sm font-semibold">Total Contracts</h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">All time contracts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-neutral-800 shadow-sm text-slate-900 dark:text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold tracking-tight">${totalEarnings.toLocaleString()}</span>
          </div>
          <h3 className="text-sm font-semibold">Total Earnings</h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">From completed contracts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-neutral-800 shadow-sm text-slate-900 dark:text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <Star className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold tracking-tight">{averageRating.toFixed(1)}</span>
          </div>
          <h3 className="text-sm font-semibold">Average Rating</h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">Client satisfaction</p>
        </motion.div>
      </div>

      {/* Contract History List */}
      <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-neutral-800 shadow-sm text-slate-900 dark:text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold tracking-tight">Contract History</h2>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {(['all', 'completed', 'ongoing', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredContracts.map((contract, index) => {
            const isExpanded = expandedContractId === contract.id;
            return (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 bg-white/50 dark:bg-black/40 hover:border-blue-500/40 transition-all duration-200"
              >
                {/* Compact Row Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold truncate">{contract.company}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(contract.status)}`}>
                        {contract.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 dark:text-neutral-300 truncate">
                      {contract.sourcePort} → {contract.destinationPort}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400">${contract.salary.toLocaleString()}</div>
                    </div>
                    <button
                      onClick={() => setExpandedContractId(isExpanded ? null : contract.id)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors"
                      aria-label="Toggle contract details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expandable Details Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-slate-200 dark:border-neutral-800 space-y-3 text-xs"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="bg-slate-50 dark:bg-black/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Vessel Name</span>
                          <span className="font-bold truncate block">{contract.shipName}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-black/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Duration</span>
                          <span className="font-bold truncate block">{contract.duration}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-black/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Start Date</span>
                          <span className="font-bold truncate block">{new Date(contract.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-black/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block">End Date</span>
                          <span className="font-bold truncate block">{new Date(contract.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400 pt-1">
                        <span>Contract ID: <strong className="font-mono text-slate-700 dark:text-neutral-200">{contract.id}</strong></span>
                        {contract.status === 'completed' && contract.rating > 0 && (
                          <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>Rating: {contract.rating} / 5.0</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {filteredContracts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 dark:text-neutral-700 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-neutral-300 mb-1">No contracts found</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">No contracts match the selected filter</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContractHistory;