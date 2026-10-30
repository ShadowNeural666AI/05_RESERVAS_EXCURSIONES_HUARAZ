const rateLimit = require('express-rate-limit');

/**
 * Sanitiza recursivamente strings para neutralizar vectores de ataque XSS
 * (Cross-Site Scripting) y manipulación de parámetros HTML/JS.
 */
function sanitizeValue(value) {
  if (typeof value === 'string') {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (typeof value === 'object' && value !== null) {
    const cleanObj = {};
    for (const key of Object.keys(value)) {
      cleanObj[key] = sanitizeValue(value[key]);
    }
    return cleanObj;
  }
  return value;
}

/**
 * Middleware para sanear inputs de req.body, req.query y req.params
 */
const xssSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};

/**
 * Rate Limiter General para la API
 * Protege contra inundación de peticiones (DoS) y scraping automatizado
 */
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 600, // 600 peticiones por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas solicitudes desde esta dirección IP. Por favor intente más tarde.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

/**
 * Rate Limiter Estricto para Operaciones Sensibles (Cambio de contraseña y Login)
 * Previene ataques de fuerza bruta contra credenciales
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Máximo 20 intentos por 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Límite de intentos de seguridad excedido. Por seguridad, intente en 15 minutos.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  }
});

module.exports = {
  xssSanitizer,
  apiLimiter,
  authLimiter
};
