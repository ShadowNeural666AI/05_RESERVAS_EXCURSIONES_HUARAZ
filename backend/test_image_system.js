const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const mysql = require('mysql2/promise');

const API_BASE = 'http://localhost:5000/api';
const UPLOADS_BASE = 'http://localhost:5000';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 INICIANDO BATERÍA DE PRUEBAS DE SUBIDA Y GESTIÓN DE IMÁGENES');
  console.log('====================================================\n');

  const testDir = path.resolve(__dirname, 'test_artifacts');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Generar fixtures de prueba
  console.log('📦 Generando archivos de prueba controlados...');
  const jpegPath = path.join(testDir, 'sample_test.jpg');
  const pngPath = path.join(testDir, 'sample_test.png');
  const webpPath = path.join(testDir, 'sample_test.webp');
  const fakeImagePath = path.join(testDir, 'fake_malicious.jpg');
  const textFilePath = path.join(testDir, 'document.txt');
  const oversizedPath = path.join(testDir, 'oversized.jpg');

  // 1. Imagen JPEG real (800x600)
  await sharp({
    create: { width: 800, height: 600, channels: 3, background: { r: 14, g: 165, b: 233 } }
  }).jpeg().toFile(jpegPath);

  // 2. Imagen PNG real (600x400)
  await sharp({
    create: { width: 600, height: 400, channels: 4, background: { r: 16, g: 185, b: 129, alpha: 1 } }
  }).png().toFile(pngPath);

  // 3. Imagen WebP real (500x500)
  await sharp({
    create: { width: 500, height: 500, channels: 3, background: { r: 139, g: 92, b: 246 } }
  }).webp().toFile(webpPath);

  // 4. Archivo falso con extensión .jpg pero contenido de texto
  fs.writeFileSync(fakeImagePath, 'ESTE ES UN TEXTO MALICIOSO DISFRAZADO DE JPG');

  // 5. Archivo de texto normal
  fs.writeFileSync(textFilePath, 'Contenido de texto plano no permitido');

  // 6. Archivo mayor a 5 MB (6 MB de buffer de imagen o ceros)
  const bigBuffer = Buffer.alloc(6 * 1024 * 1024, 0x41);
  fs.writeFileSync(oversizedPath, bigBuffer);

  console.log('✔ Archivos de prueba generados con éxito.\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      process.stdout.write(`Prueba #${total}: ${name}... `);
      await fn();
      console.log('✅ APROBADA');
      passed++;
    } catch (err) {
      console.log(`❌ FALLÓ: ${err.message}`);
    }
  }

  let createdRutaId = null;
  let uploadedImageUrl = null;
  let uploadedThumbUrl = null;

  // PRUEBA 1: Subida correcta de JPEG
  await test('Subida correcta de una imagen JPEG', async () => {
    const formData = new FormData();
    formData.append('nombre', 'Tour Glaciar Rajucolta Test JPEG');
    formData.append('categoria', 'Montaña');
    formData.append('ubicacion', 'Cordillera Blanca - Huaraz');
    formData.append('duracion', '1 día');
    formData.append('dificultad', 'Moderado');
    formData.append('cupo_total', '18');
    formData.append('precio', '35.00');
    formData.append('estado', 'Disponible');
    formData.append('descripcion', 'Ruta de prueba automatizada con formato JPEG');

    const fileBlob = new Blob([fs.readFileSync(jpegPath)], { type: 'image/jpeg' });
    formData.append('imagen', fileBlob, 'sample_test.jpg');

    const res = await fetch(`${API_BASE}/rutas`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();

    if (!data.id || !data.imagen.endsWith('.webp') || !data.imagen_thumbnail.endsWith('.webp')) {
      throw new Error(`Respuesta inválida: imagen no optimizada a WebP: ${JSON.stringify(data)}`);
    }

    createdRutaId = data.id;
    uploadedImageUrl = data.imagen;
    uploadedThumbUrl = data.imagen_thumbnail;
  });

  // PRUEBA 2: Subida correcta de PNG
  await test('Subida correcta de una imagen PNG', async () => {
    const formData = new FormData();
    formData.append('nombre', 'Laguna Churup Test PNG');
    formData.append('categoria', 'Laguna');
    formData.append('ubicacion', 'Pitec - Huaraz');
    formData.append('duracion', '1 día');
    formData.append('dificultad', 'Difícil');
    formData.append('cupo_total', '12');
    formData.append('precio', '40.00');
    formData.append('estado', 'Disponible');

    const fileBlob = new Blob([fs.readFileSync(pngPath)], { type: 'image/png' });
    formData.append('imagen', fileBlob, 'sample_test.png');

    const res = await fetch(`${API_BASE}/rutas`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();

    if (!data.id || !data.imagen.endsWith('.webp')) {
      throw new Error('No se convirtió PNG a WebP');
    }

    // Limpiar esta ruta temporal
    await fetch(`${API_BASE}/rutas/${data.id}`, { method: 'DELETE' });
  });

  // PRUEBA 3: Subida correcta de WebP
  await test('Subida correcta de una imagen WebP nativa', async () => {
    const formData = new FormData();
    formData.append('nombre', 'Trek Santa Cruz Test WebP');
    formData.append('categoria', 'Caminata');
    formData.append('ubicacion', 'Cashapampa');
    formData.append('duracion', '3 días');
    formData.append('dificultad', 'Experto');
    formData.append('cupo_total', '10');
    formData.append('precio', '120.00');
    formData.append('estado', 'Disponible');

    const fileBlob = new Blob([fs.readFileSync(webpPath)], { type: 'image/webp' });
    formData.append('imagen', fileBlob, 'sample_test.webp');

    const res = await fetch(`${API_BASE}/rutas`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();

    // Limpiar esta ruta temporal
    await fetch(`${API_BASE}/rutas/${data.id}`, { method: 'DELETE' });
  });

  // PRUEBA 4: Rechazo de archivo que no sea imagen real (magic bytes inválidos)
  await test('Rechazo de archivo falso disfrazado de imagen (.jpg falso)', async () => {
    const formData = new FormData();
    formData.append('nombre', 'Ataque Falso JPG');
    formData.append('ubicacion', 'Huaraz');
    formData.append('duracion', '1 día');
    formData.append('cupo_total', '10');

    const fileBlob = new Blob([fs.readFileSync(fakeImagePath)], { type: 'image/jpeg' });
    formData.append('imagen', fileBlob, 'fake_malicious.jpg');

    const res = await fetch(`${API_BASE}/rutas`, { method: 'POST', body: formData });
    if (res.ok) throw new Error('El backend aceptó un archivo que no es una imagen válida');
    const json = await res.json();
    if (!json.error) throw new Error('No se devolvió mensaje de error amigable');
  });

  // PRUEBA 5: Rechazo de archivo que exceda el límite (> 5MB)
  await test('Rechazo de imagen que excede límite de 5 MB', async () => {
    const formData = new FormData();
    formData.append('nombre', 'Archivo Gigante Test');
    formData.append('ubicacion', 'Huaraz');
    formData.append('duracion', '1 día');
    formData.append('cupo_total', '10');

    const fileBlob = new Blob([fs.readFileSync(oversizedPath)], { type: 'image/jpeg' });
    formData.append('imagen', fileBlob, 'oversized.jpg');

    const res = await fetch(`${API_BASE}/rutas`, { method: 'POST', body: formData });
    if (res.ok) throw new Error('El backend aceptó un archivo mayor a 5 MB');
    const json = await res.json();
    if (!json.error || !json.error.includes('5 MB')) {
      throw new Error(`Mensaje inesperado: ${JSON.stringify(json)}`);
    }
  });

  // PRUEBA 6: Rechazo de extensión o formato no permitido (ej. archivo .txt)
  await test('Rechazo de extensión no permitida (.txt)', async () => {
    const formData = new FormData();
    formData.append('nombre', 'Documento no permitido');
    formData.append('ubicacion', 'Huaraz');
    formData.append('duracion', '1 día');
    formData.append('cupo_total', '10');

    const fileBlob = new Blob([fs.readFileSync(textFilePath)], { type: 'text/plain' });
    formData.append('imagen', fileBlob, 'document.txt');

    const res = await fetch(`${API_BASE}/rutas`, { method: 'POST', body: formData });
    if (res.ok) throw new Error('El backend aceptó un archivo .txt');
  });

  // PRUEBA 7: Visualización y descarga HTTP del archivo y miniatura
  await test('Visualización HTTP de la imagen optimizada y su miniatura', async () => {
    const imgRes = await fetch(`${UPLOADS_BASE}${uploadedImageUrl}`);
    if (!imgRes.ok) throw new Error(`No se pudo obtener la imagen en ${uploadedImageUrl}`);
    const imgContentType = imgRes.headers.get('content-type');
    if (!imgContentType.includes('image/webp')) {
      throw new Error(`Content-Type incorrecto: ${imgContentType}`);
    }

    const thumbRes = await fetch(`${UPLOADS_BASE}${uploadedThumbUrl}`);
    if (!thumbRes.ok) throw new Error(`No se pudo obtener la miniatura en ${uploadedThumbUrl}`);
  });

  // PRUEBA 8: Persistencia en disco físico tras reinicio
  await test('Existencia física y persistencia en disco de los archivos WebP', async () => {
    const relativeMain = uploadedImageUrl.replace(/^\/uploads\//, '');
    const relativeThumb = uploadedThumbUrl.replace(/^\/uploads\//, '');

    const diskMain = path.resolve(__dirname, 'uploads', relativeMain);
    const diskThumb = path.resolve(__dirname, 'uploads', relativeThumb);

    if (!fs.existsSync(diskMain)) throw new Error(`El archivo físico principal no existe en: ${diskMain}`);
    if (!fs.existsSync(diskThumb)) throw new Error(`El archivo físico miniatura no existe en: ${diskThumb}`);

    const stat = fs.statSync(diskMain);
    if (stat.size <= 0) throw new Error('El archivo físico está vacío');
  });

  // PRUEBA 9: Registro correcto de la ruta y metadatos en MySQL
  await test('Registro correcto de metadatos en MySQL (tablas rutas e imagenes)', async () => {
    const db = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'huaraz_tours_db'
    });

    const [rutas] = await db.query('SELECT * FROM rutas WHERE id = ?', [createdRutaId]);
    if (rutas.length === 0) throw new Error('Ruta no encontrada en MySQL');
    if (rutas[0].imagen !== uploadedImageUrl) throw new Error('Ruta en MySQL no coincide con URL de imagen');
    if (rutas[0].imagen_thumbnail !== uploadedThumbUrl) throw new Error('Ruta en MySQL no coincide con thumbnail');

    const [imagenes] = await db.query('SELECT * FROM imagenes WHERE entidad = "rutas" AND entidad_id = ?', [createdRutaId]);
    if (imagenes.length === 0) throw new Error('No se encontró registro en tabla `imagenes` de MySQL');
    const imgMeta = imagenes[0];
    if (imgMeta.formato !== 'webp' || imgMeta.tamano_bytes <= 0 || !imgMeta.ancho) {
      throw new Error(`Metadatos incompletos en tabla imagenes: ${JSON.stringify(imgMeta)}`);
    }

    await db.end();
  });

  // PRUEBA 10: Actualización de imagen existente con eliminación limpia del archivo anterior
  let newUploadedUrl = null;
  await test('Actualización con nueva imagen y eliminación segura del archivo anterior', async () => {
    const relativeOld = uploadedImageUrl.replace(/^\/uploads\//, '');
    const diskOld = path.resolve(__dirname, 'uploads', relativeOld);

    const formData = new FormData();
    formData.append('nombre', 'Tour Glaciar Rajucolta Actualizado');

    const newBlob = new Blob([fs.readFileSync(pngPath)], { type: 'image/png' });
    formData.append('imagen', newBlob, 'new_image.png');

    const res = await fetch(`${API_BASE}/rutas/${createdRutaId}`, { method: 'PUT', body: formData });
    if (!res.ok) throw new Error(`Error en actualización: ${await res.text()}`);
    const data = await res.json();

    newUploadedUrl = data.imagen;
    if (newUploadedUrl === uploadedImageUrl) throw new Error('La URL de la imagen no cambió tras subir nueva');

    // Comprobar que el archivo anterior fue eliminado del disco
    if (fs.existsSync(diskOld)) {
      throw new Error('El archivo físico anterior NO fue eliminado y quedó huérfano');
    }

    // Comprobar que el nuevo archivo sí existe
    const relativeNew = newUploadedUrl.replace(/^\/uploads\//, '');
    const diskNew = path.resolve(__dirname, 'uploads', relativeNew);
    if (!fs.existsSync(diskNew)) {
      throw new Error('El nuevo archivo físico no existe en disco');
    }
  });

  // PRUEBA 11: Conservación de la imagen anterior si no se envía un nuevo archivo
  await test('Conservación de imagen existente cuando se editan otros campos sin subir imagen', async () => {
    const formData = new FormData();
    formData.append('nombre', 'Tour Glaciar Rajucolta Modificado Sin Imagen');
    formData.append('precio', '55.00');

    const res = await fetch(`${API_BASE}/rutas/${createdRutaId}`, { method: 'PUT', body: formData });
    if (!res.ok) throw new Error(`Error: ${await res.text()}`);
    const data = await res.json();

    if (data.imagen !== newUploadedUrl) {
      throw new Error(`Se perdió la imagen existente: ${data.imagen} !== ${newUploadedUrl}`);
    }
  });

  // PRUEBA 12: Eliminación segura de ruta y limpieza de sus archivos asociados
  await test('Eliminación segura de la ruta y de sus archivos en disco', async () => {
    const relativeToDelete = newUploadedUrl.replace(/^\/uploads\//, '');
    const diskToDelete = path.resolve(__dirname, 'uploads', relativeToDelete);

    const res = await fetch(`${API_BASE}/rutas/${createdRutaId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error al eliminar: ${res.status}`);

    if (fs.existsSync(diskToDelete)) {
      throw new Error('El archivo físico no fue eliminado tras borrar la ruta');
    }

    // Verificar en MySQL
    const db = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'huaraz_tours_db'
    });
    const [imagenes] = await db.query('SELECT COUNT(*) as count FROM imagenes WHERE entidad = "rutas" AND entidad_id = ?', [createdRutaId]);
    if (imagenes[0].count > 0) {
      throw new Error('Los registros de metadata en tabla imagenes no fueron borrados');
    }
    await db.end();
  });

  // PRUEBA 13: Listado de rutas completo sin degradación de rendimiento
  await test('Consulta y carga rápida de listado con miniaturas', async () => {
    const start = Date.now();
    const res = await fetch(`${API_BASE}/rutas`);
    if (!res.ok) throw new Error('Error al consultar rutas');
    const rutas = await res.json();
    const elapsed = Date.now() - start;

    if (!Array.isArray(rutas) || rutas.length === 0) {
      throw new Error('No se retornaron rutas');
    }
    if (elapsed > 500) {
      throw new Error(`Consulta lenta (${elapsed}ms)`);
    }
  });

  console.log('\n====================================================');
  console.log(`📊 RESULTADO FINAL: ${passed}/${total} PRUEBAS SUPERADAS EXITOSAMENTE`);
  console.log('====================================================\n');

  // Limpieza de directorio test_artifacts
  fs.rmSync(testDir, { recursive: true, force: true });

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fallo no controlado en suite de pruebas:', err);
  process.exit(1);
});
