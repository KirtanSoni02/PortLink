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
      <div id="statistics"><Statistics /></div>
      <div id="how-it-works"><HowItWorks /></div>
      <div id="features"><Features /></div>
      <div id="about"><RealTimeTracking /></div>
      <UserGrowthCharts />
      <CallToAction />
      
    <div id="contact"><Footer /></div></div>
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