import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, MapPin, Ship, Users, DollarSign, Download, Trash2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CompletedContract {
  id: string;
  shipNumber: string;
  shipName: string;
  startDate: string;
  endDate: string;
  sailorsCount: number;
  route: {
    source: string;
    destination: string;
  };
  cargoType: string;
  totalPayment: number;
  duration: string;
}

interface CompletedContractsProps {
  contracts: CompletedContract[];
}

const CompletedContracts: React.FC<CompletedContractsProps> = ({ contracts }) => {
  const [filter, setFilter] = useState<'all' | 'recent' | 'high-value'>('all');
  const [localContracts, setLocalContracts] = useState(contracts);
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);

  React.useEffect(() => {
    setLocalContracts(contracts);
  }, [contracts]);

  const filteredContracts = localContracts.filter((contract) => {
    switch (filter) {
      case 'recent': {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return new Date(contract.endDate) >= threeMonthsAgo;
      }
      case 'high-value':
        return contract.totalPayment >= 150000;
      default:
        return true;
    }
  });

  const totalRevenue = localContracts.reduce((sum, contract) => sum + contract.totalPayment, 0);
  const averageContractValue = localContracts.length ? totalRevenue / localContracts.length : 0;
  const API_URL = import.meta.env.VITE_API_URL;

  const handleDeleteContract = async (contractId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/contract/delete/${contractId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocalContracts((prev) => prev.filter((contract) => contract.id !== contractId));
      toast.success('Contract deleted successfully.');
    } catch (error) {
      console.error('Failed to delete contract:', error);
      toast.error('Failed to delete contract. Please try again.');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Ship Name',
      'Ship Number',
      'Source Port',
      'Destination Port',
      'Start Date',
      'End Date',
      'Duration',
      'Crew',
      'Cargo Type',
      'Total Payment',
    ];

    const rows = filteredContracts.map((contract) => [
      contract.shipName,
      contract.shipNumber,
      contract.route.source,
      contract.route.destination,
      contract.startDate,
      contract.endDate,
      contract.duration,
      contract.sailorsCount,
      contract.cargoType,
      contract.totalPayment,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map(String).map((val) => `"${val.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'completed_contracts.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 min-w-0">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        <SummaryCard
          icon={<FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          value={contracts.length}
          label="Total Contracts"
          sub="Completed successfully"
        />
        <SummaryCard
          icon={<DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          value={`$${totalRevenue.toLocaleString()}`}
          label="Total Revenue"
          sub="From all verified contracts"
        />
        <SummaryCard
          icon={<Ship className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          value={`$${Math.round(averageContractValue).toLocaleString()}`}
          label="Average Value"
          sub="Per voyage contract"
        />
      </div>

      {/* Contracts Container */}
      <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors duration-300 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Completed Contracts</h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="appearance-none bg-slate-50 dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              >
                <option value="all">All Contracts</option>
                <option value="recent">Recent (3 months)</option>
                <option value="high-value">High Value ($150k+)</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Accordion View (< sm) */}
        <div className="block sm:hidden space-y-3">
          {filteredContracts.map((contract, index) => {
            const isExpanded = expandedContractId === contract.id;
            return (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-slate-200 dark:border-neutral-800 rounded-xl p-3.5 bg-slate-50/50 dark:bg-black/40"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedContractId(isExpanded ? null : contract.id)}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{contract.shipName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                      {contract.route.source} → {contract.route.destination}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      ${contract.totalPayment.toLocaleString()}
                    </span>
                    <button className="p-1 text-slate-500 dark:text-neutral-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-slate-200 dark:border-neutral-800 space-y-2 text-xs"
                    >
                      <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-neutral-300">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">IMO Number</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{contract.shipNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{contract.duration}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cargo Category</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{contract.cargoType}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Crew Assigned</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{contract.sailorsCount} members</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-slate-400">
                          {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContract(contract.id);
                          }}
                          className="flex items-center space-x-1 px-2.5 py-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg text-xs font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop Table View (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Ship</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Crew</th>
                <th className="py-3 px-4">Cargo</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 text-sm">
              {filteredContracts.map((contract, index) => (
                <motion.tr
                  key={contract.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/80 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white max-w-[140px] truncate" title={contract.shipName}>
                        {contract.shipName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-neutral-400">{contract.shipNumber}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white max-w-[130px] truncate" title={contract.route.source}>
                          {contract.route.source}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-neutral-400 max-w-[130px] truncate" title={contract.route.destination}>
                          to {contract.route.destination}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{contract.duration}</div>
                      <div className="text-[11px] text-slate-500 dark:text-neutral-400">
                        {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{contract.sailorsCount}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-slate-700 dark:text-neutral-300">{contract.cargoType}</td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">${contract.totalPayment.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteContract(contract.id)}
                      className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
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

const SummaryCard = ({ icon, value, label, sub }: { icon: React.ReactNode; value: any; label: string; sub: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors duration-300 min-w-0"
  >
    <div className="flex items-center justify-between mb-4">
      {icon}
      <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</span>
    </div>
    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{label}</h3>
    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{sub}</p>
  </motion.div>
);

export default CompletedContracts;