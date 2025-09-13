import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, FileText, MapPin, Calendar, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';


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
  // expectedSalary: string;
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
    // expectedSalary: shipment.salary.toString(),
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

    // Required fields validation
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
        newErrors.availabilityDate = 'Availability date cannot be in the past or after the shipment departure date';
      }
    }

    // if (!formData.expectedSalary.trim()) {
    //   newErrors.expectedSalary = 'Expected salary is required';
    // } else if (parseInt(formData.expectedSalary) < 1000) {
    //   newErrors.expectedSalary = 'Expected salary must be at least $1,000';
    // }

    if (!formData.relevantExperience.trim()) {
      newErrors.relevantExperience = 'Relevant experience description is required';
    }

    if (!formData.certifications.trim()) {
      newErrors.certifications = 'Maritime certifications are required';
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
      newErrors.passportNumber = 'Passport number is required';
    }

    if (!formData.visaStatus.trim()) {
      newErrors.visaStatus = 'Visa status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   // Simulate API call
  //   setTimeout(() => {
  //     const applicationData = {
  //       shipmentId: shipment.id,
  //       sailorId: 'sailor_001', // This would come from auth context
  //       sailorName: sailorData.name,
  //       sailorEmail: sailorData.email,
  //       sailorPhone: sailorData.phone,
  //       sailorRating: sailorData.rating,
  //       applicationDate: new Date().toISOString(),
  //       ...formData,
  //       status: 'pending'
  //     };

  //     onSubmitApplication(applicationData);
  //     setSubmitSuccess(true);
  //     setIsSubmitting(false);

  //     // Close modal after success message
  //     setTimeout(() => {
  //       setSubmitSuccess(false);
  //       onClose();
  //       // Reset form
  //       setFormData({
  //         personalMessage: '',
  //         availabilityDate: '',
  //         relevantExperience: '',
  //         certifications: '',
  //         emergencyContact: '',
  //         emergencyPhone: '',
  //         medicalCertification: '',
  //         passportNumber: '',
  //         visaStatus: ''
  //       });
  //     }, 2000);
  //   }, 2000);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      // Build the application payload
      const applicationData = {
        shipmentId: shipment.id
      };

      await axios.post(
        "${API_URL}/api/sailor/jobposts/assign-crew",
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setSubmitSuccess(true);
      setIsSubmitting(false);

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
    } catch (error) {
      setIsSubmitting(false);
      alert("Failed to submit application. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-emerald-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Apply for Shipment</h2>
                <p className="text-sky-100">
                  {shipment.sourcePort} → {shipment.destinationPort}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Application Submitted!</h3>
                <p className="text-slate-600 mb-6">
                  Your application has been successfully submitted to {shipment.company}.
                  You will receive a notification once they review your application.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-emerald-700 text-sm">
                    <strong>Application ID:</strong> APP-{Date.now()}
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                {/* Shipment Summary */}
                <div className="bg-slate-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Shipment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-600">Route:</span>
                      <span className="text-sm font-medium text-slate-800">
                        {shipment.sourcePort} → {shipment.destinationPort}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-slate-600">Duration:</span>
                      <span className="text-sm font-medium text-slate-800">{shipment.DepartureDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-slate-600">Crew Required:</span>
                      <span className="text-sm font-medium text-slate-800">{shipment.crewRequired} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-slate-600">Cargo:</span>
                      <span className="text-sm font-medium text-slate-800">{shipment.cargoType}</span>
                    </div>
                  </div>
                </div>

                {/* Application Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Message */}
                  <div className="lg:col-span-2">
                    <label htmlFor="personalMessage" className="block text-sm font-medium text-slate-700 mb-2">
                      Personal Message *
                    </label>
                    <textarea
                      id="personalMessage"
                      name="personalMessage"
                      value={formData.personalMessage}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${errors.personalMessage ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                      placeholder="Tell the company why you're the right fit for this shipment. Include your relevant experience and motivation..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.personalMessage && (
                        <p className="text-sm text-red-600">{errors.personalMessage}</p>
                      )}
                      <p className="text-xs text-slate-500 ml-auto">
                        {formData.personalMessage.length}/500 characters
                      </p>
                    </div>
                  </div>

                  {/* Availability Date */}
                  <div>
                    <label htmlFor="availabilityDate" className="block text-sm font-medium text-slate-700 mb-2">
                      Available From *
                    </label>
                    <input
                      type="date"
                      id="availabilityDate"
                      name="availabilityDate"
                      value={formData.availabilityDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${errors.availabilityDate ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                    />
                    {errors.availabilityDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.availabilityDate}</p>
                    )}
                  </div>

                  {/* Expected Salary */}


                  {/* Relevant Experience */}
                  <div className="lg:col-span-2">
                    <label htmlFor="relevantExperience" className="block text-sm font-medium text-slate-700 mb-2">
                      Relevant Experience *
                    </label>
                    <textarea
                      id="relevantExperience"
                      name="relevantExperience"
                      value={formData.relevantExperience}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${errors.relevantExperience ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                      placeholder="Describe your relevant maritime experience, similar routes, cargo types, etc."
                    />
                    {errors.relevantExperience && (
                      <p className="mt-1 text-sm text-red-600">{errors.relevantExperience}</p>
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="lg:col-span-2">
                    <label htmlFor="certifications" className="block text-sm font-medium text-slate-700 mb-2">
                      Maritime Certifications *
                    </label>
                    <textarea
                      id="certifications"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${errors.certifications ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                      placeholder="List your maritime certifications (STCW, Medical First Aid, etc.)"
                    />
                    {errors.certifications && (
                      <p className="mt-1 text-sm text-red-600">{errors.certifications}</p>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label htmlFor="emergencyContact" className="block text-sm font-medium text-slate-700 mb-2">
                      Emergency Contact Name *
                    </label>
                    <input
                      type="text"
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${errors.emergencyContact ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                      placeholder="Full name of emergency contact"
                    />
                    {errors.emergencyContact && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyContact}</p>
                    )}
                  </div>

                  {/* Emergency Phone */}
                  <div>
                    <label htmlFor="emergencyPhone" className="block text-sm font-medium text-slate-700 mb-2">
                      Emergency Contact Phone *
                    </label>
                    <input
                      type="tel"
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${errors.emergencyPhone ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.emergencyPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyPhone}</p>
                    )}
                  </div>

                  {/* Medical Certification */}
                  <div>
                    <label htmlFor="medicalCertification" className="block text-sm font-medium text-slate-700 mb-2">
                      Medical Certification Status *
                    </label>
                    <select
                      id="medicalCertification"
                      name="medicalCertification"
                      value={formData.medicalCertification}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${errors.medicalCertification ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                    >
                      <option value="">Select status</option>
                      <option value="valid">Valid and Current</option>
                      <option value="expiring">Expiring Soon</option>
                      <option value="renewal">Under Renewal</option>
                    </select>
                    {errors.medicalCertification && (
                      <p className="mt-1 text-sm text-red-600">{errors.medicalCertification}</p>
                    )}
                  </div>

                  {/* Passport Number */}
                  <div>
                    <label htmlFor="passportNumber" className="block text-sm font-medium text-slate-700 mb-2">
                      Passport Number *
                    </label>
                    <input
                      type="text"
                      id="passportNumber"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${errors.passportNumber ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                      placeholder="Passport number"
                    />
                    {errors.passportNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.passportNumber}</p>
                    )}
                  </div>

                  {/* Visa Status */}
                  <div className="lg:col-span-2">
                    <label htmlFor="visaStatus" className="block text-sm font-medium text-slate-700 mb-2">
                      Visa/Work Authorization Status *
                    </label>
                    <select
                      id="visaStatus"
                      name="visaStatus"
                      value={formData.visaStatus}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${errors.visaStatus ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                    >
                      <option value="">Select visa status</option>
                      <option value="citizen">Citizen</option>
                      <option value="permanent-resident">Permanent Resident</option>
                      <option value="work-visa">Valid Work Visa</option>
                      <option value="student-visa">Student Visa with Work Authorization</option>
                      <option value="other">Other (specify in message)</option>
                    </select>
                    {errors.visaStatus && (
                      <p className="mt-1 text-sm text-red-600">{errors.visaStatus}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
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
    </AnimatePresence>
  );
};

export default ShipmentApplicationModal;