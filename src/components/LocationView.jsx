import React from 'react';
import { ABOUT_INFO } from '../data/menuData';

function telHref(tel) {
  return 'tel:' + tel.replace(/[^\d+]/g, '');
}

export default function LocationView({ isActive, onBack }) {
  const phoneHref = telHref(ABOUT_INFO.telefono);

  return (
    <section id="view-location" className={`view ${isActive ? 'active' : ''}`}>
      <div className="subview-header">
        <button className="back-btn" id="btn-location-back" onClick={onBack} aria-label="Volver">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <h2>Ubicación</h2>
      </div>
      <div className="subview-body" style={{ paddingBottom: '40px' }}>
        <div className="section-label" style={{ marginTop: '6px' }}>Cómo pedir</div>
        <p className="about-lead" style={{ marginBottom: '22px' }}>
          Esta carta es solo para que veas los platos. Para hacer tu pedido, llámanos por teléfono — recogida en tienda o entrega a domicilio en un radio de 5 km, con un pedido mínimo de 25€.
        </p>

        <a
          className="btn-secondary-outline btn-block"
          id="btn-call-location"
          href={phoneHref}
          style={{
            textAlign: 'center',
            display: 'block',
            textDecoration: 'none',
            marginBottom: '24px',
            color: 'var(--c-gold)',
            borderColor: 'var(--c-gold)'
          }}
        >
          Llamar ahora
        </a>

        <div className="section-label">Dónde estamos</div>
        <div className="info-card">
          <div className="info-row">
            <div className="info-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.3" />
              </svg>
            </div>
            <div>
              <div className="info-title" id="about-address">{ABOUT_INFO.direccion}</div>
              <div className="info-sub" id="about-city">{ABOUT_INFO.ciudad}</div>
            </div>
          </div>
          <div className="info-row">
            <div className="info-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" />
              </svg>
            </div>
            <div>
              <div className="info-title" id="about-hours-1">{ABOUT_INFO.horario1}</div>
              <div className="info-sub" id="about-hours-2">{ABOUT_INFO.horario2}</div>
            </div>
          </div>
          <div className="info-row">
            <div className="info-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 12h13l-3-3m3 3l-3 3" />
                <path d="M16 6h2.5L21 12l-2.5 6H16" />
              </svg>
            </div>
            <div>
              <div className="info-title">{ABOUT_INFO.horarioLlevar1 || 'Para llevar: miércoles a domingo'}</div>
              <div className="info-sub">{ABOUT_INFO.horarioLlevar2 || '20:00–23:30'}</div>
            </div>
          </div>
          <div className="info-row info-row-phone">
            <div className="info-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-3-2 2c-2.5-1.2-4.3-3-5.5-5.5l2-2-3-6z" />
              </svg>
            </div>
            <div>
              <div className="info-title" id="about-phone">{ABOUT_INFO.telefono}</div>
              <div className="info-sub">Llámanos para pedir</div>
            </div>
          </div>
        </div>

        <a
          className="btn-secondary-outline btn-block"
          style={{ marginTop: '16px', textAlign: 'center', display: 'block', textDecoration: 'none' }}
          id="about-maps-link"
          href={ABOUT_INFO.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cómo llegar
        </a>
      </div>
    </section>
  );
}
