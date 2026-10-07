import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  crearPedidoEnDb,
  obtenerPedidosDb,
  actualizarEstadoPedidoDb,
  actualizarEstadoPagoDb,
  obtenerPedidoPorIdDb,
  obtenerCartaDb,
  registrarEventoAnalyticsDb,
  validarCuponDb,
  incrementarUsoCuponDb,
  obtenerOfertasActivasDb,
  obtenerBotWebConfigDb
} from './db/index.js';
import { sendOrderConfirmedEmail, sendOrderReadyEmail } from './email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Configurar Stripe de forma segura
const stripeSecretKey = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')
  ? process.env.STRIPE_SECRET_KEY
  : null;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// CORS abierto para permitir el acceso desde la web pública, el monitor Takeaway y el Dashboard
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Fallback en memoria para desarrollo si PostgreSQL no está encendido
const pedidosEnMemoria = [];

// Middlewares
app.use(express.json());

// Iniciar base de datos al arrancar
initDatabase().catch(err => {
  console.warn('Nota: Iniciando con soporte PostgreSQL activo y fallback resiliente.');
});

// =========================================================
// RUTAS API
// =========================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    postgresConfigured: Boolean(process.env.DATABASE_URL || process.env.PGHOST),
    stripeConfigured: Boolean(stripeSecretKey)
  });
});

// CONFIGURACIÓN DEL BOT WEB (Sincronizado en tiempo real con el Dashboard)
app.get('/api/bots-web', async (req, res) => {
  try {
    const config = await obtenerBotWebConfigDb();
    res.json(config);
  } catch (err) {
    console.error('Error al obtener /api/bots-web:', err);
    res.status(500).json({ error: 'Error al obtener configuración del bot' });
  }
});

// CARTA OFICIAL EN VIVO (desde PostgreSQL MenuItem)
app.get('/api/carta', async (req, res) => {
  try {
    const items = await obtenerCartaDb();
    if (items && items.length > 0) {
      return res.json(items);
    }
  } catch (err) {
    console.warn('⚠️ Error al consultar /api/carta:', err.message);
  }
  res.json([]);
});

// VALIDAR CUPÓN DE DESCUENTO
app.post('/api/cupones/validar', async (req, res) => {
  try {
    const { codigo, subtotal } = req.body;
    const resultado = await validarCuponDb(codigo, subtotal);
    if (!resultado.valido) {
      return res.status(400).json({ error: resultado.error });
    }
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar cupón.' });
  }
});

// OFERTAS Y PROMOCIONES ACTIVAS
app.get('/api/ofertas', async (req, res) => {
  try {
    const ofertas = await obtenerOfertasActivasDb();
    res.json(ofertas);
  } catch (err) {
    res.json([]);
  }
});

// 1. CREAR PEDIDO (Pago en Restaurante o directo)
app.post('/api/pedidos', async (req, res) => {
  try {
    const {
      cliente_nombre,
      cliente_telefono,
      cliente_email,
      tipo_entrega,
      hora_recogida,
      notas,
      metodo_pago,
      items,
      total
    } = req.body;

    if (!cliente_nombre || !cliente_telefono || !items || !items.length) {
      return res.status(400).json({ error: 'Nombre, teléfono y al menos un plato son obligatorios.' });
    }

    const payload = {
      cliente_nombre,
      cliente_telefono,
      cliente_email: cliente_email || null,
      tipo_entrega: tipo_entrega || 'recogida_local',
      hora_recogida: hora_recogida || 'Lo antes posible',
      notas: notas || '',
      metodo_pago: metodo_pago || 'restaurante',
      estado_pago: req.body.estado_pago || (metodo_pago === 'stripe' ? 'pendiente' : 'pendiente_local'),
      estado_pedido: 'recibido',
      total: Number(total),
      items
    };

    let pedidoGuardado;
    try {
      pedidoGuardado = await crearPedidoEnDb(payload);
      if (req.body.cupon_codigo) {
        await incrementarUsoCuponDb(req.body.cupon_codigo);
      }
    } catch (dbErr) {
      console.warn('⚠️ Guardando en memoria temporal (PostgreSQL en espera de conexión):', dbErr.message);
      const idSimulado = pedidosEnMemoria.length + 1;
      const numeroSimulado = `OB-${Math.floor(1000 + Math.random() * 9000)}`;
      pedidoGuardado = {
        id: idSimulado,
        numero_pedido: numeroSimulado,
        ...payload,
        created_at: new Date().toISOString()
      };
      pedidosEnMemoria.unshift(pedidoGuardado);
    }

    res.status(201).json({
      success: true,
      pedido: pedidoGuardado,
      mensaje: 'Pedido registrado con éxito.'
    });
  } catch (error) {
    console.error('Error al registrar pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar el pedido.' });
  }
});

