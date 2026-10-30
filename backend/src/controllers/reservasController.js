const pool = require('../db/database');

const formatCurrentDateTime = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const getNextClienteId = async () => {
  const [rows] = await pool.query('SELECT id FROM clientes');
  let maxNum = 0;
  for (const row of rows) {
    const match = row.id.match(/^C-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `C-${String(maxNum + 1).padStart(3, '0')}`;
};

const getNextReservaId = async () => {
  const [rows] = await pool.query('SELECT id FROM reservas');
  let maxNum = 0;
  for (const row of rows) {
    const match = row.id.match(/^R-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `R-${String(maxNum + 1).padStart(3, '0')}`;
};

exports.getAllReservas = async (req, res) => {
  try {
    const { q, estado, ruta_id } = req.query;
    let sql = 'SELECT * FROM reservas WHERE 1=1';
    const params = [];

    if (q) {
      sql += ' AND (cliente LIKE ? OR ruta_nombre LIKE ? OR dni LIKE ? OR id LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (estado) {
      sql += ' AND estado = ?';
      params.push(estado);
    }

    if (ruta_id) {
      sql += ' AND ruta_id = ?';
      params.push(Number(ruta_id));
    }

    sql += ' ORDER BY id ASC';
    const [rows] = await pool.query(sql, params);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching reservas from MySQL:', err);
    return res.status(500).json({ error: 'Error al obtener las reservas' });
  }
};

exports.getReservaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    const reserva = rows[0];
    const [rutas] = await pool.query('SELECT * FROM rutas WHERE id = ?', [reserva.ruta_id]);

    return res.status(200).json({
      ...reserva,
      ruta_detalle: rutas.length > 0 ? rutas[0] : null
    });
  } catch (err) {
    console.error('Error fetching reserva by id:', err);
    return res.status(500).json({ error: 'Error al obtener la reserva' });
  }
};

exports.createReserva = async (req, res) => {
  try {
    const {
      id,
      cliente,
      dni,
      telefono,
      correo,
      ruta_id,
      fecha,
      personas,
      estado,
      observaciones
    } = req.body;

    if (!cliente || !dni || !telefono || !correo || !ruta_id || !fecha || !personas) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados' });
    }

    const [rutas] = await pool.query('SELECT * FROM rutas WHERE id = ?', [Number(ruta_id)]);
    if (rutas.length === 0) {
      return res.status(404).json({ error: 'La ruta seleccionada no existe' });
    }

    const ruta = rutas[0];
    const numPersonas = Number(personas);
    if (numPersonas <= 0) {
      return res.status(400).json({ error: 'El número de personas debe ser mayor a cero' });
    }

    const targetEstado = estado || 'Confirmada';

    if (targetEstado !== 'Cancelada' && numPersonas > ruta.cupos_disponibles) {
      return res.status(400).json({
        error: `No hay suficientes cupos disponibles en la ruta seleccionada (${ruta.cupos_disponibles} disponibles)`
      });
    }

    const newId = id && id.trim().length > 0 ? id.trim() : await getNextReservaId();
    const [existingCheck] = await pool.query('SELECT id FROM reservas WHERE id = ?', [newId]);
    if (existingCheck.length > 0) {
      return res.status(400).json({ error: `El código de reserva ${newId} ya está registrado` });
    }

    const fechaRegistro = formatCurrentDateTime();
    const precioUnit = Number(ruta.precio) || 20.00;
    const total = precioUnit * numPersonas;

    await pool.query(`
      INSERT INTO reservas (id, cliente, dni, telefono, correo, ruta_id, ruta_nombre, fecha, personas, precio_unitario, total, estado, fecha_registro, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      newId,
      cliente,
      dni,
      telefono,
      correo,
      ruta.id,
      ruta.nombre,
      fecha,
      numPersonas,
      precioUnit,
      total,
      targetEstado,
      fechaRegistro,
      observaciones || ''
    ]);

    // Update available seats
    if (targetEstado !== 'Cancelada') {
      const newDisponibles = Math.max(0, ruta.cupos_disponibles - numPersonas);
      await pool.query('UPDATE rutas SET cupos_disponibles = ? WHERE id = ?', [newDisponibles, ruta.id]);
    }

    // Upsert or register client
    const [existingCliente] = await pool.query('SELECT id FROM clientes WHERE dni = ?', [dni]);
    if (existingCliente.length > 0) {
      await pool.query(
        'UPDATE clientes SET reservas_count = reservas_count + 1, telefono = ?, correo = ? WHERE id = ?',
        [telefono, correo, existingCliente[0].id]
      );
    } else {
      const clienteId = await getNextClienteId();
      await pool.query(`
        INSERT INTO clientes (id, nombre, dni, telefono, correo, reservas_count)
        VALUES (?, ?, ?, ?, ?, 1)
      `, [clienteId, cliente, dni, telefono, correo]);
    }

    const [created] = await pool.query('SELECT * FROM reservas WHERE id = ?', [newId]);
    const [updatedRuta] = await pool.query('SELECT * FROM rutas WHERE id = ?', [ruta.id]);

    return res.status(201).json({
      ...created[0],
      ruta_detalle: updatedRuta[0]
    });
  } catch (err) {
    console.error('Error creating reserva in MySQL:', err);
    return res.status(500).json({ error: 'Error al registrar la reserva' });
  }
};

exports.updateReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    const existing = rows[0];
    const {
      cliente,
      dni,
      telefono,
      correo,
      ruta_id,
      fecha,
      personas,
      estado,
      observaciones
    } = req.body;

    const newRutaId = ruta_id !== undefined ? Number(ruta_id) : existing.ruta_id;
    const [rutas] = await pool.query('SELECT * FROM rutas WHERE id = ?', [newRutaId]);
    if (rutas.length === 0) {
      return res.status(404).json({ error: 'La ruta especificada no existe' });
    }

    const newRuta = rutas[0];
    const updatedPersonas = personas !== undefined ? Number(personas) : existing.personas;
    const updatedEstado = estado !== undefined ? estado : existing.estado;

    // Restore old seats if it was active
    if (existing.estado !== 'Cancelada') {
      await pool.query('UPDATE rutas SET cupos_disponibles = cupos_disponibles + ? WHERE id = ?', [existing.personas, existing.ruta_id]);
    }

    // Refresh seat count
    const [refreshedTarget] = await pool.query('SELECT * FROM rutas WHERE id = ?', [newRutaId]);
    const targetSeats = refreshedTarget[0].cupos_disponibles;

    if (updatedEstado !== 'Cancelada') {
      if (updatedPersonas > targetSeats) {
        // Rollback old restore
        if (existing.estado !== 'Cancelada') {
          await pool.query('UPDATE rutas SET cupos_disponibles = cupos_disponibles - ? WHERE id = ?', [existing.personas, existing.ruta_id]);
        }
        return res.status(400).json({
          error: `No hay suficientes cupos disponibles (${targetSeats} disponibles)`
        });
      }

      await pool.query('UPDATE rutas SET cupos_disponibles = cupos_disponibles - ? WHERE id = ?', [updatedPersonas, newRutaId]);
    }

    const precioUnit = Number(newRuta.precio) || 20.00;
    const total = precioUnit * updatedPersonas;

    await pool.query(`
      UPDATE reservas
      SET cliente = ?, dni = ?, telefono = ?, correo = ?, ruta_id = ?, ruta_nombre = ?, fecha = ?, personas = ?, precio_unitario = ?, total = ?, estado = ?, observaciones = ?
      WHERE id = ?
    `, [
      cliente !== undefined ? cliente : existing.cliente,
      dni !== undefined ? dni : existing.dni,
      telefono !== undefined ? telefono : existing.telefono,
      correo !== undefined ? correo : existing.correo,
      newRuta.id,
      newRuta.nombre,
      fecha !== undefined ? fecha : existing.fecha,
      updatedPersonas,
      precioUnit,
      total,
      updatedEstado,
      observaciones !== undefined ? observaciones : existing.observaciones,
      id
    ]);

    const [saved] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);
    const [finalRuta] = await pool.query('SELECT * FROM rutas WHERE id = ?', [newRuta.id]);

    return res.status(200).json({
      ...saved[0],
      ruta_detalle: finalRuta[0]
    });
  } catch (err) {
    console.error('Error updating reserva in MySQL:', err);
    return res.status(500).json({ error: 'Error al actualizar la reserva' });
  }
};

exports.deleteReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    const existing = rows[0];
    if (existing.estado !== 'Cancelada') {
      await pool.query('UPDATE rutas SET cupos_disponibles = cupos_disponibles + ? WHERE id = ?', [existing.personas, existing.ruta_id]);
    }

    await pool.query('DELETE FROM reservas WHERE id = ?', [id]);
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting reserva in MySQL:', err);
    return res.status(500).json({ error: 'Error al eliminar la reserva' });
  }
};

exports.cancelReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    const existing = rows[0];
    if (existing.estado === 'Cancelada') {
      return res.status(400).json({ error: 'La reserva ya se encuentra cancelada' });
    }

    await pool.query('UPDATE rutas SET cupos_disponibles = cupos_disponibles + ? WHERE id = ?', [existing.personas, existing.ruta_id]);
    await pool.query("UPDATE reservas SET estado = 'Cancelada' WHERE id = ?", [id]);

    const [updated] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);
    const [ruta] = await pool.query('SELECT * FROM rutas WHERE id = ?', [existing.ruta_id]);

    return res.status(200).json({
      ...updated[0],
      ruta_detalle: ruta[0]
    });
  } catch (err) {
    console.error('Error cancelling reserva in MySQL:', err);
    return res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
};
