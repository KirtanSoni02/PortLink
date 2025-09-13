import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Handshake } from 'lucide-react';

interface StepProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Step: React.FC<StepProps> = ({ step, icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="relative text-center group"
    >
      {/* Step Number */}
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 text-white font-bold rounded-full flex items-center justify-center text-lg shadow-lg">
        {step}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-slate-100">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-sky-100 to-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>

      {/* Connector Line (hidden on mobile, visible on larger screens) */}
      {step < 3 && (
        <div className="hidden lg:block absolute top-1/2 -right-16 w-32 h-0.5 bg-gradient-to-r from-sky-300 to-emerald-300"></div>
      )}
    </motion.div>
  );
};

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get started with PortLink in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 max-w-6xl mx-auto relative">
          <Step
            step={1}
            icon={<UserPlus className="w-12 h-12 text-sky-600" />}
            title="Register & Choose Role"
            description="Sign up and select your role - whether you're a sailor, port authority, or service provider. Complete your profile to get started."
            delay={0.2}
          />
          <Step
            step={2}
            icon={<Search className="w-12 h-12 text-sky-600" />}
            title="Discover & Connect"
            description="Browse available port services, check availability, and connect with the right providers for your maritime needs."
            delay={0.4}
          />
          <Step
            step={3}
            icon={<Handshake className="w-12 h-12 text-sky-600" />}
            title="Contract & Operate"
            description="Create digital contracts, schedule docking, and manage all your maritime operations seamlessly through our platform."
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;