import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Eye, EyeOff, User, Mail, Phone, MapPin, Globe, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const [portList, setPortList] = useState<string[]>([
    "Port of Deendayal (Kandla)", "Port of Mumbai", "Port of Jawaharlal Nehru (Nhava Sheva)", "Port of Mormugao", "Port of New Mangalore", "Port of Cochin (Kochi)", "Port of V.O. Chidambaranar (Tuticorin)", "Port of Chennai", "Port of Kamarajar (Ennore)", "Port of Visakhapatnam", "Port of Paradip", "Port of Syama Prasad Mookerjee (Kolkata)", "Port of Port Blair", "Port of Vadhavan", "Port of Porbandar", "Port of Veraval", "Port of Bhavnagar", "Port of Bharuch", "Port of Surat", "Port of Mandvi", "Port of Navlakhi", "Port of Bedi", "Port of Sikka", "Port of Jafarabad", "Port of Okha", "Port of Magdalla", "Port of Mundra", "Port of Pipavav", "Port of Dahej", "Port of Hazira", "Port of Tuna", "Port of Ratnagiri", "Port of Dahanu", "Port of Tarapur", "Port of Satpati", "Port of Kellwa-Mahim", "Port of Arnala", "Port of Uttan", "Port of Bassein", "Port of Bhiwandi", "Port of Manori", "Port of Kalyan", "Port of Thane", "Port of Versova", "Port of Bandra", "Port of Trombay", "Port of Ulwa-Belapur", "Port of Panvel", "Port of More", "Port of Mandwa", "Port of Karanja", "Port of Thal", "Port of Rewas", "Port of Alibag", "Port of Dharamtar", "Port of Revdanda", "Port of Borli/Mandla", "Port of Nandgaon", "Port of Murud-Janjira", "Port of Rajpuri", "Port of Mandad", "Port of Dighi", "Port of Panaji", "Port of Chapora", "Port of Betul", "Port of Talpona", "Port of Tiracol", "Port of Mangalore", "Port of Malpe", "Port of Hangarkatta", "Port of Kundapur", "Port of Bhatkal", "Port of Honavar", "Port of Tadri", "Port of Belekeri", "Port of Karwar", "Port of Padubidri", "Port of Alappuzha", "Port of Vadakara", "Port of Kannur", "Port of Kasargode", "Port of Kodungallore", "Port of Ponnani", "Port of Thalassery", "Port of Thiruvananthapuram", "Port of Kollam (Quilon)", "Port of Kozhikode/Beypore", "Port of Neendakara", "Port of Azhikkal", "Port of Vizhinjam", "Port of Nagapattinam", "Port of Kattupalli", "Port of Karaikal", "Port of Cuddalore", "Port of Thirukkadaiyur", "Port of Koondankulam", "Port of Machilipatnam", "Port of Kakinada", "Port of Krishnapatnam", "Port of Gangavaram", "Port of Bhavanapadu", "Port of Calingapatnam", "Port of Bheemunipatnam", "Port of Narsapur", "Port of Vadarevu", "Port of Nizampatnam", "Port of Gopalpur", "Port of Dhamra", "Port of Kulpi", "Port of Durgachak", "Port of Farakka", "Port of Sahebganj"
]);


  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach(key => {
      if (!formData[key as keyof FormData].trim()) {
        newErrors[key] = 'This field cannot be empty';
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.role === "port" && !formData.selectedPort) {
    newErrors.selectedPort = "Please select your port";
  }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    // const response = await axios.post("http://localhost:3000/api/auth/register", {
    //   firstName: formData.firstName,
    //   lastName: formData.lastName,
    //   email: formData.email,
    //   phone: formData.phone,
    //   password: formData.password,
    //   role: formData.role,               // e.g., "sailor"
    //   location: formData.location,
    //   city: formData.city,
    //   state: formData.state,
    //   country: formData.country,
    //   experience: formData.experience,
    //   selectedport: formData.selectedPort   
    // });

    const response = await axios.post("http://localhost:3000/api/auth/register", {
  ...formData, // includes all necessary fields including selectedPort
});


    alert("✅ Registration successful!");
    console.log("Registration response:", response.data);
    // You can navigate to login page here, e.g., navigate("/login")
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.response?.status === 409) {
      alert("❗ User already exists");
    } else {
      alert("🚫 Registration failed");
    }
  } finally {
    setIsLoading(false);
  }
};

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "undefined" }));
    }
  };

  const inputFields = [
    { name: 'firstName', label: 'First Name', type: 'text', icon: User, placeholder: 'Enter your first name' },
    { name: 'lastName', label: 'Last Name', type: 'text', icon: User, placeholder: 'Enter your last name' },
    { name: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'Enter your email address' },
    { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: 'Enter your phone number' },
    { name: 'location', label: 'Location', type: 'text', icon: MapPin, placeholder: 'Enter your location' },
    { name: 'city', label: 'City', type: 'text', icon: MapPin, placeholder: 'Enter your city' },
    { name: 'state', label: 'State', type: 'text', icon: MapPin, placeholder: 'Enter your state' },
    { name: 'country', label: 'Country', type: 'text', icon: Globe, placeholder: 'Enter your country' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-white overflow-y-auto"
      >
        <div className="w-full max-w-md py-8">
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
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Your Web Sailor Account</h1>
            <p className="text-slate-600">Join the maritime digital revolution</p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Regular Input Fields */}
            {inputFields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <field.icon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof FormData]}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${
                      errors[field.name] ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                    placeholder={field.placeholder}
                  />
                </div>
                {errors[field.name] && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors[field.name]}
                  </motion.p>
                )}
              </motion.div>
            ))}

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                  placeholder="Create a secure password"
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
            </motion.div>

            {/* Role Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${
                    errors.role ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                >
                  <option value="">Select your role</option>
                  <option value="sailor">Sailor</option>
                  <option value="port">Port Authority</option>
                  <option value="service-provider">Service Provider</option>
                </select>
              </div>



    {formData.role === "port" && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.5 }}
  >
    <label htmlFor="selectedPort" className="block text-sm font-medium text-slate-700 mb-2 mt-6">
      Select Port You Work At
    </label>
    <select
      id="selectedPort"
      name="selectedPort"
      value={formData.selectedPort}
      onChange={handleInputChange}
      className="block w-full pl-3 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
    >
      <option value="">-- Select a Port --</option>
      {portList.map((port, idx) => (
        <option key={idx} value={port}>
          {port}
        </option>
      ))}
    </select>
    {errors.selectedPort && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 text-sm text-red-600"
      >
        {errors.selectedPort}
      </motion.p>
    )}
  </motion.div>
)}

              
              {errors.role && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.role}
                </motion.p>
              )}
            </motion.div>

            {/* Experience Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-2">
                Experience
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ${
                    errors.experience ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                >
                  <option value="">Do you have maritime experience?</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              {errors.experience && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.experience}
                </motion.p>
              )}
            </motion.div>

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
                  Creating Account...
                </div>
              ) : (
                'Register'
              )}
            </motion.button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-sky-600 hover:text-sky-500 transition-colors duration-300"
                >
                  Login here
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-sky-900/20 z-10"></div>
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8 }}
          src="https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Port and maritime operations"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 z-20 flex items-end p-12">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Chart Your Course</h2>
            <p className="text-xl text-white/90">
              Connect with maritime professionals and unlock new opportunities
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;