import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, User, LogOut, Settings, Anchor, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PortDashboardHeaderProps {
  portData: {
    name: string;
    email: string;
    portName: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
  };
  onMenuClick: () => void;
}

const PortDashboardHeader: React.FC<PortDashboardHeaderProps> = ({ portData, onMenuClick }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'New sailor application received', time: '5 min ago', unread: true },
    { id: 2, message: 'Ship "Ocean Navigator" requesting docking', time: '15 min ago', unread: true },
    { id: 3, message: 'Weather alert for port area', time: '1 hour ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50" style={{ pointerEvents: "auto", zIndex: 9999 }}>
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>

          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full">
              <Anchor className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-slate-800">PortLink</span>
              <div className="text-xs text-slate-500">Port Authority</div>
            </div>
          </Link>
        </div>

        {/* Center - Port Info */}
        <div className="hidden md:flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-500" />
          <div>
            <div className="text-sm font-semibold text-slate-800">{portData.portName}</div>
            <div className="text-xs text-slate-500">
              {portData.location.city}, {portData.location.state}
            </div>
          </div>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <div className="relative">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="w-6 h-6 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div> */}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-slate-800">{portData.name}</div>
                <div className="text-xs text-slate-500">Port Authority</div>
              </div>
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2"
                >
                  <div className="px-4 py-3 border-b border-slate-200">
                    <div className="font-medium text-slate-800">{portData.name}</div>
                    <div className="text-sm text-slate-500">{portData.email}</div>
                    <div className="text-xs text-blue-600 mt-1">{portData.portName}</div>
                  </div>

                  <div className="py-2">

                    <Link
                      to="/"
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-700">Logout</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortDashboardHeader;