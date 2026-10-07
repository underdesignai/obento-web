import React from 'react';
import { ABOUT_INFO } from '../data/menuData';
import MarqueeTicker from './MarqueeTicker';

function telHref(tel) {
  return 'tel:' + tel.replace(/[^\d+]/g, '');
}

export default function HeroSection() {
  const phoneHref = telHref(ABOUT_INFO.telefono);

  const scrollToMenu = (e) => {
    e.preventDefault();
    const el = document.getElementById('menu-seccion');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="hero-section seigaiha">
      <div className="hero-glow"></div>
      <div className="hero-container">
        <div className="hero-content">
          {/* Badge de Servicio */}
          <div className="hero-badge">
            <span className="badge-icon-dot"></span>
            <span className="badge-text-primary">100% Take Away & Recogida</span>
            <span className="badge-divider">·</span>
            <span className="badge-text-sub">Miércoles a Domingo · 18:00 - 23:30</span>
          </div>

          {/* Logo visual centrado o de marca */}
          <div className="hero-logo-wrap">
            <img
              src="/images/logo-obento.png"
              alt="OBENTO Japanese Food"
              className="hero-logo"
            />
          </div>

          {/* H1 Principal */}
          <h1 className="hero-title">
            Descubre el Sabor Auténtico de <span className="text-gold">Japón</span> en La Ñora
          </h1>

          {/* Subtítulo */}
          <p className="hero-lead">
            {ABOUT_INFO.lead}
          </p>

          {/* Doble CTA */}
          <div className="hero-cta-group">
            <a href="/pedidos" className="btn-primary hero-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-ico-svg">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
              <span>Pedir Online (Takeaway)</span>
            </a>

            <a href="#menu-seccion" onClick={scrollToMenu} className="btn-secondary-outline hero-btn hero-btn-outline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-ico-svg">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              <span>Ver Carta Informativa</span>
            </a>

          </div>

          {/* Sellos de Calidad */}
          <div className="hero-seals">
            <div className="seal-item">
              <div className="seal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span>Atún Ricardo Fuentes & Salmón Noruego</span>
            </div>
            <div className="seal-item">
              <div className="seal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span>Elaborado a Mano, al Momento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marquesina ticker integrada en la base de la pantalla inicial */}
      <MarqueeTicker />
    </section>
  );
}


