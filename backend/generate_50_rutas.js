const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pool = require('./src/db/database');

const RUTAS_50 = [
  {
    nombre: 'Laguna Churup',
    categoria: 'Laguna',
    ubicacion: 'Huaraz - Pitec',
    duracion: '1 día',
    dificultad: 'Moderado',
    cupo_total: 18,
    cupos_disponibles: 11,
    precio: 25.00,
    estado: 'Disponible',
    descripcion: 'Aguas cristalinas de tonos esmeralda al pie del nevado Churup (5,493 m s. n. m.). Incluye tramos de cuerdas fijas en roca y vistas panorámicas de la Cordillera Blanca.',
    altitud: '4,450 m',
    slug: 'laguna-churup'
  },
  {
    nombre: 'Laguna Parón',
    categoria: 'Laguna',
    ubicacion: 'Caraz - Huaylas',
    duracion: '1 día',
    dificultad: 'Fácil',
    cupo_total: 25,
    cupos_disponibles: 16,
    precio: 35.00,
    estado: 'Disponible',
    descripcion: 'La masa de agua dulce más grande del Parque Nacional Huascarán. Rodeada por la Pirámide de Garcilaso, Chacraraju y Artesonraju (el pico de Paramount Pictures).',
    altitud: '4,185 m',
    slug: 'laguna-paron'
  },
  {
    nombre: 'Nevado Mateo (Cumbre 5,150 m)',
    categoria: 'Aventura',
    ubicacion: 'Carhuaz - Punta Olímpica',
    duracion: '1 día',
    dificultad: 'Difícil',
    cupo_total: 8,
    cupos_disponibles: 4,
    precio: 150.00,
    estado: 'Disponible',
    descripcion: 'Ascensión glaciar técnica de iniciación en alta montaña. Incluye uso de grampones, piolet y cuerda guiada por instructores UIAGM hasta la cumbre.',
    altitud: '5,150 m',
    slug: 'nevado-mateo'
  },
  {
    nombre: 'Trek Santa Cruz Clásico',
    categoria: 'Caminata',
    ubicacion: 'Cashapampa - Vaquería',
    duracion: '4 días',
    dificultad: 'Difícil',
    cupo_total: 12,
    cupos_disponibles: 7,
    precio: 280.00,
    estado: 'Disponible',
    descripcion: 'Clasificado por National Geographic entre los 10 mejores circuitos de trekking del planeta. Cruza el mítico Paso Punta Unión a 4,750 m s. n. m. con campamentos bajo cielos estrellados.',
    altitud: '4,750 m',
    slug: 'trek-santa-cruz'
  },
  {
    nombre: 'Laguna Wilcacocha',
    categoria: 'Laguna',
    ubicacion: 'Cordillera Negra - Huaraz',
    duracion: 'Medio día',
    dificultad: 'Fácil',
    cupo_total: 20,
    cupos_disponibles: 14,
    precio: 15.00,
    estado: 'Disponible',
    descripcion: 'Excelente ruta de aclimatación en la Cordillera Negra. Espejo de agua habitado por patos silvestres y mirador natural frontal a toda la cadena de nevados de la Cordillera Blanca.',
    altitud: '3,725 m',
    slug: 'laguna-wilcacocha'
  },
  {
    nombre: 'Laguna Radian',
    categoria: 'Laguna',
    ubicacion: 'Independencia - Huaraz',
    duracion: 'Medio día',
    dificultad: 'Fácil',
    cupo_total: 15,
    cupos_disponibles: 9,
    precio: 20.00,
    estado: 'Disponible',
    descripcion: 'Hermosa laguna rodeada de pastizales y bosques nativos de queñuales. Paisaje bucólico con vista directa a los nevados Huascarán, Chopicalqui y Copa.',
    altitud: '3,890 m',
    slug: 'laguna-radian'
  },
  {
    nombre: 'Lagunas Mullaca y Carhuac',
    categoria: 'Laguna',
    ubicacion: 'Carhuaz',
    duracion: '1 día',
    dificultad: 'Moderado',
    cupo_total: 14,
    cupos_disponibles: 8,
    precio: 40.00,
    estado: 'Disponible',
    descripcion: 'Doble circuito glaciar poco concurrido. La Laguna Mullaca destaca por sus tonalidades rojas y el glaciar colgante del Nevado Hualcán.',
    altitud: '4,590 m',
    slug: 'lagunas-mullaca-carhuac'
  },
  {
    nombre: 'Laguna Ahuac',
    categoria: 'Laguna',
    ubicacion: 'Huaraz - Wilcahuain',
    duracion: '1 día',
    dificultad: 'Moderado',
    cupo_total: 16,
    cupos_disponibles: 10,
    precio: 25.00,
    estado: 'Disponible',
    descripcion: 'Sendero ancestral que parte cerca del templo arqueológico de Wilcahuain. Laguna encajonada en anfiteatro rocoso con vistas panorámicas sobre todo el Callejón de Huaylas.',
    altitud: '4,560 m',
    slug: 'laguna-ahuac'
  },
  {
    nombre: 'Laguna Rajucolta',
    categoria: 'Laguna',
    ubicacion: 'Macashca - Huaraz',
    duracion: '1 día',
    dificultad: 'Moderado',
    cupo_total: 15,
    cupos_disponibles: 9,
    precio: 30.00,
    estado: 'Disponible',
    descripcion: 'Ubicada al final de una quebrada virgen, reposa directamente bajo la inmensa muralla de hielo y roca del Nevado Huantsán (6,395 m), el rey de la Cordillera Blanca.',
    altitud: '4,270 m',
    slug: 'laguna-rajucolta'
  },
  {
    nombre: 'Laguna Shallap',
    categoria: 'Laguna',
    ubicacion: 'Olleros - Huaraz',
    duracion: '1 día',
    dificultad: 'Moderado',
    cupo_total: 16,
    cupos_disponibles: 11,
    precio: 35.00,
    estado: 'Disponible',
    descripcion: 'Famosa por su color verde esmeralda brillante lechoso, producto de los minerales en suspensión de los glaciares San Juan y Huantsán.',
    altitud: '4,250 m',
    slug: 'laguna-shallap'
  },
  {
    nombre: 'Laguna Querococha',
    categoria: 'Laguna',
    ubicacion: 'Recuay - Cátac',
    duracion: '1 día',
    dificultad: 'Fácil',
    cupo_total: 25,
    cupos_disponibles: 18,
    precio: 20.00,
    estado: 'Disponible',
    descripcion: 'Pintoresco lago andino en la ruta hacia el Monumento Arqueológico Chavín. En su ladera montañosa se aprecia una silueta geológica natural idéntica al mapa del Perú.',
    altitud: '3,980 m',
    slug: 'laguna-querococha'
  },
  {
    nombre: 'Laguna Palcacocha',
    categoria: 'Laguna',
    ubicacion: 'Quebrada Cojup - Huaraz',
    duracion: '1 día',
    dificultad: 'Moderado',
    cupo_total: 12,
    cupos_disponibles: 6,
    precio: 45.00,
    estado: 'Disponible',
    descripcion: 'Impresionante laguna origen de la cuenca hídrica del Quillcay. Enmarcada por los nevados Palcaraju y Pucaranra, con morrenas glaciares imponentes.',
    altitud: '4,566 m',
    slug: 'laguna-palcacocha'
  },
  {
    nombre: 'Laguna Uruscocha',
    categoria: 'Laguna',
    ubicacion: 'Tarica - Huaraz',
    duracion: '1 día',
    dificultad: 'Difícil',
    cupo_total: 10,
    cupos_disponibles: 5,
    precio: 40.00,
    estado: 'Disponible',
    descripcion: 'Ruta agreste de alta montaña que asciende por la Quebrada Akillpo. Paisajes solitarios de tundra andina con vistas a los contrafuertes del Urus e Ishinca.',
    altitud: '4,360 m',
    slug: 'laguna-uruscocha'
  },
  {
    nombre: 'Laguna Rocotuyoc y Laguna Congelada',
    categoria: 'Laguna',
    ubicacion: 'Marcará - Carhuaz',
    duracion: '1 día',
    dificultad: 'Moderado',
    cupo_total: 18,
    cupos_disponibles: 12,
    precio: 40.00,
    estado: 'Disponible',
    descripcion: 'Laguna con témpanos de hielo desprendidos de los glaciares del Nevado Paccharaju. Incluye visita a pinturas rupestres precolombinas en el trayecto.',
    altitud: '4,550 m',
    slug: 'laguna-rocotuyoc'
  },
  {
    nombre: 'Laguna Cullicocha',
    categoria: 'Laguna',
    ubicacion: 'Santa Cruz - Caraz',
    duracion: '2 días',
    dificultad: 'Difícil',
    cupo_total: 12,
    cupos_disponibles: 6,
    precio: 90.00,
    estado: 'Disponible',
    descripcion: 'Una de las postales más sobrecogedoras del Perú. Sus aguas de color zafiro contrastan con la pared de hielo vertical del Nevado Santa Cruz (6,259 m).',
    altitud: '4,620 m',
    slug: 'laguna-cullicocha'
  },
  {
    nombre: 'Laguna Jancacocha',
    categoria: 'Laguna',
    ubicacion: 'Pomabamba - Conchucos',
    duracion: '2 días',
    dificultad: 'Moderado',
    cupo_total: 12,
    cupos_disponibles: 8,
    precio: 75.00,
    estado: 'Disponible',
    descripcion: 'Santuario lacustre de aguas verde azuladas ubicado en la vertiente oriental de la Cordillera Blanca, rodeado de bosques vírgenes de alisos y queñual.',
    altitud: '4,280 m',
    slug: 'laguna-jancacocha'
  },
  {
    nombre: 'Lagunas de Safuna y Alpamayo',
    categoria: 'Laguna',
    ubicacion: 'Alpamayo Norte',
    duracion: '2 días',
    dificultad: 'Difícil',
    cupo_total: 10,
    cupos_disponibles: 5,
    precio: 85.00,
    estado: 'Disponible',
    descripcion: 'Lagunas gemelas situadas al pie de la pared norte del Nevado Alpamayo y Pucajirca. Un escenario de hielo puro y soledad alpina absoluta.',
    altitud: '4,350 m',
    slug: 'lagunas-safuna'
  },
  {
    nombre: 'Circuito Huayhuash Completo',
    categoria: 'Caminata',
    ubicacion: 'Chiquián - Bolognesi',
    duracion: '10 días',
    dificultad: 'Difícil',
    cupo_total: 10,
    cupos_disponibles: 5,
    precio: 650.00,
    estado: 'Disponible',
    descripcion: 'El trekking más renombrado de Sudamérica. Rodea el macizo del Yerupajá y Siula Grande (Touching the Void), cruzando pasos a más de 5,000 m s. n. m. todos los días.',
    altitud: '5,020 m',
    slug: 'circuito-huayhuash'
  },
  {
    nombre: 'Trek Cedros - Alpamayo',
    categoria: 'Caminata',
    ubicacion: 'Hualcayán - Santa Cruz',
    duracion: '8 días',
    dificultad: 'Difícil',
    cupo_total: 10,
    cupos_disponibles: 6,
    precio: 520.00,
    estado: 'Disponible',
    descripcion: 'Expedición de travesía que circunnavega el Nevado Alpamayo, observando su famosa pirámide perfecta de hielo desde diversos ángulos y pasos desolados.',
    altitud: '4,850 m',
    slug: 'trek-cedros-alpamayo'
  },
  {
    nombre: 'Quebrada Ishinca y Refugio Base',
    categoria: 'Montaña',
    ubicacion: 'Pashpa - Tarica',
    duracion: '2 días',
    dificultad: 'Moderado',
    cupo_total: 15,
    cupos_disponibles: 9,
    precio: 110.00,
    estado: 'Disponible',
    descripcion: 'Campamento base y refugio alpino rodeado por los nevados Tocllaraju (6,032 m), Urus (5,420 m) e Ishinca (5,530 m). El centro neurálgico del montañismo en Áncash.',
    altitud: '4,350 m',
    slug: 'quebrada-ishinca'
  },
  {
    nombre: 'Quebrada Quilcayhuanca y Cayesh',
    categoria: 'Caminata',
    ubicacion: 'Huaraz',
    duracion: '1 día',
    dificultad: 'Moderado',
    cupo_total: 16,
    cupos_disponibles: 10,
    precio: 35.00,
    estado: 'Disponible',
    descripcion: 'Valle glaciar llano de pastoreo tradicional y restos arqueológicos preincas. Vista a la impresionante aguja de granito del Nevado Cayesh.',
    altitud: '3,950 m',
    slug: 'quebrada-quilcayhuanca'
  },
  {
    nombre: 'Quebrada Honda y Paso Portachuelo',
    categoria: 'Aventura',
    ubicacion: 'Marcará - Chacas',
    duracion: '2 días',
    dificultad: 'Difícil',
    cupo_total: 12,
    cupos_disponibles: 6,
    precio: 130.00,
    estado: 'Disponible',
    descripcion: 'Antigua ruta de arrieros andinos que conecta el Callejón de Huaylas con la zona de los Conchucos. Cruce de collados glaciares con alta biodiversidad.',
    altitud: '4,750 m',
    slug: 'quebrada-honda'
  },
  {
    nombre: 'Quebrada Rurec - Paredes de Granito',
    categoria: 'Aventura',
    ubicacion: 'Olleros',
    duracion: '3 días',
    dificultad: 'Difícil',
    cupo_total: 8,
    cupos_disponibles: 4,
    precio: 220.00,
    estado: 'Disponible',
    descripcion: 'Paraíso mundial de la escalada en granito (Big Wall). Formaciones verticales de roca pura de más de 800 metros de altura en un valle sereno y poco explorado.',
    altitud: '4,200 m',
    slug: 'quebrada-rurec'
  },
  {
    nombre: 'Nevado Vallunaraju (Cumbre 5,686 m)',
    categoria: 'Montaña',
    ubicacion: 'Huaraz - Quebrada Llaca',
    duracion: '2 días',
    dificultad: 'Difícil',
    cupo_total: 6,
    cupos_disponibles: 3,
    precio: 320.00,
    estado: 'Disponible',
    descripcion: 'Ascenso guiado de alta montaña al coloso bicéfalo que domina la ciudad de Huaraz. Requiere marcha sobre glaciar, aristas de nieve y técnica de aseguramiento.',
    altitud: '5,686 m',
    slug: 'nevado-vallunaraju'
  },
  {
    nombre: 'Nevado Huascarán (Mirador y Campo Morrena)',
    categoria: 'Montaña',
    ubicacion: 'Musho - Yungay',
    duracion: '3 días',
    dificultad: 'Difícil',
    cupo_total: 8,
    cupos_disponibles: 4,
    precio: 380.00,
    estado: 'Disponible',
    descripcion: 'Aproximación a las faldas del techo del Perú (6,768 m s. n. m.). Noches de campamento en el refugio Don Bosco y contemplación de grietas y avalanchas seguras.',
    altitud: '4,900 m',
    slug: 'nevado-huascaran'
  },
  {
    nombre: 'Nevado Alpamayo - Mirador Cruz Pampa',
    categoria: 'Montaña',
    ubicacion: 'Caraz - Santa Cruz',
    duracion: '3 días',
    dificultad: 'Difícil',
    cupo_total: 10,
    cupos_disponibles: 5,
    precio: 250.00,
    estado: 'Disponible',
    descripcion: 'Trekking hasta el campamento base del Alpamayo para presenciar el amanecer sobre las estrías de hielo de la montaña más hermosa del planeta.',
    altitud: '4,300 m',
    slug: 'alpamayo-cruz-pampa'
  },
  {
    nombre: 'Nevado Pisco (Cumbre 5,752 m)',
    categoria: 'Montaña',
    ubicacion: 'Yungay - Llanganuco',
    duracion: '3 días',
    dificultad: 'Difícil',
    cupo_total: 8,
    cupos_disponibles: 4,
    precio: 360.00,
    estado: 'Disponible',
    descripcion: 'La ascensión clásica de los Andes. Ofrece la vista panorámica más completa de la Cordillera Blanca: Huascarán, Chopicalqui, Huandoy, Chacraraju y Artesonraju.',
    altitud: '5,752 m',
    slug: 'nevado-pisco'
  },
  {
    nombre: 'Nevado Yanapaccha (Cumbre 5,460 m)',
    categoria: 'Montaña',
    ubicacion: 'Yungay - Portachuelo',
    duracion: '2 días',
    dificultad: 'Difícil',
    cupo_total: 6,
    cupos_disponibles: 3,
    precio: 340.00,
    estado: 'Disponible',
    descripcion: 'Cumbre alpina con pendientes de nieve de hasta 55 grados. Vistas aéreas únicas a las lagunas de Llanganuco y toda la quebrada de Cebollapampa.',
    altitud: '5,460 m',
    slug: 'nevado-yanapaccha'
  },
  {
    nombre: 'Nevado Urus Este (Cumbre 5,420 m)',
    categoria: 'Montaña',
    ubicacion: 'Tarica - Ishinca',
    duracion: '2 días',
    dificultad: 'Difícil',
    cupo_total: 8,
    cupos_disponibles: 4,
    precio: 310.00,
    estado: 'Disponible',
    descripcion: 'Ascensión combinada en arista rocosa y pendientes de nieve firme en la Quebrada Ishinca. Recomendado como preparación antes de picos mayores de 6,000 metros.',
    altitud: '5,420 m',
    slug: 'nevado-urus'
  },
  {
    nombre: 'Punta Olímpica y Túnel Trasandino',
    categoria: 'Paisaje',
    ubicacion: 'Carhuaz - Chacas',
    duracion: '1 día',
    dificultad: 'Fácil',
    cupo_total: 20,
    cupos_disponibles: 15,
    precio: 30.00,
    estado: 'Disponible',
    descripcion: 'Cruce del túnel vehicular a mayor altitud del mundo (4,736 m s. n. m.). Descenso hacia el místico callejón de Conchucos con murallas de hielo al costado de la carretera.',
    altitud: '4,736 m',
    slug: 'punta-olimpica'
  },
  {
    nombre: 'Bosque de Piedras de Hatun Machay',
    categoria: 'Aventura',
    ubicacion: 'Pampas Chico - Recuay',
    duracion: '1 día',
    dificultad: 'Moderado',
    cupo_total: 18,
    cupos_disponibles: 12,
    precio: 35.00,
    estado: 'Disponible',
    descripcion: 'El bosque de rocas más extenso de la Cordillera Negra. Laberinto milenario de figuras geológicas, pinturas rupestres precerámicas y cientos de vías de escalada deportiva.',
    altitud: '4,290 m',
    slug: 'hatun-machay'
  },
  {
    nombre: 'Aguas Termales de Chancos',
    categoria: 'Paisaje',
    ubicacion: 'Marcará - Carhuaz',
    duracion: 'Medio día',
    dificultad: 'Fácil',
    cupo_total: 25,
    cupos_disponibles: 19,
    precio: 18.00,
    estado: 'Disponible',
    descripcion: 'Famosas termas subterráneas con cuevas naturales de sauna de vapor mineral, recomendadas para el relax muscular y el alivio respiratorio tras largas caminatas.',
    altitud: '2,950 m',
    slug: 'termas-chancos'
  },
  {
    nombre: 'Aguas Termales de Monterrey',
    categoria: 'Paisaje',
    ubicacion: 'Huaraz Norte',
    duracion: 'Medio día',
    dificultad: 'Fácil',
    cupo_total: 30,
    cupos_disponibles: 22,
    precio: 12.00,
    estado: 'Disponible',
    descripcion: 'Balneario termal tradicional a solo 7 km de la Plaza de Armas de Huaraz. Pozas individuales y piscina temperada con aguas ferruginosas curativas.',
    altitud: '3,080 m',
    slug: 'termas-monterrey'
  },
  {
    nombre: 'Restos Arqueológicos de Wilcahuain',
    categoria: 'Paisaje',
    ubicacion: 'Independencia - Huaraz',
    duracion: 'Medio día',
    dificultad: 'Fácil',
    cupo_total: 25,
    cupos_disponibles: 18,
    precio: 15.00,
    estado: 'Disponible',
    descripcion: 'Monumento funerario de la cultura Wari (siglos VII al X). Construcción de tres niveles de piedra labrada con sistema antisísmico y techos intactos.',
    altitud: '3,180 m',
    slug: 'wilcahuain'
  },
  {
    nombre: 'Cañón del Pato y sus 35 Túneles',
    categoria: 'Aventura',
    ubicacion: 'Caraz - Huallanca',
    duracion: '1 día',
    dificultad: 'Fácil',
    cupo_total: 20,
    cupos_disponibles: 14,
    precio: 28.00,
    estado: 'Disponible',
    descripcion: 'Garganta natural donde la Cordillera Blanca y la Cordillera Negra casi se tocan separadas apenas por unos metros, tallada por la furia del río Santa.',
    altitud: '1,800 m',
    slug: 'canon-del-pato'
  },
  {
    nombre: 'Complejo Arqueológico Honcopampa',
    categoria: 'Paisaje',
    ubicacion: 'San Miguel de Aco - Carhuaz',
    duracion: '1 día',
    dificultad: 'Fácil',
    cupo_total: 20,
    cupos_disponibles: 15,
    precio: 22.00,
    estado: 'Disponible',
    descripcion: 'Gran ciudadela preinca con chullpas monumentales de dos plantas y cataratas mágicas escondidas en un bosque nativo de queñuales.',
    altitud: '3,500 m',
    slug: 'honcopampa'
  },
  {
    nombre: 'Catarata Yuracyacu',
    categoria: 'Caminata',
    ubicacion: 'Caraz',
    duracion: 'Medio día',
    dificultad: 'Fácil',
    cupo_total: 18,
    cupos_disponibles: 13,
    precio: 16.00,
    estado: 'Disponible',
    descripcion: 'Hermosa caída de agua cristalina proveniente de los deshielos de la Quebrada Santa Cruz, rodeada de densa vegetación y campos de cultivo tradicionales.',
    altitud: '2,650 m',
    slug: 'catarata-yuracyacu'
  },
  {
    nombre: 'Mirador de Rataquenua y Cruz de Huaraz',
    categoria: 'Paisaje',
    ubicacion: 'Huaraz Sur',
    duracion: 'Medio día',
    dificultad: 'Fácil',
    cupo_total: 25,
    cupos_disponibles: 20,
    precio: 10.00,
    estado: 'Disponible',
    descripcion: 'Mirador natural sobre el acantilado rocoso al sureste de Huaraz. Ofrece una vista panorámica de 180° de la ciudad y el majestuoso Nevado Huascarán.',
    altitud: '3,250 m',
    slug: 'mirador-rataquenua'
  },
  {
    nombre: 'Santuario del Señor de la Soledad',
    categoria: 'Paisaje',
    ubicacion: 'Huaraz Centro',
    duracion: 'Medio día',
    dificultad: 'Fácil',
    cupo_total: 30,
    cupos_disponibles: 25,
    precio: 10.00,
    estado: 'Disponible',
    descripcion: 'Templo católico construido tras el terremoto de 1970 que alberga la venerada imagen del patrono de Huaraz, adornado con frescos murales andinos de los Cayo.',
    altitud: '3,052 m',
    slug: 'senor-de-la-soledad'
  },
  {
    nombre: 'Pueblo Tradicional de Chacas',
    categoria: 'Paisaje',
    ubicacion: 'Chacas - Asunción',
    duracion: '1 día',
    dificultad: 'Fácil',
    cupo_total: 18,
    cupos_disponibles: 12,
    precio: 45.00,
    estado: 'Disponible',
    descripcion: 'Pueblo joya declarado Monumento Histórico, reconocido por sus balcones de madera tallados por los artesanos de la Operación Mato Grosso.',
    altitud: '3,360 m',
    slug: 'pueblo-chacas'
  },
  {
    nombre: 'Laguna Purhuay',
    categoria: 'Laguna',
    ubicacion: 'Huari - Conchucos',
    duracion: '1 día',
    dificultad: 'Fácil',
    cupo_total: 20,
    cupos_disponibles: 14,
    precio: 35.00,
    estado: 'Disponible',
    descripcion: 'Inmensa laguna rodeada de densos bosques de aliso, eucalipto y queñual. Paseos en bote tradicional, senderos interpretativos y pesca de trucha.',
    altitud: '3,580 m',
    slug: 'laguna-purhuay'
  },
  {
    nombre: 'Laguna Jahuacocha (Huayhuash)',
    categoria: 'Laguna',
    ubicacion: 'Cordillera Huayhuash',
    duracion: '3 días',
    dificultad: 'Moderado',
    cupo_total: 14,
    cupos_disponibles: 8,
    precio: 190.00,
    estado: 'Disponible',
    descripcion: 'La joya fotográfica de la Cordillera Huayhuash. Sus aguas tranquilas reflejan en un espejo perfecto los glaciares del Yerupajá, Rondoy y Jirishanca.',
    altitud: '4,070 m',
    slug: 'laguna-jahuacocha'
  },
  {
    nombre: 'Laguna Carhuacocha (Amanecer Andino)',
    categoria: 'Laguna',
    ubicacion: 'Queropalca - Huayhuash',
    duracion: '3 días',
    dificultad: 'Moderado',
    cupo_total: 12,
    cupos_disponibles: 7,
    precio: 210.00,
    estado: 'Disponible',
    descripcion: 'Lugar donde se contemplan los tres gigantes de Huayhuash: Yerupajá, Siula y Carnicero, tiñéndose de dorado y púrpura en el amanecer andino.',
    altitud: '4,138 m',
    slug: 'laguna-carhuacocha'
  },
  {
    nombre: 'Trek Olleros - Chavín (Camino Preinca)',
    categoria: 'Caminata',
    ubicacion: 'Olleros - Chavín',
    duracion: '3 días',
    dificultad: 'Moderado',
    cupo_total: 14,
    cupos_disponibles: 9,
    precio: 160.00,
    estado: 'Disponible',
    descripcion: 'Ruta de peregrinación milenaria utilizada por los antiguos sacerdotes Chavín. Acompañada de llamas de carga cruzando el paso Yanashallash (4,700 m).',
    altitud: '4,700 m',
    slug: 'trek-olleros-chavin'
  },
  {
    nombre: 'Cueva de Guitarrero',
    categoria: 'Paisaje',
    ubicacion: 'Shupluy - Yungay',
    duracion: 'Medio día',
    dificultad: 'Fácil',
    cupo_total: 20,
    cupos_disponibles: 15,
    precio: 18.00,
    estado: 'Disponible',
    descripcion: 'Cuna de la agricultura americana descubierta por Thomas Lynch. Vestigios arqueológicos de domesticación de frijol y ají de hace más de 10,000 años.',
    altitud: '2,580 m',
    slug: 'cueva-guitarrero'
  },
  {
    nombre: 'Cataratas de Bruja Armanan',
    categoria: 'Caminata',
    ubicacion: 'Recuay',
    duracion: 'Medio día',
    dificultad: 'Moderado',
    cupo_total: 16,
    cupos_disponibles: 10,
    precio: 20.00,
    estado: 'Disponible',
    descripcion: 'Caídas de agua místicas en la cuenca alta de Recuay, donde las leyendas locales narran rituales ancestrales andinos entre bromelias silvestres.',
    altitud: '3,450 m',
    slug: 'cataratas-bruja-armanan'
  },
  {
    nombre: 'Nevado Caullaraju (Glaciar Sur)',
    categoria: 'Montaña',
    ubicacion: 'Cátac - Recuay',
    duracion: '2 días',
    dificultad: 'Difícil',
    cupo_total: 8,
    cupos_disponibles: 4,
    precio: 260.00,
    estado: 'Disponible',
    descripcion: 'Macizo glaciar ubicado en el extremo sur de la Cordillera Blanca. Morrenas prístinas, lagunas turquesa y avistamiento garantizado de vicuñas silvestres.',
    altitud: '5,603 m',
    slug: 'nevado-caullaraju'
  },
  {
    nombre: 'Santuario de Puyas Raimondi en Quebrada Carpa',
    categoria: 'Paisaje',
    ubicacion: 'Cátac - Parque Huascarán',
    duracion: '1 día',
    dificultad: 'Fácil',
    cupo_total: 25,
    cupos_disponibles: 18,
    precio: 25.00,
    estado: 'Disponible',
    descripcion: 'El mayor bosque de la inflorescencia más grande del reino vegetal. Plantas titánicas de hasta 12 metros de altura que viven hasta 100 años.',
    altitud: '4,100 m',
    slug: 'puyas-raimondi-carpa'
  },
  {
    nombre: 'Laguna Llaca y Centro Glaciológico',
    categoria: 'Laguna',
    ubicacion: 'Huaraz - Quebrada Llaca',
    duracion: '1 día',
    dificultad: 'Moderado',
    cupo_total: 16,
    cupos_disponibles: 11,
    precio: 30.00,
    estado: 'Disponible',
    descripcion: 'Laguna de color verde jade situada directamente debajo de las paredes glaciares de los nevados Ranrapalca y Vallunaraju. Visita al refugio glaciológico.',
    altitud: '4,474 m',
    slug: 'laguna-llaca'
  },
  {
    nombre: 'Quebrada Ulta y Mirador Huascarán Sur',
    categoria: 'Paisaje',
    ubicacion: 'Carhuaz',
    duracion: '1 día',
    dificultad: 'Fácil',
    cupo_total: 20,
    cupos_disponibles: 14,
    precio: 32.00,
    estado: 'Disponible',
    descripcion: 'Majestuoso valle de origen glaciar donde caen decenas de cascadas desde las cumbres del Nevado Contrahierbas y la pared sur del Huascarán.',
    altitud: '4,050 m',
    slug: 'quebrada-ulta'
  }
];

