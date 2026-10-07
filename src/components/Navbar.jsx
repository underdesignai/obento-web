import React, { useState } from 'react';
import { ABOUT_INFO } from '../data/menuData';

function telHref(tel) {
  return 'tel:' + tel.replace(/[^\d+]/g, '');
}

export default function Navbar({ onOpenAllergens }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const phoneHref = telHref(ABOUT_INFO.telefono);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand */}
        <div className="brand-group" onClick={() => scrollToSection('hero')} style={{ cursor: 'pointer' }}>
          <img src="/images/logo-obento.png" alt="Obento" className="nav-logo" />
          <div className="nav-brand-text">
            <span className="brand-title small">OBENTO</span>
            <span className="nav-brand-sub">Japanese Food · La Ñora</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <button type="button" className="nav-link" onClick={() => scrollToSection('hero')}>
            Inicio
          </button>
          <button type="button" className="nav-link" onClick={() => scrollToSection('bento-seccion')}>
            Especialidades
          </button>
          <button type="button" className="nav-link" onClick={() => scrollToSection('menu-seccion')}>
            Carta
          </button>
          <a href="/pedidos" className="nav-link highlight-link">
            🍣 Pedir Online
          </a>
          <a href="/seguimiento" className="nav-link">
            📍 Seguimiento
          </a>
          <button type="button" className="nav-link" onClick={() => scrollToSection('contacto-seccion')}>
            Contacto
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn"
            title="Ver Alérgenos"
            aria-label="Alérgenos"
            onClick={onOpenAllergens}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v6M12 7.5v.01" />
            </svg>
          </button>

          <a className="btn-primary nav-cta-btn" href="/pedidos">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-ico-svg">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            <span>Pedir Online (Takeaway)</span>
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-menu-toggle icon-btn"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <button type="button" className="drawer-link" onClick={() => scrollToSection('hero')}>
            Inicio
          </button>
          <button type="button" className="drawer-link" onClick={() => scrollToSection('bento-seccion')}>
            Especialidades
          </button>
          <button type="button" className="drawer-link" onClick={() => scrollToSection('menu-seccion')}>
            Carta Completa
          </button>
          <a href="/pedidos" className="drawer-link highlight-link" style={{ color: 'var(--c-accent, #e54d38)', fontWeight: 600 }}>
            🍣 Pedir Online (Takeaway)
          </a>
          <a href="/seguimiento" className="drawer-link">
            📍 Seguimiento de Pedido
          </a>
          <button type="button" className="drawer-link" onClick={() => scrollToSection('contacto-seccion')}>
            Contacto
          </button>
          <div className="drawer-footer">
            <button type="button" className="btn-secondary-outline btn-block" onClick={() => { setMobileMenuOpen(false); onOpenAllergens(); }}>
              Ver Alérgenos
            </button>
            <a className="btn-primary btn-block" href="/pedidos" style={{ marginTop: '10px', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
              🍣 Hacer Pedido Online
            </a>
            <a className="btn-secondary-outline btn-block" href={phoneHref} style={{ marginTop: '8px', textAlign: 'center', display: 'block', textDecoration: 'none', fontSize: '12px' }}>
              Llamar por teléfono
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
