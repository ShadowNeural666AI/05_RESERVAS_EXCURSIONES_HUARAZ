const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const pool = require('../db/database');

// Directorio raíz de uploads absoluto respecto al backend
const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads');
const RUTAS_DIR = path.join(UPLOADS_ROOT, 'rutas');
const RUTAS_THUMB_DIR = path.join(RUTAS_DIR, 'thumbnails');

// Asegurar existencia de carpetas requeridas al inicializar
function ensureDirectoriesExist() {
  const dirs = [
    UPLOADS_ROOT,
    RUTAS_DIR,
    RUTAS_THUMB_DIR,
    path.join(UPLOADS_ROOT, 'usuarios'),
    path.join(UPLOADS_ROOT, 'categorias'),
    path.join(UPLOADS_ROOT, 'otros')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

ensureDirectoriesExist();

/**
 * Procesa y optimiza una imagen recibida en memoria.
 * - Valida contenido real con Sharp
 * - Convierte a WebP
 * - Genera versión principal (max 1200px)
 * - Genera miniatura (max 400px)
 * - Elimina metadatos EXIF para privacidad y menor peso
 */
async function processAndSaveImage(fileBuffer, subfolder = 'rutas') {
  ensureDirectoriesExist();

  // Validar contenido real mediante los metadatos de Sharp
  let metadata;
  try {
    metadata = await sharp(fileBuffer).metadata();
  } catch (err) {
    throw new Error('El archivo proporcionado no es una imagen válida o está dañado');
  }

  const allowedFormats = ['jpeg', 'png', 'webp', 'jpg'];
  if (!metadata.format || !allowedFormats.includes(metadata.format.toLowerCase())) {
    throw new Error(`Formato '${metadata.format}' no permitido. Formatos aceptados: JPEG, PNG, WebP`);
  }

  // Generar nombre seguro y aleatorio con extensión WebP
  const randomId = crypto.randomUUID();
  const mainFilename = `ruta-${Date.now()}-${randomId}.webp`;
  const thumbFilename = `thumb-${Date.now()}-${randomId}.webp`;

  const mainFilePath = path.join(RUTAS_DIR, mainFilename);
  const thumbFilePath = path.join(RUTAS_THUMB_DIR, thumbFilename);

  // 1. Procesar imagen principal (max 1200px ancho, calidad 85 WebP, sin EXIF)
  const mainProcessed = await sharp(fileBuffer)
    .rotate() // Respeta orientación original
    .resize({ width: 1200, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 85, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  // 2. Procesar miniatura (max 400px ancho, calidad 80 WebP)
  const thumbProcessed = await sharp(fileBuffer)
    .rotate()
    .resize({ width: 400, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 80, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  // Escribir a disco en las rutas protegidas
  await fs.promises.writeFile(mainFilePath, mainProcessed.data);
  await fs.promises.writeFile(thumbFilePath, thumbProcessed.data);

  return {
    filename: mainFilename,
    thumbFilename: thumbFilename,
    url: `/uploads/${subfolder}/${mainFilename}`,
    thumbUrl: `/uploads/${subfolder}/thumbnails/${thumbFilename}`,
    physicalPath: mainFilePath,
    thumbPhysicalPath: thumbFilePath,
    format: 'webp',
    originalFormat: metadata.format,
    sizeBytes: mainProcessed.info.size,
    thumbSizeBytes: thumbProcessed.info.size,
    width: mainProcessed.info.width,
    height: mainProcessed.info.height
  };
}

/**
 * Registra los metadatos de la imagen en la tabla `imagenes` de MySQL
 */
async function registerImageInDatabase(imageData, entidad, entidadId) {
  try {
    const [result] = await pool.query(
      `INSERT INTO imagenes 
       (entidad, entidad_id, archivo_nombre, archivo_ruta, archivo_thumbnail, formato, tamano_bytes, ancho, alto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entidad,
        Number(entidadId),
        imageData.filename,
        imageData.url,
        imageData.thumbUrl,
        imageData.format,
        imageData.sizeBytes,
        imageData.width,
        imageData.height
      ]
    );
    return result.insertId;
  } catch (err) {
    console.error('Error registrando imagen en MySQL:', err);
    throw err;
  }
}

/**
 * Elimina archivos físicos de disco de forma segura.
 * Solo elimina archivos que se encuentren dentro de la carpeta uploads.
 */
function safelyDeletePhysicalFiles(fileUrls) {
  if (!Array.isArray(fileUrls)) {
    fileUrls = [fileUrls];
  }

  for (const url of fileUrls) {
    if (!url || !url.startsWith('/uploads/')) {
      // Ignorar URLs externas o estáticas predefinidas como /images/...
      continue;
    }

    try {
      // Reconstruir la ruta local a partir de la URL relativa
      const relativePart = url.replace(/^\/uploads\//, '');
      const absolutePath = path.resolve(UPLOADS_ROOT, relativePart);

      // Comprobar que la ruta permanezca dentro de UPLOADS_ROOT para evitar path traversal
      if (absolutePath.startsWith(UPLOADS_ROOT) && fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log(`[ImageService] Archivo físico eliminado con éxito: ${absolutePath}`);
      }
    } catch (err) {
      console.error(`[ImageService] Error eliminando archivo físico '${url}':`, err.message);
    }
  }
}

/**
 * Limpieza de imágenes asociadas a una entidad al eliminar un registro
 */
async function deleteImagesForEntity(entidad, entidadId) {
  try {
    const [rows] = await pool.query(
      'SELECT archivo_ruta, archivo_thumbnail FROM imagenes WHERE entidad = ? AND entidad_id = ?',
      [entidad, Number(entidadId)]
    );

    const urlsToDelete = [];
    rows.forEach(r => {
      if (r.archivo_ruta) urlsToDelete.push(r.archivo_ruta);
      if (r.archivo_thumbnail) urlsToDelete.push(r.archivo_thumbnail);
    });

    safelyDeletePhysicalFiles(urlsToDelete);

    await pool.query(
      'DELETE FROM imagenes WHERE entidad = ? AND entidad_id = ?',
      [entidad, Number(entidadId)]
    );
  } catch (err) {
    console.error(`Error eliminando imágenes de ${entidad} #${entidadId}:`, err);
  }
}

module.exports = {
  UPLOADS_ROOT,
  RUTAS_DIR,
  RUTAS_THUMB_DIR,
  ensureDirectoriesExist,
  processAndSaveImage,
  registerImageInDatabase,
  safelyDeletePhysicalFiles,
  deleteImagesForEntity
};
