import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Star, Edit, Save, X, Camera } from 'lucide-react';
import axios from 'axios';

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
  };
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ sailorData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: sailorData.name,
    email: sailorData.email,
    phone: sailorData.phone,
    location: sailorData.location,
    bio: 'Experienced maritime professional with 8+ years in international shipping.',
    certifications: 'STCW Basic Safety Training, Advanced Firefighting, Medical First Aid',
    languages: 'English (Native), Spanish (Fluent), Portuguese (Conversational)'
  });
  const API_URL = import.meta.env.VITE_API_URL;

 const handleSave = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/api/sailor/edit-profile`,{
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      alert('Profile updated successfully. Please log out and log in again to see changes reflected.');
      setIsEditing(false);
    } else {
      alert('Failed to update profile.');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Something went wrong while updating your profile.');
  }
};

  const handleCancel = () => {
    setFormData({
      name: sailorData.name,
      email: sailorData.email,
      phone: sailorData.phone,
      location: sailorData.location,
      bio: 'Experienced maritime professional with 8+ years in international shipping.',
      certifications: 'STCW Basic Safety Training, Advanced Firefighting, Medical First Aid',
      languages: 'English (Native), Spanish (Fluent), Portuguese (Conversational)'
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-slate-200 hover:bg-slate-50 transition-colors">
                <Camera className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{sailorData.name}</h1>
              <p className="text-slate-600 mb-3">Professional Sailor</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-amber-500 fill-current" />
                  <span className="font-semibold text-slate-800">{sailorData.rating}</span>
                  <span className="text-slate-600">rating</span>
                </div>
                <div className="text-slate-600">
                  {sailorData.completedContracts} contracts completed
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Personal Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-800">{formData.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-800">{formData.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-800">{formData.phone}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-800">{formData.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Professional Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <p className="text-slate-800">{formData.bio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Experience</label>
              <p className="text-slate-800">{sailorData.experience}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Certifications</label>
              {isEditing ? (
                <textarea
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <p className="text-slate-800">{formData.certifications}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Languages</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <p className="text-slate-800">{formData.languages}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Performance Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-sky-500 mb-2">{sailorData.completedContracts}</div>
            <div className="text-slate-600">Contracts Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-500 mb-2">{sailorData.rating}</div>
            <div className="text-slate-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">98%</div>
            <div className="text-slate-600">On-Time Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-500 mb-2">24</div>
            <div className="text-slate-600">Countries Visited</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;