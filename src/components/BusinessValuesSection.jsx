import React from 'react';
import { ABOUT_INFO } from '../data/menuData';

function telHref(tel) {
  return 'tel:' + tel.replace(/[^\d+]/g, '');
}

export default function BusinessValuesSection() {
  const phoneHref = telHref(ABOUT_INFO.telefono);

  return (
    <section id="contacto-seccion" className="business-section reveal-on-scroll">
      <div className="section-container">
        <div className="business-grid">
          {/* Left: Info Card */}
          <div className="business-info-card">
            <div className="card-header">
              <span className="section-eyebrow">Identidad & Contacto</span>
              <h3 className="card-title">Obento Japanese Food</h3>
              <p className="card-lead">
                Espacio culinario dedicado al respeto por las recetas niponas en el corazón de La Ñora.
              </p>
            </div>

            <div className="info-items">
              {/* Dirección */}
              <div className="info-item">
                <div className="info-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11z" />
                    <circle cx="12" cy="10" r="2.3" />
                  </svg>
                </div>
                <div>
                  <div className="info-title">Dirección</div>
                  <div className="info-val">{ABOUT_INFO.direccion}, {ABOUT_INFO.ciudad}</div>
                  <div className="info-note">A pocos minutos del campus de la UCAM</div>
                </div>
              </div>

              {/* Teléfono */}
              <div className="info-item">
                <div className="info-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-3-2 2c-2.5-1.2-4.3-3-5.5-5.5l2-2-3-6z" />
                  </svg>
                </div>
                <div>
                  <div className="info-title">Teléfono Directo</div>
                  <a className="info-link" href={phoneHref}>{ABOUT_INFO.telefono}</a>
                  <div className="info-note">Exclusivo encargos y pedidos take away</div>
                </div>
              </div>

              {/* Instagram */}
              <div className="info-item">
                <div className="info-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <div>
                  <div className="info-title">Comunidad en Instagram</div>
                  <a
                    className="info-link flex-link"
                    href="https://www.instagram.com/obento_es/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>@obento_es</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ext-ico">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                  <div className="info-note">Platos del día, historias y novedades</div>
                </div>
              </div>

              {/* Horarios */}
              <div className="info-item-block">
                <div className="info-hours-header">
                  <div className="info-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3.5 2" />
                    </svg>
                  </div>
                  <span className="info-title">Horarios de Servicio</span>
                </div>
                <div className="hours-table">
                  <div className="hours-row highlight">
                    <span className="hours-day">Miércoles a Domingo</span>
                    <span className="hours-time">18:00 – 23:30</span>
                  </div>
                  <div className="hours-row closed">
                    <span className="hours-day">Lunes y Martes</span>
                    <span className="hours-status">Cerrado por descanso</span>
                  </div>
                  <div className="hours-delivery-note">
                    <strong>Zonas de reparto (radio 5 km):</strong> La Ñora, Guadalupe, Rincón de Beniscornia, Jabalí Viejo, Jabalí Nuevo y Puebla de Soto.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Values + Maps Banner */}
          <div className="business-values-col">
            <div className="values-header">
              <span className="section-eyebrow">Ventajas Obento</span>
              <h3 className="values-title">Por Qué Elegir Nuestra Cocina</h3>
              <p className="values-lead">
                Combinamos la filosofía milenaria de Japón con un servicio cercano, ágil y adaptado a tu estilo de vida.
              </p>
            </div>

            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <h4 className="value-h">Menú Digital Claro</h4>
                <p className="value-p">
                  Consulta ingredientes, opciones sin gluten, alérgenos y fotografías de cada plato con transparencia total.
                </p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h4 className="value-h">Pide y Recoge Rápido</h4>
                <p className="value-p">
                  Llama por teléfono o encárgalo con antelación y ten tu pedido recién hecho listo para recoger sin esperas.
                </p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
                    <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
                    <circle cx="8" cy="18" r="2" />
                    <circle cx="18" cy="18" r="2" />
                  </svg>
                </div>
                <h4 className="value-h">Envases Especializados</h4>
                <p className="value-p">
                  Envases térmicos que protegen la firmeza del pescado fresco y mantienen calientes los salteados hasta tu hogar.
                </p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6a4.8 4.8 0 0 1 8.8-2.7 4.8 4.8 0 0 1 8.8 2.7z" />
                  </svg>
                </div>
                <h4 className="value-h">Atún y Salmón Premium</h4>
                <p className="value-p">
                  Pescado con origen garantizado (Ricardo Fuentes) y estrictos procesos de conservación para tu seguridad y deleite.
                </p>
              </div>
            </div>

            {/* Maps Card */}
            <div className="maps-banner">
              <div className="maps-content">
                <div className="maps-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="maps-badge-ico">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                  <span>Cómo Llegar</span>
                </div>
                <h4 className="maps-title">Visítanos en La Ñora (Murcia)</h4>
                <p className="maps-desc">
                  Calle Amargura, 3 · Aparcamiento cómodo en las inmediaciones y parada de tranvía cercana.
                </p>
                <a
                  className="btn-secondary-outline maps-btn"
                  href={ABOUT_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
