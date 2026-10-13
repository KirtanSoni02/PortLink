import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import Statistics from './components/Statistics';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import RealTimeTracking from './components/RealTimeTracking';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import SailorDashboard from './components/dashboard/SailorDashboard';
import PortAuthorityDashboard from './components/dashboard/PortAuthorityDashboard';
import AIAssistantChat from './components/AIAssistantChat';
import { ThemeProvider } from './context/ThemeContext';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
      <Header />
      <Hero />
      <div id="tracking"><RealTimeTracking /></div>
      <div id="statistics"><Statistics /></div>
      <div id="features"><Features /></div>
      <div id="how-it-works"><HowItWorks /></div>
      <div id="contact"><Footer /></div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/sailor" element={<SailorDashboard />} />
          <Route path="/dashboard/port-authority" element={<PortAuthorityDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AIAssistantChat />
      </Router>
    </ThemeProvider>
  );
}

export default App;