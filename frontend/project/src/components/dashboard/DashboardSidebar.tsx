import React from 'react';
import { motion } from 'framer-motion';
import { Home, FileText, Ship, User, LogOut, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ActiveSection } from './SailorDashboard';

interface DashboardSidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeSection,
  onSectionChange,
  isOpen,
  onClose
}) => {
  const menuItems = [
    { id: 'dashboard' as ActiveSection, label: 'Dashboard', icon: Home },
    { id: 'contracts' as ActiveSection, label: 'Contract History', icon: FileText },
    { id: 'shipments' as ActiveSection, label: 'Available Shipments', icon: Ship },
    { id: 'profile' as ActiveSection, label: 'Profile Settings', icon: User }
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
                    ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg'
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
          <h2 className="text-lg font-bold text-slate-800">Menu</h2>
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
                    ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg'
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

export default DashboardSidebar;