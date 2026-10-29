# 🏔️ Huaraz Tours - Sistema de Reservas y Gestión Turística

Panel web moderno de **Huaraz Tours** para gestionar y reservar rutas turísticas de la cordillera de Áncash (Laguna 69, Chavín de Huántar, Nevado Pastoruri, Cerro Hualcán, Laguna Llanganuco, etc.).

Incluye buscador en tiempo real, filtros dinámicos por categorías y dificultad, tarjetas interactivas con fotografías, detalles de altitud, duración y precios, junto con un sistema integral de reservas y control de cupos.

---

## 🚀 Características Principales

### 🛡️ Control de Acceso Basado en Roles (RBAC)
- **Modo Administrador:**
  - Gestión completa (CRUD) de rutas turísticas (Crear, Consultar, Editar y Eliminar).
  - Directorio y administración de clientes registrados.
  - Auditoría global de todas las reservas realizadas.
  - Panel analítico y reportes estadísticos con gráficos interactivos.
  - Configuración del sistema y de la agencia.
- **Modo Usuario / Turista:**
  - Catálogo optimizado para exploración de excursiones.
  - Reservas inmediatas con cálculo de cupos disponibles en vivo.
  - Panel personal de **"Mis Reservas"** con seguimiento de estado (Confirmada, Pendiente, Cancelada).
  - Protección de rutas y acciones exclusivas de administración.

### 🪪 Panel de Credenciales Bonito & Selector de Perfil
- Interfaz flotante con diseño *Glassmorphism* accesible desde el *Header* o el *Sidebar*.
- Muestra el perfil activo, credenciales (DNI, correo, teléfono) y estado de sesión.
- Cambio de rol con 1 solo clic entre **Administrador** y perfiles de **Turista** precargados (María López, Carlos Ramos, Ana Torres).
- Formulario de autenticación rápida.

### 🎨 Diseño y Experiencia de Usuario
- Arquitectura limpia con **React 18** y **Vite**.
- Estilo visual profesional con fondos blancos de alto contraste y legibilidad en las vistas de contenido (*Inicio, Rutas, Reservas, Reportes*).
- Carrusel de banners panorámicos interactivo.
- Iconografía moderna con Lucide Icons.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - React 18 + Vite
  - React Router DOM v6
  - Formik & Yup (Validación de formularios)
  - Lucide React (Iconografía)
  - CSS3 Moderno con variables y diseño responsivo
- **Backend:**
  - Node.js & Express
  - MySQL2 con conexión a XAMPP MySQL / MariaDB
  - Multer & Sharp (Procesamiento y optimización de imágenes)
  - Dotenv & CORS

---

## 📦 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/ShadowNeural666AI/05_RESERVAS_EXCURSIONES_HUARAZ.git
cd 05_RESERVAS_EXCURSIONES_HUARAZ
```

### 2. Base de Datos (MySQL / XAMPP)
Asegúrate de tener MySQL corriendo (puerto 3306 por defecto) y ejecuta la migración automática:
```bash
cd backend
npm install
node migrate.js
```

### 3. Iniciar el Backend
```bash
npm start
# Servidor ejecutándose en http://localhost:5000
```

### 4. Iniciar el Frontend
En otra terminal:
```bash
cd frontend
npm install
npm run dev
# Aplicación ejecutándose en http://localhost:5173
```

---

## 👤 Autor
Desarrollado para el reto de desarrollo web - Sistema de Reservas de Excursiones en Huaraz.

