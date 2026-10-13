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
      setCountdown(30);
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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl text-slate-900 dark:text-white transition-colors"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Verify Email Code</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-neutral-400 mb-4">
          Enter the 6-digit verification code sent to <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1">
              OTP Security Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2.5 text-center tracking-widest text-lg font-mono border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-black rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500 dark:focus:ring-white transition-colors"
              placeholder="000000"
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center font-medium">{error}</p>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className={`text-xs font-medium ${
                countdown > 0
                  ? 'text-slate-400 dark:text-neutral-500 cursor-not-allowed'
                  : 'text-slate-900 dark:text-white hover:underline'
              }`}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </button>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-black rounded-xl hover:bg-slate-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default OTPModal;