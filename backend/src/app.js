require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('node:path');

const rutasRoutes = require('./routes/rutasRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const statsController = require('./controllers/statsController');
const { xssSanitizer, apiLimiter } = require('./middleware/securityMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// CIBERSEGURIDAD Y PROTECCIÓN DEL SERVIDOR
// ==========================================

// 1. Ocultar huellas de tecnología del servidor
app.disable('x-powered-by');

// 2. Cabeceras de seguridad HTTP con Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Permite servir imágenes a Vite
  contentSecurityPolicy: false // Desactivado para no interferir con el frontend dev en localhost
}));

// 3. Control de Acceso CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (herramientas locales, apps móviles, scripts) o de los orígenes autorizados
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(new Error('Acceso bloqueado por política de CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 4. Protección contra Desbordamiento de Carga Útil (Payload Limits)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 5. Sanitización contra Cross-Site Scripting (XSS)
app.use(xssSanitizer);

// 6. Rate Limiting general para rutas API
app.use('/api', apiLimiter);

// ==========================================
// SERVICIO DE ARCHIVOS ESTÁTICOS
// ==========================================
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads'), {
  maxAge: '1d',
  etag: true,
  dotfiles: 'ignore' // Ignorar archivos ocultos
}));

// ==========================================
// ENRUTAMIENTO DE LA API REST
// ==========================================
app.use('/api/rutas', rutasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/perfil', perfilRoutes);
app.get('/api/stats', statsController.getStats);
app.get('/api/reportes', statsController.getReportes);
app.get('/api/health', statsController.getHealth);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado o recurso inexistente' });
});

// ==========================================
// MANEJADOR DE ERRORES SANITIZADO (NO LEAKS)
// ==========================================
app.use((err, req, res, next) => {
  // Registro seguro interno en el servidor
  console.error('[SECURITY AUDIT] Error no controlado:', err.stack || err.message);

  // Respuesta protegida hacia el cliente (sin exponer datos de la BD o rutas internas)
  res.status(err.status || 500).json({
    error: 'Error interno del servidor. La solicitud no pudo ser procesada.',
    code: err.code || 'INTERNAL_SERVER_ERROR'
  });
});

app.listen(PORT, () => {
  console.log(`[HUARAZ TOURS BACKEND] Servidor seguro activo en http://localhost:${PORT}`);
});