// Colores temáticos por categoría
const CATEGORY_STYLES = {
  Laguna: {
    gradTop: '#0284c7',
    gradBottom: '#075985',
    accent: '#38bdf8',
    waterColor: '#0ea5e9',
    badgeBg: '#0284c7',
    iconText: '💧 LAGUNA GLACIAR'
  },
  Montaña: {
    gradTop: '#0f766e',
    gradBottom: '#134e4a',
    accent: '#34d399',
    waterColor: '#059669',
    badgeBg: '#059669',
    iconText: '🏔️ ALTA MONTAÑA'
  },
  Caminata: {
    gradTop: '#6d28d9',
    gradBottom: '#4c1d95',
    accent: '#c084fc',
    waterColor: '#7c3aed',
    badgeBg: '#7c3aed',
    iconText: '🥾 TREKKING &amp; RUTA'
  },
  Aventura: {
    gradTop: '#b91c1c',
    gradBottom: '#7f1d1d',
    accent: '#f87171',
    waterColor: '#dc2626',
    badgeBg: '#dc2626',
    iconText: '🧗 AVENTURA EXTREMA'
  },
  Paisaje: {
    gradTop: '#0369a1',
    gradBottom: '#1e3a8a',
    accent: '#38bdf8',
    waterColor: '#2563eb',
    badgeBg: '#0284c7',
    iconText: '🌄 PAISAJE ANDINO'
  }
};

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Genera una imagen WebP de alta calidad para la ruta usando Sharp
 */
