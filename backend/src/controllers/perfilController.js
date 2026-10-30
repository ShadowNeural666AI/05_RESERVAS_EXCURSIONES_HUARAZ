const db = require('../db/database');
const bcrypt = require('bcryptjs');

// Obtener perfil por ID
exports.getPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT id, nombre, correo, role, dni, telefono, fecha_nacimiento, avatar, cargo, estado, preferencias, notificaciones, rutas_favoritas, created_at, updated_at
       FROM usuarios WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    if (typeof user.preferencias === 'string') user.preferencias = JSON.parse(user.preferencias);
    if (typeof user.notificaciones === 'string') user.notificaciones = JSON.parse(user.notificaciones);
    if (typeof user.rutas_favoritas === 'string') user.rutas_favoritas = JSON.parse(user.rutas_favoritas);

    res.json(user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener datos del perfil', details: error.message });
  }
};

// Actualizar datos del perfil
exports.updatePerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      correo,
      dni,
      telefono,
      fecha_nacimiento,
      avatar,
      preferencias,
      notificaciones,
      rutas_favoritas,
      cargo
    } = req.body;

    // Verificar usuario existente
    const [existing] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const currentUser = existing[0];

    // SEGURIDAD: Un turista NO puede modificar su propio rol a admin
    if (req.body.role && req.body.role !== currentUser.role && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso no autorizado: No se permite cambiar de rol.' });
    }

    // Validar duplicado de correo si se cambió
    if (correo && correo.toLowerCase() !== currentUser.correo.toLowerCase()) {
      const [emailCheck] = await db.query('SELECT id FROM usuarios WHERE correo = ? AND id != ?', [correo.toLowerCase(), id]);
      if (emailCheck.length > 0) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado por otro usuario.' });
      }
    }

    const updatedNombre = nombre ? nombre.trim() : currentUser.nombre;
    const updatedCorreo = correo ? correo.trim().toLowerCase() : currentUser.correo;
    const updatedDni = dni !== undefined ? dni.trim() : currentUser.dni;
    const updatedTelefono = telefono !== undefined ? telefono.trim() : currentUser.telefono;
    const updatedFechaNac = fecha_nacimiento !== undefined ? fecha_nacimiento : currentUser.fecha_nacimiento;
    const updatedAvatar = avatar || currentUser.avatar;
    const updatedCargo = cargo || currentUser.cargo;
    const updatedPrefs = preferencias !== undefined ? (typeof preferencias === 'string' ? preferencias : JSON.stringify(preferencias)) : currentUser.preferencias;
    const updatedNotifs = notificaciones !== undefined ? (typeof notificaciones === 'string' ? notificaciones : JSON.stringify(notificaciones)) : currentUser.notificaciones;
    const updatedFavs = rutas_favoritas !== undefined ? (typeof rutas_favoritas === 'string' ? rutas_favoritas : JSON.stringify(rutas_favoritas)) : currentUser.rutas_favoritas;

    await db.query(
      `UPDATE usuarios SET
        nombre = ?,
        correo = ?,
        dni = ?,
        telefono = ?,
        fecha_nacimiento = ?,
        avatar = ?,
        cargo = ?,
        preferencias = ?,
        notificaciones = ?,
        rutas_favoritas = ?
       WHERE id = ?`,
      [
        updatedNombre,
        updatedCorreo,
        updatedDni,
        updatedTelefono,
        updatedFechaNac,
        updatedAvatar,
        updatedCargo,
        updatedPrefs,
        updatedNotifs,
        updatedFavs,
        id
      ]
    );

    // Si es cliente en la tabla `clientes`, sincronizar
    try {
      await db.query(
        'UPDATE clientes SET nombre = ?, correo = ?, telefono = ?, dni = ? WHERE id = ? OR dni = ?',
        [updatedNombre, updatedCorreo, updatedTelefono, updatedDni, id, updatedDni]
      );
    } catch (e) {
      console.warn('Nota: Sincronización en clientes omitida:', e.message);
    }

    // Obtener usuario actualizado
    const [updatedRows] = await db.query(
      `SELECT id, nombre, correo, role, dni, telefono, fecha_nacimiento, avatar, cargo, estado, preferencias, notificaciones, rutas_favoritas, updated_at
       FROM usuarios WHERE id = ?`,
      [id]
    );

    const user = updatedRows[0];
    if (typeof user.preferencias === 'string') user.preferencias = JSON.parse(user.preferencias);
    if (typeof user.notificaciones === 'string') user.notificaciones = JSON.parse(user.notificaciones);
    if (typeof user.rutas_favoritas === 'string') user.rutas_favoritas = JSON.parse(user.rutas_favoritas);

    res.json({
      message: 'Perfil actualizado exitosamente',
      user
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar datos del perfil', details: error.message });
  }
};

