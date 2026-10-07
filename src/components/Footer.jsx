import React from 'react';
import { ABOUT_INFO } from '../data/menuData';

function telHref(tel) {
  return 'tel:' + tel.replace(/[^\d+]/g, '');
}

export default function Footer({ onOpenAllergens }) {
  const phoneHref = telHref(ABOUT_INFO.telefono);

  const scrollToMenu = (e) => {
    e.preventDefault();
    const el = document.getElementById('menu-seccion');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="site-footer">
      <div className="section-container">
        <div className="footer-grid">
          {/* Col 1: Brand */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand">
              <span className="brand-title">OBENTO</span>
              <span className="footer-sub">JAPANESE FOOD · LA ÑORA</span>
            </div>

            <div className="footer-takeaway-badge">
              <span className="dot"></span>
              <span>🍱 100% Take Away & Recogida</span>
            </div>

            <p className="footer-desc">
              Elaboración artesanal diaria de sushi, rolls de autor, yakisobas y especialidades japonesas para llevar y disfrutar en casa con la máxima frescura.
            </p>

            <a
              className="footer-insta-btn"
              href="https://www.instagram.com/obento_es/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="btn-ico-svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>@obento_es en Instagram</span>
            </a>
          </div>

          {/* Col 2: Especialidades */}
          <div className="footer-col">
            <h4 className="footer-heading">Especialidades</h4>
            <ul className="footer-links">
              <li><a href="#menu-seccion" onClick={scrollToMenu}>Nigiris de Atún & Salmón</a></li>
              <li><a href="#menu-seccion" onClick={scrollToMenu}>Uramakis de Autor</a></li>
              <li><a href="#menu-seccion" onClick={scrollToMenu}>Futomakis Especiales</a></li>
              <li><a href="#menu-seccion" onClick={scrollToMenu}>Yakisobas Calientes</a></li>
              <li><a href="#menu-seccion" onClick={scrollToMenu}>Gyozas & Entrantes</a></li>
              <li><a href="#menu-seccion" onClick={scrollToMenu}>Mochis Artesanales</a></li>
              <li><button type="button" className="footer-link-btn" onClick={onOpenAllergens}>Guía de Alérgenos</button></li>
            </ul>
          </div>

          {/* Col 3: Horarios */}
          <div className="footer-col">
            <h4 className="footer-heading">Horario de Servicio</h4>
            <div className="footer-hours-list">
              <div className="footer-hour-item">
                <div className="f-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3.5 2" />
                  </svg>
                </div>
                <div>
                  <span className="f-label">Miércoles a Domingo</span>
                  <span className="f-val">18:00 – 23:30 h</span>
                </div>
              </div>

              <div className="footer-hour-item">
                <div className="f-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div>
                  <span className="f-label">Lunes y Martes</span>
                  <span className="f-val dim">Cerrado por descanso</span>
                </div>
              </div>

              <div className="footer-note-card">
                <span className="f-note-title">💡 Nota útil:</span>
                <p className="f-note-p">
                  Encarga con antelación para tenerlo listo a tu llegada o consultar reparto a domicilio.
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Haz tu Pedido */}
          <div className="footer-col">
            <h4 className="footer-heading">Haz tu Pedido</h4>
            <div className="footer-order-box">
              <a className="btn-primary footer-call-btn" href={phoneHref}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="btn-ico-svg">
                  <path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-3-2 2c-2.5-1.2-4.3-3-5.5-5.5l2-2-3-6z" />
                </svg>
                <span>+34 {ABOUT_INFO.telefono}</span>
              </a>

              <div className="footer-contact-item">
                <div className="f-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11z" />
                    <circle cx="12" cy="10" r="2.3" />
                  </svg>
                </div>
                <div>
                  <span className="f-label">Ubicación</span>
                  <span className="f-val">{ABOUT_INFO.direccion}, {ABOUT_INFO.ciudad}</span>
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="f-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div>
                  <span className="f-label">Pago Aceptado</span>
                  <span className="f-val">Tarjeta y Efectivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Obento Japanese Food. Todos los derechos reservados. Cocina japonesa para llevar y recoger en La Ñora, Murcia.
          </p>
          <div className="footer-legal">
            <span className="legal-link">Aviso Legal</span>
            <span className="legal-sep">·</span>
            <span className="legal-link">Privacidad</span>
            <span className="legal-sep">·</span>
            <span className="legal-link">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
