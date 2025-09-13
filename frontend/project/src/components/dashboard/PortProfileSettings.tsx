import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Building, Edit, Save, X, Camera, Ship, FileText, Users, Briefcase } from 'lucide-react';

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
}

const PortProfileSettings: React.FC<PortProfileSettingsProps> = ({ portData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: portData.name,
    email: portData.email,
    phone: '+1 (555) 987-6543',
    portName: portData.portName,
    city: portData.location.city,
    state: portData.location.state,
    country: portData.location.country,
    description: 'Major international port facility specializing in container shipping and maritime logistics.',
    facilities: 'Container terminals, Bulk cargo handling, Passenger services, Ship repair facilities',
    operatingHours: '24/7 Operations',
    website: 'www.portofmiami.com'
  });

  const handleSave = () => {
    console.log('Saving port profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: portData.name,
      email: portData.email,
      phone: '+1 (555) 987-6543',
      portName: portData.portName,
      city: portData.location.city,
      state: portData.location.state,
      country: portData.location.country,
      description: 'Major international port facility specializing in container shipping and maritime logistics.',
      facilities: 'Container terminals, Bulk cargo handling, Passenger services, Ship repair facilities',
      operatingHours: '24/7 Operations',
      website: 'www.portofmiami.com'
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
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Building className="w-12 h-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-slate-200 hover:bg-slate-50 transition-colors">
                <Camera className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{portData.name}</h1>
              <p className="text-slate-600 mb-1">Port Authority Administrator</p>
              <p className="text-blue-600 font-semibold mb-3">{portData.portName}</p>
              <div className="flex items-center space-x-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{portData.location.city}, {portData.location.state}, {portData.location.country}</span>
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
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-800">{formData.phone}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-800">{formData.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Port Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Port Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Port Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.portName}
                  onChange={(e) => setFormData({ ...formData, portName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-slate-800 font-semibold">{formData.portName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-800">{formData.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-800">{formData.state}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-800">{formData.country}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-slate-800">{formData.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Facilities</label>
              {isEditing ? (
                <textarea
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-slate-800">{formData.facilities}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Operating Hours</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-slate-800">{formData.operatingHours}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Port Statistics */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Port Performance Statistics</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Ship className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-500 mb-2">{portData.totalShipsInTransit}</div>
            <div className="text-slate-600">Ships In Transit</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-emerald-500 mb-2">{portData.totalContractsCompleted}</div>
            <div className="text-slate-600">Contracts Completed</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-purple-500 mb-2">{portData.activeJobPosts}</div>
            <div className="text-slate-600">Active Job Posts</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-amber-500 mb-2">{portData.registeredSailors}</div>
            <div className="text-slate-600">Registered Sailors</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PortProfileSettings;