// Cambiar contraseña con validación de identidad
exports.cambiarPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { passwordActual, passwordNueva } = req.body;

    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ error: 'Debes proporcionar la contraseña actual y la nueva contraseña.' });
    }

    if (passwordNueva.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    // Obtener hash actual
    const [rows] = await db.query('SELECT password_hash FROM usuarios WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { password_hash } = rows[0];

    // Validar contraseña actual con bcrypt
    const match = await bcrypt.compare(passwordActual, password_hash);
    if (!match) {
      return res.status(400).json({ error: 'La contraseña actual ingresada es incorrecta.' });
    }

    // Generar nuevo hash con bcrypt
    const newHash = await bcrypt.hash(passwordNueva, 10);
    await db.query('UPDATE usuarios SET password_hash = ? WHERE id = ?', [newHash, id]);

    res.json({ message: 'Contraseña cambiada exitosamente. Tu cuenta está segura.' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar la contraseña', details: error.message });
  }
};

// Historial de reservas del turista
exports.getHistorialReservas = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener DNI y correo del usuario
    const [userRows] = await db.query('SELECT dni, correo FROM usuarios WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { dni, correo } = userRows[0];

    // Consultar reservas en la base de datos que correspondan a este usuario
    const [reservas] = await db.query(
      `SELECT r.*, rt.imagen as ruta_imagen, rt.dificultad as ruta_dificultad, rt.duracion as ruta_duracion, rt.ubicacion as ruta_ubicacion
       FROM reservas r
       LEFT JOIN rutas rt ON r.ruta_id = rt.id
       WHERE r.dni = ? OR r.correo = ?
       ORDER BY r.created_at DESC`,
      [dni, correo]
    );

    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener historial de reservas', details: error.message });
  }
};

// Rutas favoritas del turista
exports.getRutasFavoritas = async (req, res) => {
  try {
    const { id } = req.params;
    const [userRows] = await db.query('SELECT rutas_favoritas FROM usuarios WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let favIds = userRows[0].rutas_favoritas;
    if (typeof favIds === 'string') favIds = JSON.parse(favIds);
    if (!Array.isArray(favIds) || favIds.length === 0) {
      return res.json([]);
    }

    const [rutas] = await db.query(
      `SELECT id, nombre, categoria, ubicacion, duracion, dificultad, precio, estado, imagen, descripcion
       FROM rutas WHERE id IN (?)`,
      [favIds]
    );

    res.json(rutas);
  } catch (error) {
    console.error('Error al obtener rutas favoritas:', error);
    res.status(500).json({ error: 'Error al obtener rutas favoritas', details: error.message });
  }
};

// Alternar ruta favorita (agregar/quitar)
exports.toggleRutaFavorita = async (req, res) => {
  try {
    const { id } = req.params;
    const { rutaId } = req.body;

    if (!rutaId) {
      return res.status(400).json({ error: 'rutaId es requerido' });
    }

    const [userRows] = await db.query('SELECT rutas_favoritas FROM usuarios WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let favs = userRows[0].rutas_favoritas;
    if (typeof favs === 'string') favs = JSON.parse(favs);
    if (!Array.isArray(favs)) favs = [];

    const numId = Number(rutaId);
    const index = favs.indexOf(numId);
    let added = false;

    if (index > -1) {
      favs.splice(index, 1);
    } else {
      favs.push(numId);
      added = true;
    }

    await db.query('UPDATE usuarios SET rutas_favoritas = ? WHERE id = ?', [JSON.stringify(favs), id]);

    res.json({
      message: added ? 'Ruta agregada a tus favoritos' : 'Ruta removida de favoritos',
      favoritos: favs,
      added
    });
  } catch (error) {
    console.error('Error al alternar favorita:', error);
    res.status(500).json({ error: 'Error al actualizar favoritos', details: error.message });
  }
};

// Resumen de actividad administrativa (para perfil de Admin)
exports.getActividadAdmin = async (req, res) => {
  try {
    const [rutasCount] = await db.query('SELECT COUNT(*) as total FROM rutas');
    const [reservasCount] = await db.query('SELECT COUNT(*) as total, SUM(total) as ingresos FROM reservas');
    const [reservasConfirmadas] = await db.query("SELECT COUNT(*) as total FROM reservas WHERE estado = 'Confirmada'");
    const [clientesCount] = await db.query('SELECT COUNT(*) as total FROM clientes');
    const [recentReservas] = await db.query(
      `SELECT r.id, r.cliente, r.ruta_nombre, r.fecha, r.personas, r.estado, r.total, r.created_at
       FROM reservas r
       ORDER BY r.created_at DESC LIMIT 5`
    );

    res.json({
      rutasTotales: rutasCount[0].total,
      reservasTotales: reservasCount[0].total,
      reservasConfirmadas: reservasConfirmadas[0].total,
      clientesTotales: clientesCount[0].total,
      ingresosTotales: reservasCount[0].ingresos || 0,
      ultimasReservas: recentReservas,
      servidor: {
        motorDB: 'MySQL (XAMPP / MariaDB)',
        baseDatos: 'huaraz_tours_db',
        seguridad: 'Cifrado Bcrypt Hash activo',
        estado: 'Óptimo 100%'
      }
    });
  } catch (error) {
    console.error('Error al obtener actividad administrativa:', error);
    res.status(500).json({ error: 'Error al obtener actividad administrativa', details: error.message });
  }
};

