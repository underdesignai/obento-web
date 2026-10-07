import React from 'react';

export default function SocialSection() {
  return (
    <section id="social-seccion" className="social-section reveal-on-scroll">
      <div className="section-container">
        <div className="section-header-center">
          <span className="section-eyebrow">Comunidad & Redes Sociales</span>
          <h2 className="section-title">Síguenos en Instagram & TikTok</h2>
          <p className="section-subtitle">
            Descubre el detrás de cámaras de nuestra cocina en La Ñora, cortes de atún rojo al momento, recetas de autor y novedades exclusivas.
          </p>
        </div>

        <div className="social-grid">
          {/* Tarjeta Instagram */}
          <div className="social-card social-card-insta">
            <div className="social-card-top">
              <div className="social-icon-box insta-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <span className="social-badge insta-badge">Instagram Oficial</span>
            </div>

            <div className="social-card-body">
              <span className="social-handle">@obento_es</span>
              <h3 className="social-card-title">Fotos, Rolls de Autor & Novedades Diarias</h3>
              <p className="social-card-desc">
                Historias en directo con cada preparación, bandejas para llevar, avisos de horario y recomendaciones gastronómicas en Murcia.
              </p>

              <ul className="social-highlights">
                <li>
                  <span className="check-dot">✓</span>
                  <span>Fotos de cada plato con su presentación real</span>
                </li>
                <li>
                  <span className="check-dot">✓</span>
                  <span>Avisos de apertura, festivos y eventos especiales</span>
                </li>
                <li>
                  <span className="check-dot">✓</span>
                  <span>Atención cercana por mensaje directo</span>
                </li>
              </ul>
            </div>

            <a
              href="https://www.instagram.com/obento_es/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary social-btn insta-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-ico-svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>Seguir en Instagram</span>
              <span className="arrow-ext">↗</span>
            </a>
          </div>

          {/* Tarjeta TikTok */}
          <div className="social-card social-card-tiktok">
            <div className="social-card-top">
              <div className="social-icon-box tiktok-icon-box">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3.1 15.68a6.34 6.34 0 0 0 10.74 4.54 6.27 6.27 0 0 0 1.94-4.55V8.82a8.28 8.28 0 0 0 3.81 1.25V6.69z" />
                </svg>
              </div>
              <span className="social-badge tiktok-badge">TikTok Oficial</span>
            </div>

            <div className="social-card-body">
              <span className="social-handle">@obento_es</span>
              <h3 className="social-card-title">Vídeos de Cocina & Procesos en Directo</h3>
              <p className="social-card-desc">
                Mira de cerca cómo sellamos el salmón al soplete, el crujido de las gyozas doradas y la técnica tradicional de corte japonés.
              </p>

              <ul className="social-highlights">
                <li>
                  <span className="check-dot">✓</span>
                  <span>Vídeos cortos de elaboraciones y trucos de sushi</span>
                </li>
                <li>
                  <span className="check-dot">✓</span>
                  <span>Preparación de pedidos en cocina en tiempo real</span>
                </li>
                <li>
                  <span className="check-dot">✓</span>
                  <span>Tendencias y recetas de street food nipón</span>
                </li>
              </ul>
            </div>

            <a
              href="https://www.tiktok.com/@obento_es"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-outline social-btn tiktok-btn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="btn-ico-svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3.1 15.68a6.34 6.34 0 0 0 10.74 4.54 6.27 6.27 0 0 0 1.94-4.55V8.82a8.28 8.28 0 0 0 3.81 1.25V6.69z" />
              </svg>
              <span>Seguir en TikTok</span>
              <span className="arrow-ext">↗</span>
            </a>
          </div>
        </div>

        {/* Banner de comunidad inferior */}
        <div className="social-community-bar">
          <span className="community-tag">🍱 #ObentoMurcia</span>
          <p className="community-text">
            Comparte tu mesa y tus fotos de sushi mencionando a <strong>@obento_es</strong> para que te compartamos en nuestras historias.
          </p>
        </div>
      </div>
    </section>
  );
}
