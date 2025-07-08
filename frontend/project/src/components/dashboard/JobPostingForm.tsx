import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Users, DollarSign, Calendar, Package, Save } from 'lucide-react';

interface JobPostingFormProps {
  onCreateJob: (jobPost: {
    sourcePort: string;
    destinationPort: string;
    sailorsRequired: number;
    salaryOffered: number;
    departureDate: string;
    cargoType: string;
  }) => void;
  portData: {
    portName: string;
  };
}

interface FormData {
  sourcePort: string;
  destinationPort: string;
  sailorsRequired: string;
  salaryOffered: string;
  departureDate: string;
  cargoType: string;
}

interface FormErrors {
  [key: string]: string;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ onCreateJob, portData }) => {
  const [formData, setFormData] = useState<FormData>({
    sourcePort: portData.portName,
    destinationPort: '',
    sailorsRequired: '',
    salaryOffered: '',
    departureDate: '',
    cargoType: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cargoTypes = [
    'Container Cargo',
    'Bulk Cargo',
    'General Cargo',
    'Liquid Cargo',
    'Refrigerated Cargo',
    'Hazardous Materials',
    'Automotive',
    'Machinery'
  ];

  const popularPorts = [
    'Port of Shanghai',
    'Port of Singapore',
    'Port of Rotterdam',
    'Port of Antwerp',
    'Port of Hamburg',
    'Port of Los Angeles',
    'Port of Long Beach',
    'Port of New York',
    'Port of Barcelona',
    'Port of Tokyo',
    'Port of Dubai',
    'Port of Hong Kong'
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.sourcePort.trim()) {
      newErrors.sourcePort = 'Source port is required';
    }

    if (!formData.destinationPort.trim()) {
      newErrors.destinationPort = 'Destination port is required';
    }

    if (!formData.sailorsRequired.trim()) {
      newErrors.sailorsRequired = 'Number of sailors is required';
    } else if (parseInt(formData.sailorsRequired) < 1) {
      newErrors.sailorsRequired = 'At least 1 sailor is required';
    }

    if (!formData.salaryOffered.trim()) {
      newErrors.salaryOffered = 'Salary is required';
    } else if (parseInt(formData.salaryOffered) < 1000) {
      newErrors.salaryOffered = 'Minimum salary is $1,000';
    }

    if (!formData.departureDate.trim()) {
      newErrors.departureDate = 'Departure date is required';
    } else {
      const selectedDate = new Date(formData.departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.departureDate = 'Departure date cannot be in the past';
      }
    }

    if (!formData.cargoType.trim()) {
      newErrors.cargoType = 'Cargo type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onCreateJob({
        sourcePort: formData.sourcePort,
        destinationPort: formData.destinationPort,
        sailorsRequired: parseInt(formData.sailorsRequired),
        salaryOffered: parseInt(formData.salaryOffered),
        departureDate: formData.departureDate,
        cargoType: formData.cargoType
      });

      // Reset form
      setFormData({
        sourcePort: portData.portName,
        destinationPort: '',
        sailorsRequired: '',
        salaryOffered: '',
        departureDate: '',
        cargoType: ''
      });

      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
    >
      <div className="flex items-center mb-8">
        <Plus className="w-8 h-8 mr-3 text-blue-500" />
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Create New Job Post</h2>
          <p className="text-slate-600 mt-1">Post a new sailing opportunity for qualified sailors</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Port */}
          <div>
            <label htmlFor="sourcePort" className="block text-sm font-medium text-slate-700 mb-2">
              Source Port
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-emerald-500" />
              </div>
              <input
                type="text"
                id="sourcePort"
                name="sourcePort"
                value={formData.sourcePort}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                  errors.sourcePort ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                }`}
                placeholder="Enter source port"
              />
            </div>
            {errors.sourcePort && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600"
              >
                {errors.sourcePort}
              </motion.p>
            )}
          </div>

          {/* Destination Port */}
          <div>
            <label htmlFor="destinationPort" className="block text-sm font-medium text-slate-700 mb-2">
              Destination Port
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <select
                id="destinationPort"
                name="destinationPort"
                value={formData.destinationPort}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                  errors.destinationPort ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              >
                <option value="">Select destination port</option>
                {popularPorts.map((port) => (
                  <option key={port} value={port}>{port}</option>
                ))}
              </select>
            </div>
            {errors.destinationPort && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600"
              >
                {errors.destinationPort}
              </motion.p>
            )}
          </div>

          {/* Number of Sailors */}
          <div>
            <label htmlFor="sailorsRequired" className="block text-sm font-medium text-slate-700 mb-2">
              Number of Sailors Required
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <input
                type="number"
                id="sailorsRequired"
                name="sailorsRequired"
                value={formData.sailorsRequired}
                onChange={handleInputChange}
                min="1"
                max="50"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                  errors.sailorsRequired ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                }`}
                placeholder="e.g., 8"
              />
            </div>
            {errors.sailorsRequired && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600"
              >
                {errors.sailorsRequired}
              </motion.p>
            )}
          </div>

          {/* Salary Offered */}
          <div>
            <label htmlFor="salaryOffered" className="block text-sm font-medium text-slate-700 mb-2">
              Salary Offered (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <input
                type="number"
                id="salaryOffered"
                name="salaryOffered"
                value={formData.salaryOffered}
                onChange={handleInputChange}
                min="1000"
                step="100"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                  errors.salaryOffered ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                }`}
                placeholder="e.g., 18000"
              />
            </div>
            {errors.salaryOffered && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600"
              >
                {errors.salaryOffered}
              </motion.p>
            )}
          </div>

          {/* Departure Date */}
          <div>
            <label htmlFor="departureDate" className="block text-sm font-medium text-slate-700 mb-2">
              Expected Departure Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-amber-500" />
              </div>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                  errors.departureDate ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              />
            </div>
            {errors.departureDate && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600"
              >
                {errors.departureDate}
              </motion.p>
            )}
          </div>

          {/* Cargo Type */}
          <div>
            <label htmlFor="cargoType" className="block text-sm font-medium text-slate-700 mb-2">
              Cargo Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package className="h-5 w-5 text-orange-500" />
              </div>
              <select
                id="cargoType"
                name="cargoType"
                value={formData.cargoType}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                  errors.cargoType ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              >
                <option value="">Select cargo type</option>
                {cargoTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {errors.cargoType && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600"
              >
                {errors.cargoType}
              </motion.p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-slate-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Post...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Create Job Post</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default JobPostingForm;