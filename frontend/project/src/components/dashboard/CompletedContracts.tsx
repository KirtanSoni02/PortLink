import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, MapPin, Ship, Users, DollarSign, Download, Trash2, Filter } from 'lucide-react';

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
  portId: string;
}

const CompletedContracts: React.FC<CompletedContractsProps> = ({ portId }) => {
  const [filter, setFilter] = useState<'all' | 'recent' | 'high-value'>('all');
  const [contracts] = useState<CompletedContract[]>([
    {
      id: 'contract_001',
      shipNumber: 'ON-2023-045',
      shipName: 'Ocean Navigator',
      startDate: '2023-12-01',
      endDate: '2023-12-15',
      sailorsCount: 12,
      route: {
        source: 'Port of Miami',
        destination: 'Port of Barcelona'
      },
      cargoType: 'Container Cargo',
      totalPayment: 180000,
      duration: '14 days'
    },
    {
      id: 'contract_002',
      shipNumber: 'AS-2023-032',
      shipName: 'Atlantic Star',
      startDate: '2023-11-15',
      endDate: '2023-11-27',
      sailorsCount: 8,
      route: {
        source: 'Port of Miami',
        destination: 'Port of Hamburg'
      },
      cargoType: 'General Cargo',
      totalPayment: 128000,
      duration: '12 days'
    },
    {
      id: 'contract_003',
      shipNumber: 'NW-2023-018',
      shipName: 'Nordic Wind',
      startDate: '2023-10-20',
      endDate: '2023-11-05',
      sailorsCount: 6,
      route: {
        source: 'Port of Miami',
        destination: 'Port of Rotterdam'
      },
      cargoType: 'Bulk Cargo',
      totalPayment: 96000,
      duration: '16 days'
    },
    {
      id: 'contract_004',
      shipNumber: 'PS-2023-067',
      shipName: 'Pacific Star',
      startDate: '2023-09-10',
      endDate: '2023-09-30',
      sailorsCount: 15,
      route: {
        source: 'Port of Miami',
        destination: 'Port of Singapore'
      },
      cargoType: 'Liquid Cargo',
      totalPayment: 300000,
      duration: '20 days'
    },
    {
      id: 'contract_005',
      shipNumber: 'MW-2023-089',
      shipName: 'Mediterranean Wave',
      startDate: '2023-08-15',
      endDate: '2023-08-28',
      sailorsCount: 10,
      route: {
        source: 'Port of Miami',
        destination: 'Port of Genoa'
      },
      cargoType: 'Automotive',
      totalPayment: 150000,
      duration: '13 days'
    }
  ]);

  const filteredContracts = contracts.filter(contract => {
    switch (filter) {
      case 'recent':
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return new Date(contract.endDate) >= threeMonthsAgo;
      case 'high-value':
        return contract.totalPayment >= 150000;
      default:
        return true;
    }
  });

  const totalRevenue = contracts.reduce((sum, contract) => sum + contract.totalPayment, 0);
  const averageContractValue = totalRevenue / contracts.length;

  const handleDeleteContract = (contractId: string) => {
    console.log('Deleting contract:', contractId);
    // Handle delete logic
  };

  const handleExportCSV = () => {
    console.log('Exporting contracts to CSV');
    // Handle CSV export logic
  };

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
          <p className="text-slate-600">Completed successfully</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-800">${totalRevenue.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Total Revenue</h3>
          <p className="text-slate-600">From all contracts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <Ship className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-slate-800">${Math.round(averageContractValue).toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Average Value</h3>
          <p className="text-slate-600">Per contract</p>
        </motion.div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 sm:mb-0">Completed Contracts</h2>
          
          <div className="flex space-x-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Contracts</option>
                <option value="recent">Recent (3 months)</option>
                <option value="high-value">High Value ($150k+)</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export CSV</span>
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Ship</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Route</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Duration</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Crew</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Cargo</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Payment</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract, index) => (
                <motion.tr
                  key={contract.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-800">{contract.shipName}</div>
                      <div className="text-sm text-slate-500">{contract.shipNumber}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="text-sm font-medium text-slate-800">{contract.route.source}</div>
                        <div className="text-xs text-slate-500">to {contract.route.destination}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm font-medium text-slate-800">{contract.duration}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-slate-800">{contract.sailorsCount}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-slate-800">{contract.cargoType}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-lg font-bold text-emerald-600">${contract.totalPayment.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteContract(contract.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No contracts found</h3>
            <p className="text-slate-500">No contracts match the selected filter</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompletedContracts;