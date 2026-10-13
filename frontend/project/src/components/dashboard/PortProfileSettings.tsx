import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Building, Edit, Save, X, Camera, Ship, FileText, Users, Briefcase } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PortProfileSettingsProps {
  portData: {
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
  };
  onUpdate?: () => void;
}

const PortProfileSettings: React.FC<PortProfileSettingsProps> = ({ portData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    name: portData?.name || '',
    email: portData?.email || '',
    phone: '+1 (555) 987-6543',
    portName: portData?.portName || '',
    city: portData?.location?.city || '',
    state: portData?.location?.state || '',
    country: portData?.location?.country || '',
    description: 'Major international port facility specializing in container shipping and maritime logistics.',
    facilities: 'Container terminals, Bulk cargo handling, Passenger services, Ship repair facilities',
    operatingHours: '24/7 Operations',
    website: 'www.portlink.maritime'
  });

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Administrator name cannot be empty');
      return;
    }
    if (!formData.email.trim() || !emailPattern.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/port/profile`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          portName: formData.portName,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Port Authority profile updated successfully');
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Failed to update port profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: portData?.name || '',
      email: portData?.email || '',
      phone: '+1 (555) 987-6543',
      portName: portData?.portName || '',
      city: portData?.location?.city || '',
      state: portData?.location?.state || '',
      country: portData?.location?.country || '',
      description: 'Major international port facility specializing in container shipping and maritime logistics.',
      facilities: 'Container terminals, Bulk cargo handling, Passenger services, Ship repair facilities',
      operatingHours: '24/7 Operations',
      website: 'www.portlink.maritime'
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6 min-w-0"
    >
      {/* Profile Header */}
      <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors duration-300 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-3 sm:gap-5 min-w-0">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-900 text-white dark:bg-white dark:text-black rounded-2xl flex items-center justify-center shadow-md">
                <Building className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-neutral-800 rounded-full shadow-md flex items-center justify-center border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors">
                <Camera className="w-3.5 h-3.5 text-slate-600 dark:text-neutral-300" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 break-words">{portData.name}</h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mb-1 font-medium">Port Authority Administrator</p>
              <p className="text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 break-words">{portData.portName}</p>
              <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span className="break-words">{portData.location.city}, {portData.location.state}, {portData.location.country}</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-black font-semibold rounded-xl text-xs shadow-sm hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 rounded-xl font-semibold text-xs hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-black font-semibold rounded-xl text-xs shadow-sm hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors duration-300 min-w-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Personal Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                />
              ) : (
                <div className="flex items-center space-x-3 text-sm">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">{formData.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                />
              ) : (
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">{formData.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                />
              ) : (
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">{formData.phone}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Website</label>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                />
              ) : (
                <div className="flex items-center space-x-3 text-sm">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">{formData.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Port Information */}
        <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors duration-300">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Port Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Port Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.portName}
                  onChange={(e) => setFormData({ ...formData, portName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{formData.portName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-neutral-200">{formData.city}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-neutral-200">{formData.state}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-neutral-200">{formData.country}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Description</label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                />
              ) : (
                <p className="text-sm text-slate-700 dark:text-neutral-300 leading-relaxed">{formData.description}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Facilities</label>
              {isEditing ? (
                <textarea
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                />
              ) : (
                <p className="text-sm text-slate-700 dark:text-neutral-300 leading-relaxed">{formData.facilities}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Operating Hours</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{formData.operatingHours}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Port Statistics */}
      <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors duration-300">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Port Performance Statistics</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Ship className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">{portData.totalShipsInTransit}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Ships In Transit</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">{portData.totalContractsCompleted}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Contracts Completed</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">{portData.activeJobPosts}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Active Job Posts</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">{portData.registeredSailors}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Registered Sailors</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PortProfileSettings;