-- Creación de la base de datos para Huaraz Tours en XAMPP MySQL
CREATE DATABASE IF NOT EXISTS huaraz_tours_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE huaraz_tours_db;

-- Tabla de Rutas Turísticas
CREATE TABLE IF NOT EXISTS rutas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(50) NOT NULL DEFAULT 'Laguna',
  ubicacion VARCHAR(150) NOT NULL,
  duracion VARCHAR(50) NOT NULL DEFAULT '1 día',
  dificultad VARCHAR(50) NOT NULL DEFAULT 'Moderado',
  cupo_total INT NOT NULL DEFAULT 20,
  cupos_disponibles INT NOT NULL DEFAULT 12,
  precio DECIMAL(10,2) NOT NULL DEFAULT 20.00,
  estado VARCHAR(50) NOT NULL DEFAULT 'Disponible',
  imagen VARCHAR(255) NOT NULL,
  imagen_thumbnail VARCHAR(255) NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de Registro y Metadatos de Imágenes
CREATE TABLE IF NOT EXISTS imagenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entidad VARCHAR(50) NOT NULL DEFAULT 'rutas',
  entidad_id INT NOT NULL,
  archivo_nombre VARCHAR(255) NOT NULL,
  archivo_ruta VARCHAR(255) NOT NULL,
  archivo_thumbnail VARCHAR(255) NULL,
  formato VARCHAR(20) NOT NULL,
  tamano_bytes INT NOT NULL,
  ancho INT NULL,
  alto INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_entidad_registro (entidad, entidad_id)
) ENGINE=InnoDB;

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id VARCHAR(20) PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  dni VARCHAR(15) NOT NULL UNIQUE,
  telefono VARCHAR(30) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  reservas_count INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de Reservas
