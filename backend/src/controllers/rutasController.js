const pool = require('../db/database');
const {
  registerImageInDatabase,
  safelyDeletePhysicalFiles,
  deleteImagesForEntity
} = require('../services/imageService');

exports.getAllRutas = async (req, res) => {
  try {
    const { q, categoria, estado } = req.query;
    let sql = 'SELECT * FROM rutas WHERE 1=1';
    const params = [];

    if (q) {
      sql += ' AND (nombre LIKE ? OR ubicacion LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    if (categoria && categoria.toLowerCase() !== 'todas') {
      sql += ' AND LOWER(categoria) = LOWER(?)';
      params.push(categoria);
    }

    if (estado) {
      sql += ' AND estado = ?';
      params.push(estado);
    }

    sql += ' ORDER BY id ASC';
    const [rows] = await pool.query(sql, params);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching rutas from MySQL:', err);
    return res.status(500).json({ error: 'Error al obtener las rutas de MySQL' });
  }
};

exports.getRutaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM rutas WHERE id = ?', [Number(id)]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error fetching ruta by id:', err);
    return res.status(500).json({ error: 'Error al obtener detalle de la ruta' });
  }
};

exports.createRuta = async (req, res) => {
  const processed = req.processedImage;

  try {
    const {
      nombre,
      categoria,
      ubicacion,
      duracion,
      dificultad,
      cupo_total,
      cupos_disponibles,
      precio,
      estado,
      imagen,
      descripcion
    } = req.body;

    if (!nombre || !ubicacion || !duracion || cupo_total === undefined) {
      // Compensación: Si se subió imagen pero faltan datos obligatorios, eliminarla
      if (processed) {
        safelyDeletePhysicalFiles([processed.url, processed.thumbUrl]);
      }
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const total = Number(cupo_total);
    const disponibles = cupos_disponibles !== undefined ? Number(cupos_disponibles) : total;

    // Determinar imagen y thumbnail
    const finalImagen = processed ? processed.url : (imagen || '/images/laguna69.jpg');
    const finalThumbnail = processed ? processed.thumbUrl : null;

    const [result] = await pool.query(`
      INSERT INTO rutas (nombre, categoria, ubicacion, duracion, dificultad, cupo_total, cupos_disponibles, precio, estado, imagen, imagen_thumbnail, descripcion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nombre,
      categoria || 'Laguna',
      ubicacion,
      duracion || '1 día',
      dificultad || 'Moderado',
      total,
      disponibles,
      precio !== undefined ? Number(precio) : 20.00,
      estado || 'Disponible',
      finalImagen,
      finalThumbnail,
      descripcion || ''
    ]);

    const rutaId = result.insertId;

    // Si se subió archivo físico optimizado, registrar metadatos en tabla `imagenes`
    if (processed) {
      await registerImageInDatabase(processed, 'rutas', rutaId);
    }

    const [newRow] = await pool.query('SELECT * FROM rutas WHERE id = ?', [rutaId]);
    return res.status(201).json(newRow[0]);
  } catch (err) {
    console.error('Error creating ruta in MySQL:', err);
    // Compensación de fallo en base de datos: eliminar archivos huérfanos recién subidos
    if (processed) {
      safelyDeletePhysicalFiles([processed.url, processed.thumbUrl]);
    }
    return res.status(500).json({ error: 'Error al crear la ruta en MySQL' });
  }
};

exports.updateRuta = async (req, res) => {
  const processed = req.processedImage;

  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM rutas WHERE id = ?', [Number(id)]);
    if (existing.length === 0) {
      if (processed) {
        safelyDeletePhysicalFiles([processed.url, processed.thumbUrl]);
      }
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }

    const current = existing[0];
    const {
      nombre,
      categoria,
      ubicacion,
      duracion,
      dificultad,
      cupo_total,
      cupos_disponibles,
      precio,
      estado,
      imagen,
      descripcion
    } = req.body;

    // Determinar nuevas imágenes: si se procesó un archivo, usarlo; sino, conservar el actual o el enviado
    let newImagen = current.imagen;
    let newThumbnail = current.imagen_thumbnail;

    if (processed) {
      newImagen = processed.url;
      newThumbnail = processed.thumbUrl;
    } else if (imagen !== undefined && imagen !== '') {
      newImagen = imagen;
    }

    await pool.query(`
      UPDATE rutas
      SET nombre = ?, categoria = ?, ubicacion = ?, duracion = ?, dificultad = ?, cupo_total = ?, cupos_disponibles = ?, precio = ?, estado = ?, imagen = ?, imagen_thumbnail = ?, descripcion = ?
      WHERE id = ?
    `, [
      nombre !== undefined ? nombre : current.nombre,
      categoria !== undefined ? categoria : current.categoria,
      ubicacion !== undefined ? ubicacion : current.ubicacion,
      duracion !== undefined ? duracion : current.duracion,
      dificultad !== undefined ? dificultad : current.dificultad,
      cupo_total !== undefined ? Number(cupo_total) : current.cupo_total,
      cupos_disponibles !== undefined ? Number(cupos_disponibles) : current.cupos_disponibles,
      precio !== undefined ? Number(precio) : current.precio,
      estado !== undefined ? estado : current.estado,
      newImagen,
      newThumbnail,
      descripcion !== undefined ? descripcion : current.descripcion,
      Number(id)
    ]);

    // Si se subió una nueva imagen y se confirmó la actualización en MySQL:
    if (processed) {
      // 1. Registrar metadatos de la nueva imagen
      await registerImageInDatabase(processed, 'rutas', Number(id));

      // 2. Si la imagen anterior era un archivo subido en /uploads/, eliminar el archivo anterior para no dejar basura
      if (current.imagen && current.imagen.startsWith('/uploads/') && current.imagen !== newImagen) {
        safelyDeletePhysicalFiles([current.imagen, current.imagen_thumbnail]);
      }
    }

    const [updated] = await pool.query('SELECT * FROM rutas WHERE id = ?', [Number(id)]);
    return res.status(200).json(updated[0]);
  } catch (err) {
    console.error('Error updating ruta in MySQL:', err);
    // Compensación: eliminar el archivo nuevo subido si la base de datos falló
    if (processed) {
      safelyDeletePhysicalFiles([processed.url, processed.thumbUrl]);
    }
    return res.status(500).json({ error: 'Error al actualizar la ruta' });
  }
};

exports.deleteRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM rutas WHERE id = ?', [Number(id)]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }

    const current = existing[0];

    const [activeRes] = await pool.query(
      "SELECT COUNT(*) as count FROM reservas WHERE ruta_id = ? AND estado != 'Cancelada'",
      [Number(id)]
    );

    if (activeRes[0].count > 0) {
      return res.status(400).json({ error: 'No se puede eliminar la ruta porque posee reservas activas vinculadas' });
    }

    // 1. Eliminar archivos físicos asociados si están en /uploads/
    if (current.imagen && current.imagen.startsWith('/uploads/')) {
      safelyDeletePhysicalFiles([current.imagen, current.imagen_thumbnail]);
    }
    await deleteImagesForEntity('rutas', Number(id));

    // 2. Eliminar registro de la tabla rutas
    await pool.query('DELETE FROM rutas WHERE id = ?', [Number(id)]);
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting ruta in MySQL:', err);
    return res.status(500).json({ error: 'Error al eliminar la ruta' });
  }
};
