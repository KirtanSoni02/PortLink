import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Eye, EyeOff, User, Mail, Phone, MapPin, Globe, Briefcase, ArrowLeft, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Country, State, City } from 'country-state-city';
import OTPModal from './OTPModal';
import AuthMethodModal from './AuthMethodModal';
import GoogleAuthButton from './GoogleAuthButton';
import { useTheme } from '../context/ThemeContext';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  location: string;
  city: string;
  state: string;
  country: string;
  experience: string;
  selectedPort: string;
}

interface FormErrors {
  [key: string]: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    location: '',
    city: '',
    state: '',
    country: '',
    experience: '',
    selectedPort: ''
  });

  const [portList] = useState<string[]>([
    "Port of Deendayal (Kandla)", "Port of Mumbai", "Port of Jawaharlal Nehru (Nhava Sheva)", "Port of Mormugao", "Port of New Mangalore", "Port of Cochin (Kochi)", "Port of V.O. Chidambaranar (Tuticorin)", "Port of Chennai", "Port of Kamarajar (Ennore)", "Port of Visakhapatnam", "Port of Paradip", "Port of Syama Prasad Mookerjee (Kolkata)", "Port of Port Blair", "Port of Vadhavan", "Port of Porbandar", "Port of Veraval", "Port of Bhavnagar", "Port of Bharuch", "Port of Surat", "Port of Mandvi", "Port of Navlakhi", "Port of Bedi", "Port of Sikka", "Port of Jafarabad", "Port of Okha", "Port of Magdalla", "Port of Mundra", "Port of Pipavav", "Port of Dahej", "Port of Hazira", "Port of Tuna", "Port of Ratnagiri", "Port of Dahanu", "Port of Tarapur", "Port of Satpati", "Port of Kellwa-Mahim", "Port of Arnala", "Port of Uttan", "Port of Bassein", "Port of Bhiwandi", "Port of Manori", "Port of Kalyan", "Port of Thane", "Port of Versova", "Port of Bandra", "Port of Trombay", "Port of Ulwa-Belapur", "Port of Panvel", "Port of More", "Port of Mandwa", "Port of Karanja", "Port of Thal", "Port of Rewas", "Port of Alibag", "Port of Dharamtar", "Port of Revdanda", "Port of Borli/Mandla", "Port of Nandgaon", "Port of Murud-Janjira", "Port of Rajpuri", "Port of Mandad", "Port of Dighi", "Port of Panaji", "Port of Chapora", "Port of Betul", "Port of Talpona", "Port of Tiracol", "Port of Mangalore", "Port of Malpe", "Port of Hangarkatta", "Port of Kundapur", "Port of Bhatkal", "Port of Honavar", "Port of Tadri", "Port of Belekeri", "Port of Karwar", "Port of Padubidri", "Port of Alappuzha", "Port of Vadakara", "Port of Kannur", "Port of Kasargode", "Port of Kodungallore", "Port of Ponnani", "Port of Thalassery", "Port of Thiruvananthapuram", "Port of Kollam (Quilon)", "Port of Kozhikode/Beypore", "Port of Neendakara", "Port of Azhikkal", "Port of Vizhinjam", "Port of Nagapattinam", "Port of Kattupalli", "Port of Karaikal", "Port of Cuddalore", "Port of Thirukkadaiyur", "Port of Koondankulam", "Port of Machilipatnam", "Port of Kakinada", "Port of Krishnapatnam", "Port of Gangavaram", "Port of Bhavanapadu", "Port of Calingapatnam", "Port of Bheemunipatnam", "Port of Narsapur", "Port of Vadarevu", "Port of Nizampatnam", "Port of Gopalpur", "Port of Dhamra", "Port of Kulpi", "Port of Durgachak", "Port of Farakka", "Port of Sahebganj"
  ]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [allCountries] = useState(Country.getAllCountries());
  const [allStates, setAllStates] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);

  const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
  const [filteredStates, setFilteredStates] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);

  const [countryInput, setCountryInput] = useState('');
  const [stateInput, setStateInput] = useState('');
  const [cityInput, setCityInput] = useState('');

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [googleData, setGoogleData] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | null>(null);

  useEffect(() => {
    if (authMethod) {
      setShowAuthModal(false);
    }
  }, [authMethod]);

  const handleCountrySelect = (country: any) => {
    setFormData(prev => ({ ...prev, country: country.name, state: '', city: '' }));
    setCountryInput(country.name);
    setAllStates(State.getStatesOfCountry(country.isoCode));
    setAllCities([]);
    setShowCountryDropdown(false);
  };

  const handleStateSelect = (state: any) => {
    setFormData(prev => ({ ...prev, state: state.name, city: '' }));
    setStateInput(state.name);
    const countryCode = allCountries.find(c => c.name === formData.country)?.isoCode;
    if (countryCode) {
      setAllCities(City.getCitiesOfState(countryCode, state.isoCode));
    }
    setShowStateDropdown(false);
  };

  const handleCitySelect = (city: any) => {
    setFormData(prev => ({ ...prev, city: city.name }));
    setCityInput(city.name);
    setShowCityDropdown(false);
  };

  const handleCountryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountryInput(value);
    setFilteredCountries(
      allCountries.filter(country =>
        country.name.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowCountryDropdown(true);
  };

  const handleStateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStateInput(value);
    setFilteredStates(
      allStates.filter(state =>
        state.name.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowStateDropdown(true);
  };

  const handleCityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    setFilteredCities(
      allCities.filter(city =>
        city.name.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowCityDropdown(true);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach(key => {
      if (
        key !== "selectedPort" &&
        key !== "password" &&
        !formData[key as keyof FormData]?.trim()
      ) {
        newErrors[key] = "This field cannot be empty";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (authMethod === 'email' && formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.role === "port") {
      if (!formData.selectedPort || !formData.selectedPort.trim()) {
        newErrors.selectedPort = "Please select your port";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const sendOTP = async () => {
    if (!formData.email || errors.email) {
      toast.error('Please enter a valid email first');
      return;
    }

    setIsSendingOTP(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
        email: formData.email
      });
      setVerificationToken(response.data.token);
      setIsOTPModalOpen(true);
      toast.success('OTP sent to your email!');
    } catch (error: any) {
      console.error('OTP sending error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp,
        token: verificationToken
      });

      if (response.data.success) {
        setIsEmailVerified(true);
        setIsOTPModalOpen(false);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const resendOTP = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/resend-otp`, {
        email: formData.email,
        token: verificationToken
      });
      toast.success('OTP sent again!');
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (authMethod === 'email' && !isEmailVerified) {
      toast.error('Please verify your email first');
      return;
    }

    setIsLoading(true);

    try {
      let response;

      if (authMethod === 'google') {
        response = await axios.post(`${API_URL}/api/auth/complete-google-profile`, {
          googleData,
          ...formData
        });
      } else {
        response = await axios.post(`${API_URL}/api/auth/register`, {
          ...formData,
          verificationToken: isEmailVerified ? verificationToken : undefined
        });
      }

      if (response.data.success) {
        toast.success("Registration successful!");
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response?.status === 409) {
        toast.error("User already exists");
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };

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

    if (name === 'password' && authMethod === 'email') {
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

  const handleEmailAuthSelect = () => {
    setAuthMethod('email');
    setShowAuthModal(false);
  };

  const handleGoogleAuthSelect = () => {
    setAuthMethod('google');
    setShowAuthModal(false);
  };

  const handleGoogleSuccess = (response: any) => {
    if (response.profileComplete) {
      localStorage.setItem('token', response.token);
      navigate('/dashboard');
    } else if (response.googleData) {
      setGoogleData(response.googleData);
      setFormData(prev => ({
        ...prev,
        email: response.googleData.email,
        firstName: response.googleData.firstName || '',
        lastName: response.googleData.lastName || '',
      }));
      setIsEmailVerified(true);
    } else {
      toast.error('Unexpected response from server. Please try again.');
    }
  };

  const inputFields = [
    { name: 'firstName', label: 'First Name', type: 'text', icon: User, placeholder: 'Enter your first name' },
    { name: 'lastName', label: 'Last Name', type: 'text', icon: User, placeholder: 'Enter your last name' },
    { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: 'Enter your phone number' },
    { name: 'location', label: 'Location', type: 'text', icon: MapPin, placeholder: 'Enter your location' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
      {/* Auth Method Modal */}
      <AuthMethodModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSelectEmail={handleEmailAuthSelect}
        onSelectGoogle={handleGoogleAuthSelect}
      />

      {/* OTP Modal */}
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        email={formData.email}
        onVerify={verifyOTP}
        onResend={resendOTP}
      />

      {/* Left Side - Form Container */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto relative z-10"
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
        <div className="w-full max-w-md mx-auto my-auto py-4">
          {/* Header Branding */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-slate-900 dark:bg-neutral-900 border border-slate-800 dark:border-neutral-700 text-white shadow-md">
              <Anchor className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400">
              Join PortLink maritime digital platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Fields */}
            {inputFields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <field.icon className="h-4 w-4 text-slate-400 dark:text-neutral-500" />
                  </div>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof FormData]}
                    onChange={handleInputChange}
                    className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 transition-all ${
                      errors[field.name]
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300'
                        : 'border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-white'
                    }`}
                    placeholder={field.placeholder}
                  />
                </div>
                {errors[field.name] && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[field.name]}</p>
                )}
              </div>
            ))}

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
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={authMethod === 'google'}
                  className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.email
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300'
                      : 'border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-white'
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            {authMethod === 'email' && (
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-slate-400 dark:text-neutral-500" />
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
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>
            )}

            {/* Verify Email Button */}
            {authMethod === 'email' && (
              <button
                type="button"
                onClick={sendOTP}
                disabled={isSendingOTP || !!errors.email || !formData.email || isEmailVerified}
                className={`w-full py-2.5 px-4 rounded-lg shadow-sm text-xs font-semibold border transition-all ${
                  isEmailVerified
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                    : isSendingOTP || errors.email || !formData.email
                      ? 'bg-slate-100 dark:bg-neutral-900 text-slate-400 dark:text-neutral-600 border-slate-200 dark:border-neutral-800 cursor-not-allowed'
                      : 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white border-slate-300 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800'
                }`}
              >
                {isSendingOTP ? 'Sending Verification Code...' : isEmailVerified ? '✓ Email Verified' : 'Verify Email with OTP'}
              </button>
            )}

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1">
                Country
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-4 w-4 text-slate-400 dark:text-neutral-500" />
                </div>
                <input
                  type="text"
                  id="country"
                  name="country"
                  autoComplete="off"
                  value={countryInput}
                  onChange={handleCountryInput}
                  onFocus={() => setShowCountryDropdown(true)}
                  className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.country
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300'
                      : 'border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-white'
                  }`}
                  placeholder="Type to search country"
                />
                {showCountryDropdown && countryInput.length > 0 && (
                  <ul className="absolute z-20 w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg text-xs">
                    {filteredCountries.map((country, idx) => (
                      <li
                        key={idx}
                        className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer text-slate-900 dark:text-white"
                        onClick={() => handleCountrySelect(country)}
                      >
                        {country.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* State */}
            {formData.country && (
              <div>
                <label htmlFor="state" className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1">
                  State / Province
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-slate-400 dark:text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    autoComplete="off"
                    value={stateInput}
                    onChange={handleStateInput}
                    onFocus={() => setShowStateDropdown(true)}
                    className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1"
                    placeholder="Type to search state"
                  />
                  {showStateDropdown && stateInput.length > 0 && (
                    <ul className="absolute z-20 w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg text-xs">
                      {filteredStates.map((state, idx) => (
                        <li
                          key={idx}
                          className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer text-slate-900 dark:text-white"
                          onClick={() => handleStateSelect(state)}
                        >
                          {state.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* City */}
            {formData.country && formData.state && (
              <div>
                <label htmlFor="city" className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1">
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-slate-400 dark:text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    autoComplete="off"
                    value={cityInput}
                    onChange={handleCityInput}
                    onFocus={() => setShowCityDropdown(true)}
                    className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1"
                    placeholder="Type to search city"
                  />
                  {showCityDropdown && cityInput.length > 0 && (
                    <ul className="absolute z-20 w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg text-xs">
                      {filteredCities.map((city, idx) => (
                        <li
                          key={idx}
                          className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer text-slate-900 dark:text-white"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Role Dropdown */}
            <div>
              <label htmlFor="role" className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1">
                Account Persona / Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-slate-400 dark:text-neutral-500" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1"
                >
                  <option value="">Select your role</option>
                  <option value="sailor">Sailor</option>
                  <option value="port">Port Authority</option>
                </select>
              </div>

              {formData.role === "port" && (
                <div className="mt-3">
                  <label htmlFor="selectedPort" className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1">
                    Select Port You Work At
                  </label>
                  <select
                    id="selectedPort"
                    name="selectedPort"
                    value={formData.selectedPort}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2.5 text-sm border border-slate-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                  >
                    <option value="">-- Select a Port --</option>
                    {portList.map((port, idx) => (
                      <option key={idx} value={port}>{port}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (authMethod === 'google' && !googleData)}
              className="w-full py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold text-white dark:text-black bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-6"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-600 dark:text-neutral-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-slate-900 dark:text-white hover:underline transition-colors"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 dark:text-neutral-500 pt-4">
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
          src="../../images/Register_Page_Image.jpg"
          alt="Port and maritime operations"
          className="w-full h-full object-cover opacity-90"
        />

        <div className="absolute inset-0 z-20 flex items-end p-12">
          <div className="text-white max-w-lg">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider mb-3">
              <span>Maritime Ecosystem</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Chart Your Maritime Future
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              Connect with verified maritime professionals, ports, and real-time telemetry streams worldwide.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;