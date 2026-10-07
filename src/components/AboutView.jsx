import React from 'react';
import { ABOUT_INFO } from '../data/menuData';

export default function AboutView({ isActive, onBack }) {
  return (
    <section id="view-about" className={`view ${isActive ? 'active' : ''}`}>
      <div className="subview-header">
        <button className="back-btn" id="btn-about-back" onClick={onBack} aria-label="Volver">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <h2>Conócenos</h2>
      </div>
      <div className="subview-body" style={{ paddingBottom: '40px' }}>
        <div className="about-hero seigaiha">
          <div className="brand-block">
            <div className="brand-title">OBENTO</div>
            <p className="splash-subtitle" style={{ marginBottom: 0 }}>Japanese Food</p>
          </div>
        </div>
        <p className="about-lead" id="about-lead">{ABOUT_INFO.lead}</p>
        <div className="value-list" id="value-list">
          {ABOUT_INFO.valores.map((v, i) => (
            <div className="value-item" key={i}>
              <div className="value-ico">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: v.ico }}
                />
              </div>
              <div className="value-text">
                <div className="v-title">{v.titulo}</div>
                <div className="v-desc">{v.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
