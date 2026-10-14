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
import CookieBanner from './components/legal/CookieBanner';
import LegalModal from './components/legal/LegalModal';
import { trackPageView } from './utils/analytics';
import { PEDIDOS_URL } from './config';

function RedirectToPedidos({ path = '' }) {
  useEffect(() => {
    window.location.href = `${PEDIDOS_URL}${path}`;
  }, [path]);
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: '#fff', background: '#0c0b0a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Redirigiendo a la App de Pedidos...</p>
      <a href={`${PEDIDOS_URL}${path}`} style={{ color: '#c81e22', fontWeight: 'bold' }}>Haz clic aquí si no te redirige automáticamente</a>
    </div>
  );
}

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
    <BrowserRouter>
      <PageTracker />
      <Routes>
        <Route path="/" element={<HomeView onOpenLegal={handleOpenLegal} />} />
        {/* Rutas de pedidos redirigen a la app de pedidos desacoplada en local */}
        <Route path="/pedidos" element={<RedirectToPedidos />} />
        <Route path="/delivery" element={<RedirectToPedidos path="/delivery" />} />
        <Route path="/reparto" element={<RedirectToPedidos path="/delivery" />} />
        <Route path="/seguimiento" element={<RedirectToPedidos path="/seguimiento" />} />
        <Route path="/tracking" element={<RedirectToPedidos path="/tracking" />} />
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
  );
}
