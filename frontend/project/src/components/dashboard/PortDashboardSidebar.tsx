import React from 'react';
import { motion } from 'framer-motion';
import { Home, Plus, Ship, FileText, User, LogOut, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PortActiveSection } from './PortAuthorityDashboard';

interface PortDashboardSidebarProps {
  activeSection: PortActiveSection;
  onSectionChange: (section: PortActiveSection) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PortDashboardSidebar: React.FC<PortDashboardSidebarProps> = ({
  activeSection,
  onSectionChange,
  isOpen,
  onClose
}) => {
  const menuItems = [
    { id: 'dashboard' as PortActiveSection, label: 'Dashboard', icon: Home },
    { id: 'create-job' as PortActiveSection, label: 'Create Job Post', icon: Plus },
    { id: 'active-shipments' as PortActiveSection, label: 'Active Shipments', icon: Ship },
    { id: 'completed-contracts' as PortActiveSection, label: 'Completed Contracts', icon: FileText },
    { id: 'profile' as PortActiveSection, label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 w-64 h-full bg-white border-r border-slate-200 z-30">
        <nav className="p-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <Link
              to="/"
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden fixed left-0 top-0 w-64 h-full bg-white border-r border-slate-200 z-50"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Port Authority</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <nav className="p-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  onClose();
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <Link
              to="/"
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        </nav>
      </motion.aside>
    </>
  );
};

export default PortDashboardSidebar;