import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, SUSHI_SUBCATEGORIES, MENU, ABOUT_INFO } from '../data/menuData';
import DishCardOrder from '../components/DishCardOrder';
import CartDrawer from '../components/cart/CartDrawer';
import CheckoutModal from '../components/cart/CheckoutModal';
import OrderSuccessModal from '../components/cart/OrderSuccessModal';
import AllergenModal from '../components/AllergenModal';
import { useCart } from '../context/CartContext';

function fmt(n) {
  return Number(n).toFixed(2).replace('.', ',') + '€';
}

export default function PedidosPage() {
  const {
    totalCount,
    totalPrice,
    setIsCartOpen,
    setIsCheckoutOpen,
    clearCart
  } = useCart();

  const [activeCat, setActiveCat] = useState('entrantes');
  const [activeSushiSub, setActiveSushiSub] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAllergenOpen, setIsAllergenOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [platosLista, setPlatosLista] = useState(MENU);

  // Sincronización en vivo con la carta oficial
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

  // Escuchar si el cliente regresa de Stripe con ?status=success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const sessionId = urlParams.get('session_id');
    const numeroPedido = urlParams.get('numero_pedido');
    const simulated = urlParams.get('simulated');
    const pedidoId = urlParams.get('pedido_id');

    if (status === 'success') {
      clearCart();
      const verifyUrl = sessionId
        ? `/api/pedidos/verify-session/${sessionId}?numero_pedido=${numeroPedido || ''}`
        : `/api/pedidos/verify-session/simulated?simulated=${simulated || 'true'}&numero_pedido=${numeroPedido || ''}&pedido_id=${pedidoId || ''}`;

      fetch(verifyUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data.pedido) {
            setConfirmedOrder(data.pedido);
          } else {
            setConfirmedOrder({
              numero_pedido: numeroPedido || 'OB-CONFIRMADO',
              cliente_nombre: 'Cliente Web',
              cliente_telefono: 'Confirmado',
              hora_recogida: 'Lo antes posible (~25-35 min)',
              estado_pago: 'pagado',
              total: totalPrice > 0 ? totalPrice : 0,
              items: []
            });
          }
          // Limpiar parámetros de la URL sin recargar
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          console.error('Error al verificar sesión:', err);
          setConfirmedOrder({
            numero_pedido: numeroPedido || 'OB-CONFIRMADO',
            cliente_nombre: 'Cliente',
            cliente_telefono: '',
            hora_recogida: 'Lo antes posible (~25-35 min)',
            estado_pago: 'pagado',
            total: totalPrice,
            items: []
          });
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, []);

  // Platos filtrados por categoría, subcategoría y búsqueda
  const filteredDishes = useMemo(() => {
    let list = platosLista;

    // Si hay búsqueda por texto, busca en toda la carta
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (dish) =>
          dish.nombre.toLowerCase().includes(q) ||
          (dish.descripcion && dish.descripcion.toLowerCase().includes(q))
      );
    }

    // Filtrar por categoría activa
    list = list.filter((dish) => dish.cat === activeCat);

    // Si es sushi y hay subcategoría activa
    if (activeCat === 'sushi' && activeSushiSub !== 'todos') {
      list = list.filter((dish) => dish.sub === activeSushiSub);
    }

    return list;
  }, [platosLista, activeCat, activeSushiSub, searchQuery]);

  const currentCategory = CATEGORIES.find((c) => c.slug === activeCat) || CATEGORIES[0];

  return (
    <div className="pedidos-page">
      {/* Barra de Navegación de Pedidos */}
      <header className="site-header pedidos-header">
        <div className="header-container">
          <div className="brand-group" onClick={() => (window.location.href = '/')} style={{ cursor: 'pointer' }}>
            <img src="/images/logo-obento.png" alt="Obento" className="nav-logo" />
            <div className="nav-brand-text">
              <span className="brand-title small">OBENTO</span>
              <span className="nav-brand-sub hide-on-mobile">Takeaway · Pedidos Online</span>
            </div>
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="btn-secondary-outline nav-back-btn"
              onClick={() => (window.location.href = '/')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-ico-svg">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span className="nav-back-text-full">Volver a la Web</span>
              <span className="nav-back-text-short">Volver</span>
            </button>

            <button
              type="button"
              className="icon-btn nav-allergen-btn"
              title="Guía de Alérgenos"
              aria-label="Alérgenos"
              onClick={() => setIsAllergenOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v6M12 7.5v.01" />
              </svg>
            </button>

            {/* Botón Carrito */}
            <button
              type="button"
              className="btn-primary nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-ico-svg">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="nav-cart-label">PEDIDO</span>
              {totalCount > 0 && (
                <span className="cart-badge-counter">{totalCount} · {fmt(totalPrice)}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner de Pedidos */}
      <section className="pedidos-hero-banner">
        <div className="section-container">
          <div className="pedidos-hero-content">
            <div className="section-eyebrow-dot">
              <span className="dot"></span>
              <span>Servicio Takeaway · La Ñora (Murcia)</span>
            </div>
            <h1 className="pedidos-hero-title">Haz tu Pedido Online</h1>
            <p className="pedidos-hero-desc">
              Toda nuestra carta artesanal preparada al momento. Elige tus platos, personaliza tus porciones y recoge en Calle Mayor 45 recién salido de cocina.
            </p>

            <div className="pedidos-highlights-row">
              <div className="pedidos-highlight-chip">
                <span>⏱️</span>
                <span>Preparación: ~25 - 35 min</span>
              </div>
              <div className="pedidos-highlight-chip">
                <span>💳</span>
                <span>Pago con Tarjeta Online (Stripe) o al Recoger</span>
              </div>
              <div className="pedidos-highlight-chip">
                <span>📍</span>
                <span>Recogida en Local: C/ Mayor 45, La Ñora</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Filtros, Categorías y Búsqueda */}
      <section className="pedidos-menu-section">
        <div className="section-container">
          <div className="pedidos-controls-bar">
            {/* Buscador */}
            <div className="search-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-ico-svg">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar plato o ingrediente (ej. Salmón, Gyozas, Atún...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pedidos-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  &times;
                </button>
              )}
            </div>

            {/* Desplegable de Categorías */}
            {!searchQuery && (
              <div className="pedidos-dropdown-container">
                <div className="custom-dropdown-select-wrap">
                  <span className="dropdown-prefix-icon">🍱</span>
                  <select
                    id="categoria-select"
                    className="pedidos-category-select"
                    value={activeCat}
                    onChange={(e) => {
                      setActiveCat(e.target.value);
                      setActiveSushiSub('todos');
                    }}
                    aria-label="Seleccionar categoría de la carta"
                  >
                    {CATEGORIES.map((cat) => {
                      const count = platosLista.filter((m) => m.cat === cat.slug).length;
                      return (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.label} ({count})
                        </option>
                      );
                    })}
                  </select>
                  <div className="dropdown-chevron-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Subcategorías de Sushi */}
            {!searchQuery && activeCat === 'sushi' && (
              <div className="sushi-subnav-bar">
                <button
                  type="button"
                  className={`sushi-sub-pill ${activeSushiSub === 'todos' ? 'active' : ''}`}
                  onClick={() => setActiveSushiSub('todos')}
                >
                  Todos ({platosLista.filter((m) => m.cat === 'sushi').length})
                </button>
                {SUSHI_SUBCATEGORIES.map((sub) => {
                  const subCount = platosLista.filter((m) => m.cat === 'sushi' && m.sub === sub.slug).length;
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
          </div>

          {/* Encabezado de la lista actual */}
          <div className="category-meta-header" style={{ marginTop: '24px', marginBottom: '24px' }}>
            <div>
              <h2 className="category-meta-title">
                {searchQuery ? `Resultados de búsqueda: "${searchQuery}"` : currentCategory.label}
              </h2>
              <p className="category-meta-desc">
                {searchQuery
                  ? `Se han encontrado ${filteredDishes.length} platos disponibles.`
                  : activeCat === 'sushi' && activeSushiSub !== 'todos'
                  ? `Selección especial de ${activeSushiSub}.`
                  : `Selección elaborada con ingredientes frescos de máxima calidad.`}
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary-outline allergen-info-btn"
              onClick={() => setIsAllergenOpen(true)}
              style={{ padding: '6px 14px', fontSize: '11px' }}
            >
              Consultar Alérgenos
            </button>
          </div>

          {/* Grid de Platos Interactivos */}
          {filteredDishes.length === 0 ? (
            <div className="empty-search-state">
              <p>No se encontraron platos que coincidan con "{searchQuery}".</p>
              <button
                type="button"
                className="btn-secondary-outline"
                onClick={() => setSearchQuery('')}
                style={{ marginTop: '12px' }}
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="dishes-order-grid">
              {filteredDishes.map((dish) => (
                <DishCardOrder
                  key={dish.id}
                  dish={dish}
                  onOpenAllergens={() => setIsAllergenOpen(true)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Barra Fija Inferior Permanente con Botón 'PAGAR' */}
      <aside className="bottom-pay-bar">
        <div className="bottom-pay-inner">
          <div
            className="bottom-pay-info"
            onClick={() => setIsCartOpen(true)}
            title="Ver cesta y platos añadidos"
          >
            <div className="bottom-pay-cart-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
              {totalCount > 0 && <span className="bottom-pay-bubble">{totalCount}</span>}
            </div>
            <div className="bottom-pay-texts">
              <span className="bottom-pay-count">
                {totalCount === 0 ? 'Añade tus platos preferidos' : `${totalCount} ${totalCount === 1 ? 'plato' : 'platos'}`}
              </span>
              <span className="bottom-pay-total">
                {totalCount === 0 ? '0,00€' : fmt(totalPrice)}
              </span>
            </div>
          </div>

          <button
            type="button"
            className={`bottom-pay-btn ${totalCount === 0 ? 'is-disabled' : ''}`}
            onClick={() => {
              if (totalCount > 0) {
                setIsCheckoutOpen(true);
              } else {
                setIsCartOpen(true);
              }
            }}
            aria-label="Pagar pedido"
          >
            <span className="pay-btn-text">Pagar</span>
            {totalCount > 0 && <span className="pay-btn-subtotal">· {fmt(totalPrice)}</span>}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-ico-svg">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Cajón Lateral del Carrito */}
      <CartDrawer />

      {/* Modal de Checkout / Pago */}
      <CheckoutModal
        onOrderSuccess={(pedido) => {
          setConfirmedOrder(pedido);
        }}
      />

      {/* Modal de Confirmación de Pedido */}
      {confirmedOrder && (
        <OrderSuccessModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}

      {/* Modal de Alérgenos */}
      <AllergenModal
        isOpen={isAllergenOpen}
        onClose={() => setIsAllergenOpen(false)}
      />
    </div>
  );
}
