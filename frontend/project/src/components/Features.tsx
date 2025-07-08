import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, FileText, Calendar, ShoppingBag, Bell, BarChart3 } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-slate-100 h-full">
        <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="w-7 h-7 text-white" />,
      title: "Real-Time Tracking",
      description: "Track vessel locations, port availability, and service status in real-time with our advanced monitoring system."
    },
    {
      icon: <FileText className="w-7 h-7 text-white" />,
      title: "Digital Contracts",
      description: "Create, sign, and manage all your maritime contracts digitally with secure blockchain-backed verification."
    },
    {
      icon: <Calendar className="w-7 h-7 text-white" />,
      title: "Port Scheduling",
      description: "Schedule docking times, berth reservations, and coordinate with port authorities efficiently."
    },
    {
      icon: <ShoppingBag className="w-7 h-7 text-white" />,
      title: "Service Marketplace",
      description: "Access a comprehensive marketplace of maritime services from trusted providers worldwide."
    },
    {
      icon: <Bell className="w-7 h-7 text-white" />,
      title: "Smart Notifications",
      description: "Receive intelligent alerts about weather conditions, port updates, and service availability."
    },
    {
      icon: <BarChart3 className="w-7 h-7 text-white" />,
      title: "Analytics Dashboard",
      description: "Monitor your maritime operations with detailed analytics and performance insights."
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to manage your maritime operations efficiently
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;