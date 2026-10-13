import React from 'react';
import { motion } from 'framer-motion';
import { Home, Plus, Ship, FileText, User, LogOut, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PortActiveSection } from './PortAuthorityDashboard';

interface PortDashboardSidebarProps {
  activeSection: PortActiveSection;
  onSectionChange: (section: PortActiveSection) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const PortDashboardSidebar: React.FC<PortDashboardSidebarProps> = ({
  activeSection,
  onSectionChange,
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const menuItems = [
    { id: 'dashboard' as PortActiveSection, label: 'Dashboard', icon: Home },
    { id: 'create-job' as PortActiveSection, label: 'Create Job Post', icon: Plus },
    { id: 'active-shipments' as PortActiveSection, label: 'Active Shipments', icon: Ship },
    { id: 'completed-contracts' as PortActiveSection, label: 'Completed Contracts', icon: FileText },
    { id: 'profile' as PortActiveSection, label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-16 ${
          isCollapsed ? 'w-20' : 'w-64'
        } h-[calc(100vh-4rem)] bg-white/90 dark:bg-black/90 backdrop-blur-md border-r border-slate-200 dark:border-neutral-800 z-30 transition-all duration-300`}
      >
        <nav className="p-3 flex flex-col h-full justify-between">
          <div className="space-y-1.5">
            {/* Collapse Toggle Header (Desktop) */}
            {onToggleCollapse && (
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-3'} py-2 mb-1`}>
                {!isCollapsed && (
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                    Menu Navigation
                  </span>
                )}
                <button
                  onClick={onToggleCollapse}
                  title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </button>
              </div>
            )}

            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'space-x-3 px-4 py-3'
                  } w-full rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md font-semibold'
                      : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white dark:text-black' : 'text-slate-500 dark:text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-neutral-800">
            <Link
              to="/"
              title={isCollapsed ? 'Logout' : undefined}
              className={`flex items-center ${
                isCollapsed ? 'justify-center px-0 py-3' : 'space-x-3 px-4 py-3'
              } w-full rounded-xl font-medium text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden fixed left-0 top-0 w-72 max-w-[85vw] h-full bg-white dark:bg-neutral-950 border-r border-slate-200 dark:border-neutral-800 z-[10000] transition-colors shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-neutral-800">
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Port Authority</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 flex flex-col h-[calc(100%-4rem)] justify-between overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    onClose();
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md font-semibold'
                      : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white dark:text-black' : 'text-slate-500 dark:text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-neutral-800 mt-auto">
            <Link
              to="/"
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Logout</span>
            </Link>
          </div>
        </nav>
      </motion.aside>
    </>
  );
};

export default PortDashboardSidebar;