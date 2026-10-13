import React from 'react';
import { motion } from 'framer-motion';
import { Anchor, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-neutral-800 py-10 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
          {/* Brand Info & Socials */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 dark:bg-neutral-900 border border-slate-800 dark:border-neutral-700">
                <Anchor className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">PortLink</span>
            </div>

            <p className="text-slate-600 dark:text-neutral-400 text-xs leading-relaxed max-w-sm mb-4">
              Real-time vessel tracking and sailor contract management platform empowering sailors and port authorities.
            </p>

            <div className="flex space-x-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-8 h-8 bg-slate-200 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 rounded-lg flex items-center justify-center text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-neutral-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="md:text-right"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Contact Us</h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-neutral-400 md:flex md:flex-col md:items-end">
              <div className="flex items-center space-x-2 md:justify-end">
                <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400 shrink-0" />
                <span>Waghodia Road, Vadodara, Gujarat, 390019</span>
              </div>
              <div className="flex items-center space-x-2 md:justify-end">
                <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400 shrink-0" />
                <span>+91 9427447965</span>
              </div>
              <div className="flex items-center space-x-2 md:justify-end">
                <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400 shrink-0" />
                <span>contact@websailor.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 dark:text-neutral-500">
          <p>© 2025 PortLink. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-slate-900 dark:hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-neutral-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;