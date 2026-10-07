import React from 'react';
import { ABOUT_INFO } from '../data/menuData';

function telHref(tel) {
  return 'tel:' + tel.replace(/[^\d+]/g, '');
}

export default function SplashView({ isActive, onNavigate }) {
  const phoneHref = telHref(ABOUT_INFO.telefono);

  return (
    <section id="view-splash" className={`view seigaiha ${isActive ? 'active' : ''}`}>
      <div className="splash-logo-wrap">
        <img
          src="/images/logo-obento.png"
          alt="OBENTO · Japanese Food"
          className="splash-logo"
        />
      </div>
      <p className="splash-tagline">
        <span className="st-line"></span>
        Para recoger · Para llevar
        <span className="st-line right"></span>
      </p>
      <p className="splash-jp">美味しい</p>
      <button
        className="btn-primary btn-primary-splash"
        id="btn-ver-carta"
        onClick={() => onNavigate('menu')}
      >
        Ver la carta
      </button>
      <a className="btn-call" id="btn-call-splash" href={phoneHref}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-3-2 2c-2.5-1.2-4.3-3-5.5-5.5l2-2-3-6z" />
        </svg>
        <span>
          <span className="bc-label">Número de pedidos</span>
          <span id="call-splash-num">{ABOUT_INFO.telefono}</span>
        </span>
      </a>
      <div style={{ display: 'flex', gap: '22px', marginTop: '18px' }}>
        <button
          className="btn-link"
          id="btn-ver-about-splash"
          onClick={() => onNavigate('about')}
        >
          Conócenos
        </button>
        <button
          className="btn-link"
          id="btn-ver-location-splash"
          onClick={() => onNavigate('location')}
        >
          Ubicación
        </button>
      </div>
    </section>
  );
}
