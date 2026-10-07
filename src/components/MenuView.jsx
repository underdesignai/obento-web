import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, SUSHI_SUBCATEGORIES, MENU, ABOUT_INFO } from '../data/menuData';
import DishSlide from './DishSlide';

function telHref(tel) {
  return 'tel:' + tel.replace(/[^\d+]/g, '');
}

export default function MenuView({
  isActive,
  onBack,
  onOpenAbout,
  onOpenLocation,
  onOpenAllergens
}) {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].slug);
  const [platosLista, setPlatosLista] = useState(MENU);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch('/api/carta')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlatosLista(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cat = entry.target.dataset.cat;
            if (cat) {
              setActiveCat(cat);
            }
          }
        });
      },
      {
        root: scrollContainer,
        threshold: 0.4
      }
    );

    const titleSlides = scrollContainer.querySelectorAll('.cat-title-slide');
    titleSlides.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [isActive]);

  const scrollToCategory = (slug) => {
    setActiveCat(slug);
    const target = document.getElementById(`cat-title-${slug}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const phoneHref = telHref(ABOUT_INFO.telefono);

  return (
    <section id="view-menu" className={`view ${isActive ? 'active' : ''}`}>
      <div className="menu-scroll" id="menu-scroll" ref={scrollRef}>
        <div className="menu-header">
          <div className="header-row">
            <button
              type="button"
              className="icon-btn"
              id="btn-menu-back"
              aria-label="Volver"
              onClick={onBack}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <div className="wordmark">
              <div className="brand-title small">OBENTO</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="icon-btn"
                id="btn-open-about"
                aria-label="Conócenos"
                onClick={onOpenAbout}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6a4.8 4.8 0 0 1 8.8-2.7 4.8 4.8 0 0 1 8.8 2.7z" />
                </svg>
              </button>
              <button
                type="button"
                className="icon-btn"
                id="btn-open-location"
                aria-label="Ubicación"
                onClick={onOpenLocation}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.3" />
                </svg>
              </button>
              <button
                type="button"
                className="icon-btn"
                id="btn-allergen-info"
                aria-label="Alérgenos"
                onClick={onOpenAllergens}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v6M12 7.5v.01" />
                </svg>
              </button>
            </div>
          </div>
          <div className="pills-row" id="pills-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                className={`pill ${activeCat === cat.slug ? 'active' : ''}`}
                data-cat={cat.slug}
                onClick={() => scrollToCategory(cat.slug)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {CATEGORIES.map((cat) => {
          const catItems = platosLista.filter((m) => m.cat === cat.slug);

          return (
            <React.Fragment key={cat.slug}>
              <div
                className="cat-title-slide"
                id={`cat-title-${cat.slug}`}
                data-cat={cat.slug}
              >
                <div className="eyebrow">Carta OBENTO</div>
                <h2>{cat.label}</h2>
                <div className="divider-orn"></div>
                <div className="count">{catItems.length} platos · desliza para descubrir</div>
              </div>

              {cat.slug === 'sushi' ? (
                SUSHI_SUBCATEGORIES.map((sub) => {
                  const subItems = catItems.filter((m) => m.sub === sub.slug);
                  if (subItems.length === 0) return null;
                  return (
                    <React.Fragment key={sub.slug}>
                      <div className="subcat-title-slide" data-cat={cat.slug}>
                        <h3>{sub.label}</h3>
                        <div className="divider-orn small"></div>
                      </div>
                      <div className="dishes-grid">
                        {subItems.map((dish) => (
                          <DishSlide key={dish.id} dish={dish} catSlug={cat.slug} />
                        ))}
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="dishes-grid">
                  {catItems.map((dish) => (
                    <DishSlide key={dish.id} dish={dish} catSlug={cat.slug} />
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <a className="call-bar" id="call-bar" href={phoneHref}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-3-2 2c-2.5-1.2-4.3-3-5.5-5.5l2-2-3-6z" />
        </svg>
        <span>
          Número de pedidos<b id="call-bar-num">{ABOUT_INFO.telefono}</b>
        </span>
      </a>
    </section>
  );
}
