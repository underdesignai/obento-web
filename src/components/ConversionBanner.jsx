import React from 'react';
import { ABOUT_INFO } from '../data/menuData';

function telHref(tel) {
  return 'tel:' + tel.replace(/[^\d+]/g, '');
}

export default function ConversionBanner() {
  const [ofertaActiva, setOfertaActiva] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/ofertas')
      .then((res) => (res.ok ? res.json() : []))
      .then((ofertas) => {
        if (Array.isArray(ofertas) && ofertas.length > 0) {
          setOfertaActiva(ofertas[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="conversion-section reveal-on-scroll">
      <div className="section-container">
        <div className="conversion-banner seigaiha">
          <div className="conversion-text">
            {ofertaActiva ? (
              <>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#c9a84c', color: '#080808', fontWeight: 800, fontSize: 11, padding: '3px 10px', borderRadius: 4, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                  <span>🔥 {ofertaActiva.badge || 'OFERTA ACTIVA'}</span>
                </div>
                <h3 className="conversion-title">{ofertaActiva.titulo}</h3>
                <p className="conversion-desc">
                  {ofertaActiva.descripcion}
                  {ofertaActiva.validoHasta ? ` (${ofertaActiva.validoHasta})` : ''}
                </p>
              </>
            ) : (
              <>
                <span className="conversion-eyebrow">¿Cenamos hoy?</span>
                <h3 className="conversion-title">Tu Pedido en Obento Te Espera</h3>
                <p className="conversion-desc">
                  Haz tu encargo online para recoger en Calle Amargura, 3, La Ñora (Murcia) recién elaborado con ingredientes frescos.
                </p>
              </>
            )}
          </div>

          <div className="conversion-actions">
            <a className="btn-primary conversion-cta" href="/pedidos">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-ico-svg">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
              <span>Pedir Online (Takeaway)</span>
            </a>


            <a
              className="btn-secondary-outline conversion-insta"
              href="https://www.instagram.com/obento_es/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Ver Instagram</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-ico-svg">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
