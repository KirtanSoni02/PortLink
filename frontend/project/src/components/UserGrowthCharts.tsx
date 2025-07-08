import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Ship, Building } from 'lucide-react';

const UserGrowthCharts: React.FC = () => {
  const monthlyGrowthData = [
    { month: 'Jan', users: 150, sailors: 80, ports: 25, services: 45 },
    { month: 'Feb', users: 280, sailors: 150, ports: 45, services: 85 },
    { month: 'Mar', users: 420, sailors: 230, ports: 65, services: 125 },
    { month: 'Apr', users: 650, sailors: 350, ports: 95, services: 205 },
    { month: 'May', users: 890, sailors: 480, ports: 135, services: 275 },
    { month: 'Jun', users: 1200, sailors: 650, ports: 180, services: 370 },
    { month: 'Jul', users: 1580, sailors: 850, ports: 230, services: 500 },
    { month: 'Aug', users: 1950, sailors: 1050, ports: 285, services: 615 },
    { month: 'Sep', users: 2350, sailors: 1280, ports: 340, services: 730 },
    { month: 'Oct', users: 2800, sailors: 1520, ports: 395, services: 885 },
    { month: 'Nov', users: 3200, sailors: 1750, ports: 450, services: 1000 },
    { month: 'Dec', users: 3650, sailors: 2000, ports: 500, services: 1150 }
  ];

  const dailyActivityData = [
    { day: 'Mon', active: 1200, transactions: 450 },
    { day: 'Tue', active: 1350, transactions: 520 },
    { day: 'Wed', active: 1180, transactions: 480 },
    { day: 'Thu', active: 1420, transactions: 580 },
    { day: 'Fri', active: 1650, transactions: 720 },
    { day: 'Sat', active: 1380, transactions: 520 },
    { day: 'Sun', active: 1100, transactions: 380 }
  ];

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
            Platform Growth & Analytics
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real-time insights into our growing maritime community and platform performance
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, label: 'Total Users', value: '3,650+', growth: '+28%', color: 'from-blue-500 to-blue-600' },
            { icon: Ship, label: 'Active Sailors', value: '2,000+', growth: '+32%', color: 'from-emerald-500 to-emerald-600' },
            { icon: Building, label: 'Port Partners', value: '500+', growth: '+25%', color: 'from-purple-500 to-purple-600' },
            { icon: TrendingUp, label: 'Daily Transactions', value: '720+', growth: '+45%', color: 'from-amber-500 to-amber-600' }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center mb-4`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{metric.value}</div>
              <div className="text-slate-600 mb-2">{metric.label}</div>
              <div className="text-emerald-600 text-sm font-medium">{metric.growth} this month</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">User Growth Trend</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Growing</span>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* User Categories Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-6">User Categories</h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line type="monotone" dataKey="sailors" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="ports" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="services" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>

            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Sailors</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Ports</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Services</span>
              </div>
            </div>
          </motion.div>

          {/* Daily Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 lg:col-span-2"
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Weekly Activity Overview</h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="active" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="transactions" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="flex justify-center space-x-8 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-slate-600">Active Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                <span className="text-sm text-slate-600">Transactions</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UserGrowthCharts;