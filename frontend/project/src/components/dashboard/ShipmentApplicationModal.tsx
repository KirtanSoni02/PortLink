import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, FileText, MapPin, Calendar, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatters';

interface ShipmentApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: {
    id: string;
    sourcePort: string;
    destinationPort: string;
    company: string;
    salary: number;
    DepartureDate: Date;
    crewRequired?: number;
    cargoType: string;
    urgency?: string;
  };
  sailorData: {
    name: string;
    email: string;
    phone: string;
    experience: string;
    rating: number;
  };
  onSubmitApplication: (applicationData: any) => void;
}

interface ApplicationFormData {
  personalMessage: string;
  availabilityDate: string;
  relevantExperience: string;
  certifications: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalCertification: string;
  passportNumber: string;
  visaStatus: string;
}

interface FormErrors {
  [key: string]: string;
}

const ShipmentApplicationModal: React.FC<ShipmentApplicationModalProps> = ({
  isOpen,
  onClose,
  shipment,
  sailorData,
  onSubmitApplication
}) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    personalMessage: '',
    availabilityDate: '',
    relevantExperience: '',
    certifications: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalCertification: '',
    passportNumber: '',
    visaStatus: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.personalMessage.trim()) {
      newErrors.personalMessage = 'Personal message is required';
    } else if (formData.personalMessage.length < 50) {
      newErrors.personalMessage = 'Personal message must be at least 50 characters';
    }

    if (!formData.availabilityDate) {
      newErrors.availabilityDate = 'Availability date is required';
    } else {
      const selectedDate = new Date(formData.availabilityDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today || selectedDate > shipment.DepartureDate) {
        newErrors.availabilityDate = 'Availability date cannot be in the past or after the departure date';
      }
    }

    if (!formData.relevantExperience.trim()) {
      newErrors.relevantExperience = 'Relevant experience is required';
    }

    if (!formData.certifications.trim()) {
      newErrors.certifications = 'Certifications are required';
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact name is required';
    }

    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Emergency contact phone is required';
    }

    if (!formData.medicalCertification.trim()) {
      newErrors.medicalCertification = 'Medical certification status is required';
    }

    if (!formData.passportNumber.trim()) {
      newErrors.passportNumber = 'Passport/Seaman Book number is required';
    }

    if (!formData.visaStatus) {
      newErrors.visaStatus = 'Visa/Work authorization status is required';
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
      const applicationData = {
        shipmentId: shipment.id,
        sailorName: sailorData.name,
        sailorEmail: sailorData.email,
        sailorPhone: sailorData.phone,
        sailorExperience: sailorData.experience,
        sailorRating: sailorData.rating,
        ...formData,
        submittedAt: new Date().toISOString()
      };

      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/shipment-applications`, applicationData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      onSubmitApplication(applicationData);
      setSubmitSuccess(true);
      toast.success("Shipment application submitted successfully!");

      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
        setFormData({
          personalMessage: '',
          availabilityDate: '',
          relevantExperience: '',
          certifications: '',
          emergencyContact: '',
          emergencyPhone: '',
          medicalCertification: '',
          passportNumber: '',
          visaStatus: ''
        });
      }, 1500);
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error(error?.response?.data?.error || "Failed to submit application. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-neutral-900 border-0 sm:border border-slate-200 dark:border-neutral-800 rounded-none sm:rounded-2xl shadow-2xl w-full max-w-lg h-full sm:h-auto max-h-none sm:max-h-[90vh] flex flex-col my-auto text-slate-900 dark:text-white overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 dark:bg-black text-white p-4 sm:p-6 border-b border-slate-800 dark:border-neutral-800 flex justify-between items-center shrink-0">
            <div className="min-w-0 pr-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/30 text-blue-400 border border-blue-500/30 uppercase mb-1 inline-block">
                OFFSHORE DEPLOYMENT APPLICATION
              </span>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight">Apply for Shipment</h2>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 break-words">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{shipment.sourcePort} → {shipment.destinationPort}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-neutral-800 transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body Container */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
            {submitSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                  <CheckCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold">Application Submitted!</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 max-w-md mx-auto">
                  Your application has been received and logged for review by the Port Authority.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Summary Card */}
                <div className="bg-slate-50 dark:bg-black/60 p-3.5 rounded-xl border border-slate-200 dark:border-neutral-800 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 dark:text-neutral-400 block font-medium">Stipend Offered</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{formatCurrency(shipment.salary)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-neutral-400 block font-medium">Cargo Type</span>
                    <span className="font-semibold text-slate-900 dark:text-white break-words">{shipment.cargoType || 'General Cargo'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-neutral-400 block font-medium">Departure Date</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{new Date(shipment.DepartureDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-neutral-400 block font-medium">Applicant Name</span>
                    <span className="font-semibold text-slate-900 dark:text-white break-words">{sailorData.name}</span>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Personal Cover Message */}
                  <div className="sm:col-span-2">
                    <label htmlFor="personalMessage" className="block font-semibold mb-1.5 uppercase text-slate-700 dark:text-neutral-300 tracking-wider">
                      Cover Statement / Personal Message * (min 50 chars)
                    </label>
                    <textarea
                      id="personalMessage"
                      name="personalMessage"
                      rows={3}
                      value={formData.personalMessage}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-xl bg-slate-50/50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.personalMessage ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-slate-200 dark:border-neutral-800'
                      }`}
                      placeholder="Detail your maritime qualifications, recent vessel deployments, and readiness..."
                    />
                    {errors.personalMessage && <p className="mt-1 text-red-500 font-medium">{errors.personalMessage}</p>}
                  </div>

                  {/* Availability Date */}
                  <div>
                    <label htmlFor="availabilityDate" className="block font-semibold mb-1.5 uppercase text-slate-700 dark:text-neutral-300 tracking-wider">
                      Earliest Availability *
                    </label>
                    <input
                      type="date"
                      id="availabilityDate"
                      name="availabilityDate"
                      value={formData.availabilityDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full p-2.5 border rounded-xl bg-slate-50/50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.availabilityDate ? 'border-red-500' : 'border-slate-200 dark:border-neutral-800'
                      }`}
                    />
                    {errors.availabilityDate && <p className="mt-1 text-red-500 font-medium">{errors.availabilityDate}</p>}
                  </div>

                  {/* Passport / Seaman Book Number */}
                  <div>
                    <label htmlFor="passportNumber" className="block font-semibold mb-1.5 uppercase text-slate-700 dark:text-neutral-300 tracking-wider">
                      Seaman Book / Passport *
                    </label>
                    <input
                      type="text"
                      id="passportNumber"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-xl bg-slate-50/50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.passportNumber ? 'border-red-500' : 'border-slate-200 dark:border-neutral-800'
                      }`}
                      placeholder="e.g., N1234567"
                    />
                    {errors.passportNumber && <p className="mt-1 text-red-500 font-medium">{errors.passportNumber}</p>}
                  </div>

                  {/* Relevant Experience */}
                  <div>
                    <label htmlFor="relevantExperience" className="block font-semibold mb-1.5 uppercase text-slate-700 dark:text-neutral-300 tracking-wider">
                      Relevant Experience *
                    </label>
                    <input
                      type="text"
                      id="relevantExperience"
                      name="relevantExperience"
                      value={formData.relevantExperience}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-xl bg-slate-50/50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.relevantExperience ? 'border-red-500' : 'border-slate-200 dark:border-neutral-800'
                      }`}
                      placeholder="e.g., 5 yrs Container Cargo"
                    />
                    {errors.relevantExperience && <p className="mt-1 text-red-500 font-medium">{errors.relevantExperience}</p>}
                  </div>

                  {/* Visa Status */}
                  <div>
                    <label htmlFor="visaStatus" className="block font-semibold mb-1.5 uppercase text-slate-700 dark:text-neutral-300 tracking-wider">
                      Work Visa Status *
                    </label>
                    <select
                      id="visaStatus"
                      name="visaStatus"
                      value={formData.visaStatus}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-xl bg-slate-50/50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.visaStatus ? 'border-red-500' : 'border-slate-200 dark:border-neutral-800'
                      }`}
                    >
                      <option value="" className="dark:bg-black">Select visa status</option>
                      <option value="citizen" className="dark:bg-black">Citizen</option>
                      <option value="permanent-resident" className="dark:bg-black">Permanent Resident</option>
                      <option value="work-visa" className="dark:bg-black">Valid Work Visa</option>
                      <option value="seaman-discharge" className="dark:bg-black">Seaman Discharge Book</option>
                    </select>
                    {errors.visaStatus && <p className="mt-1 text-red-500 font-medium">{errors.visaStatus}</p>}
                  </div>

                  {/* Certifications */}
                  <div className="sm:col-span-2">
                    <label htmlFor="certifications" className="block font-semibold mb-1.5 uppercase text-slate-700 dark:text-neutral-300 tracking-wider">
                      Maritime Certifications *
                    </label>
                    <input
                      type="text"
                      id="certifications"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-xl bg-slate-50/50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.certifications ? 'border-red-500' : 'border-slate-200 dark:border-neutral-800'
                      }`}
                      placeholder="STCW Basic Safety, Firefighting..."
                    />
                    {errors.certifications && <p className="mt-1 text-red-500 font-medium">{errors.certifications}</p>}
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label htmlFor="emergencyContact" className="block font-semibold mb-1.5 uppercase text-slate-700 dark:text-neutral-300 tracking-wider">
                      Emergency Contact *
                    </label>
                    <input
                      type="text"
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-xl bg-slate-50/50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.emergencyContact ? 'border-red-500' : 'border-slate-200 dark:border-neutral-800'
                      }`}
                      placeholder="Contact Name"
                    />
                    {errors.emergencyContact && <p className="mt-1 text-red-500 font-medium">{errors.emergencyContact}</p>}
                  </div>

                  {/* Emergency Phone */}
                  <div>
                    <label htmlFor="emergencyPhone" className="block font-semibold mb-1.5 uppercase text-slate-700 dark:text-neutral-300 tracking-wider">
                      Emergency Phone *
                    </label>
                    <input
                      type="tel"
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-xl bg-slate-50/50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.emergencyPhone ? 'border-red-500' : 'border-slate-200 dark:border-neutral-800'
                      }`}
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.emergencyPhone && <p className="mt-1 text-red-500 font-medium">{errors.emergencyPhone}</p>}
                  </div>

                  {/* Medical Certification */}
                  <div className="sm:col-span-2">
                    <label htmlFor="medicalCertification" className="block font-semibold mb-1.5 uppercase text-slate-700 dark:text-neutral-300 tracking-wider">
                      Medical Fitness Status *
                    </label>
                    <input
                      type="text"
                      id="medicalCertification"
                      name="medicalCertification"
                      value={formData.medicalCertification}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-xl bg-slate-50/50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.medicalCertification ? 'border-red-500' : 'border-slate-200 dark:border-neutral-800'
                      }`}
                      placeholder="Valid ENG1 Medical Certificate (MM/YYYY)"
                    />
                    {errors.medicalCertification && <p className="mt-1 text-red-500 font-medium">{errors.medicalCertification}</p>}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ShipmentApplicationModal;