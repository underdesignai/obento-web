import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ABOUT_INFO, MENU } from '../data/menuData';

// Ícono de Mensaje / Chat de Atención al Cliente (Cálido y humano, no robótico)
function MessageChatIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <circle cx="8" cy="12" r="1.1" fill={color} stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill={color} stroke="none" />
      <circle cx="16" cy="12" r="1.1" fill={color} stroke="none" />
    </svg>
  );
}

// Configuración por defecto sincronizada con el Dashboard
const DEFAULT_CONFIG = {
  activo: true,
  nombreBot: 'Obentico',
  colorTema: '#c81e22',
  saludoInicial: '¡Hola! 🍣 Bienvenido a Obento Japanese Food. ¿Te apetece alguna recomendación de sushi para hoy??',
  sugerencias: [
    '🍣 ¿Cuáles son los rollos más pedidos?',
    '🌾 ¿Tenéis opciones sin gluten?',
    '🕒 ¿Cuál es el horario de recogida hoy?'
  ]
};

function getBotResponse(userQuery, onOpenAllergens) {
  const q = userQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 1. Rollos más pedidos / Recomendaciones (Lleva directo a Pedidos)
  if (q.includes('rollo') || q.includes('mas pedido') || q.includes('mas vendido') || q.includes('popular') || q.includes('recomiend') || q.includes('estrella') || q.includes('especial')) {
    return {
      text: `🍣 **Nuestros rollos y platos más pedidos:**\n• **Dragón Uramaki Especial (13,90€):** Langostino tempurizado crujiente, aguacate y salmón flameado.\n• **Sakura Roll (12,50€):** Salmón flambeado con mayo kimchi suave.\n• **Jōnetsu Tuna (14,20€):** Atún rojo fresco, foie flambeado y salsa teriyaki.\n• **Gyozas artesanas de pollo (4,50€):** Empanadillas japonesas a la plancha.\n• **Yakisoba tradicional (11,90€):** Fideos al wok con verduras crujientes.\n\n¡Puedes entrar ahora a pedidos y seleccionar los platos que más te gusten!`,
      action: {
        type: 'link',
        label: '🛍️ Ir a Pedidos (Elegir Platos)',
        href: '/pedidos'
      }
    };
  }

  // 2. Opciones sin gluten / Alérgenos
  if (q.includes('gluten') || q.includes('celiac') || q.includes('alergen') || q.includes('alergia') || q.includes('intoleran')) {
    return {
      text: `🌾 **Opciones Sin Gluten & Alérgenos:**\n• En nuestros **Yakisobas** puedes elegir fideos de arroz 100% sin gluten.\n• Disponemos de salsa de soja sin gluten (Tamari) bajo petición.\n• Contamos con variedad de **Nigiris, Sashimi y Edamame** aptos para celíacos.\n\nPuedes consultar nuestra Guía Oficial de Alérgenos:`,
      action: {
        type: 'callback',
        label: '📋 Abrir Guía Oficial de Alérgenos',
        onClick: onOpenAllergens
      }
    };
  }

  // 3. Horario de recogida / Apertura (Lleva directo a Pedidos)
  if (q.includes('horario') || q.includes('hora') || q.includes('recogida') || q.includes('abierto') || q.includes('cierra') || q.includes('cuando')) {
    return {
      text: `🕒 **Horario de cocina y recogida:**\n• **Martes a Domingo:** 13:00 a 16:00 h y 20:00 a 23:30 h.\n• **Lunes:** Cerrado por descanso.\n\nEl tiempo medio de preparación artesanal para recogida es de **20 a 30 minutos**. ¡Haz tu pedido online ahora para empezar a seleccionar lo que quieres comprar!`,
      action: {
        type: 'link',
        label: '🛍️ Empezar Pedido para Recoger',
        href: '/pedidos'
      }
    };
  }

  // 4. Cómo pedir / Encargar (Lleva directo a Pedidos)
  if (q.includes('pedir') || q.includes('pedido') || q.includes('encarg') || q.includes('ordenar') || q.includes('comprar')) {
    return {
      text: `🛍️ **Hacer tu pedido es muy sencillo:**\nEntra en nuestra sección de pedidos online, explora las categorías, añade tus platos al carrito y elige tu hora de recogida. ¡Todo recién preparado al momento!`,
      action: {
        type: 'link',
        label: '🛍️ Hacer Pedido Online (Takeaway)',
        href: '/pedidos'
      }
    };
  }

  // 5. Ofertas y Promociones Especiales
  if (q.includes('oferta') || q.includes('promocion') || q.includes('descuento') || q.includes('promo') || q.includes('cupon')) {
    return {
      text: `🎁 **Ofertas y Descuentos Especiales:**\n• Descubre nuestras promociones activas y combos especiales elaborados para hoy.\n• Puedes aplicar códigos promocionales en tu cesta para obtener descuentos inmediatos.\n\n¡Entra en la tienda online para seleccionar lo que quieras comprar!`,
      action: {
        type: 'link',
        label: '🛍️ Ver Ofertas y Pedir Online',
        href: '/pedidos'
      }
    };
  }

  // 6. Ubicación / Dónde estáis
  if (q.includes('donde') || q.includes('ubicacion') || q.includes('direccion') || q.includes('calle') || q.includes('llegar') || q.includes('mapa') || q.includes('nora')) {
    return {
      text: `📍 Nos encontramos en **${ABOUT_INFO.direccion}, 30830 La Ñora (Murcia)**, a pocos minutos de la UCAM. Local especializado en Take Away.\n\n¡Haz tu pedido online y recógelo recién hecho sin esperas!`,
      action: {
        type: 'link',
        label: '🛍️ Empezar Pedido para Recoger',
        href: '/pedidos'
      }
    };
  }

  // 6. Reparto / A domicilio (Lleva directo a Pedidos)
  if (q.includes('reparto') || q.includes('domicilio') || q.includes('envio') || q.includes('delivery')) {
    return {
      text: `🛵 **Modalidad de pedidos:**\nSomos especialistas en **Take Away** (recogida en tienda en La Ñora) y disponemos de reparto a domicilio para zonas cercanas. Puedes gestionar tu pedido directamente en nuestra plataforma online.`,
      action: {
        type: 'link',
        label: '🛍️ Empezar Pedido Online',
        href: '/pedidos'
      }
    };
  }

  // 7. Saludos
  if (q.includes('hola') || q.includes('buenas') || q.includes('saludos') || q.includes('konnichiwa') || q.includes('que tal')) {
    return {
      text: `¡Hola! 👋 Qué alegría saludarte. Puedo recomendarte nuestros rollos más pedidos, resolver dudas de horarios o guiarte para hacer tu pedido online. ¿Qué te apetece hoy?`,
      action: {
        type: 'link',
        label: '🛍️ Ver Carta y Pedir Online',
        href: '/pedidos'
      }
    };
  }

  // 8. Agradecimientos y despedidas
  if (q.includes('gracias') || q.includes('arigato') || q.includes('adios') || q.includes('chao')) {
    return {
      text: `¡Arigatō gozaimasu! 🙏 Ha sido un placer. Cuando te apetezca auténtico sushi japonés elaborado al momento, aquí nos tienes. ¡Que tengas un día excelente!`
    };
  }

  // 9. Búsqueda por plato específico
  const matchedDish = MENU.find(d => {
    const dName = d.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return q.includes(dName) || dName.includes(q);
  });

  if (matchedDish) {
    return {
      text: `🍣 **${matchedDish.nombre}**\n• Precio: **${matchedDish.precio ? matchedDish.precio.toFixed(2) + '€' : 'Consultar'}**\n• Descripción: ${matchedDish.descripcion || 'Especialidad japonesa elaborada al momento con ingredientes frescos de máxima calidad.'}\n\n¿Te apetece añadirlo a tu pedido?`,
      action: {
        type: 'link',
        label: `🛍️ Pedir ${matchedDish.nombre} Online`,
        href: '/pedidos'
      }
    };
  }

  // Fallback inteligente (Lleva directo a Pedidos)
  return {
    text: `Entendido. Te invito a entrar en nuestra tienda online para ver toda la carta con fotos, precios y seleccionar lo que quieres comprar.`,
    action: {
      type: 'link',
      label: '🛍️ Empezar a Elegir Platos',
      href: '/pedidos'
    }
  };
}

