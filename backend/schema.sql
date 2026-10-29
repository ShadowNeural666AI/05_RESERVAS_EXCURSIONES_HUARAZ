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

-- Semilla de Rutas
INSERT INTO rutas (id, nombre, categoria, ubicacion, duracion, dificultad, cupo_total, cupos_disponibles, precio, estado, imagen, descripcion) VALUES
(1, 'Laguna 69', 'Laguna', 'Yungay - Huaraz', '1 día', 'Moderado', 20, 12, 20.00, 'Disponible', '/images/laguna69.jpg', 'Hermosa laguna de aguas turquesas, rodeada de montañas nevadas. Altitud: 4,600 m s. n. m.'),
(2, 'Chavín de Huántar', 'Montaña', 'Chavín - Huaraz', '1 día', 'Fácil', 15, 8, 15.00, 'Disponible', '/images/chavin.jpg', 'Milenario centro ceremonial con galerías subterráneas y cabezas clavas.'),
(3, 'Nevado Pastoruri', 'Caminata', 'Ancash', '1 día', 'Moderado', 12, 5, 12.00, 'Disponible', '/images/pastoruri.jpg', 'Imponente glaciar a más de 5,000 m s. n. m. y ruta de las Puyas Raimondi.'),
(4, 'Cerro Hualcán', 'Aventura', 'Recuay', '1 día', 'Difícil', 10, 6, 10.00, 'Disponible', '/images/hualcan.jpg', 'Senderismo panorámico de alta montaña con vistas privilegiadas.'),
(5, 'Laguna Llanganuco', 'Laguna', 'Yungay', '1 día', 'Moderado', 18, 9, 18.00, 'Disponible', '/images/llanganuco.jpg', 'Aguas turquesas entre los macizos del Huascarán y Huandoy.'),
(6, 'Valle de Llanganuco', 'Paisaje', 'Yungay', '1 día', 'Fácil', 20, 10, 14.00, 'Disponible', '/images/banner.jpg', 'Pintoresco valle andino con bosques de quenuales y arroyos glaciares.')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

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
