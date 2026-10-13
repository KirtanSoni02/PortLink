import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Users, DollarSign, Calendar, Package, Save, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { SUPPORTED_CURRENCIES, formatCurrency } from '../../utils/formatters';

interface JobPostingFormProps {
  onCreateJob: (jobPost: {
    sourcePort: string;
    destinationPort: string;
    sailorsRequired: number;
    salaryOffered: number;
    currency?: string;
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
  currency: string;
  departureDate: string;
  cargoType: string;
}

interface FormErrors {
  [key: string]: string;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ onCreateJob, portData }) => {
  const [formData, setFormData] = useState<FormData>({
    sourcePort: portData.portName || '',
    destinationPort: '',
    sailorsRequired: '',
    salaryOffered: '',
    currency: 'USD',
    departureDate: '',
    cargoType: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdJobSuccess, setCreatedJobSuccess] = useState<any | null>(null);

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
    "Port of Deendayal (Kandla)", "Port of Mumbai", "Port of Jawaharlal Nehru (Nhava Sheva)", "Port of Mormugao", "Port of New Mangalore", "Port of Cochin (Kochi)", "Port of V.O. Chidambaranar (Tuticorin)", "Port of Chennai", "Port of Kamarajar (Ennore)", "Port of Visakhapatnam", "Port of Paradip", "Port of Syama Prasad Mookerjee (Kolkata)", "Port of Port Blair", "Port of Vadhavan", "Port of Porbandar", "Port of Veraval", "Port of Bhavnagar", "Port of Bharuch", "Port of Surat", "Port of Mandvi", "Port of Navlakhi", "Port of Bedi", "Port of Sikka", "Port of Jafarabad", "Port of Okha", "Port of Magdalla", "Port of Mundra", "Port of Pipavav", "Port of Dahej", "Port of Hazira", "Port of Tuna", "Port of Ratnagiri", "Port of Dahanu", "Port of Tarapur", "Port of Satpati", "Port of Kellwa-Mahim", "Port of Arnala", "Port of Uttan", "Port of Bassein", "Port of Bhiwandi", "Port of Manori", "Port of Kalyan", "Port of Thane", "Port of Versova", "Port of Bandra", "Port of Trombay", "Port of Ulwa-Belapur", "Port of Panvel", "Port of More", "Port of Mandwa", "Port of Karanja", "Port of Thal", "Port of Rewas", "Port of Alibag", "Port of Dharamtar", "Port of Revdanda", "Port of Borli/Mandla", "Port of Nandgaon", "Port of Murud-Janjira", "Port of Rajpuri", "Port of Mandad", "Port of Dighi", "Port of Panaji", "Port of Chapora", "Port of Betul", "Port of Talpona", "Port of Tiracol", "Port of Mangalore", "Port of Malpe", "Port of Hangarkatta", "Port of Kundapur", "Port of Bhatkal", "Port of Honavar", "Port of Tadri", "Port of Belekeri", "Port of Karwar", "Port of Padubidri", "Port of Alappuzha", "Port of Vadakara", "Port of Kannur", "Port of Kasargode", "Port of Kodungallore", "Port of Ponnani", "Port of Thalassery", "Port of Thiruvananthapuram", "Port of Kollam (Quilon)", "Port of Kozhikode/Beypore", "Port of Neendakara", "Port of Azhikkal", "Port of Vizhinjam", "Port of Nagapattinam", "Port of Kattupalli", "Port of Karaikal", "Port of Cuddalore", "Port of Thirukkadaiyur", "Port of Koondankulam", "Port of Machilipatnam", "Port of Kakinada", "Port of Krishnapatnam", "Port of Gangavaram", "Port of Bhavanapadu", "Port of Calingapatnam", "Port of Bheemunipatnam", "Port of Narsapur", "Port of Vadarevu", "Port of Nizampatnam", "Port of Gopalpur", "Port of Dhamra", "Port of Kulpi", "Port of Durgachak", "Port of Farakka", "Port of Sahebganj"
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
    } else if (parseInt(formData.salaryOffered) < 100) {
      newErrors.salaryOffered = 'Minimum salary is 100';
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

  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/api/port/jobs`,
        {
          sourcePort: formData.sourcePort,
          destinationPort: formData.destinationPort,
          sailorsRequired: parseInt(formData.sailorsRequired),
          salaryOffered: parseInt(formData.salaryOffered),
          currency: formData.currency,
          departureDate: formData.departureDate,
          cargoType: formData.cargoType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const createdJobObj = {
        ...response.data,
        id: response.data._id || `job_${Date.now()}`,
        status: response.data.status || "active",
        applicationsCount: 0,
        currency: formData.currency,
        createdDate: new Date().toISOString().split('T')[0]
      };

      toast.success("Job post created successfully!");
      onCreateJob(createdJobObj);
      setCreatedJobSuccess(createdJobObj);

      // Reset form
      setFormData({
        sourcePort: portData.portName || '',
        destinationPort: '',
        sailorsRequired: '',
        salaryOffered: '',
        currency: 'USD',
        departureDate: '',
        cargoType: ''
      });

    } catch (error: any) {
      console.error("❌ Failed to create job:", error);
      toast.error(error.response?.data?.message || "Failed to create job post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-w-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors duration-300"
      >
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center mr-4 shadow-sm shrink-0">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white break-words">Create New Job Post</h2>
            <p className="text-slate-500 dark:text-neutral-400 text-xs sm:text-sm mt-0.5">Post a new sailing opportunity for qualified sailors</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Port */}
            <div>
              <label htmlFor="sourcePort" className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Source Port
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                </div>
                <select
                  id="sourcePort"
                  name="sourcePort"
                  value={formData.sourcePort}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm transition-all duration-200 ${
                    errors.sourcePort
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-800'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900 text-slate-900 dark:text-white'
                  }`}
                >
                  <option value="" className="dark:bg-neutral-900">Select source port</option>
                  {popularPorts.map((port) => (
                    <option key={port} value={port} className="dark:bg-neutral-900">{port}</option>
                  ))}
                </select>
              </div>
              {errors.sourcePort && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
                >
                  {errors.sourcePort}
                </motion.p>
              )}
            </div>