export default function Chatbot({ onOpenAllergens }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activo, setActivo] = useState(DEFAULT_CONFIG.activo);
  const [nombreBot, setNombreBot] = useState(DEFAULT_CONFIG.nombreBot);
  const [colorTema, setColorTema] = useState(DEFAULT_CONFIG.colorTema);
  const [saludoInicial, setSaludoInicial] = useState(DEFAULT_CONFIG.saludoInicial);
  const [sugerencias, setSugerencias] = useState(DEFAULT_CONFIG.sugerencias);
  const [messages, setMessages] = useState([
    {
      id: 'init',
      sender: 'bot',
      text: DEFAULT_CONFIG.saludoInicial,
      time: 'Ahora'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sincronización en vivo con la Base de Datos compartida con el Dashboard
  useEffect(() => {
    let isMounted = true;
    fetch('/api/bots-web')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('No config');
      })
      .then(data => {
        if (!isMounted || !data) return;
        if (data.activo !== undefined) setActivo(Boolean(data.activo));
        if (data.nombreBot) setNombreBot(data.nombreBot);
        if (data.colorTema) setColorTema(data.colorTema);
        if (data.saludoInicial) {
          setSaludoInicial(data.saludoInicial);
          setMessages(prev => {
            if (prev.length === 1 && prev[0].id === 'init') {
              return [{ ...prev[0], text: data.saludoInicial }];
            }
            return prev;
          });
        }
        if (Array.isArray(data.sugerencias) && data.sugerencias.length > 0) {
          setSugerencias(data.sugerencias);
        }
      })
      .catch(err => {
        console.info('Configuración local del bot activa:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewBadge(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = (userText) => {
    const text = userText || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Respuesta inteligente del asistente
    setTimeout(() => {
      const botReply = getBotResponse(text, onOpenAllergens);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply.text,
        action: botReply.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionClick = (action) => {
    if (!action) return;
    if (action.type === 'callback' && action.onClick) {
      action.onClick();
    } else if (action.href && action.href.startsWith('/')) {
      navigate(action.href);
      setIsOpen(false);
    } else if (action.href) {
      window.open(action.href, action.type === 'map' ? '_blank' : '_self');
    } else if (action.type === 'scroll' && action.targetId) {
      const el = document.getElementById(action.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Si el bot está desactivado en el dashboard, no renderizar
  if (!activo) return null;

  return (
    <div className="obento-chatbot-wrapper">
      {/* Botón Flotante Redondo Sincronizado */}
      <button
        type="button"
        className={`chatbot-trigger-btn ${isOpen ? 'active' : ''}`}
        style={{
          background: isOpen ? '#191512' : colorTema,
          borderColor: isOpen ? 'rgba(200, 30, 34, 0.4)' : 'rgba(255, 255, 255, 0.25)',
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir asistente de chat"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="chat-btn-svg">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <MessageChatIcon size={26} color="#ffffff" />
            {hasNewBadge && (
              <span className="chatbot-ping-dot">
                <span className="ping-wave"></span>
              </span>
            )}
          </>
        )}
      </button>

      {/* Ventana de Chat Sincronizada con el Dashboard */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Cabecera Corporativa con Tema Rojo del Dashboard */}
          <div
            className="chatbot-header"
            style={{
              background: colorTema,
              borderBottom: 'none',
              padding: '12px 16px',
            }}
          >
            <div className="chatbot-header-info">
              {/* Avatar blanco circular con icono Mensaje */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                }}
              >
                <MessageChatIcon size={18} color={colorTema} />
              </div>
              <div>
                <h4
                  className="chatbot-title"
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '0.02em',
                  }}
                >
                  {nombreBot}
                </h4>
                <span
                  className="chatbot-status"
                  style={{
                    fontSize: 10.5,
                    color: 'rgba(255, 255, 255, 0.88)',
                    fontWeight: 500,
                  }}
                >
                  En línea · Asistente Obento
                </span>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
              style={{
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '50%',
                width: 28,
                height: 28,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 15, height: 15 }}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Feed de Conversación */}
          <div className="chatbot-messages">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble-wrap ${m.sender === 'user' ? 'user-wrap' : 'bot-wrap'}`}>
                {m.sender === 'bot' && (
                  <div
                    className="bubble-avatar"
                    style={{
                      background: 'rgba(200, 30, 34, 0.2)',
                      border: '1px solid rgba(200, 30, 34, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MessageChatIcon size={14} color={colorTema} />
                  </div>
                )}
                <div
                  className={`chat-bubble ${m.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}
                  style={m.sender === 'user' ? { background: colorTema, color: '#ffffff' } : {}}
                >
                  <div className="bubble-text">
                    {m.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line.split('**').map((seg, j) =>
                          j % 2 === 1 ? <strong key={j}>{seg}</strong> : seg
                        )}
                        {i < m.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Botón de Acción contextual que lleva a PEDIDOS */}
                  {m.action && (
                    <div className="bubble-action-box" style={{ marginTop: 10 }}>
                      <button
                        type="button"
                        className="chat-action-btn"
                        onClick={() => handleActionClick(m.action)}
                        style={{
                          background: colorTema,
                          color: '#ffffff',
                          border: 'none',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          padding: '11px 16px',
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(200, 30, 34, 0.45)',
                          transition: 'transform 0.16s ease, filter 0.16s ease',
                        }}
                      >
                        {m.action.label}
                      </button>
                    </div>
                  )}

                  <span className="bubble-time">{m.time}</span>
                </div>
              </div>
            ))}

            {/* Indicador de escritura */}
            {isTyping && (
              <div className="chat-bubble-wrap bot-wrap">
                <div className="bubble-avatar">
                  <MessageChatIcon size={14} color={colorTema} />
                </div>
                <div className="chat-bubble bot-bubble typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chips Rápidos Sincronizados con el Dashboard */}
          <div className="chatbot-prompts-bar">
            {sugerencias.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                className="chatbot-prompt-chip"
                onClick={() => handleSend(sug)}
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input de Mensaje idéntico al Dashboard Preview */}
          <div className="chatbot-footer">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder="Pregunta algo sobre la carta..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="chatbot-send-btn"
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              aria-label="Enviar mensaje"
              style={{
                background: colorTema,
                color: '#ffffff',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
