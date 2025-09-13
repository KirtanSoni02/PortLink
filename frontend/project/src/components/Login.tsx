import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleAuthButton from './GoogleAuthButton';

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
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

      alert('Login Successful');
      const role = response.data.role;

      // Navigate based on role
      if (role === 'sailor') {
        navigate('/dashboard/sailor');
      } else if (role === 'port') {
        navigate('/dashboard/port-authority');
      } else if (role === 'service') {
        navigate('/dashboard/service');
      } else {
        navigate('/dashboard');
      }

      // Store token for auth
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      console.log(response.data);
    } catch (err) {
      alert('Login failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const newErrors: FormErrors = { ...errors };

    // Real-time validation for email
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

    // Real-time validation for password
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
    console.log("Google login response:", response);

    if (response.success) {
      alert('Google Login Successful');
      const role = response.user.role;

      // Navigate based on role
      if (role === 'sailor') {
        navigate('/dashboard/sailor');
      } else if (role === 'port') {
        navigate('/dashboard/port-authority');
      } else if (role === 'service') {
        navigate('/dashboard/service');
      } else {
        navigate('/dashboard');
      }

      // Store token for auth
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } else {
      alert('Google login failed: ' + (response.error || 'Unknown error'));
    }
  };

  const handleGoogleError = (error: any) => {
    console.error('Google authentication error:', error);
    alert('Google authentication failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-white"
      >
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full">
              <Anchor className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Login to PortLink</h1>
            <p className="text-slate-600">Welcome back to your maritime platform</p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Log In'
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Auth Button */}
            <GoogleAuthButton
              mode="login"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-sky-600 hover:text-sky-500 transition-colors duration-300"
                >
                  Register here
                </Link>
              </p>
            </div>
          </motion.form>
        </div>
      </motion.div>

      {/* Right Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-1 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 to-emerald-900/20 z-10"></div>
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8 }}
          src="../../../images/Login_Page_Image.png"
          alt="Maritime scene"
          className="w-full h-full object-cover"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 z-20 flex items-end p-12">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Navigate Your Future</h2>
            <p className="text-xl text-white/90">
              Join the digital maritime revolution and connect with ports worldwide
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;