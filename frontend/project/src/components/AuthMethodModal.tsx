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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Choose Authentication Method</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={onSelectEmail}
            className="w-full flex items-center justify-center p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Mail className="h-6 w-6 mr-3 text-slate-600" />
            <span className="text-lg font-medium">Sign up with Email</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            onClick={onSelectGoogle}
            className="w-full flex items-center justify-center p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {/* <Chrome className="h-6 w-6 mr-3 text-slate-600" /> */}
            <img src="../images/google.png" alt="Google Logo" className="w-6 h-6 mr-3" />
            <span className="text-lg font-medium">Continue with Google</span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthMethodModal;