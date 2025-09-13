import React from 'react';
import { motion } from 'framer-motion';
import { Anchor } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-sky-600 overflow-hidden pt-16">
      {/* Floating Maritime Graphics */}
      <div className="absolute inset-0">
        {/* Ship Silhouettes */}
        <motion.div
          animate={{
            x: [-100, window.innerWidth + 100],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-32 w-24 h-12 opacity-20"
        >
          <img
            src="https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Ship"
            className="w-full h-full object-cover rounded-lg filter brightness-0 invert"
          />
        </motion.div>

        {/* Floating Port Elements */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-16 h-16 opacity-30"
        >
          <img
            src="https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Port"
            className="w-full h-full object-cover rounded-full filter brightness-0 invert"
          />
        </motion.div>

        {/* Lighthouse */}
        <motion.div
          animate={{
            y: [10, -10, 10],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-40 left-20 w-12 h-20 opacity-25"
        >
          <img
            src="https://images.pexels.com/photos/1532771/pexels-photo-1532771.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Lighthouse"
            className="w-full h-full object-cover rounded-lg filter brightness-0 invert"
          />
        </motion.div>

        {/* Compass */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-60 left-32 w-14 h-14 opacity-20"
        >
          <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/40 rounded-full relative">
              <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-white/60 transform -translate-x-1/2"></div>
            </div>
          </div>
        </motion.div>

        {/* Anchor Icons */}
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-60 right-32 w-10 h-10 opacity-25"
        >
          <Anchor className="w-full h-full text-white" />
        </motion.div>

        {/* Wave Animation */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-32"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-white/10"
              initial={{ x: -50 }}
              animate={{ x: 50 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </svg>
        </div>

        {/* Digital Grid Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Anchor className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">PortLink</h1>
        </motion.div>

        {/* Main Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Sailing Meets
            <span className="block bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Technology
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-sky-100 max-w-3xl mx-auto leading-relaxed">
            Connecting sailors, ports, and services through a real-time digital platform
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
            >
              Login
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 inline-block"
            >
              Register
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;