const pool = require('../db/database');

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

exports.getAllClientes = async (req, res) => {
  try {
    const { q } = req.query;
    let sql = 'SELECT * FROM clientes WHERE 1=1';
    const params = [];

    if (q) {
      sql += ' AND (nombre LIKE ? OR dni LIKE ? OR correo LIKE ? OR telefono LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }

    sql += ' ORDER BY id ASC';
    const [rows] = await pool.query(sql, params);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching clientes from MySQL:', err);
    return res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

exports.createCliente = async (req, res) => {
  try {
    const { nombre, dni, telefono, correo } = req.body;
    if (!nombre || !dni || !telefono || !correo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const [existing] = await pool.query('SELECT id FROM clientes WHERE dni = ?', [dni]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ya existe un cliente registrado con este DNI' });
    }

    const id = await getNextClienteId();
    await pool.query(`
      INSERT INTO clientes (id, nombre, dni, telefono, correo, reservas_count)
      VALUES (?, ?, ?, ?, ?, 0)
    `, [id, nombre, dni, telefono, correo]);

    const [created] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
    return res.status(201).json(created[0]);
  } catch (err) {
    console.error('Error creating cliente in MySQL:', err);
    return res.status(500).json({ error: 'Error al registrar cliente' });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting cliente in MySQL:', err);
    return res.status(500).json({ error: 'Error al eliminar cliente' });
  }
};
