const multer = require('multer');
const { processAndSaveImage, safelyDeletePhysicalFiles } = require('../services/imageService');

// Configuración de almacenamiento en memoria para validación profunda previa a escritura
const storage = multer.memoryStorage();

// Límite de 5 MB por archivo
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const allowedExtensions = /\.(jpeg|jpg|png|webp)$/i;

  if (!allowedMimes.includes(file.mimetype) || !allowedExtensions.test(file.originalname)) {
    const error = new Error('Formato de imagen no permitido. Solo se aceptan archivos JPEG, PNG y WebP');
    error.code = 'INVALID_FILE_TYPE';
    return cb(error, false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter
}).single('imagen');

/**
 * Middleware para procesar la subida y optimización de imagen con Sharp.
 * Admite peticiones multipart/form-data con o sin archivo (por si se edita sin cambiar imagen).
 */
const handleImageUpload = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: 'El archivo excede el tamaño máximo permitido de 5 MB',
            code: 'FILE_TOO_LARGE'
          });
        }
        return res.status(400).json({
          error: `Error al subir el archivo: ${err.message}`,
          code: err.code
        });
      }

      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          error: err.message,
          code: 'INVALID_FILE_TYPE'
        });
      }

      return res.status(400).json({
        error: 'Error al procesar la imagen enviada',
        details: err.message
      });
    }

    // Si no se adjuntó ningún archivo físico, continuar (ej. edición que mantiene la imagen anterior)
    if (!req.file) {
      return next();
    }

    try {
      // Procesar y optimizar con Sharp
      const processed = await processAndSaveImage(req.file.buffer, 'rutas');
      req.processedImage = processed;
      next();
    } catch (processErr) {
      console.error('Error procesando imagen con Sharp:', processErr.message);
      return res.status(400).json({
        error: processErr.message || 'Error al validar y optimizar la imagen'
      });
    }
  });
};

module.exports = {
  handleImageUpload,
  MAX_FILE_SIZE
};
