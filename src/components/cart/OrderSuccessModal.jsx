import React from 'react';

function fmt(n) {
  return Number(n).toFixed(2).replace('.', ',') + '€';
}

export default function OrderSuccessModal({ order, onClose }) {
  if (!order) return null;

  const isPagado = order.estado_pago === 'pagado';

  return (
    <div className="checkout-backdrop" onClick={onClose}>
      <div className="order-success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon-wrap">
          <div className="success-icon-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="success-check-svg">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <span className="success-eyebrow">
          {isPagado ? '¡PAGO COMPLETADO CON ÉXITO!' : '¡PEDIDO REGISTRADO!'}
        </span>
        <h3 className="success-title">Tu pedido está en marcha</h3>

        <div className="order-ticket-box">
          <div className="order-ticket-top">
            <div className="ticket-label">NÚMERO DE PEDIDO</div>
            <div className="ticket-number">{order.numero_pedido}</div>
            <div className="ticket-badge-state">
              {isPagado ? '🟢 Pagado con tarjeta' : '🟠 Pagar al recoger en el local'}
            </div>
          </div>

          <div className="ticket-details-grid">
            <div className="ticket-detail-item">
              <span className="detail-label">Cliente:</span>
              <span className="detail-val">{order.cliente_nombre}</span>
            </div>
            <div className="ticket-detail-item">
              <span className="detail-label">Teléfono:</span>
              <span className="detail-val">{order.cliente_telefono}</span>
            </div>
            <div className="ticket-detail-item">
              <span className="detail-label">Hora recogida:</span>
              <span className="detail-val highlight">{order.hora_recogida || 'Lo antes posible'}</span>
            </div>
            <div className="ticket-detail-item">
              <span className="detail-label">Total:</span>
              <span className="detail-val total">{fmt(order.total)}</span>
            </div>
          </div>

          {Array.isArray(order.items) && order.items.length > 0 && (
            <div className="ticket-items-list">
              <div className="ticket-items-title">Platos incluidos:</div>
              {order.items.map((it, idx) => (
                <div key={idx} className="ticket-item-row">
                  <span>
                    <strong>{it.cantidad}x</strong> {it.nombre}
                    {it.porcion && ` (${it.porcion} uds)`}
                    {it.opcion && ` - ${it.opcion}`}
                  </span>
                  <span>{fmt(it.subtotal || (it.precio_unitario * it.cantidad) || 0)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="ticket-instructions">
            <div className="instruction-icon">📍</div>
            <div className="instruction-text">
              <strong>Punto de recogida Takeaway:</strong>
              <p>Calle Mayor 45, La Ñora (Murcia). Presenta tu número de pedido <strong>{order.numero_pedido}</strong> en el mostrador.</p>
            </div>
          </div>
        </div>

        <div className="success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
          <a
            href={`/seguimiento?id=${order.numero_pedido}`}
            className="btn-primary btn-block"
            style={{ textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span>🔴</span> Seguir Estado en Vivo
          </a>
          <button
            type="button"
            className="btn-secondary-outline btn-block"
            onClick={onClose}
          >
            Aceptar y Volver a la Carta
          </button>
        </div>
      </div>
    </div>
  );
}