CREATE TABLE IF NOT EXISTS reservas (
  id VARCHAR(20) PRIMARY KEY,
  cliente VARCHAR(150) NOT NULL,
  dni VARCHAR(15) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  ruta_id INT NOT NULL,
  ruta_nombre VARCHAR(150) NOT NULL,
  fecha VARCHAR(50) NOT NULL,
  personas INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 20.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 40.00,
  estado VARCHAR(50) NOT NULL DEFAULT 'Confirmada',
  fecha_registro VARCHAR(50) NOT NULL,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Semilla de Rutas (56 Destinos de Huaraz y Áncash)
INSERT INTO rutas (id, nombre, categoria, ubicacion, duracion, dificultad, cupo_total, cupos_disponibles, precio, estado, imagen, imagen_thumbnail, descripcion) VALUES
(1, 'Laguna 69', 'Laguna', 'Yungay - Huaraz', '1 día', 'Moderado', 20, 12, 20.00, 'Disponible', '/images/laguna69.jpg', '', 'Hermosa laguna de aguas turquesas, rodeada de montañas nevadas. Altitud: 4,600 m s. n. m.'),
(2, 'Chavín de Huántar', 'Montaña', 'Chavín - Huaraz', '1 día', 'Fácil', 15, 8, 15.00, 'Disponible', '/images/chavin.jpg', '', 'Milenario centro ceremonial con galerías subterráneas y cabezas clavas.'),
(3, 'Nevado Pastoruri', 'Caminata', 'Ancash', '1 día', 'Moderado', 12, 5, 12.00, 'Disponible', '/images/pastoruri.jpg', '', 'Imponente glaciar a más de 5,000 m s. n. m. y ruta de las Puyas Raimondi.'),
(4, 'Cerro Hualcán', 'Aventura', 'Recuay', '1 día', 'Difícil', 10, 6, 10.00, 'Disponible', '/images/hualcan.jpg', '', 'Senderismo panorámico de alta montaña con vistas privilegiadas.'),
(5, 'Laguna Llanganuco', 'Laguna', 'Yungay', '1 día', 'Moderado', 18, 9, 18.00, 'Disponible', '/images/llanganuco.jpg', '', 'Aguas turquesas entre los macizos del Huascarán y Huandoy.'),
(6, 'Valle de Llanganuco', 'Paisaje', 'Yungay', '1 día', 'Fácil', 20, 10, 14.00, 'Disponible', '/images/banner.jpg', '', 'Pintoresco valle andino con bosques de quenuales y arroyos glaciares.'),
(7, 'Laguna Churup', 'Laguna', 'Huaraz - Pitec', '1 día', 'Moderado', 18, 11, 25.00, 'Disponible', '/images/rutas/ruta_laguna-churup.webp', '/images/rutas/thumbnails/thumb_laguna-churup.webp', 'Aguas cristalinas de tonos esmeralda al pie del nevado Churup (5,493 m s. n. m.). Incluye tramos de cuerdas fijas en roca y vistas panorámicas de la Cordillera Blanca.'),
(8, 'Laguna Parón', 'Laguna', 'Caraz - Huaylas', '1 día', 'Fácil', 25, 16, 35.00, 'Disponible', '/images/rutas/ruta_laguna-paron.webp', '/images/rutas/thumbnails/thumb_laguna-paron.webp', 'La masa de agua dulce más grande del Parque Nacional Huascarán. Rodeada por la Pirámide de Garcilaso, Chacraraju y Artesonraju (el pico de Paramount Pictures).'),
(9, 'Nevado Mateo (Cumbre 5,150 m)', 'Aventura', 'Carhuaz - Punta Olímpica', '1 día', 'Difícil', 8, 4, 150.00, 'Disponible', '/images/rutas/ruta_nevado-mateo.webp', '/images/rutas/thumbnails/thumb_nevado-mateo.webp', 'Ascensión glaciar técnica de iniciación en alta montaña. Incluye uso de grampones, piolet y cuerda guiada por instructores UIAGM hasta la cumbre.'),
(10, 'Trek Santa Cruz Clásico', 'Caminata', 'Cashapampa - Vaquería', '4 días', 'Difícil', 12, 7, 280.00, 'Disponible', '/images/rutas/ruta_trek-santa-cruz.webp', '/images/rutas/thumbnails/thumb_trek-santa-cruz.webp', 'Clasificado por National Geographic entre los 10 mejores circuitos de trekking del planeta. Cruza el mítico Paso Punta Unión a 4,750 m s. n. m. con campamentos bajo cielos estrellados.'),
(11, 'Laguna Wilcacocha', 'Laguna', 'Cordillera Negra - Huaraz', 'Medio día', 'Fácil', 20, 14, 15.00, 'Disponible', '/images/rutas/ruta_laguna-wilcacocha.webp', '/images/rutas/thumbnails/thumb_laguna-wilcacocha.webp', 'Excelente ruta de aclimatación en la Cordillera Negra. Espejo de agua habitado por patos silvestres y mirador natural frontal a toda la cadena de nevados de la Cordillera Blanca.'),
(12, 'Laguna Radian', 'Laguna', 'Independencia - Huaraz', 'Medio día', 'Fácil', 15, 9, 20.00, 'Disponible', '/images/rutas/ruta_laguna-radian.webp', '/images/rutas/thumbnails/thumb_laguna-radian.webp', 'Hermosa laguna rodeada de pastizales y bosques nativos de queñuales. Paisaje bucólico con vista directa a los nevados Huascarán, Chopicalqui y Copa.'),
(13, 'Lagunas Mullaca y Carhuac', 'Laguna', 'Carhuaz', '1 día', 'Moderado', 14, 8, 40.00, 'Disponible', '/images/rutas/ruta_lagunas-mullaca-carhuac.webp', '/images/rutas/thumbnails/thumb_lagunas-mullaca-carhuac.webp', 'Doble circuito glaciar poco concurrido. La Laguna Mullaca destaca por sus tonalidades rojas y el glaciar colgante del Nevado Hualcán.'),
(14, 'Laguna Ahuac', 'Laguna', 'Huaraz - Wilcahuain', '1 día', 'Moderado', 16, 10, 25.00, 'Disponible', '/images/rutas/ruta_laguna-ahuac.webp', '/images/rutas/thumbnails/thumb_laguna-ahuac.webp', 'Sendero ancestral que parte cerca del templo arqueológico de Wilcahuain. Laguna encajonada en anfiteatro rocoso con vistas panorámicas sobre todo el Callejón de Huaylas.'),
(15, 'Laguna Rajucolta', 'Laguna', 'Macashca - Huaraz', '1 día', 'Moderado', 15, 9, 30.00, 'Disponible', '/images/rutas/ruta_laguna-rajucolta.webp', '/images/rutas/thumbnails/thumb_laguna-rajucolta.webp', 'Ubicada al final de una quebrada virgen, reposa directamente bajo la inmensa muralla de hielo y roca del Nevado Huantsán (6,395 m), el rey de la Cordillera Blanca.'),
(16, 'Laguna Shallap', 'Laguna', 'Olleros - Huaraz', '1 día', 'Moderado', 16, 11, 35.00, 'Disponible', '/images/rutas/ruta_laguna-shallap.webp', '/images/rutas/thumbnails/thumb_laguna-shallap.webp', 'Famosa por su color verde esmeralda brillante lechoso, producto de los minerales en suspensión de los glaciares San Juan y Huantsán.'),
(17, 'Laguna Querococha', 'Laguna', 'Recuay - Cátac', '1 día', 'Fácil', 25, 18, 20.00, 'Disponible', '/images/rutas/ruta_laguna-querococha.webp', '/images/rutas/thumbnails/thumb_laguna-querococha.webp', 'Pintoresco lago andino en la ruta hacia el Monumento Arqueológico Chavín. En su ladera montañosa se aprecia una silueta geológica natural idéntica al mapa del Perú.'),
(18, 'Laguna Palcacocha', 'Laguna', 'Quebrada Cojup - Huaraz', '1 día', 'Moderado', 12, 6, 45.00, 'Disponible', '/images/rutas/ruta_laguna-palcacocha.webp', '/images/rutas/thumbnails/thumb_laguna-palcacocha.webp', 'Impresionante laguna origen de la cuenca hídrica del Quillcay. Enmarcada por los nevados Palcaraju y Pucaranra, con morrenas glaciares imponentes.'),
(19, 'Laguna Uruscocha', 'Laguna', 'Tarica - Huaraz', '1 día', 'Difícil', 10, 5, 40.00, 'Disponible', '/images/rutas/ruta_laguna-uruscocha.webp', '/images/rutas/thumbnails/thumb_laguna-uruscocha.webp', 'Ruta agreste de alta montaña que asciende por la Quebrada Akillpo. Paisajes solitarios de tundra andina con vistas a los contrafuertes del Urus e Ishinca.'),
(20, 'Laguna Rocotuyoc y Laguna Congelada', 'Laguna', 'Marcará - Carhuaz', '1 día', 'Moderado', 18, 12, 40.00, 'Disponible', '/images/rutas/ruta_laguna-rocotuyoc.webp', '/images/rutas/thumbnails/thumb_laguna-rocotuyoc.webp', 'Laguna con témpanos de hielo desprendidos de los glaciares del Nevado Paccharaju. Incluye visita a pinturas rupestres precolombinas en el trayecto.'),
(21, 'Laguna Cullicocha', 'Laguna', 'Santa Cruz - Caraz', '2 días', 'Difícil', 12, 6, 90.00, 'Disponible', '/images/rutas/ruta_laguna-cullicocha.webp', '/images/rutas/thumbnails/thumb_laguna-cullicocha.webp', 'Una de las postales más sobrecogedoras del Perú. Sus aguas de color zafiro contrastan con la pared de hielo vertical del Nevado Santa Cruz (6,259 m).'),
(22, 'Laguna Jancacocha', 'Laguna', 'Pomabamba - Conchucos', '2 días', 'Moderado', 12, 8, 75.00, 'Disponible', '/images/rutas/ruta_laguna-jancacocha.webp', '/images/rutas/thumbnails/thumb_laguna-jancacocha.webp', 'Santuario lacustre de aguas verde azuladas ubicado en la vertiente oriental de la Cordillera Blanca, rodeado de bosques vírgenes de alisos y queñual.'),
(23, 'Lagunas de Safuna y Alpamayo', 'Laguna', 'Alpamayo Norte', '2 días', 'Difícil', 10, 5, 85.00, 'Disponible', '/images/rutas/ruta_lagunas-safuna.webp', '/images/rutas/thumbnails/thumb_lagunas-safuna.webp', 'Lagunas gemelas situadas al pie de la pared norte del Nevado Alpamayo y Pucajirca. Un escenario de hielo puro y soledad alpina absoluta.'),
(24, 'Circuito Huayhuash Completo', 'Caminata', 'Chiquián - Bolognesi', '10 días', 'Difícil', 10, 5, 650.00, 'Disponible', '/images/rutas/ruta_circuito-huayhuash.webp', '/images/rutas/thumbnails/thumb_circuito-huayhuash.webp', 'El trekking más renombrado de Sudamérica. Rodea el macizo del Yerupajá y Siula Grande (Touching the Void), cruzando pasos a más de 5,000 m s. n. m. todos los días.'),
(25, 'Trek Cedros - Alpamayo', 'Caminata', 'Hualcayán - Santa Cruz', '8 días', 'Difícil', 10, 6, 520.00, 'Disponible', '/images/rutas/ruta_trek-cedros-alpamayo.webp', '/images/rutas/thumbnails/thumb_trek-cedros-alpamayo.webp', 'Expedición de travesía que circunnavega el Nevado Alpamayo, observando su famosa pirámide perfecta de hielo desde diversos ángulos y pasos desolados.'),
(26, 'Quebrada Ishinca y Refugio Base', 'Montaña', 'Pashpa - Tarica', '2 días', 'Moderado', 15, 9, 110.00, 'Disponible', '/images/rutas/ruta_quebrada-ishinca.webp', '/images/rutas/thumbnails/thumb_quebrada-ishinca.webp', 'Campamento base y refugio alpino rodeado por los nevados Tocllaraju (6,032 m), Urus (5,420 m) e Ishinca (5,530 m). El centro neurálgico del montañismo en Áncash.'),
(27, 'Quebrada Quilcayhuanca y Cayesh', 'Caminata', 'Huaraz', '1 día', 'Moderado', 16, 10, 35.00, 'Disponible', '/images/rutas/ruta_quebrada-quilcayhuanca.webp', '/images/rutas/thumbnails/thumb_quebrada-quilcayhuanca.webp', 'Valle glaciar llano de pastoreo tradicional y restos arqueológicos preincas. Vista a la impresionante aguja de granito del Nevado Cayesh.'),
(28, 'Quebrada Honda y Paso Portachuelo', 'Aventura', 'Marcará - Chacas', '2 días', 'Difícil', 12, 6, 130.00, 'Disponible', '/images/rutas/ruta_quebrada-honda.webp', '/images/rutas/thumbnails/thumb_quebrada-honda.webp', 'Antigua ruta de arrieros andinos que conecta el Callejón de Huaylas con la zona de los Conchucos. Cruce de collados glaciares con alta biodiversidad.'),
(29, 'Quebrada Rurec - Paredes de Granito', 'Aventura', 'Olleros', '3 días', 'Difícil', 8, 4, 220.00, 'Disponible', '/images/rutas/ruta_quebrada-rurec.webp', '/images/rutas/thumbnails/thumb_quebrada-rurec.webp', 'Paraíso mundial de la escalada en granito (Big Wall). Formaciones verticales de roca pura de más de 800 metros de altura en un valle sereno y poco explorado.'),
(30, 'Nevado Vallunaraju (Cumbre 5,686 m)', 'Montaña', 'Huaraz - Quebrada Llaca', '2 días', 'Difícil', 6, 3, 320.00, 'Disponible', '/images/rutas/ruta_nevado-vallunaraju.webp', '/images/rutas/thumbnails/thumb_nevado-vallunaraju.webp', 'Ascenso guiado de alta montaña al coloso bicéfalo que domina la ciudad de Huaraz. Requiere marcha sobre glaciar, aristas de nieve y técnica de aseguramiento.'),
(31, 'Nevado Huascarán (Mirador y Campo Morrena)', 'Montaña', 'Musho - Yungay', '3 días', 'Difícil', 8, 4, 380.00, 'Disponible', '/images/rutas/ruta_nevado-huascaran.webp', '/images/rutas/thumbnails/thumb_nevado-huascaran.webp', 'Aproximación a las faldas del techo del Perú (6,768 m s. n. m.). Noches de campamento en el refugio Don Bosco y contemplación de grietas y avalanchas seguras.'),
(32, 'Nevado Alpamayo - Mirador Cruz Pampa', 'Montaña', 'Caraz - Santa Cruz', '3 días', 'Difícil', 10, 5, 250.00, 'Disponible', '/images/rutas/ruta_alpamayo-cruz-pampa.webp', '/images/rutas/thumbnails/thumb_alpamayo-cruz-pampa.webp', 'Trekking hasta el campamento base del Alpamayo para presenciar el amanecer sobre las estrías de hielo de la montaña más hermosa del planeta.'),
(33, 'Nevado Pisco (Cumbre 5,752 m)', 'Montaña', 'Yungay - Llanganuco', '3 días', 'Difícil', 8, 4, 360.00, 'Disponible', '/images/rutas/ruta_nevado-pisco.webp', '/images/rutas/thumbnails/thumb_nevado-pisco.webp', 'La ascensión clásica de los Andes. Ofrece la vista panorámica más completa de la Cordillera Blanca: Huascarán, Chopicalqui, Huandoy, Chacraraju y Artesonraju.'),
(34, 'Nevado Yanapaccha (Cumbre 5,460 m)', 'Montaña', 'Yungay - Portachuelo', '2 días', 'Difícil', 6, 3, 340.00, 'Disponible', '/images/rutas/ruta_nevado-yanapaccha.webp', '/images/rutas/thumbnails/thumb_nevado-yanapaccha.webp', 'Cumbre alpina con pendientes de nieve de hasta 55 grados. Vistas aéreas únicas a las lagunas de Llanganuco y toda la quebrada de Cebollapampa.'),
(35, 'Nevado Urus Este (Cumbre 5,420 m)', 'Montaña', 'Tarica - Ishinca', '2 días', 'Difícil', 8, 4, 310.00, 'Disponible', '/images/rutas/ruta_nevado-urus.webp', '/images/rutas/thumbnails/thumb_nevado-urus.webp', 'Ascensión combinada en arista rocosa y pendientes de nieve firme en la Quebrada Ishinca. Recomendado como preparación antes de picos mayores de 6,000 metros.'),
(36, 'Punta Olímpica y Túnel Trasandino', 'Paisaje', 'Carhuaz - Chacas', '1 día', 'Fácil', 20, 15, 30.00, 'Disponible', '/images/rutas/ruta_punta-olimpica.webp', '/images/rutas/thumbnails/thumb_punta-olimpica.webp', 'Cruce del túnel vehicular a mayor altitud del mundo (4,736 m s. n. m.). Descenso hacia el místico callejón de Conchucos con murallas de hielo al costado de la carretera.'),
(37, 'Bosque de Piedras de Hatun Machay', 'Aventura', 'Pampas Chico - Recuay', '1 día', 'Moderado', 18, 12, 35.00, 'Disponible', '/images/rutas/ruta_hatun-machay.webp', '/images/rutas/thumbnails/thumb_hatun-machay.webp', 'El bosque de rocas más extenso de la Cordillera Negra. Laberinto milenario de figuras geológicas, pinturas rupestres precerámicas y cientos de vías de escalada deportiva.'),
(38, 'Aguas Termales de Chancos', 'Paisaje', 'Marcará - Carhuaz', 'Medio día', 'Fácil', 25, 19, 18.00, 'Disponible', '/images/rutas/ruta_termas-chancos.webp', '/images/rutas/thumbnails/thumb_termas-chancos.webp', 'Famosas termas subterráneas con cuevas naturales de sauna de vapor mineral, recomendadas para el relax muscular y el alivio respiratorio tras largas caminatas.'),
(39, 'Aguas Termales de Monterrey', 'Paisaje', 'Huaraz Norte', 'Medio día', 'Fácil', 30, 22, 12.00, 'Disponible', '/images/rutas/ruta_termas-monterrey.webp', '/images/rutas/thumbnails/thumb_termas-monterrey.webp', 'Balneario termal tradicional a solo 7 km de la Plaza de Armas de Huaraz. Pozas individuales y piscina temperada con aguas ferruginosas curativas.'),
(40, 'Restos Arqueológicos de Wilcahuain', 'Paisaje', 'Independencia - Huaraz', 'Medio día', 'Fácil', 25, 18, 15.00, 'Disponible', '/images/rutas/ruta_wilcahuain.webp', '/images/rutas/thumbnails/thumb_wilcahuain.webp', 'Monumento funerario de la cultura Wari (siglos VII al X). Construcción de tres niveles de piedra labrada con sistema antisísmico y techos intactos.'),
(41, 'Cañón del Pato y sus 35 Túneles', 'Aventura', 'Caraz - Huallanca', '1 día', 'Fácil', 20, 14, 28.00, 'Disponible', '/images/rutas/ruta_canon-del-pato.webp', '/images/rutas/thumbnails/thumb_canon-del-pato.webp', 'Garganta natural donde la Cordillera Blanca y la Cordillera Negra casi se tocan separadas apenas por unos metros, tallada por la furia del río Santa.'),
(42, 'Complejo Arqueológico Honcopampa', 'Paisaje', 'San Miguel de Aco - Carhuaz', '1 día', 'Fácil', 20, 15, 22.00, 'Disponible', '/images/rutas/ruta_honcopampa.webp', '/images/rutas/thumbnails/thumb_honcopampa.webp', 'Gran ciudadela preinca con chullpas monumentales de dos plantas y cataratas mágicas escondidas en un bosque nativo de queñuales.'),
(43, 'Catarata Yuracyacu', 'Caminata', 'Caraz', 'Medio día', 'Fácil', 18, 13, 16.00, 'Disponible', '/images/rutas/ruta_catarata-yuracyacu.webp', '/images/rutas/thumbnails/thumb_catarata-yuracyacu.webp', 'Hermosa caída de agua cristalina proveniente de los deshielos de la Quebrada Santa Cruz, rodeada de densa vegetación y campos de cultivo tradicionales.'),
(44, 'Mirador de Rataquenua y Cruz de Huaraz', 'Paisaje', 'Huaraz Sur', 'Medio día', 'Fácil', 25, 20, 10.00, 'Disponible', '/images/rutas/ruta_mirador-rataquenua.webp', '/images/rutas/thumbnails/thumb_mirador-rataquenua.webp', 'Mirador natural sobre el acantilado rocoso al sureste de Huaraz. Ofrece una vista panorámica de 180° de la ciudad y el majestuoso Nevado Huascarán.'),
(45, 'Santuario del Señor de la Soledad', 'Paisaje', 'Huaraz Centro', 'Medio día', 'Fácil', 30, 25, 10.00, 'Disponible', '/images/rutas/ruta_senor-de-la-soledad.webp', '/images/rutas/thumbnails/thumb_senor-de-la-soledad.webp', 'Templo católico construido tras el terremoto de 1970 que alberga la venerada imagen del patrono de Huaraz, adornado con frescos murales andinos de los Cayo.'),
(46, 'Pueblo Tradicional de Chacas', 'Paisaje', 'Chacas - Asunción', '1 día', 'Fácil', 18, 12, 45.00, 'Disponible', '/images/rutas/ruta_pueblo-chacas.webp', '/images/rutas/thumbnails/thumb_pueblo-chacas.webp', 'Pueblo joya declarado Monumento Histórico, reconocido por sus balcones de madera tallados por los artesanos de la Operación Mato Grosso.'),
(47, 'Laguna Purhuay', 'Laguna', 'Huari - Conchucos', '1 día', 'Fácil', 20, 14, 35.00, 'Disponible', '/images/rutas/ruta_laguna-purhuay.webp', '/images/rutas/thumbnails/thumb_laguna-purhuay.webp', 'Inmensa laguna rodeada de densos bosques de aliso, eucalipto y queñual. Paseos en bote tradicional, senderos interpretativos y pesca de trucha.'),
(48, 'Laguna Jahuacocha (Huayhuash)', 'Laguna', 'Cordillera Huayhuash', '3 días', 'Moderado', 14, 8, 190.00, 'Disponible', '/images/rutas/ruta_laguna-jahuacocha.webp', '/images/rutas/thumbnails/thumb_laguna-jahuacocha.webp', 'La joya fotográfica de la Cordillera Huayhuash. Sus aguas tranquilas reflejan en un espejo perfecto los glaciares del Yerupajá, Rondoy y Jirishanca.'),
(49, 'Laguna Carhuacocha (Amanecer Andino)', 'Laguna', 'Queropalca - Huayhuash', '3 días', 'Moderado', 12, 7, 210.00, 'Disponible', '/images/rutas/ruta_laguna-carhuacocha.webp', '/images/rutas/thumbnails/thumb_laguna-carhuacocha.webp', 'Lugar donde se contemplan los tres gigantes de Huayhuash: Yerupajá, Siula y Carnicero, tiñéndose de dorado y púrpura en el amanecer andino.'),
(50, 'Trek Olleros - Chavín (Camino Preinca)', 'Caminata', 'Olleros - Chavín', '3 días', 'Moderado', 14, 9, 160.00, 'Disponible', '/images/rutas/ruta_trek-olleros-chavin.webp', '/images/rutas/thumbnails/thumb_trek-olleros-chavin.webp', 'Ruta de peregrinación milenaria utilizada por los antiguos sacerdotes Chavín. Acompañada de llamas de carga cruzando el paso Yanashallash (4,700 m).'),
(51, 'Cueva de Guitarrero', 'Paisaje', 'Shupluy - Yungay', 'Medio día', 'Fácil', 20, 15, 18.00, 'Disponible', '/images/rutas/ruta_cueva-guitarrero.webp', '/images/rutas/thumbnails/thumb_cueva-guitarrero.webp', 'Cuna de la agricultura americana descubierta por Thomas Lynch. Vestigios arqueológicos de domesticación de frijol y ají de hace más de 10,000 años.'),
(52, 'Cataratas de Bruja Armanan', 'Caminata', 'Recuay', 'Medio día', 'Moderado', 16, 10, 20.00, 'Disponible', '/images/rutas/ruta_cataratas-bruja-armanan.webp', '/images/rutas/thumbnails/thumb_cataratas-bruja-armanan.webp', 'Caídas de agua místicas en la cuenca alta de Recuay, donde las leyendas locales narran rituales ancestrales andinos entre bromelias silvestres.'),
(53, 'Nevado Caullaraju (Glaciar Sur)', 'Montaña', 'Cátac - Recuay', '2 días', 'Difícil', 8, 4, 260.00, 'Disponible', '/images/rutas/ruta_nevado-caullaraju.webp', '/images/rutas/thumbnails/thumb_nevado-caullaraju.webp', 'Macizo glaciar ubicado en el extremo sur de la Cordillera Blanca. Morrenas prístinas, lagunas turquesa y avistamiento garantizado de vicuñas silvestres.'),
(54, 'Santuario de Puyas Raimondi en Quebrada Carpa', 'Paisaje', 'Cátac - Parque Huascarán', '1 día', 'Fácil', 25, 18, 25.00, 'Disponible', '/images/rutas/ruta_puyas-raimondi-carpa.webp', '/images/rutas/thumbnails/thumb_puyas-raimondi-carpa.webp', 'El mayor bosque de la inflorescencia más grande del reino vegetal. Plantas titánicas de hasta 12 metros de altura que viven hasta 100 años.'),
(55, 'Laguna Llaca y Centro Glaciológico', 'Laguna', 'Huaraz - Quebrada Llaca', '1 día', 'Moderado', 16, 11, 30.00, 'Disponible', '/images/rutas/ruta_laguna-llaca.webp', '/images/rutas/thumbnails/thumb_laguna-llaca.webp', 'Laguna de color verde jade situada directamente debajo de las paredes glaciares de los nevados Ranrapalca y Vallunaraju. Visita al refugio glaciológico.'),
(56, 'Quebrada Ulta y Mirador Huascarán Sur', 'Paisaje', 'Carhuaz', '1 día', 'Fácil', 20, 14, 32.00, 'Disponible', '/images/rutas/ruta_quebrada-ulta.webp', '/images/rutas/thumbnails/thumb_quebrada-ulta.webp', 'Majestuoso valle de origen glaciar donde caen decenas de cascadas desde las cumbres del Nevado Contrahierbas y la pared sur del Huascarán.')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), categoria=VALUES(categoria), ubicacion=VALUES(ubicacion), duracion=VALUES(duracion), dificultad=VALUES(dificultad), precio=VALUES(precio), imagen=VALUES(imagen), imagen_thumbnail=VALUES(imagen_thumbnail), descripcion=VALUES(descripcion);

