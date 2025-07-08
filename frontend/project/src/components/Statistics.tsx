import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, MapPin, Briefcase } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  number: number;
  label: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, number, label, delay }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let start = 0;
        const increment = number / 100;
        const counter = setInterval(() => {
          start += increment;
          if (start >= number) {
            setCount(number);
            clearInterval(counter);
          } else {
            setCount(Math.floor(start));
          }
        }, 20);
        return () => clearInterval(counter);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, number, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: delay / 1000 }}
      className="text-center group"
    >
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
        {count.toLocaleString()}+
      </div>
      <div className="text-slate-600 font-medium text-lg">{label}</div>
    </motion.div>
  );
};

const Statistics: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Trusted by Maritime Professionals
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join thousands of sailors, ports, and service providers already using Web Sailor
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          <StatCard
            icon={<Users className="w-8 h-8 text-white" />}
            number={1200}
            label="Sailors Registered"
            delay={200}
          />
          <StatCard
            icon={<MapPin className="w-8 h-8 text-white" />}
            number={350}
            label="Port Authorities Connected"
            delay={400}
          />
          <StatCard
            icon={<Briefcase className="w-8 h-8 text-white" />}
            number={500}
            label="Services Offered"
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default Statistics;