import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Chrome } from 'lucide-react';

interface AuthMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmail: () => void;
  onSelectGoogle: () => void;
}

const AuthMethodModal: React.FC<AuthMethodModalProps> = ({
  isOpen,
  onClose,
  onSelectEmail,
  onSelectGoogle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl text-slate-900 dark:text-white transition-colors"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Join PortLink
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Select your preferred authentication method
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onSelectEmail}
            className="w-full flex items-center justify-center p-3.5 border border-slate-300 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-black hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors group"
          >
            <Mail className="h-5 w-5 mr-3 text-slate-700 dark:text-neutral-300 group-hover:scale-105 transition-transform" />
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Sign up with Email</span>
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-neutral-900 text-slate-400 dark:text-neutral-500">Or</span>
            </div>
          </div>

          <button
            onClick={onSelectGoogle}
            className="w-full flex items-center justify-center p-3.5 border border-slate-300 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-black hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors group"
          >
            <img src="../images/google.png" alt="Google Logo" className="w-5 h-5 mr-3 group-hover:scale-105 transition-transform" />
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Continue with Google</span>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-neutral-500">
          By continuing, you agree to PortLink's Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthMethodModal;