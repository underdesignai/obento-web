import React, { useState, useEffect } from 'react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIosPrompt, setIsIosPrompt] = useState(false);

  useEffect(() => {
    // Check if already in standalone / PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;

    // Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    const isSafari = /safari/.test(ua) && !/chrome|crios|fxios|edge|edg/.test(ua);

    if (isIosDevice && isSafari) {
      // Only show iOS tip if not dismissed recently
      const dismissed = localStorage.getItem('obento_ios_pwa_dismissed');
      if (!dismissed) {
        setIsIosPrompt(true);
        setShowInstallBanner(true);
      }
    }

    // Android & Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    if (isIosPrompt) {
      localStorage.setItem('obento_ios_pwa_dismissed', 'true');
    }
  };

  if (!showInstallBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '18px',
      left: '16px',
      right: '16px',
      maxWidth: '440px',
      margin: '0 auto',
      zIndex: 9998,
      background: 'rgba(18, 17, 16, 0.96)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(200, 30, 34, 0.35)',
      borderRadius: '16px',
      padding: '14px 16px',
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(200, 30, 34, 0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#fff',
      animation: 'fadeInUp 0.3s ease-out'
    }}>
      <img
        src="/icons/icon-192x192.png"
        alt="Obento App"
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          objectFit: 'contain',
          background: '#0c0b0a',
          padding: '2px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      />
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: '13px', letterSpacing: '0.04em', color: '#f3ede0' }}>
          Instala la App de OBENTO
        </div>
        <div style={{ fontSize: '11px', color: '#a89f8d', marginTop: '2px', lineHeight: 1.3 }}>
          {isIosPrompt ? (
            <span>Pulsa <strong style={{ color: '#fff' }}>Compartir</strong> ⎋ y luego <strong style={{ color: '#fff' }}>«Añadir a inicio» ＋</strong></span>
          ) : (
            'Accede a tus pedidos y carta con un solo toque.'
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!isIosPrompt && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            style={{
              background: 'linear-gradient(135deg, #c81e22, #99151b)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 2px 10px rgba(200,30,34,0.4)',
              whiteSpace: 'nowrap'
            }}
          >
            Instalar
          </button>
        )}
        <button
          onClick={handleDismiss}
          aria-label="Cerrar"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#8b8475',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
