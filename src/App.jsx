import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SocialSection from './components/SocialSection';
import BentoSpecialties from './components/BentoSpecialties';
import FullMenuSection from './components/FullMenuSection';
import BusinessValuesSection from './components/BusinessValuesSection';
import ConversionBanner from './components/ConversionBanner';
import Footer from './components/Footer';
import AllergenModal from './components/AllergenModal';
import Chatbot from './components/Chatbot';
import PedidosPage from './pages/PedidosPage';
import TrackingPage from './pages/TrackingPage';
import DeliveryPage from './pages/DeliveryPage';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import CookieBanner from './components/legal/CookieBanner';
import LegalModal from './components/legal/LegalModal';
import { CartProvider } from './context/CartContext';
import { trackPageView } from './utils/analytics';

function HomeView({ onOpenLegal }) {
  const [isAllergenOpen, setIsAllergenOpen] = useState(false);

  useEffect(() => {
    // Reveal animation observer for subtle, elegant scroll entrances
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="obento-page">
      {/* Top sticky/fixed navigation */}
      <Navbar onOpenAllergens={() => setIsAllergenOpen(true)} />

      {/* Main Content */}
      <main className="main-content">
        <HeroSection />
        <ConversionBanner />
        <BentoSpecialties />
        <FullMenuSection onOpenAllergens={() => setIsAllergenOpen(true)} />
        <BusinessValuesSection />
        <SocialSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAllergens={() => setIsAllergenOpen(true)}
        onOpenLegal={onOpenLegal}
      />

      {/* Alérgenos Modal */}
      <AllergenModal
        isOpen={isAllergenOpen}
        onClose={() => setIsAllergenOpen(false)}
      />

      {/* Floating Chatbot Assistant */}
      <Chatbot onOpenAllergens={() => setIsAllergenOpen(true)} />

      {/* PWA Mobile Installation Prompt */}
      <PwaInstallPrompt />
    </div>
  );
}

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

export default function App() {
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState('aviso-legal');

  const handleOpenLegal = (tab = 'aviso-legal') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  useEffect(() => {
    const handleGlobalLegal = (e) => {
      const tab = e?.detail?.tab || 'aviso-legal';
      handleOpenLegal(tab);
    };
    window.addEventListener('open_legal_modal', handleGlobalLegal);
    return () => window.removeEventListener('open_legal_modal', handleGlobalLegal);
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <PageTracker />
        <PwaInstallPrompt />
        <Routes>
          <Route path="/" element={<HomeView onOpenLegal={handleOpenLegal} />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/seguimiento" element={<TrackingPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/reparto" element={<DeliveryPage />} />
          {/* Fallback a home */}
          <Route path="*" element={<HomeView onOpenLegal={handleOpenLegal} />} />
        </Routes>
        <CookieBanner onOpenCookiesPolicy={() => handleOpenLegal('cookies')} />
        <LegalModal
          isOpen={isLegalOpen}
          initialTab={legalTab}
          onClose={() => setIsLegalOpen(false)}
        />
      </BrowserRouter>
    </CartProvider>
  );
}
