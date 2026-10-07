import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { trackOrderCompleted } from '../../utils/analytics';

function fmt(n) {
  return Number(n).toFixed(2).replace('.', ',') + '€';
}

const HORAS_DISPONIBLES = [
  { label: 'Lo antes posible (~25-35 min)', val: 'Lo antes posible (~25-35 min)', icon: '⚡' },
  { label: 'En 45 minutos', val: 'En 45 minutos', icon: '🕒' },
  { label: 'En 1 hora', val: 'En 1 hora', icon: '🕒' },
  { label: 'En 1 hora y 30 minutos', val: 'En 1 hora y 30 minutos', icon: '🕒' },
  { label: 'Para cenar a las 20:30h', val: 'Para cenar a las 20:30h', icon: '🍣' },
  { label: 'Para cenar a las 21:00h', val: 'Para cenar a las 21:00h', icon: '🍣' },
  { label: 'Para cenar a las 21:30h', val: 'Para cenar a las 21:30h', icon: '🍣' },
  { label: 'Para cenar a las 22:00h', val: 'Para cenar a las 22:00h', icon: '🍣' },
  { label: 'Para cenar a las 22:30h', val: 'Para cenar a las 22:30h', icon: '🍣' }
];

export default function CheckoutModal({ onOrderSuccess }) {
  const {
    cart,
    totalPrice,
    finalPrice,
    appliedCoupon,
    couponDiscount,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart
  } = useCart();

  const [tipoEntrega, setTipoEntrega] = useState('recogida_local'); // 'recogida_local' | 'domicilio'
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [direccionDetalles, setDireccionDetalles] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('30107'); // Default La Ñora / Murcia
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [horaRecogida, setHoraRecogida] = useState('Lo antes posible (~25-35 min)');
  const [isHoraDropdownOpen, setIsHoraDropdownOpen] = useState(false);
  const [notas, setNotas] = useState('');
  const [metodoPago, setMetodoPago] = useState('stripe'); // 'stripe' | 'restaurante'
  const [necesitaCubiertos, setNecesitaCubiertos] = useState(true);

  // Estados de la tarjeta bancaria (Simulación interactiva)
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [caducidad, setCaducidad] = useState('');
  const [cvc, setCvc] = useState('');
  const [titularTarjeta, setTitularTarjeta] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCheckoutOpen) return null;

  // Formateadores automáticos de tarjeta
  const handleNumeroTarjetaChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setNumeroTarjeta(formatted);
  };

  const handleCaducidadChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCaducidad(val);
  };

  const handleCvcChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvc(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nombre.trim() || !telefono.trim()) {
      setErrorMsg('Por favor introduce tu nombre y un teléfono de contacto.');
      return;
    }

    if (tipoEntrega === 'domicilio' && !direccionEntrega.trim()) {
      setErrorMsg('Por favor introduce la dirección completa para el reparto a domicilio.');
      return;
    }

    if (cart.length === 0) {
      setErrorMsg('Tu cesta está vacía.');
      return;
    }

    if (metodoPago === 'stripe') {
      if (numeroTarjeta.replace(/\s/g, '').length < 15) {
        setErrorMsg('Por favor introduce un número de tarjeta válido (16 dígitos).');
        return;
      }
      if (!caducidad || caducidad.length < 5) {
        setErrorMsg('Por favor introduce la fecha de caducidad (MM/AA).');
        return;
      }
      if (!cvc || cvc.length < 3) {
        setErrorMsg('Por favor introduce el código de seguridad CVC (3 dígitos).');
        return;
      }
    }

    setLoading(true);

    const pedidoPayload = {
      cliente_nombre: nombre.trim(),
      cliente_telefono: telefono.trim(),
      cliente_email: email.trim() || null,
      tipo_entrega: tipoEntrega,
      direccion_entrega: tipoEntrega === 'domicilio' ? direccionEntrega.trim() : null,
      direccion_detalles: tipoEntrega === 'domicilio' ? direccionDetalles.trim() : null,
      codigo_postal: tipoEntrega === 'domicilio' ? codigoPostal.trim() : null,
      hora_recogida: horaRecogida,
      notas: `${necesitaCubiertos ? 'Incluir palillos y soja. ' : 'Sin palillos. '}${notas}`.trim(),
      metodo_pago: metodoPago,
      estado_pago: metodoPago === 'stripe' ? 'pagado' : 'pendiente_local',
      items: cart,
      cupon_codigo: appliedCoupon ? appliedCoupon.codigo : null,
      total: finalPrice
    };

    try {
      if (metodoPago === 'stripe') {
        // Simulación interactiva de pasarela de pago bancario
        await new Promise((resolve) => setTimeout(resolve, 1400));

        const res = await fetch('/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pedidoPayload)
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Error al procesar el pago con tarjeta.');
        }

        clearCart();
        setIsCheckoutOpen(false);
        trackOrderCompleted({
          ...data.pedido,
          metodo_pago: 'stripe'
        });
        if (onOrderSuccess) {
          onOrderSuccess({
            ...data.pedido,
            estado_pago: 'pagado'
          });
        }
      } else {
        // Pago en Restaurante (Efectivo / Tarjeta al recoger)
        const res = await fetch('/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pedidoPayload)
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Error al registrar el pedido.');
        }

        clearCart();
        setIsCheckoutOpen(false);
        trackOrderCompleted({
          ...data.pedido,
          metodo_pago: 'restaurante'
        });
        if (onOrderSuccess) {
          onOrderSuccess(data.pedido);
        }
      }
    } catch (err) {
      console.error('Error en checkout:', err);
      setErrorMsg(err.message || 'Hubo un problema al procesar tu pedido. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-backdrop" onClick={() => !loading && setIsCheckoutOpen(false)}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-modal-header">
          <div>
            <span className="checkout-badge" style={{
              background: tipoEntrega === 'domicilio' ? 'rgba(59,130,246,0.15)' : 'rgba(200,30,34,0.15)',
              color: tipoEntrega === 'domicilio' ? '#60a5fa' : '#c81e22',
              borderColor: tipoEntrega === 'domicilio' ? 'rgba(59,130,246,0.3)' : 'rgba(200,30,34,0.3)'
            }}>
              {tipoEntrega === 'domicilio' ? '🛵 Reparto · Entrega a Domicilio' : '🥡 Takeaway · Recogida en Local'}
            </span>
            <h3 className="checkout-title">Finalizar Pedido</h3>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={() => !loading && setIsCheckoutOpen(false)}
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        {errorMsg && (
          <div className="checkout-alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="checkout-form">
          {/* Tipo de Pedido: Recogida o Reparto a Domicilio */}
          <div className="form-section-title">1. Modalidad de Pedido</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
            <button
              type="button"
              onClick={() => setTipoEntrega('recogida_local')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 10px',
                borderRadius: '10px',
                border: tipoEntrega === 'recogida_local' ? '2px solid #c81e22' : '1px solid rgba(255,255,255,0.12)',
                background: tipoEntrega === 'recogida_local' ? 'rgba(200,30,34,0.12)' : 'rgba(255,255,255,0.03)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '20px' }}>🥡</span>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>Recogida en Tienda</span>
              <span style={{ fontSize: '11px', color: '#a0998f' }}>Calle Mayor 45, La Ñora</span>
            </button>

            <button
              type="button"
              onClick={() => setTipoEntrega('domicilio')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 10px',
                borderRadius: '10px',
                border: tipoEntrega === 'domicilio' ? '2px solid #c81e22' : '1px solid rgba(255,255,255,0.12)',
                background: tipoEntrega === 'domicilio' ? 'rgba(200,30,34,0.12)' : 'rgba(255,255,255,0.03)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '20px' }}>🛵</span>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>Entrega a Domicilio</span>
              <span style={{ fontSize: '11px', color: '#4ade80' }}>Reparto oficial Obento</span>
            </button>
          </div>

          {/* Formulario de Dirección de Entrega (si es delivery) */}
          {tipoEntrega === 'domicilio' && (
            <div style={{
              background: 'rgba(200,30,34,0.06)',
              border: '1px solid rgba(200,30,34,0.25)',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#f3ede0', fontWeight: 600, fontSize: '13px' }}>
                <span>📍 Dirección de Reparto (Verificada para Google Maps)</span>
              </div>
              <div className="form-field" style={{ marginBottom: '10px' }}>
                <label>Calle, Avenida o Plaza y Número *</label>
                <input
                  type="text"
                  required={tipoEntrega === 'domicilio'}
                  placeholder="Ej. Calle Mayor, 12"
                  value={direccionEntrega}
                  onChange={(e) => setDireccionEntrega(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Piso, Puerta, Bloque, Escalera</label>
                  <input
                    type="text"
                    placeholder="Ej. 2º B, Bloque A"
                    value={direccionDetalles}
                    onChange={(e) => setDireccionDetalles(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="form-field">
                  <label>Código Postal / Zona</label>
                  <input
                    type="text"
                    placeholder="30107 (La Ñora/Murcia)"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Datos de contacto */}
          <div className="form-section-title">2. Datos de Contacto</div>
          <div className="form-grid-2">
            <div className="form-field">
              <label>Nombre y Apellidos *</label>
              <input
                type="text"
                required
                placeholder="Ej. Carmen Navarro"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-field">
              <label>Teléfono móvil * (Para el repartidor)</label>
              <input
                type="tel"
                required
                placeholder="Ej. 654 321 098"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Correo Electrónico (opcional para confirmación)</label>
            <input
              type="email"
              placeholder="tuemail@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Horario de recogida o entrega: DESPLEGABLE con Estilo y Temas de la Web */}
          <div className="form-section-title" style={{ marginTop: '16px' }}>
            {tipoEntrega === 'domicilio' ? '3. Horario de Entrega Deseado' : '3. Horario de Recogida en Local'}
          </div>
          <div className="form-field">
            <label>
              {tipoEntrega === 'domicilio' ? '¿A qué hora deseas recibir tu pedido en tu domicilio?' : '¿A qué hora recogerás tu pedido en La Ñora?'}
            </label>

            <div className="custom-dropdown-wrap">
              <button
                type="button"
                className={`custom-dropdown-trigger ${isHoraDropdownOpen ? 'open' : ''}`}
                onClick={() => setIsHoraDropdownOpen(!isHoraDropdownOpen)}
                disabled={loading}
              >
                <div className="dropdown-trigger-left">
                  <span className="dropdown-trigger-ico">
                    {HORAS_DISPONIBLES.find((h) => h.val === horaRecogida)?.icon || '🕒'}
                  </span>
                  <span className="dropdown-trigger-text">{horaRecogida}</span>
                </div>
                <div className={`dropdown-trigger-chevron ${isHoraDropdownOpen ? 'rotated' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {isHoraDropdownOpen && (
                <div className="custom-dropdown-menu">
                  {HORAS_DISPONIBLES.map((h) => {
                    const isSelected = horaRecogida === h.val;
                    return (
                      <button
                        key={h.val}
                        type="button"
                        className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setHoraRecogida(h.val);
                          setIsHoraDropdownOpen(false);
                        }}
                      >
                        <div className="dropdown-item-left">
                          <span className="dropdown-item-ico">{h.icon}</span>
                          <span className="dropdown-item-text">{h.label}</span>
                        </div>
                        {isSelected && (
                          <span className="dropdown-item-check">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Palillos y Notas */}
          <div className="form-checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={necesitaCubiertos}
                onChange={(e) => setNecesitaCubiertos(e.target.checked)}
                disabled={loading}
              />
              <span>Deseo palillos japoneses, servilletas y soja</span>
            </label>
          </div>

          <div className="form-field">
            <label>Instrucciones o alergias especiales para cocina</label>
            <textarea
              rows="2"
              placeholder="Ej. Sin sésamo en el nigiri, salsa picante aparte..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Método de Pago */}
          <div className="form-section-title" style={{ marginTop: '16px' }}>3. Método de Pago</div>
          <div className="payment-options-grid">
            <div
              className={`payment-card-option payment-card-option-stripe ${metodoPago === 'stripe' ? 'selected' : ''}`}
              onClick={() => setMetodoPago('stripe')}
              role="button"
              tabIndex={0}
            >
              <div className="payment-option-header-row">
                <input
                  type="radio"
                  name="metodo_pago"
                  value="stripe"
                  checked={metodoPago === 'stripe'}
                  onChange={() => setMetodoPago('stripe')}
                  disabled={loading}
                />
                <div className="payment-card-content">
                  <div className="payment-card-top">
                    <span className="payment-title">Pagar Online con Tarjeta</span>
                    <span className="payment-badge-secure">Stripe 100% Seguro</span>
                  </div>
                  <p className="payment-desc">
                    Paga con Visa, Mastercard, Apple Pay o Google Pay antes de recoger. Tu pedido pasa directo a preparación en cocina.
                  </p>
                </div>
              </div>

              {/* Formulario Interactivo de Tarjeta: CENTRADO DENTRO DE LA TARJETA */}
              {metodoPago === 'stripe' && (
                <div
                  className="card-fields-box centered-card-box"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="card-fields-header-centered">
                    <span className="card-fields-title">Introduce los datos de tu tarjeta</span>
                    <div className="card-brands-icons">
                      <span className="card-brand-pill visa">VISA</span>
                      <span className="card-brand-pill mc">Mastercard</span>
                    </div>
                  </div>

                  <div className="form-field" style={{ marginBottom: '10px' }}>
                    <label>Número de Tarjeta *</label>
                    <div className="card-input-icon-wrap">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="4548 0000 0000 0000"
                        value={numeroTarjeta}
                        onChange={handleNumeroTarjetaChange}
                        disabled={loading}
                        className="card-input"
                        maxLength={19}
                      />
                      <span className="card-icon-svg">💳</span>
                    </div>
                  </div>

                  <div className="card-inputs-row-2" style={{ marginBottom: '10px' }}>
                    <div className="form-field" style={{ marginBottom: 0 }}>
                      <label>Caducidad *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/AA"
                        value={caducidad}
                        onChange={handleCaducidadChange}
                        disabled={loading}
                        maxLength={5}
                        className="card-input"
                      />
                    </div>
                    <div className="form-field" style={{ marginBottom: 0 }}>
                      <label>CVC / CVV *</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        placeholder="123"
                        value={cvc}
                        onChange={handleCvcChange}
                        disabled={loading}
                        maxLength={4}
                        className="card-input"
                      />
                    </div>
                  </div>

                  <div className="form-field" style={{ marginBottom: '8px' }}>
                    <label>Nombre del Titular (opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Carmen Navarro"
                      value={titularTarjeta}
                      onChange={(e) => setTitularTarjeta(e.target.value)}
                      disabled={loading}
                      className="card-input"
                    />
                  </div>

                  <div className="card-security-note-centered">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span>Simulación de cobro seguro · Se guardará como pagado en la base de datos</span>
                  </div>
                </div>
              )}
            </div>

            <label className={`payment-card-option ${metodoPago === 'restaurante' ? 'selected' : ''}`}>
              <div className="payment-option-header-row">
                <input
                  type="radio"
                  name="metodo_pago"
                  value="restaurante"
                  checked={metodoPago === 'restaurante'}
                  onChange={() => setMetodoPago('restaurante')}
                  disabled={loading}
                />
                <div className="payment-card-content">
                  <div className="payment-card-top">
                    <span className="payment-title">
                      {tipoEntrega === 'domicilio' ? 'Pagar en Efectivo al Repartidor' : 'Pagar en el Restaurante'}
                    </span>
                    <span className="payment-badge-local">
                      {tipoEntrega === 'domicilio' ? 'En la Entrega' : 'Al Recoger'}
                    </span>
                  </div>
                  <p className="payment-desc">
                    {tipoEntrega === 'domicilio'
                      ? 'Paga en efectivo al repartidor de Obento cuando llegue a tu puerta con el pedido.'
                      : 'Paga en efectivo o con tarjeta en el mostrador de Obento cuando vengas a por tu pedido.'}
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Resumen Total y Botón de Pago */}
          <div className="checkout-summary-box">
            <div className="checkout-summary-row">
              <span>{cart.length} platos en el pedido</span>
              <span className="checkout-summary-total">{fmt(totalPrice)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="checkout-summary-row" style={{ color: '#4ade80', marginTop: 4 }}>
                <span>Cupón ({appliedCoupon.codigo}):</span>
                <span>-{fmt(couponDiscount)}</span>
              </div>
            )}
            <div className="checkout-summary-row" style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.08)', fontWeight: 700 }}>
              <span style={{ color: '#fff' }}>Total a pagar:</span>
              <span className="checkout-summary-total" style={{ color: couponDiscount > 0 ? '#4ade80' : undefined, fontSize: 16 }}>
                {fmt(finalPrice)}
              </span>
            </div>
            <p className="checkout-location-info">
              {tipoEntrega === 'domicilio'
                ? `🛵 Reparto a: ${direccionEntrega || 'Dirección indicada'} (${codigoPostal || '30107'}, Murcia)`
                : '📍 Recogida en: Calle Mayor 45, La Ñora (Murcia)'}
            </p>
          </div>

          <button
            type="submit"
            className="btn-primary btn-block checkout-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-state">
                <svg className="spinner-svg" viewBox="0 0 24 24">
                  <circle className="spinner-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
                <span>Conectando con el servidor...</span>
              </span>
            ) : metodoPago === 'stripe' ? (
              <span>Proceder al Pago Seguro ({fmt(finalPrice)})</span>
            ) : (
              <span>{tipoEntrega === 'domicilio' ? `Confirmar Pedido a Domicilio (${fmt(finalPrice)})` : `Confirmar Pedido Takeaway (${fmt(finalPrice)})`}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
