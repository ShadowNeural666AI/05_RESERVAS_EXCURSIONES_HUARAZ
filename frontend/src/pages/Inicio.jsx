import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mountain,
  Users,
  UserCheck,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Compass,
  Landmark,
  Sun,
  Leaf,
  Calendar,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

const HERO_SLIDES = [
  {
    image: '/images/banner_panoramic.jpg',
    badge: 'Huaraz Tours',
    titlePrefix: 'Bienvenido a',
    titleHighlight: 'Huaraz Tours',
    subtitle: 'Administra tus reservas y vive la experiencia de la cordillera.',
    features: [
      { icon: <Leaf size={15} />, text: 'Naturaleza' },
      { icon: <Mountain size={15} />, text: 'Aventura' },
      { icon: <Heart size={15} />, text: 'Experiencias únicas' },
    ],
  },
  {
    image: '/images/laguna69.jpg',
    badge: 'Cordillera Blanca',
    titlePrefix: 'Descubre la Mágica',
    titleHighlight: 'Laguna 69',
    subtitle: 'Aguas turquesas a 4,600 m s. n. m. bajo los macizos nevados.',
    features: [
      { icon: <Compass size={15} />, text: 'Trekking Andino' },
      { icon: <Mountain size={15} />, text: 'Altitud 4,600m' },
      { icon: <Sparkles size={15} />, text: 'Glaciares Vivos' },
    ],
  },
  {
    image: '/images/pastoruri.jpg',
    badge: 'Ruta del Cambio Climático',
    titlePrefix: 'Imponente Glaciar',
    titleHighlight: 'Pastoruri',
    subtitle: 'Puyas Raimondi milenarias y santuario de hielo a más de 5,000 m.',
    features: [
      { icon: <Mountain size={15} />, text: 'Alta Montaña' },
      { icon: <Sun size={15} />, text: 'Puyas Raimondi' },
      { icon: <Heart size={15} />, text: 'Patrimonio Natural' },
    ],
  },
];

