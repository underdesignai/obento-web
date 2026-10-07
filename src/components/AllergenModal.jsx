import React from 'react';
import { ALLERGENS } from '../data/menuData';

export default function AllergenModal({ isOpen, onClose }) {
  return (
    <div
      className={`modal-overlay ${isOpen ? 'show' : ''}`}
      id="allergen-modal"
      onClick={(e) => {
        if (e.target.id === 'allergen-modal') onClose();
      }}
    >
      <div className="modal-sheet">
        <h3>Alérgenos</h3>
        <div id="legend-list">
          {Object.entries(ALLERGENS).map(([key, a]) => (
            <div className="legend-item" key={key}>
              <div
                className="allergen-badge"
                dangerouslySetInnerHTML={{
                  __html: a.icono && a.icono.trim() ? a.icono : a.short
                }}
              />
              <span>{a.label}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn-primary btn-block modal-close"
          id="btn-close-modal"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
