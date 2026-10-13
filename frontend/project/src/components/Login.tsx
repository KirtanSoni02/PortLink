import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Eye, EyeOff, Mail, Lock, ArrowLeft, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import GoogleAuthButton from './GoogleAuthButton';
import { useTheme } from '../context/ThemeContext';

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const passwordPattern = /^[A-Za-z0-9]{8,}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const tempEmailDomains = [
    'tempmail.com', '10minutemail.com', 'mailinator.com', 'dispostable.com',
    'guerrillamail.com', 'yopmail.com', 'fakeinbox.com', 'trashmail.com',
  ];

  const isTempEmail = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return tempEmailDomains.includes(domain);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (isTempEmail(formData.email)) {
      newErrors.email = 'Temporary/disposable emails are not allowed';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters and contain only letters and numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Login Successful! Welcome back.');
      const role = response.data.role;

      if (role === 'sailor') {
        navigate('/dashboard/sailor');
      } else if (role === 'port') {
        navigate('/dashboard/port-authority');
      } else if (role === 'service') {
        navigate('/dashboard/service');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const newErrors: FormErrors = { ...errors };

    if (name === 'email') {
      if (!value.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailPattern.test(value)) {
        newErrors.email = 'Invalid email format';
      } else if (isTempEmail(value)) {
        newErrors.email = 'Temporary/disposable emails are not allowed';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password') {
      if (!value.trim()) {
        newErrors.password = 'Password is required';
      } else if (!passwordPattern.test(value)) {
        newErrors.password = 'Password must be at least 8 characters and contain only letters and numbers';
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const handleGoogleSuccess = (response: any) => {
    if (response.success) {
      toast.success('Google Login Successful!');
      const role = response.user.role;

      if (role === 'sailor') {
        navigate('/dashboard/sailor');
      } else if (role === 'port') {
        navigate('/dashboard/port-authority');
      } else if (role === 'service') {
        navigate('/dashboard/service');
      } else {
        navigate('/dashboard');
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } else {
      toast.error('Google login failed: ' + (response.error || 'Unknown error'));
    }
  };

  const handleGoogleError = (error: any) => {
    console.error('Google authentication error:', error);
    toast.error('Google authentication failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
      {/* Left Side - Form Container */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-between p-6 sm:p-12 relative z-10"
      >
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between max-w-md mx-auto w-full mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-200 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:bg-slate-300 dark:hover:bg-neutral-800 border border-slate-300 dark:border-neutral-800 transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-800" />
            )}
          </button>
        </div>

        {/* Center Form */}
        <div className="w-full max-w-md mx-auto my-auto">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-slate-900 dark:bg-neutral-900 border border-slate-800 dark:border-neutral-700 text-white shadow-md">
              <Anchor className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5">
              Login to PortLink
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400">
              Enter your credentials to access your maritime dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400 dark:text-neutral-500" />
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.email
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300'
                      : 'border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-white'
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400 dark:text-neutral-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-9 pr-10 py-2.5 text-sm border rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.password
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300'
                      : 'border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-white'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold text-white dark:text-black bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Log In'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-neutral-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-slate-50 dark:bg-black text-slate-500 dark:text-neutral-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Auth Button */}
            <GoogleAuthButton
              mode="login"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            {/* Register Link */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-600 dark:text-neutral-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-slate-900 dark:text-white hover:underline transition-colors"
                >
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 dark:text-neutral-500 pt-6">
          © 2025 PortLink. Secure Maritime Telemetry Platform.
        </div>
      </motion.div>

      {/* Right Side - Image Panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div>
        <img
          src="../../../images/Login_Page_Image.png"
          alt="Maritime vessel operations"
          className="w-full h-full object-cover opacity-90"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 z-20 flex items-end p-12">
          <div className="text-white max-w-lg">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider mb-3">
              <span>Port & Crew Telemetry</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Navigate Maritime Operations with Precision
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              Connect with global ports, track real-time vessel telemetry, and execute certified sailor contracts seamlessly.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;