export default function Inicio() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    rutasDisponibles: 5,
    reservasRegistradas: 48,
    cuposTotales: 146,
    cuposDisponibles: 97,
  });
  const [featuredRutas, setFeaturedRutas] = useState([]);
  const [favorites, setFavorites] = useState({ 1: true, 2: false, 3: false, 4: false });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Auto-play del carrusel cada 3 segundos
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsData, rutasData] = await Promise.all([
          api.getStats().catch(() => null),
          api.getRutas().catch(() => []),
        ]);

        if (statsData) setStats(statsData);
        if (rutasData && rutasData.length > 0) {
          setFeaturedRutas(rutasData.slice(0, 4));
        } else {
          // Fallback con los 4 destinos mostrados en la imagen de referencia
          setFeaturedRutas([
            {
              id: 1,
              nombre: 'Laguna 69',
              ubicacion: 'Yungay',
              cupos_disponibles: 12,
              precio: 50,
              imagen: '/images/laguna69.jpg',
              badge: { text: 'Más Popular', color: '#2563eb', icon: <Sparkles size={12} /> },
            },
            {
              id: 2,
              nombre: 'Chavín de Huántar',
              ubicacion: 'Huari',
              cupos_disponibles: 8,
              precio: 50,
              imagen: '/images/chavin.jpg',
              badge: { text: 'Cultural', color: '#8b5cf6', icon: <Landmark size={12} /> },
            },
            {
              id: 3,
              nombre: 'Nevado Pastoruri',
              ubicacion: 'Ancash',
              cupos_disponibles: 5,
              precio: 50,
              imagen: '/images/pastoruri.jpg',
              badge: { text: 'Aventura', color: '#10b981', icon: <Mountain size={12} /> },
            },
            {
              id: 4,
              nombre: 'Cerro Hualcán',
              ubicacion: 'Recuay',
              cupos_disponibles: 6,
              precio: 50,
              imagen: '/images/hualcan.jpg',
              badge: { text: 'Paisaje', color: '#f97316', icon: <Sun size={12} /> },
            },
          ]);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getCustomBadge = (index, categoria) => {
    if (index === 0) return { text: 'Más Popular', bg: '#2563eb', icon: <Sparkles size={13} /> };
    if (index === 1) return { text: 'Cultural', bg: '#8b5cf6', icon: <Landmark size={13} /> };
    if (index === 2) return { text: 'Aventura', bg: '#10b981', icon: <Mountain size={13} /> };
    return { text: 'Paisaje', bg: '#f97316', icon: <Sun size={13} /> };
  };

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <div className="inicio-dark-view">
      {/* 1. Hero Banner Panorámico Interactivo */}
      <section className="dark-hero-card">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`dark-hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}

        {/* Gradientes cinemáticos de superposición */}
        <div className="dark-hero-gradient-overlay"></div>

        {/* Contenido Hero */}
        <div className="dark-hero-content">
          <div className="dark-hero-top-badge">
            <Mountain size={14} className="badge-mount-icon" />
            <span>{activeSlideData.badge}</span>
          </div>

          <h1 className="dark-hero-title">
            {activeSlideData.titlePrefix} <br />
            <span className="dark-hero-highlight">{activeSlideData.titleHighlight}</span>
          </h1>

          <p className="dark-hero-subtitle">
            {activeSlideData.subtitle}
          </p>

          <div className="dark-hero-tags">
            {activeSlideData.features.map((feat, idx) => (
              <div key={idx} className="dark-hero-tag-item">
                <span className="tag-icon">{feat.icon}</span>
                <span className="tag-text">{feat.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Controles del Carrusel (Inferior Derecho) */}
        <div className="dark-hero-carousel-controls">
          <div className="carousel-dots-wrap">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`carousel-dot ${i === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="carousel-arrows-wrap">
            <button
              type="button"
              className="carousel-arrow-btn"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="carousel-arrow-btn"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Cuadrícula de 4 Tarjetas KPI con Gradientes, Marcas de Agua y Tendencias */}
      <section className="dark-kpi-grid">
        {/* KPI 1: Rutas disponibles (Azul Cordillera) */}
        <div className="dark-kpi-card kpi-card-blue">
          <div className="kpi-left-icon-box box-blue">
            <Compass size={26} strokeWidth={2.2} />
          </div>
          <div className="kpi-center-info">
            <div className="kpi-number">{stats.rutasDisponibles}</div>
            <div className="kpi-label">Rutas disponibles</div>
            <div className="kpi-trend">
              <TrendingUp size={13} />
              <span>+2 este mes</span>
            </div>
          </div>
          <div className="kpi-watermark-icon">
            <Mountain size={68} strokeWidth={1.5} />
          </div>
        </div>

        {/* KPI 2: Reservas registradas (Esmeralda Glaciar) */}
        <div className="dark-kpi-card kpi-card-green">
          <div className="kpi-left-icon-box box-green">
            <Users size={26} strokeWidth={2.2} />
          </div>
          <div className="kpi-center-info">
            <div className="kpi-number">{stats.reservasRegistradas}</div>
            <div className="kpi-label">Reservas registradas</div>
            <div className="kpi-trend">
              <TrendingUp size={13} />
              <span>+12% este mes</span>
            </div>
          </div>
          <div className="kpi-watermark-icon">
            <Users size={68} strokeWidth={1.5} />
          </div>
        </div>

        {/* KPI 3: Cupos totales (Ámbar Dorado) */}
        <div className="dark-kpi-card kpi-card-amber">
          <div className="kpi-left-icon-box box-amber">
            <UserCheck size={26} strokeWidth={2.2} />
          </div>
          <div className="kpi-center-info">
            <div className="kpi-number">{stats.cuposTotales}</div>
            <div className="kpi-label">Cupos totales</div>
            <div className="kpi-trend">
              <TrendingUp size={13} />
              <span>+8% este mes</span>
            </div>
          </div>
          <div className="kpi-watermark-icon">
            <Mountain size={68} strokeWidth={1.5} />
          </div>
        </div>

        {/* KPI 4: Cupos disponibles (Rubí Carmesí) */}
        <div className="dark-kpi-card kpi-card-red">
          <div className="kpi-left-icon-box box-red">
            <AlertTriangle size={26} strokeWidth={2.2} />
          </div>
          <div className="kpi-center-info">
            <div className="kpi-number">{stats.cuposDisponibles}</div>
            <div className="kpi-label">Cupos disponibles</div>
            <div className="kpi-trend">
              <TrendingUp size={13} />
              <span>+5% este mes</span>
            </div>
          </div>
          <div className="kpi-watermark-icon">
            <Calendar size={68} strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* 3. Encabezado de Rutas Destacadas */}
      <section className="dark-section-header">
        <div className="dark-section-title-wrap">
          <div className="dark-section-icon-badge">
            <Mountain size={20} color="#38bdf8" />
          </div>
          <h2 className="dark-section-title">Rutas destacadas</h2>
        </div>

        <Link to="/rutas" className="dark-section-view-all">
          <span>Ver todas las rutas</span>
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* 4. Cuadrícula de 4 Tarjetas de Rutas Destacadas */}
      <section className="dark-cards-grid">
        {featuredRutas.map((ruta, index) => {
          const badge = ruta.badge || getCustomBadge(index, ruta.categoria);
          const isFav = Boolean(favorites[ruta.id]);

          return (
            <div key={ruta.id} className="dark-tour-card">
              {/* Contenedor de la Imagen */}
              <div className="dark-tour-image-wrap">
                <img
                  src={ruta.imagen_thumbnail || ruta.imagen || '/images/laguna69.jpg'}
                  alt={ruta.nombre}
                  className="dark-tour-img"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/laguna69.jpg';
                  }}
                />

                {/* Badge Superior Izquierdo */}
                <div
                  className="dark-tour-badge"
                  style={{ backgroundColor: badge.bg || badge.color || '#2563eb' }}
                >
                  {badge.icon}
                  <span>{badge.text}</span>
                </div>

                {/* Botón de Favorito Superior Derecho */}
                <button
                  type="button"
                  className={`dark-tour-heart-btn ${isFav ? 'favorited' : ''}`}
                  onClick={(e) => toggleFavorite(ruta.id, e)}
                  title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                  <Heart size={15} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : '#ffffff'} />
                </button>
              </div>

              {/* Cuerpo de la Tarjeta */}
              <div className="dark-tour-body">
                <h3 className="dark-tour-name">{ruta.nombre}</h3>

                <div className="dark-tour-metadata">
                  <div className="dark-meta-item">
                    <MapPin size={14} className="meta-icon-pin" />
                    <span>{ruta.ubicacion}</span>
                  </div>
                  <div className="dark-meta-item">
                    <Users size={14} className="meta-icon-users" />
                    <span>{ruta.cupos_disponibles !== undefined ? ruta.cupos_disponibles : 10} cupos</span>
                  </div>
                </div>

                {/* Pie de la Tarjeta con Precio y Botón Reservar */}
                <div className="dark-tour-footer">
                  <div className="dark-tour-price-box">
                    <span className="price-lead">Desde:</span>
                    <span className="price-amount"> S/ {Number(ruta.precio || 50).toFixed(0)}</span>
                  </div>

                  <button
                    type="button"
                    className="dark-tour-reserve-btn"
                    onClick={() => navigate('/reservas/nueva', { state: { rutaId: ruta.id } })}
                  >
                    <span>Reservar</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
