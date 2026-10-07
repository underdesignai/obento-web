import React from 'react';

export default function BentoSpecialties() {
  const scrollToMenu = (e) => {
    e.preventDefault();
    const el = document.getElementById('menu-seccion');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="bento-seccion" className="bento-section reveal-on-scroll">
      <div className="section-container">
        <div className="section-header-split">
          <div>
            <div className="section-eyebrow-dot">
              <span className="dot"></span>
              <span>Bento Art & Specialties</span>
            </div>
            <h2 className="section-title">Nuestra Esencia en Cada Compartimento</h2>
          </div>
          <p className="section-subtitle-right">
            Diseñamos cada plato bajo el concepto <span className="text-gold font-semibold">«Ma»</span>: equilibrio de espacios, frescura cromática y armonía nutricional.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {/* Card 1: 7 cols */}
          <div className="bento-card bento-card-hero">
            <div className="bento-content">
              <div className="bento-card-header">
                <div className="bento-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bento-badge-icon">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>Propuesta Estrella</span>
                </div>
                <span className="bento-kanji">匠 · 弁当</span>
              </div>
              <h3 className="bento-title">Nuestra Selección de Rolls y Sushi</h3>
              <p className="bento-desc">
                Explora nuestra oferta única de bocados japoneses: desde nigiris premium con atún rojo Ricardo Fuentes hasta uramakis de autor con foie flambeado, salsa teriyaki casera y micro mezclum.
              </p>
            </div>
            <div className="bento-media-wrap bento-media-large">
              <img
                src="/images/rolloblack.jpg"
                alt="Black Dragon Roll y Sushi de Autor"
                className="bento-img"
                loading="lazy"
              />
              <div className="bento-overlay">
                <div className="bento-overlay-text">
                  <span className="bento-label">Obento Special Experience</span>
                  <a href="#menu-seccion" onClick={scrollToMenu} className="bento-link">
                    Ver en la carta →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 5 cols */}
          <div className="bento-card bento-card-side">
            <div className="bento-content">
              <div className="bento-card-header">
                <div className="bento-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M2.5 12c4-5 11-6.5 15-2.5 2 2 3 2.5 4 2.5-1 1.5-2 2-4 2-4 4-11 2.5-15-2z" />
                    <circle cx="7.2" cy="11.2" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <span className="bento-tag">Sushi Bar</span>
              </div>
              <h3 className="bento-title">Nigiris de Origen Seleccionado</h3>
              <p className="bento-desc">
                Preparado a mano al momento. Variedades de nigiri con salmón sellado al soplete con kimchi, atún toro con trufa, vieira flambeada y anguila glaseada.
              </p>
            </div>
            <div className="bento-media-wrap bento-media-medium">
              <img
                src="/images/nigiriatunfoie.jpg"
                alt="Nigiri de atún con foie"
                className="bento-img"
                loading="lazy"
              />
              <div className="bento-corner-badge">Corte Diario</div>
            </div>
          </div>

          {/* Card 3: 4 cols */}
          <div className="bento-card bento-card-third">
            <div className="bento-content">
              <div className="bento-card-header">
                <div className="bento-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3.5 2" />
                  </svg>
                </div>
                <span className="bento-tag bento-tag-subtle">Wok & Sabor</span>
              </div>
              <h3 className="bento-title-small">Yakisobas & Calientes</h3>
              <p className="bento-desc">
                Fideos de trigo o arroz salteados con langostino, ternera o pollo, verduras frescas de la huerta y un toque auténtico de aceite de sésamo y salsa de soja.
              </p>
            </div>
            <div className="bento-media-wrap bento-media-small">
              <img
                src="/images/yakisobalangostino.jpg"
                alt="Yakisoba de langostino"
                className="bento-img"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 4: 4 cols */}
          <div className="bento-card bento-card-third">
            <div className="bento-content">
              <div className="bento-card-header">
                <div className="bento-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12A10 10 0 0 1 12 2z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <span className="bento-tag bento-tag-green">100% Plant-Based</span>
              </div>
              <h3 className="bento-title-small">Opciones Vegetarianas</h3>
              <p className="bento-desc">
                Aurora Roll de micro mezclum con aguacate y mango, gyozas vegetales a la plancha, edamame con aceite de humo y maki de aguacate cremoso.
              </p>
            </div>
            <div className="bento-media-wrap bento-media-small">
              <img
                src="/images/rollovegetal.jpg"
                alt="Aurora Roll Vegetal"
                className="bento-img"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 5: 4 cols */}
          <div className="bento-card bento-card-third">
            <div className="bento-content">
              <div className="bento-card-header">
                <div className="bento-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 21a8.5 8.5 0 1 1 8.5-8.5" />
                  </svg>
                </div>
                <span className="bento-tag bento-tag-gold">Dulce Final</span>
              </div>
              <h3 className="bento-title-small">Mochis Artesanales</h3>
              <p className="bento-desc">
                Masa tradicional de arroz rellena de helado cremoso: tarta de queso con fresa, fruta de la pasión con mango o rico chocolate para cerrar tu pedido.
              </p>
            </div>
            <div className="bento-media-wrap bento-media-small">
              <img
                src="/images/mochifresa.jpg"
                alt="Mochis artesanales"
                className="bento-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
