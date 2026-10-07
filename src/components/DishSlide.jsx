import React, { useState } from 'react';
import { ALLERGENS } from '../data/menuData';

function fmt(n) {
  return Number(n).toFixed(2).replace('.', ',') + '€';
}

export default function DishSlide({ dish, catSlug }) {
  const tienePorciones = Array.isArray(dish.porciones) && dish.porciones.length > 0;
  const tieneOpciones = !tienePorciones && Array.isArray(dish.opciones) && dish.opciones.length > 0;

  const [selectedPortion, setSelectedPortion] = useState(
    tienePorciones ? dish.porciones[0] : null
  );

  const currentPrice = tienePorciones ? selectedPortion.precio : dish.precio;

  return (
    <div className="dish-slide" data-cat={catSlug}>
      {dish.imagen && (
        <div className="dish-media-wrap">
          <div className="dish-media">
            <img src={dish.imagen} alt={dish.nombre} loading="lazy" />
          </div>
        </div>
      )}
      <div className="dish-info">
        <div className="dish-top">
          <div className="dish-head">
            <div className="dish-head-text">
              <h3 className="dish-name">{dish.nombre}</h3>
            </div>
            <div className="dish-head-cta">
              <div className="dish-price">{fmt(currentPrice)}</div>
            </div>
          </div>

          {tienePorciones && (
            <div className="portion-row" data-dish={dish.id} data-kind="porcion">
              {dish.porciones.map((p) => (
                <button
                  key={p.cant}
                  type="button"
                  className={`portion-pill ${selectedPortion.cant === p.cant ? 'active' : ''}`}
                  onClick={() => setSelectedPortion(p)}
                >
                  {p.cant} uds
                </button>
              ))}
            </div>
          )}

          {tieneOpciones && (
            <p className="options-text">
              <span className="options-label">A elegir:</span>{' '}
              {dish.opciones.map((o) => o.label).join(' · ')}
            </p>
          )}

          {dish.descripcion && <p className="dish-desc">{dish.descripcion}</p>}

          <div className="dish-rule"></div>

          <div className="allergen-row">
            {!dish.alergenos || dish.alergenos.length === 0 ? (
              <span className="allergen-none">Sin alérgenos destacados</span>
            ) : (
              dish.alergenos.map((key) => {
                const a = ALLERGENS[key];
                if (!a) return null;
                return (
                  <div
                    key={key}
                    className="allergen-badge"
                    title={a.label}
                    dangerouslySetInnerHTML={{
                      __html: a.icono && a.icono.trim() ? a.icono : a.short
                    }}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
