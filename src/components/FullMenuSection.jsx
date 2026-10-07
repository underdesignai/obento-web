import React, { useState, useEffect } from 'react';
import { CATEGORIES, SUSHI_SUBCATEGORIES, MENU } from '../data/menuData';
import DishSlide from './DishSlide';

export default function FullMenuSection({ onOpenAllergens }) {
  // Lista de platos sincronizada con la base de datos
  const [platosLista, setPlatosLista] = useState(MENU);

  useEffect(() => {
    fetch('/api/carta')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const cleaned = data.map((d) => ({
            ...d,
            nombre: (d.nombre || '')
              .replace(/salm\?n/gi, 'salmón')
              .replace(/at\?n/gi, 'atún')
              .replace(/lim\?n/gi, 'limón')
              .replace(/J\?netsu/g, 'Jōnetsu'),
            descripcion: (d.descripcion || '')
              .replace(/salm\?n/gi, 'salmón')
              .replace(/at\?n/gi, 'atún')
              .replace(/az\?car/gi, 'azúcar')
              .replace(/esp\?rrago/gi, 'espárrago')
              .replace(/s\?samo/gi, 'sésamo')
              .replace(/holand\?s/gi, 'holandés')
              .replace(/acompa\?ado/gi, 'acompañado')
          }));
          setPlatosLista(cleaned);
        }
      })
      .catch(() => {});
  }, []);

  // Categoría seleccionada: por defecto 'entrantes'
  const [activeCat, setActiveCat] = useState('entrantes');
  // Subcategoría de sushi activa: por defecto 'todos'
  const [activeSushiSub, setActiveSushiSub] = useState('todos');

  const currentCategory = CATEGORIES.find((c) => c.slug === activeCat) || CATEGORIES[0];
  const catItems = platosLista.filter((m) => m.cat === activeCat);

  // Filtrado de sushi si aplica
  const displayedSushiItems = activeCat === 'sushi' && activeSushiSub !== 'todos'
    ? catItems.filter((m) => m.sub === activeSushiSub)
    : catItems;

  return (
    <section id="menu-seccion" className="full-menu-section reveal-on-scroll">
      <div className="section-container">
        {/* Cabecera de la sección centrada */}
        <div className="section-header-center" style={{ marginBottom: '32px' }}>
          <div className="section-eyebrow-dot" style={{ justifyContent: 'center' }}>
            <span className="dot"></span>
            <span>Carta Obento</span>
          </div>
          <h2 className="section-title">Elaborado al Momento</h2>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-secondary-outline allergen-info-btn"
              onClick={onOpenAllergens}
              style={{ padding: '8px 18px', fontSize: '11.5px' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="btn-ico-svg">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v6M12 7.5v.01" />
              </svg>
              <span>Guía de Alérgenos</span>
            </button>
          </div>
        </div>

        {/* Fila Principal de Categorías */}
        <div className="menu-categories-nav">
          {CATEGORIES.map((cat) => {
            const count = platosLista.filter((m) => m.cat === cat.slug).length;
            const isActive = activeCat === cat.slug;

            return (
              <button
                key={cat.slug}
                type="button"
                className={`cat-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveCat(cat.slug);
                  setActiveSushiSub('todos');
                }}
              >
                <span className="cat-nav-title">{cat.label}</span>
                <span className="cat-nav-badge">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Subcategorías secundarias para Sushi */}
        {activeCat === 'sushi' && (
          <div className="sushi-subnav-bar">
            <button
              type="button"
              className={`sushi-sub-pill ${activeSushiSub === 'todos' ? 'active' : ''}`}
              onClick={() => setActiveSushiSub('todos')}
            >
              Todos ({catItems.length})
            </button>
            {SUSHI_SUBCATEGORIES.map((sub) => {
              const subCount = catItems.filter((m) => m.sub === sub.slug).length;
              return (
                <button
                  key={sub.slug}
                  type="button"
                  className={`sushi-sub-pill ${activeSushiSub === sub.slug ? 'active' : ''}`}
                  onClick={() => setActiveSushiSub(sub.slug)}
                >
                  {sub.label} ({subCount})
                </button>
              );
            })}
          </div>
        )}

        {/* Contenido de la Categoría Activa */}
        <div className="active-category-container">
          <div className="category-meta-header">
            <div>
              <h3 className="category-meta-title">{currentCategory.label}</h3>
              <p className="category-meta-desc">
                {activeCat === 'sushi' && activeSushiSub !== 'todos'
                  ? `${SUSHI_SUBCATEGORIES.find(s => s.slug === activeSushiSub)?.label} · ${displayedSushiItems.length} opciones preparadas a mano`
                  : `${displayedSushiItems.length} opciones disponibles`}
              </p>
            </div>
            <div className="divider-orn" style={{ margin: '0' }}></div>
          </div>

          {/* Grilla de Platos de la Categoría Activa */}
          <div className="dishes-grid">
            {displayedSushiItems.map((dish) => (
              <DishSlide key={dish.id} dish={dish} catSlug={activeCat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