async function generateRouteImage(ruta, outMainPath, outThumbPath) {
  const style = CATEGORY_STYLES[ruta.categoria] || CATEGORY_STYLES.Laguna;
  const safeName = escapeXml(ruta.nombre);
  const safeLoc = escapeXml(ruta.ubicacion);
  const safeAlt = escapeXml(ruta.altitud);
  const safeDur = escapeXml(ruta.duracion);
  const safeDif = escapeXml(ruta.dificultad);

  // SVG Banner de 800x500 con diseño alpino profesional
  const svgBanner = `
  <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0a192f"/>
        <stop offset="40%" stop-color="${style.gradBottom}"/>
        <stop offset="100%" stop-color="${style.gradTop}"/>
      </linearGradient>
      <linearGradient id="mtnBack" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="35%" stop-color="#cbd5e1"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <linearGradient id="mtnFront" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="30%" stop-color="#94a3b8"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${style.accent}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="${style.waterColor}"/>
      </linearGradient>
      <linearGradient id="darkOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.1"/>
        <stop offset="60%" stop-color="#000000" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Cielo Andino -->
    <rect width="800" height="500" fill="url(#skyGrad)"/>

    <!-- Estrellas / Constelaciones -->
    <circle cx="80" cy="50" r="1.5" fill="#ffffff" opacity="0.8"/>
    <circle cx="210" cy="70" r="1.2" fill="#ffffff" opacity="0.6"/>
    <circle cx="340" cy="40" r="1.8" fill="#ffffff" opacity="0.9"/>
    <circle cx="520" cy="65" r="1.4" fill="#ffffff" opacity="0.7"/>
    <circle cx="680" cy="35" r="1.6" fill="#ffffff" opacity="0.8"/>
    <circle cx="730" cy="80" r="1.2" fill="#ffffff" opacity="0.6"/>

    <!-- Resplandor Glaciar Superior -->
    <ellipse cx="400" cy="180" rx="300" ry="120" fill="${style.accent}" opacity="0.25" filter="url(#glow)"/>

    <!-- Picos Montañosos del Fondo (Cordillera Blanca) -->
    <polygon points="0,320 120,180 240,280 380,120 520,260 660,150 800,310 800,500 0,500" fill="url(#mtnBack)" opacity="0.85"/>

    <!-- Cumbres Glaciares en Primer Plano -->
    <polygon points="0,380 180,210 320,330 460,170 600,310 740,230 800,340 800,500 0,500" fill="url(#mtnFront)"/>

    <!-- Relieve de Hielo / Paredes Verticales -->
    <polygon points="460,170 470,240 500,280 460,330 430,270" fill="#e2e8f0" opacity="0.6"/>
    <polygon points="180,210 190,260 220,290 180,320 150,270" fill="#e2e8f0" opacity="0.6"/>

    <!-- Laguna / Valle Glaciar Base -->
    <path d="M0,400 Q200,370 400,390 T800,380 L800,500 L0,500 Z" fill="url(#waterGrad)"/>

    <!-- Destellos en el Agua -->
    <ellipse cx="360" cy="430" rx="140" ry="8" fill="#ffffff" opacity="0.35"/>
    <ellipse cx="520" cy="450" rx="90" ry="5" fill="#ffffff" opacity="0.25"/>

    <!-- Sombra Inferior para Legibilidad Tipográfica -->
    <rect width="800" height="500" fill="url(#darkOverlay)"/>

    <!-- Badge de Categoría Superior Izquierda -->
    <rect x="28" y="28" width="170" height="32" rx="16" fill="${style.badgeBg}" opacity="0.95"/>
    <text x="113" y="49" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.8">
      ${style.iconText}
    </text>

    <!-- Badge de Altitud Superior Derecha -->
    <rect x="650" y="28" width="122" height="32" rx="16" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <text x="711" y="49" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#f8fafc" text-anchor="middle">
      ▲ ${safeAlt}
    </text>

    <!-- Información del Destino en el Banner -->
    <text x="32" y="415" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#ffffff">
      ${safeName}
    </text>
    <text x="32" y="445" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="${style.accent}">
      📍 ${safeLoc} • ⏱️ ${safeDur} • ⚡ ${safeDif}
    </text>
    <text x="32" y="472" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#38bdf8">
      HUARAZ TOURS • PARQUE NACIONAL HUASCARÁN
    </text>

    <!-- Precio en la Esquina Inferior Derecha -->
    <rect x="640" y="420" width="132" height="48" rx="24" fill="#0284c7" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
    <text x="706" y="451" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle">
      S/ ${Number(ruta.precio).toFixed(2)}
    </text>
  </svg>
  `;

  const svgBuffer = Buffer.from(svgBanner);

  // Generar WebP Principal (800x500)
  await sharp(svgBuffer)
    .webp({ quality: 88, effort: 4 })
    .toFile(outMainPath);

  // Generar Thumbnail WebP (360x225)
  await sharp(svgBuffer)
    .resize(360, 225)
    .webp({ quality: 80, effort: 4 })
    .toFile(outThumbPath);
}

