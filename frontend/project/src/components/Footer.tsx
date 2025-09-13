import React from 'react';
import { motion } from 'framer-motion';
import { Anchor, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full">
                <Anchor className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold">PortLink</span>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Connecting sailors, ports, and services through a real-time digital platform.
              The future of maritime operations starts here.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-sky-500 hover:to-emerald-500 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>


            <ul className="space-y-3">
              {['About Us', 'Features', 'How It Works', 'Statistics', 'Support', 'Blog'].map((link) => (
                <li key={link}>
                  <HashLink
                    smooth
                    to={`/#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-slate-300 hover:text-sky-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link}
                  </HashLink>
                </li>
              ))}
            </ul>

          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              {[
                'Port Management',
                'Real-Time Tracking',
                'Digital Contracts',
                'Service Marketplace',
                'Analytics',
                'Mobile App'
              ].map((service) => (
                <li
                  key={service}
                  className="text-slate-300 hover:text-sky-400 transition-colors duration-300 hover:translate-x-1"
                >
                  {service}
                </li>
              ))}
            </ul>

          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <span className="text-slate-300">Vrajleela Society, Parivar Char Rasta, Waghodia Road, Vadodara, 390019</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <span className="text-slate-300">+91 9427447965</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <span className="text-slate-300">contact@websailor.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-slate-400 text-sm">
            © 2025 PortLink. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-sky-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-sky-400 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-slate-400 hover:text-sky-400 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;