// 2. CREAR SESIÓN DE PAGO EN STRIPE
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const {
      cliente_nombre,
      cliente_telefono,
      cliente_email,
      tipo_entrega,
      hora_recogida,
      notas,
      items,
      total
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'El carrito no tiene productos.' });
    }

    // 1) Registrar pedido en estado 'pendiente' en la base de datos
    let pedido;
    const payload = {
      cliente_nombre,
      cliente_telefono,
      cliente_email,
      tipo_entrega: tipo_entrega || 'recogida_local',
      hora_recogida: hora_recogida || 'Lo antes posible',
      notas: notas || '',
      metodo_pago: 'stripe',
      estado_pago: 'pendiente',
      estado_pedido: 'recibido',
      total: Number(total),
      items
    };

    try {
      pedido = await crearPedidoEnDb(payload);
    } catch (dbErr) {
      console.warn('⚠️ Guardando pedido previo a Stripe en memoria:', dbErr.message);
      pedido = {
        id: pedidosEnMemoria.length + 1,
        numero_pedido: `OB-${Math.floor(1000 + Math.random() * 9000)}`,
        ...payload,
        created_at: new Date().toISOString()
      };
      pedidosEnMemoria.unshift(pedido);
    }

    // Si Stripe no está configurado con clave real, simular checkout exitoso
    if (!stripe) {
      console.log('ℹ️ Stripe está en modo desarrollo/simulado (configura STRIPE_SECRET_KEY en .env).');
      return res.json({
        simulated: true,
        numero_pedido: pedido.numero_pedido,
        url: `${CLIENT_URL}/pedidos?status=success&simulated=true&numero_pedido=${pedido.numero_pedido}&pedido_id=${pedido.id}`
      });
    }

    // Preparar ítems para Stripe
    const line_items = items.map(item => {
      const precioCentimos = Math.round(Number(item.precio || item.precio_unitario) * 100);
      const descPortion = item.porcion ? ` (${item.porcion} uds)` : '';
      const descOpcion = item.opcion ? ` - ${item.opcion}` : '';
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${item.nombre}${descPortion}${descOpcion}`,
            description: item.descripcion ? item.descripcion.substring(0, 100) : 'Obento Japanese Food'
          },
          unit_amount: precioCentimos
        },
        quantity: item.cantidad || 1
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: cliente_email || undefined,
      success_url: `${CLIENT_URL}/pedidos?status=success&session_id={CHECKOUT_SESSION_ID}&numero_pedido=${pedido.numero_pedido}&pedido_id=${pedido.id}`,
      cancel_url: `${CLIENT_URL}/pedidos?status=cancel`,
      metadata: {
        pedido_id: String(pedido.id),
        numero_pedido: pedido.numero_pedido
      }
    });

    // Guardar session_id en PostgreSQL
    try {
      await actualizarEstadoPagoDb(pedido.id, 'pendiente', session.id);
    } catch (e) {
      // ignore
    }

    res.json({
      url: session.url,
      sessionId: session.id,
      numero_pedido: pedido.numero_pedido
    });
  } catch (error) {
    console.error('Error al crear checkout session de Stripe:', error);
    res.status(500).json({ error: error.message || 'Error al conectar con la pasarela Stripe.' });
  }
});

// 3. VERIFICAR SESIÓN DE STRIPE Y CONFIRMAR PAGO
app.get('/api/pedidos/verify-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { numero_pedido, simulated, pedido_id } = req.query;

    if (simulated === 'true') {
      const pedidoNum = numero_pedido || pedido_id;
      try {
        const ped = await actualizarEstadoPagoDb(pedidoNum, 'pagado');
        if (ped && ped.cliente_email) {
          sendOrderConfirmedEmail(ped.cliente_email, ped).catch(() => {});
        }
        return res.json({ success: true, pagado: true, pedido: ped });
      } catch {
        const pMem = pedidosEnMemoria.find(p => p.numero_pedido === pedidoNum || p.id == pedidoNum);
        if (pMem) {
          pMem.estado_pago = 'pagado';
          if (pMem.cliente_email) {
            sendOrderConfirmedEmail(pMem.cliente_email, pMem).catch(() => {});
          }
        }
        return res.json({ success: true, pagado: true, pedido: pMem });
      }
    }

    if (!stripe) {
      return res.json({ success: true, pagado: true });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
      const pedidoId = session.metadata?.pedido_id;
      let pedidoActualizado;
      try {
        pedidoActualizado = await actualizarEstadoPagoDb(pedidoId, 'pagado', session.payment_intent);
        if (pedidoActualizado && pedidoActualizado.cliente_email) {
          sendOrderConfirmedEmail(pedidoActualizado.cliente_email, pedidoActualizado).catch(() => {});
        }
      } catch (err) {
        const pMem = pedidosEnMemoria.find(p => p.id == pedidoId);
        if (pMem) {
          pMem.estado_pago = 'pagado';
          pedidoActualizado = pMem;
          if (pMem.cliente_email) {
            sendOrderConfirmedEmail(pMem.cliente_email, pMem).catch(() => {});
          }
        }
      }
      return res.json({ success: true, pagado: true, pedido: pedidoActualizado });
    } else {
      return res.json({ success: false, pagado: false, status: session.payment_status });
    }
  } catch (error) {
    console.error('Error al verificar sesión de Stripe:', error);
    res.status(500).json({ error: 'Error al verificar sesión de pago.' });
  }
});

// 4. LISTAR PEDIDOS (Consumida por el Monitor Takeaway y Dashboard)
app.get('/api/pedidos', async (req, res) => {
  try {
    const { estado, soloPagados, limit } = req.query;
    try {
      const pedidos = await obtenerPedidosDb({
        estado,
        soloPagados: soloPagados === 'true',
        limit: limit || 100
      });
      return res.json(pedidos);
    } catch (dbErr) {
      // Fallback a memoria
      let list = [...pedidosEnMemoria];
      if (estado) list = list.filter(p => p.estado_pedido === estado);
      if (soloPagados === 'true') list = list.filter(p => p.estado_pago === 'pagado');
      return res.json(list);
    }
  } catch (error) {
    console.error('Error al listar pedidos:', error);
    res.status(500).json({ error: 'Error al recuperar pedidos.' });
  }
});

// 5. DETALLE DE UN PEDIDO
app.get('/api/pedidos/:idOrNumero', async (req, res) => {
  try {
    const { idOrNumero } = req.params;
    try {
      const pedido = await obtenerPedidoPorIdDb(idOrNumero);
      if (pedido) return res.json(pedido);
    } catch {
      const pMem = pedidosEnMemoria.find(p => p.numero_pedido === idOrNumero || p.id == idOrNumero);
      if (pMem) return res.json(pMem);
    }
    res.status(404).json({ error: 'Pedido no encontrado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el pedido.' });
  }
});

// 6. CAMBIAR ESTADO DE PEDIDO (Monitor Takeaway: 'en_preparacion', 'listo', 'entregado')
app.patch('/api/pedidos/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_pedido } = req.body;

    if (!estado_pedido) {
      return res.status(400).json({ error: 'estado_pedido es obligatorio.' });
    }

    try {
      const pedido = await actualizarEstadoPedidoDb(id, estado_pedido);
      if (estado_pedido === 'listo' && pedido?.cliente_email) {
        sendOrderReadyEmail(pedido.cliente_email, pedido).catch(() => {});
      }
      return res.json({ success: true, pedido });
    } catch {
      const pMem = pedidosEnMemoria.find(p => p.id == id || p.numero_pedido === id);
      if (pMem) {
        pMem.estado_pedido = estado_pedido;
        if (estado_pedido === 'listo' && pMem.cliente_email) {
          sendOrderReadyEmail(pMem.cliente_email, pMem).catch(() => {});
        }
        return res.json({ success: true, pedido: pMem });
      }
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado del pedido.' });
  }
});

// Registrar eventos de analítica y embudo de conversión
app.post('/api/analytics/track', async (req, res) => {
  try {
    const {
      sessionId,
      tipo,
      pagina,
      dishId,
      dishNombre,
      cantidadItems,
      totalCarrito,
      metadata
    } = req.body || {};

    if (!sessionId || !tipo) {
      return res.status(400).json({ error: 'sessionId y tipo son obligatorios' });
    }

    await registrarEventoAnalyticsDb({
      sessionId,
      tipo,
      pagina,
      dishId,
      dishNombre,
      cantidadItems,
      totalCarrito,
      metadata
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar evento' });
  }
});

// Servir frontend compilado en producción (dist)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 [Servidor API Obento] escuchando en http://localhost:${PORT}`);
  console.log(`📡 [Endpoints disponibles]:`);
  console.log(`   - POST   /api/pedidos`);
  console.log(`   - POST   /api/create-checkout-session`);
  console.log(`   - GET    /api/pedidos (Para Monitor Takeaway & Dashboard)`);
  console.log(`   - PATCH  /api/pedidos/:id/status (Cambiar estado en Takeaway)`);
  console.log(`   - GET    /api/health`);
});
