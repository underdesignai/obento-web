// Utilidad de Analíticas y Seguimiento de Conversión para Obento Takeaway
// Cumple con la normativa AEPD y LSSI-CE Art. 22.2 (Bloqueo previo al consentimiento)
// Compatible con Google Consent Mode v2 y Google Analytics 4 (GA4)

function hasAnalyticsConsent() {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem('obento_cookie_consent');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed && parsed.analytics === true);
  } catch {
    return false;
  }
}

// Sincronizar Google Consent Mode v2 en tiempo de ejecución
if (typeof window !== 'undefined') {
  window.addEventListener('obento_consent_updated', (event) => {
    const isAllowed = Boolean(event?.detail?.analytics);
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: isAllowed ? 'granted' : 'denied',
        ad_storage: isAllowed ? 'granted' : 'denied'
      });
    }
  });
}

function getSessionId() {
  if (typeof window === 'undefined') return 'server_session';
  try {
    let sid = localStorage.getItem('obento_analytics_sid');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('obento_analytics_sid', sid);
    }
    return sid;
  } catch {
    return 'anon_session';
  }
}

export function trackEvent(tipo, data = {}, force = false) {
  if (typeof window === 'undefined') return;

  // VERIFICACIÓN DE CONSENTIMIENTO (LSSI-CE Art. 22.2 / AEPD)
  if (!force && !hasAnalyticsConsent()) {
    // Si el usuario no ha otorgado consentimiento expreso para analítica, abortar de forma silenciosa
    return;
  }

  // 1. Google Analytics 4 (GA4) Event Dispatch
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', tipo, {
        event_category: 'Obento_Takeaway',
        page_location: data.pagina || window.location.href,
        ...data
      });
    }
  } catch (_) {}

  // 2. Endpoint Interno PostgreSQL
  const payload = {
    sessionId: getSessionId(),
    tipo,
    pagina: data.pagina || window.location.pathname,
    dishId: data.dishId ? String(data.dishId) : null,
    dishNombre: data.dishNombre || null,
    cantidadItems: typeof data.cantidadItems === 'number' ? data.cantidadItems : 0,
    totalCarrito: typeof data.totalCarrito === 'number' ? data.totalCarrito : 0,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null
  };

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
    } else {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  } catch (err) {
    // Silencioso para no interferir con la navegación del usuario
  }
}

export function trackPageView(pagina = window.location.pathname) {
  trackEvent('page_view', { pagina });
}

export function trackAddToCart(dish, cantidad = 1, totalCarrito = 0, totalCount = 0) {
  trackEvent('add_to_cart', {
    pagina: window.location.pathname,
    dishId: dish.id,
    dishNombre: dish.nombre,
    cantidadItems: totalCount,
    totalCarrito: totalCarrito,
    metadata: {
      precio: dish.precio,
      cantidad: cantidad
    }
  });

  // Evento estándar de Ecommerce para GA4
  if (hasAnalyticsConsent() && typeof window.gtag === 'function') {
    window.gtag('event', 'add_to_cart', {
      currency: 'EUR',
      value: dish.precio * cantidad,
      items: [{
        item_id: String(dish.id),
        item_name: dish.nombre,
        price: dish.precio,
        quantity: cantidad
      }]
    });
  }
}

export function trackCartView(totalCount = 0, totalCarrito = 0) {
  trackEvent('view_cart', {
    pagina: window.location.pathname,
    cantidadItems: totalCount,
    totalCarrito: totalCarrito
  });
}

export function trackCheckoutOpen(totalCount = 0, totalCarrito = 0) {
  trackEvent('begin_checkout', {
    pagina: window.location.pathname,
    cantidadItems: totalCount,
    totalCarrito: totalCarrito
  });
}

export function trackOrderCompleted(pedido) {
  trackEvent('order_completed', {
    pagina: window.location.pathname,
    cantidadItems: Array.isArray(pedido?.items) ? pedido.items.length : 0,
    totalCarrito: typeof pedido?.total === 'number' ? pedido.total : 0,
    metadata: {
      numeroPedido: pedido?.numero_pedido,
      tipoEntrega: pedido?.tipo_entrega,
      metodoPago: pedido?.metodo_pago
    }
  });

  // Evento estándar de Conversión Purchase para GA4
  if (hasAnalyticsConsent() && typeof window.gtag === 'function') {
    window.gtag('event', 'purchase', {
      transaction_id: pedido?.numero_pedido || `ped_${Date.now()}`,
      value: typeof pedido?.total === 'number' ? pedido.total : 0,
      currency: 'EUR',
      items: Array.isArray(pedido?.items)
        ? pedido.items.map(item => ({
            item_id: String(item.id || item.dish_id),
            item_name: item.nombre || item.name,
            price: item.precio || item.price,
            quantity: item.cantidad || item.quantity || 1
          }))
        : []
    });
  }
}

export function trackClickToCall() {
  trackEvent('click_to_call', {
    pagina: window.location.pathname,
    metadata: { telefono: '+34613927596' }
  });

  if (hasAnalyticsConsent() && typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      currency: 'EUR',
      lead_source: 'phone_call'
    });
  }
}

export function trackAppInstall(data = {}) {
  const isIOS = typeof window !== 'undefined' && /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isAndroid = typeof window !== 'undefined' && /android/.test(window.navigator.userAgent.toLowerCase());
  const platform = isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop';

  let clientInfo = {};
  try {
    const saved = localStorage.getItem('obento_last_customer');
    if (saved) clientInfo = JSON.parse(saved);
  } catch (_) {}

  trackEvent('app_install', {
    pagina: typeof window !== 'undefined' ? window.location.pathname : '/',
    metadata: {
      platform,
      standalone: typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true),
      clienteNombre: clientInfo.nombre || null,
      clienteTelefono: clientInfo.telefono || null,
      clienteEmail: clientInfo.email || null,
      ...data
    }
  }, true);
}

