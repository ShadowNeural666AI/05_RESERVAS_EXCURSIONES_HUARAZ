require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rutasRoutes = require('./routes/rutasRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const statsController = require('./controllers/statsController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos subidos localmente (imágenes optimizadas)
const path = require('node:path');
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads'), {
  maxAge: '1d',
  etag: true
}));

// Routes
app.use('/api/rutas', rutasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/perfil', perfilRoutes);
app.get('/api/stats', statsController.getStats);
app.get('/api/reportes', statsController.getReportes);
app.get('/api/health', statsController.getHealth);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Error interno del servidor', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor Huaraz Tours ejecutándose en http://localhost:${PORT}`);
});
