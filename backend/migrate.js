const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');

async function runMigration() {
  console.log('🚀 Iniciando migración a XAMPP MySQL...');

  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log(`✔ Conexión exitosa a MySQL en ${config.host}:${config.port} (Usuario: ${config.user})`);

    const sqlPath = path.resolve(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📦 Ejecutando scripts de creación de base de datos y tablas...');
    await connection.query(sql);

    console.log('✔ Base de datos `huaraz_tours_db` creada y actualizada correctamente.');

    // Verificación y actualización de columnas si la tabla ya existía
    await connection.changeUser({ database: 'huaraz_tours_db' });
    const [columns] = await connection.query("SHOW COLUMNS FROM rutas LIKE 'imagen_thumbnail'");
    if (columns.length === 0) {
      console.log('➕ Agregando columna `imagen_thumbnail` a la tabla `rutas`...');
      await connection.query("ALTER TABLE rutas ADD COLUMN imagen_thumbnail VARCHAR(255) NULL AFTER imagen");
      console.log('✔ Columna `imagen_thumbnail` agregada con éxito.');
    }

    const [rutas] = await connection.query('SELECT COUNT(*) as total FROM rutas');
    const [clientes] = await connection.query('SELECT COUNT(*) as total FROM clientes');
    const [reservas] = await connection.query('SELECT COUNT(*) as total FROM reservas');
    const [imagenes] = await connection.query('SELECT COUNT(*) as total FROM imagenes');

    console.log('\n📊 Resumen de migración:');
    console.log(`- Rutas registradas: ${rutas[0].total}`);
    console.log(`- Clientes registrados: ${clientes[0].total}`);
    console.log(`- Reservas registradas: ${reservas[0].total}`);
    console.log(`- Imágenes registradas: ${imagenes[0].total}`);
    console.log('\n🎉 ¡Migración a XAMPP MySQL completada con éxito!');

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error durante la migración a MySQL:', err.message);
    process.exit(1);
  }
}

runMigration();
