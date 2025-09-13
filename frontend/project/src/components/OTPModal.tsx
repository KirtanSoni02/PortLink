import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, email, onVerify, onResend }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCountdown(30); // 30 seconds countdown for resend
      const timer = setInterval(() => {
        setCountdown(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    const isValid = await onVerify(otp);
    if (!isValid) {
      setError('Invalid OTP. Please try again.');
    }

    setIsLoading(false);
  };

  const handleResend = () => {
    if (countdown === 0) {
      onResend();
      setCountdown(30);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Verify Email</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Enter the 6-digit code sent to <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter 6-digit code"
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className={`text-sm ${countdown > 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'
                }`}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
            </button>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default OTPModal;