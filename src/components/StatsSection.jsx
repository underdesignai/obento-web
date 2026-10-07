import React, { useState, useEffect, useRef } from 'react';

function useCounter(target, isVisible, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let startTime = null;
    let animationFrameId;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out exponential
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, target, duration]);

  return count;
}

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const count1 = useCounter(2000, isVisible);
  const count2 = useCounter(316, isVisible);
  const count3 = useCounter(5, isVisible);

  return (
    <section className="stats-section reveal-on-scroll" ref={sectionRef}>
      <div className="section-container">
        <div className="section-header-center">
          <span className="section-eyebrow">Honestidad y Trayectoria</span>
          <h2 className="section-title">Cifras que Respaldan Nuestra Pasión</h2>
          <p className="section-subtitle">
            El compromiso diario de nuestro equipo con la cocina japonesa auténtica en La Ñora (Murcia).
          </p>
        </div>

        <div className="stats-grid">
          {/* Card 1 */}
          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className="stat-badge">Bento & Rolls</span>
            </div>
            <div className="stat-number-wrap">
              <span className="stat-number">{count1}</span>
              <span className="stat-symbol">+</span>
            </div>
            <h3 className="stat-title">Platos Servidos</h3>
            <p className="stat-desc">
              Cada elaboración armada al momento con cortes precisos y equilibrio estético y nutricional.
            </p>
          </div>

          {/* Card 2 */}
          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6a4.8 4.8 0 0 1 8.8-2.7 4.8 4.8 0 0 1 8.8 2.7z" />
                </svg>
              </div>
              <span className="stat-badge">Reseñas Locales</span>
            </div>
            <div className="stat-number-wrap">
              <span className="stat-number">{count2}</span>
              <span className="stat-symbol">+</span>
            </div>
            <h3 className="stat-title">Clientes Satisfechos</h3>
            <p className="stat-desc">
              Comensales que nos eligen para pedidos take away y recogida para disfrutar del mejor sushi recién hecho en casa.
            </p>
          </div>

          {/* Card 3 */}
          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="stat-badge">Maestría Culinaria</span>
            </div>
            <div className="stat-number-wrap">
              <span className="stat-number">{count3}</span>
              <span className="stat-symbol stat-symbol-text">Años</span>
            </div>
            <h3 className="stat-title">Años de Experiencia</h3>
            <p className="stat-desc">
              Perfeccionando técnicas de maceración, caldos de sabor profundo y la alquimia del arroz shari perfecto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
