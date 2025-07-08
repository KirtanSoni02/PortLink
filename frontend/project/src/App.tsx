import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Statistics from './components/Statistics';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import RealTimeTracking from './components/RealTimeTracking';
import UserGrowthCharts from './components/UserGrowthCharts';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import SailorDashboard from './components/dashboard/SailorDashboard';
import PortAuthorityDashboard from './components/dashboard/PortAuthorityDashboard';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Statistics />
      <HowItWorks />
      <Features />
      <RealTimeTracking />
      <UserGrowthCharts />
      <CallToAction />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/sailor" element={<SailorDashboard />} />
        <Route path="/dashboard/port-authority" element={<PortAuthorityDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;