const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function migrateUsuarios() {
  console.log('🚀 Iniciando creación de tabla `usuarios` en MySQL...');

  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'huaraz_tours_db',
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log('✔ Conectado a huaraz_tours_db');

    // Crear tabla usuarios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id VARCHAR(50) PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        correo VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'usuario',
        dni VARCHAR(20) NULL,
        telefono VARCHAR(30) NULL,
        fecha_nacimiento VARCHAR(30) NULL,
        avatar VARCHAR(255) DEFAULT '/images/avatar.jpg',
        cargo VARCHAR(150) NULL,
        estado VARCHAR(30) DEFAULT 'Activo',
        preferencias JSON NULL,
        notificaciones JSON NULL,
        rutas_favoritas JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✔ Tabla `usuarios` creada correctamente.');

    // Hashear contraseñas con bcryptjs (salt rounds = 10)
    const adminPassHash = await bcrypt.hash('admin123', 10);
    const touristPassHash = await bcrypt.hash('turista123', 10);

    // Usuarios iniciales
    const initialUsers = [
      {
        id: 'ADM-001',
        nombre: 'Administrador General',
        correo: 'admin@huaraztours.com',
        password_hash: adminPassHash,
        role: 'admin',
        dni: '00000001',
        telefono: '043-421234',
        fecha_nacimiento: '1988-06-15',
        avatar: '/images/avatar.jpg',
        cargo: 'Gestor de Operaciones y Reservas',
        estado: 'Activo',
        preferencias: JSON.stringify({ tema: 'oscuro', idioma: 'es' }),
        notificaciones: JSON.stringify({
          emailReservas: true,
          alertasCupos: true,
          resumenSemanal: true,
          notifSistema: true
        }),
        rutas_favoritas: JSON.stringify([1, 2, 3])
      },
      {
        id: 'C-001',
        nombre: 'María López',
        correo: 'maria.lopez@email.com',
        password_hash: touristPassHash,
        role: 'usuario',
        dni: '12345678',
        telefono: '987 654 321',
        fecha_nacimiento: '1995-04-20',
        avatar: '/images/avatars/client_maria.jpg',
        cargo: 'Viajera Aventura & Trekking',
        estado: 'Activo',
        preferencias: JSON.stringify({
          dificultad: 'Moderado',
          tipoExcursion: 'Laguna & Alta Montaña',
          notifPromociones: true,
          notifRecordatorios: true
        }),
        notificaciones: JSON.stringify({
          emailReservas: true,
          alertasOfertas: true,
          recordatoriosRuta: true
        }),
        rutas_favoritas: JSON.stringify([1, 5])
      },
      {
        id: 'C-002',
        nombre: 'Carlos Ramos',
        correo: 'carlos.ramos@email.com',
        password_hash: touristPassHash,
        role: 'usuario',
        dni: '87654321',
        telefono: '912 345 678',
        fecha_nacimiento: '1991-09-12',
        avatar: '/images/avatars/client_carlos.jpg',
        cargo: 'Explorador Cultural',
        estado: 'Activo',
        preferencias: JSON.stringify({
          dificultad: 'Fácil',
          tipoExcursion: 'Cultural & Arqueología',
          notifPromociones: false,
          notifRecordatorios: true
        }),
        notificaciones: JSON.stringify({
          emailReservas: true,
          alertasOfertas: false,
          recordatoriosRuta: true
        }),
        rutas_favoritas: JSON.stringify([2])
      },
      {
        id: 'C-003',
        nombre: 'Ana Torres',
        correo: 'ana.torres@email.com',
        password_hash: touristPassHash,
        role: 'usuario',
        dni: '45678912',
        telefono: '998 712 345',
        fecha_nacimiento: '1997-11-05',
        avatar: '/images/avatars/client_ana.jpg',
        cargo: 'Senderismo Andino',
        estado: 'Activo',
        preferencias: JSON.stringify({
          dificultad: 'Moderado',
          tipoExcursion: 'Caminata Glaciar',
          notifPromociones: true,
          notifRecordatorios: true
        }),
        notificaciones: JSON.stringify({
          emailReservas: true,
          alertasOfertas: true,
          recordatoriosRuta: true
        }),
        rutas_favoritas: JSON.stringify([3])
      }
    ];

    for (const u of initialUsers) {
      await connection.query(
        `INSERT INTO usuarios (id, nombre, correo, password_hash, role, dni, telefono, fecha_nacimiento, avatar, cargo, estado, preferencias, notificaciones, rutas_favoritas)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           nombre = VALUES(nombre),
           role = VALUES(role),
           dni = VALUES(dni),
           telefono = VALUES(telefono),
           fecha_nacimiento = VALUES(fecha_nacimiento),
           avatar = VALUES(avatar),
           cargo = VALUES(cargo),
           estado = VALUES(estado)`,
        [
          u.id,
          u.nombre,
          u.correo,
          u.password_hash,
          u.role,
          u.dni,
          u.telefono,
          u.fecha_nacimiento,
          u.avatar,
          u.cargo,
          u.estado,
          u.preferencias,
          u.notificaciones,
          u.rutas_favoritas
        ]
      );
    }

    console.log('✔ Usuarios iniciales (Admin y Turistas) registrados con contraseñas seguras hasheadas.');

    const [rows] = await connection.query('SELECT id, nombre, correo, role, dni FROM usuarios');
    console.log('\n👥 Usuarios en la base de datos:', rows);

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en migración de usuarios:', err);
    process.exit(1);
  }
}

migrateUsuarios();