            {/* Destination Port */}
            <div>
              <label htmlFor="destinationPort" className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Destination Port
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-sky-500" />
                </div>
                <select
                  id="destinationPort"
                  name="destinationPort"
                  value={formData.destinationPort}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm transition-all duration-200 ${
                    errors.destinationPort
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-800'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900 text-slate-900 dark:text-white'
                  }`}
                >
                  <option value="" className="dark:bg-neutral-900">Select destination port</option>
                  {popularPorts.map((port) => (
                    <option key={port} value={port} className="dark:bg-neutral-900">{port}</option>
                  ))}
                </select>
              </div>
              {errors.destinationPort && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
                >
                  {errors.destinationPort}
                </motion.p>
              )}
            </div>

            {/* Number of Sailors */}
            <div>
              <label htmlFor="sailorsRequired" className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Number of Sailors Required
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Users className="h-4 w-4 text-purple-500" />
                </div>
                <input
                  type="number"
                  id="sailorsRequired"
                  name="sailorsRequired"
                  value={formData.sailorsRequired}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm transition-all duration-200 ${
                    errors.sailorsRequired
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-800'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500'
                  }`}
                  placeholder="e.g., 8"
                />
              </div>
              {errors.sailorsRequired && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
                >
                  {errors.sailorsRequired}
                </motion.p>
              )}
            </div>

            {/* Salary Offered & Currency */}
            <div>
              <label htmlFor="salaryOffered" className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Salary Offered & Currency
              </label>
              <div className="flex gap-2">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-28 py-3 px-2 border rounded-xl border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                >
                  {SUPPORTED_CURRENCIES.map(c => (
                    <option key={c.code} value={c.code} className="dark:bg-neutral-900">{c.label}</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </div>
                  <input
                    type="number"
                    id="salaryOffered"
                    name="salaryOffered"
                    value={formData.salaryOffered}
                    onChange={handleInputChange}
                    min="100"
                    step="100"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm transition-all duration-200 ${
                      errors.salaryOffered
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-800'
                        : 'border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500'
                    }`}
                    placeholder="e.g., 18000"
                  />
                </div>
              </div>
              {errors.salaryOffered && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
                >
                  {errors.salaryOffered}
                </motion.p>
              )}
            </div>

            {/* Departure Date */}
            <div>
              <label htmlFor="departureDate" className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Expected Departure Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-amber-500" />
                </div>
                <input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm transition-all duration-200 ${
                    errors.departureDate
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-800'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900 text-slate-900 dark:text-white'
                  }`}
                />
              </div>
              {errors.departureDate && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
                >
                  {errors.departureDate}
                </motion.p>
              )}
            </div>

            {/* Cargo Type */}
            <div>
              <label htmlFor="cargoType" className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Cargo Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Package className="h-4 w-4 text-orange-500" />
                </div>
                <select
                  id="cargoType"
                  name="cargoType"
                  value={formData.cargoType}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm transition-all duration-200 ${
                    errors.cargoType
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-800'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900 text-slate-900 dark:text-white'
                  }`}
                >
                  <option value="" className="dark:bg-neutral-900">Select cargo type</option>
                  {cargoTypes.map((type) => (
                    <option key={type} value={type} className="dark:bg-neutral-900">{type}</option>
                  ))}
                </select>
              </div>
              {errors.cargoType && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
                >
                  {errors.cargoType}
                </motion.p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-neutral-800">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-7 py-3 bg-slate-900 text-white dark:bg-white dark:text-black font-semibold rounded-xl shadow-sm hover:bg-slate-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Creating Post...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Job Post</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {createdJobSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-900 dark:text-white"
            >
              <button
                onClick={() => setCreatedJobSuccess(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Job Post Published!</h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">Your new sailing opportunity is now active on the maritime board.</p>
              </div>

              <div className="bg-slate-50 dark:bg-black/50 p-4 rounded-xl space-y-2 border border-slate-200 dark:border-neutral-800 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-neutral-400">Route:</span>
                  <span className="font-semibold">{createdJobSuccess.sourcePort} → {createdJobSuccess.destinationPort}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-neutral-400">Sailors Required:</span>
                  <span className="font-semibold">{createdJobSuccess.sailorsRequired} Crew</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-neutral-400">Salary Offered:</span>
                  <span className="font-semibold text-emerald-500">{formatCurrency(createdJobSuccess.salaryOffered, createdJobSuccess.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-neutral-400">Departure Date:</span>
                  <span className="font-semibold">{createdJobSuccess.departureDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-neutral-400">Cargo Type:</span>
                  <span className="font-semibold">{createdJobSuccess.cargoType}</span>
                </div>
              </div>

              <button
                onClick={() => setCreatedJobSuccess(null)}
                className="w-full py-3 bg-slate-900 text-white dark:bg-white dark:text-black font-semibold rounded-xl text-sm hover:opacity-95 transition-opacity"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobPostingForm;