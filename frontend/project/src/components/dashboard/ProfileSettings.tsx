import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Star, Edit, Save, X, Camera, Award } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ProfileSettingsProps {
  sailorData: {
    id: string;
    name: string;
    email: string;
    phone: string;
    experience: string;
    location: string;
    rating: number;
    completedContracts: number;
    profilePicture?: string;
  };
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ sailorData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: sailorData?.name || '',
    email: sailorData?.email || '',
    phone: sailorData?.phone || '',
    location: sailorData?.location || '',
    bio: 'Certified maritime officer dedicated to safe navigation, vessel management, and international transport compliance.',
    certifications: 'STCW Basic Safety Training, Advanced Firefighting, Medical First Aid, GMDSS Radio Operator',
    languages: 'English (Professional), Spanish (Conversational)',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(sailorData?.profilePicture || null);
  const API_URL = import.meta.env.VITE_API_URL;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty.');
      return false;
    }
    if (!formData.email.trim() || !emailPattern.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('location', formData.location);
      if (selectedFile) {
        formDataToSend.append('profilePicture', selectedFile);
      }

      const response = await axios.put(`${API_URL}/api/sailor/edit-profile`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Something went wrong while updating your profile.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: sailorData?.name || '',
      email: sailorData?.email || '',
      phone: sailorData?.phone || '',
      location: sailorData?.location || '',
      bio: 'Certified maritime officer dedicated to safe navigation, vessel management, and international transport compliance.',
      certifications: 'STCW Basic Safety Training, Advanced Firefighting, Medical First Aid, GMDSS Radio Operator',
      languages: 'English (Professional), Spanish (Conversational)',
    });
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 min-w-0">
      {/* Profile Header Card */}
      <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4 sm:space-x-6 min-w-0">
            {/* Profile Picture */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-900 text-white dark:bg-white dark:text-black rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
                {previewUrl ? (
                  <img src={previewUrl.startsWith('http') ? previewUrl : `${API_URL}${previewUrl}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 sm:w-12 sm:h-12" />
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-neutral-800 rounded-full shadow-md flex items-center justify-center border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-neutral-300" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                        setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Basic Info */}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 truncate">{formData.name || 'Professional Sailor'}</h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mb-2 font-medium">Certified Maritime Crew Member</p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-1 font-semibold text-slate-800 dark:text-neutral-200">
                  <Star className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-current" />
                  <span>{sailorData?.rating || 5.0}</span>
                  <span className="text-slate-500 dark:text-neutral-400 font-normal">Rating</span>
                </div>
                <div className="text-slate-500 dark:text-neutral-400">
                  <span className="font-semibold text-slate-900 dark:text-white">{sailorData?.completedContracts || 0}</span> contracts completed
                </div>
              </div>
            </div>
          </div>

          {/* Edit / Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-black font-semibold rounded-xl text-xs shadow-sm hover:bg-slate-800 dark:hover:bg-neutral-200 transition-all"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-sm text-slate-900 dark:text-white">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-neutral-800 pb-3">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Personal Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-xl border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <div className="flex items-center space-x-3 text-sm font-medium">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{formData.name || 'N/A'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-xl border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <div className="flex items-center space-x-3 text-sm font-medium">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{formData.email || 'N/A'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-xl border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <div className="flex items-center space-x-3 text-sm font-medium">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{formData.phone || 'N/A'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Home Location / Base</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-xl border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <div className="flex items-center space-x-3 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{formData.location || 'Not Specified'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-sm text-slate-900 dark:text-white">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-neutral-800 pb-3">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Professional Credentials
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Bio / Profile Overview</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border rounded-xl border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-700 dark:text-neutral-300 leading-relaxed">{formData.bio}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Seafaring Experience</label>
              <p className="text-sm font-semibold">{sailorData?.experience || 'Certified Crew Member'}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Certifications</label>
              {isEditing ? (
                <textarea
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border rounded-xl border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <p className="text-xs text-slate-700 dark:text-neutral-300 font-mono">{formData.certifications}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Languages Spoken</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-xl border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <p className="text-xs font-medium text-slate-700 dark:text-neutral-300">{formData.languages}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;