-- Semilla de Clientes
INSERT INTO clientes (id, nombre, dni, telefono, correo, reservas_count) VALUES
('C-001', 'María López', '12345678', '987 654 321', 'maria.lopez@email.com', 3),
('C-002', 'Carlos Ramos', '87654321', '912 345 678', 'carlos.ramos@email.com', 2),
('C-003', 'Ana Torres', '45678912', '998 712 345', 'ana.torres@email.com', 1),
('C-004', 'Luis Fernández', '34567890', '955 432 109', 'luis.fernandez@email.com', 4),
('C-005', 'Sofía Castillo', '23456789', '944 321 098', 'sofia.castillo@email.com', 1),
('C-006', 'Jorge Pérez', '67890123', '933 210 987', 'jorge.perez@email.com', 2)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Semilla de Reservas
INSERT INTO reservas (id, cliente, dni, telefono, correo, ruta_id, ruta_nombre, fecha, personas, precio_unitario, total, estado, fecha_registro, observaciones) VALUES
('R-001', 'María López', '12345678', '987 654 321', 'maria.lopez@email.com', 1, 'Laguna 69', '15/06/2025', 2, 20.00, 40.00, 'Confirmada', '10/06/2025 14:32', 'Requiere bastones de trekking'),
('R-002', 'Carlos Ramos', '87654321', '912 345 678', 'carlos.ramos@email.com', 2, 'Chavín de Huántar', '17/06/2025', 4, 15.00, 60.00, 'Confirmada', '11/06/2025 09:15', 'Familia con menores'),
('R-003', 'Ana Torres', '45678912', '998 712 345', 'ana.torres@email.com', 3, 'Nevado Pastoruri', '20/06/2025', 3, 12.00, 36.00, 'Pendiente', '12/06/2025 16:40', 'Recojo en plaza de armas'),
('R-004', 'Luis Fernández', '34567890', '955 432 109', 'luis.fernandez@email.com', 4, 'Cerro Hualcán', '22/06/2025', 2, 10.00, 20.00, 'Confirmada', '13/06/2025 11:20', 'Aclimatado'),
('R-005', 'Sofía Castillo', '23456789', '944 321 098', 'sofia.castillo@email.com', 5, 'Laguna Llanganuco', '25/06/2025', 5, 18.00, 90.00, 'Cancelada', '14/06/2025 18:05', 'Reprogramación solicitada'),
('R-006', 'Jorge Pérez', '67890123', '933 210 987', 'jorge.perez@email.com', 1, 'Laguna 69', '28/06/2025', 3, 20.00, 60.00, 'Confirmada', '15/06/2025 10:50', 'Almuerzo campestre')
ON DUPLICATE KEY UPDATE cliente=VALUES(cliente);