async function run() {
  console.log('--- GENERADOR DE 50 RUTAS TURÍSTICAS DE HUARAZ ---');

  const mainDir = path.resolve(__dirname, '../frontend/public/images/rutas');
  const thumbDir = path.resolve(__dirname, '../frontend/public/images/rutas/thumbnails');

  if (!fs.existsSync(mainDir)) fs.mkdirSync(mainDir, { recursive: true });
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < RUTAS_50.length; i++) {
    const r = RUTAS_50[i];
    const mainFilename = `ruta_${r.slug}.webp`;
    const thumbFilename = `thumb_${r.slug}.webp`;

    const mainPath = path.join(mainDir, mainFilename);
    const thumbPath = path.join(thumbDir, thumbFilename);

    // 1. Generar imágenes si no existen
    if (!fs.existsSync(mainPath) || !fs.existsSync(thumbPath)) {
      await generateRouteImage(r, mainPath, thumbPath);
      process.stdout.write(`[IMG ${i + 1}/${RUTAS_50.length}] Creada: ${mainFilename}\n`);
    }

    const imgUrl = `/images/rutas/${mainFilename}`;
    const thumbUrl = `/images/rutas/thumbnails/${thumbFilename}`;

    // 2. Verificar existencia en base de datos
    const [existing] = await pool.query('SELECT id FROM rutas WHERE nombre = ?', [r.nombre]);

    if (existing.length === 0) {
      await pool.query(`
        INSERT INTO rutas (
          nombre, categoria, ubicacion, duracion, dificultad,
          cupo_total, cupos_disponibles, precio, estado,
          imagen, imagen_thumbnail, descripcion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        r.nombre,
        r.categoria,
        r.ubicacion,
        r.duracion,
        r.dificultad,
        r.cupo_total,
        r.cupos_disponibles,
        r.precio,
        r.estado,
        imgUrl,
        thumbUrl,
        r.descripcion
      ]);
      insertedCount++;
    } else {
      await pool.query(`
        UPDATE rutas SET
          categoria = ?, ubicacion = ?, duracion = ?, dificultad = ?,
          cupo_total = ?, cupos_disponibles = ?, precio = ?, estado = ?,
          imagen = ?, imagen_thumbnail = ?, descripcion = ?
        WHERE id = ?
      `, [
        r.categoria,
        r.ubicacion,
        r.duracion,
        r.dificultad,
        r.cupo_total,
        r.cupos_disponibles,
        r.precio,
        r.estado,
        imgUrl,
        thumbUrl,
        r.descripcion,
        existing[0].id
      ]);
      updatedCount++;
    }
  }

  const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM rutas');
  console.log(`\n¡PROCESO EXITOSO!`);
  console.log(`Rutas nuevas insertadas: ${insertedCount}`);
  console.log(`Rutas actualizadas: ${updatedCount}`);
  console.log(`Total de rutas en MySQL: ${totalRows[0].total}`);

  process.exit(0);
}

run().catch(err => {
  console.error('Error durante la generación:', err);
  process.exit(1);
});
