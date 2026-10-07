// Utilidad de Analíticas y Seguimiento de Conversión para Obento Takeaway

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

export function trackEvent(tipo, data = {}) {
  if (typeof window === 'undefined') return;

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
      categoria: dish.cat,
      sub: dish.sub
    }
  });
}

export function trackCartView(totalCarrito = 0, totalCount = 0) {
  trackEvent('cart_view', {
    pagina: window.location.pathname,
    cantidadItems: totalCount,
    totalCarrito: totalCarrito
  });
}

export function trackCheckoutOpen(totalCarrito = 0, totalCount = 0) {
  trackEvent('checkout_open', {
    pagina: window.location.pathname,
    cantidadItems: totalCount,
    totalCarrito: totalCarrito
  });
}

export function trackOrderCompleted(pedido) {
  trackEvent('order_completed', {
    pagina: window.location.pathname,
    cantidadItems: Array.isArray(pedido.items) ? pedido.items.length : 0,
    totalCarrito: Number(pedido.total) || 0,
    metadata: {
      numero_pedido: pedido.numero_pedido,
      metodo_pago: pedido.metodo_pago,
      hora_recogida: pedido.hora_recogida
    }
  });
}
