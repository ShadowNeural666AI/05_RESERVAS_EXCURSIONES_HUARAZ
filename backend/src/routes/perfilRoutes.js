const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const { authLimiter } = require('../middleware/securityMiddleware');

// Consultar información de actividad administrativa (exclusivo admin)
router.get('/admin/actividad', perfilController.getActividadAdmin);

// Obtener datos del perfil de un usuario
router.get('/:id', perfilController.getPerfil);

// Actualizar datos del perfil de un usuario
router.put('/:id', perfilController.updatePerfil);

// Cambiar contraseña con validación de identidad y protección contra fuerza bruta
router.put('/:id/cambiar-password', authLimiter, perfilController.cambiarPassword);

// Obtener historial de reservas del turista
router.get('/:id/reservas', perfilController.getHistorialReservas);

// Obtener rutas favoritas del turista
router.get('/:id/favoritos', perfilController.getRutasFavoritas);

// Alternar ruta favorita (añadir/quitar)
router.post('/:id/favoritos', perfilController.toggleRutaFavorita);

module.exports = router;
