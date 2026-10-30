import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map,
  Mountain,
  Plus,
  Search,
  Grid,
  Droplets,
  Footprints,
  Compass,
  MapPin,
  Calendar,
  BarChart2,
  DollarSign,
  Eye,
  Edit3,
  Trash2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Tent
} from 'lucide-react';
import { api } from '../services/api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useAuth } from '../context/AuthContext';

export default function Rutas() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [rutas, setRutas] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const [rutaToDelete, setRutaToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadRutas = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.q = search;
      if (selectedCategory && selectedCategory !== 'todas') {
        params.categoria = selectedCategory;
      }
      const data = await api.getRutas(params);
      setRutas(data);
    } catch (err) {
      console.error('Error fetching rutas from MySQL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRutas();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async () => {
    if (!rutaToDelete) return;
    try {
      setDeleteLoading(true);
      await api.deleteRuta(rutaToDelete.id);
      setRutaToDelete(null);
      loadRutas();
    } catch (err) {
      alert(err.message || 'Error al eliminar la ruta en MySQL.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCategoryBadge = (categoria) => {
    switch (categoria?.toLowerCase()) {
      case 'laguna':
      case 'lagunas':
        return { label: 'Laguna', icon: <Droplets size={13} />, bg: '#2563eb', color: '#ffffff' };
      case 'montaña':
        return { label: 'Montaña', icon: <Mountain size={13} />, bg: '#10b981', color: '#ffffff' };
      case 'caminata':
      case 'caminatas':
        return { label: 'Caminata', icon: <Footprints size={13} />, bg: '#8b5cf6', color: '#ffffff' };
      case 'aventura':
        return { label: 'Aventura', icon: <Compass size={13} />, bg: '#ef4444', color: '#ffffff' };
      case 'paisaje':
        return { label: 'Paisaje', icon: <Tent size={13} />, bg: '#0d9488', color: '#ffffff' };
      default:
        return { label: categoria || 'Tour', icon: <Compass size={13} />, bg: '#2563eb', color: '#ffffff' };
    }
  };

  const totalPages = Math.ceil(rutas.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, rutas.length);
  const paginatedRutas = rutas.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let p = start; p <= end; p++) {
      if (!pages.includes(p)) pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    if (!pages.includes(totalPages)) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="rutas-page-view">
      {/* 1. Banner Panorámico Superior con Fotografía de Montaña y Eslogan */}
      <div className="rutas-hero-banner">
        {/* Fondo de fotografía panorámica */}
        <div className="rutas-banner-bg" />

        {/* Gradiente izquierdo profundo */}
        <div className="rutas-banner-overlay" />

        {/* Contenido Izquierdo: Icono Mapa y Título */}
        <div className="rutas-hero-left">
          <div className="rutas-icon-squircle">
            <Map size={28} className="rutas-map-icon" strokeWidth={2.4} />
          </div>
          <div className="rutas-hero-texts">
            <h1 className="rutas-hero-title">Rutas</h1>
            <p className="rutas-hero-subtitle">
              Descubre las mejores rutas turísticas de Huaraz y vive experiencias inolvidables.
            </p>
          </div>
        </div>

        {/* Contenido Derecho: Eslogan Manuscrito Alpino con Montaña */}
        <div className="rutas-hero-right">
          <div className="rutas-slogan-stack">
            <div className="slogan-row top-row">
              <span className="slogan-text">Explora</span>
              <span className="slogan-star">✦</span>
            </div>
            <div className="slogan-row middle-row">
              <span className="slogan-text">Vive</span>
              <svg
                className="slogan-mountain-doodle"
                viewBox="0 0 46 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M3 20L14 5L22 15L28 9L43 20H3Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="slogan-row bottom-row">
              <span className="slogan-star-small">✦</span>
              <span className="slogan-text">Disfruta</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros y Botón de Nueva Ruta */}
      <div className="rutas-filter-actions-bar">
        <div className="rutas-filters-left">
          {/* Buscador tipo cápsula */}
          <div className="rutas-search-pill-box">
            <Search size={16} className="search-pill-icon" />
            <input
              type="text"
              className="rutas-search-pill-input"
              placeholder="Buscar ruta..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Filtros de Categorías */}
          <div className="rutas-category-pills">
            <button
              type="button"
              className={`cat-pill-btn ${selectedCategory === 'todas' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('todas');
                setCurrentPage(1);
              }}
            >
              <Grid size={15} />
              <span>Todas</span>
            </button>

            <button
              type="button"
              className={`cat-pill-btn ${selectedCategory === 'montaña' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('montaña');
                setCurrentPage(1);
              }}
            >
              <Mountain size={15} />
              <span>Montaña</span>
            </button>

            <button
              type="button"
              className={`cat-pill-btn ${selectedCategory === 'laguna' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('laguna');
                setCurrentPage(1);
              }}
            >
              <Droplets size={15} />
              <span>Lagunas</span>
            </button>

            <button
              type="button"
              className={`cat-pill-btn ${selectedCategory === 'caminata' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('caminata');
                setCurrentPage(1);
              }}
            >
              <Footprints size={15} />
              <span>Caminatas</span>
            </button>

            <button
              type="button"
              className={`cat-pill-btn ${selectedCategory === 'aventura' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('aventura');
                setCurrentPage(1);
              }}
            >
              <Compass size={15} />
              <span>Aventura</span>
            </button>
          </div>
        </div>

        {/* Botón "+ Nueva Ruta" a la derecha (Solo Admin) */}
        {isAdmin && (
          <button
            type="button"
            className="btn-nueva-ruta-action"
            onClick={() => navigate('/rutas/nueva')}
          >
            <Plus size={18} strokeWidth={2.4} />
            <span>Nueva Ruta</span>
          </button>
        )}
      </div>

      {/* 3. Grid de Tarjetas de Rutas (3 Columnas) */}
      {loading ? (
        <div className="loading-box" style={{ padding: '60px 0' }}>
          <div className="spinner"></div>
          <p>Cargando rutas de Huaraz Tours...</p>
        </div>
      ) : paginatedRutas.length === 0 ? (
        <div className="empty-box" style={{ padding: '60px 0' }}>
          <p>No se encontraron rutas con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="rutas-grid-container">
          {paginatedRutas.map((ruta) => {
            const badge = getCategoryBadge(ruta.categoria);
            const isFav = Boolean(favorites[ruta.id]);

            return (
              <div key={ruta.id} className="ruta-card-item">
                {/* Cabecera con Imagen de la Ruta */}
                <div className="ruta-card-image-wrap">
                  <img
                    src={ruta.imagen || ruta.imagen_thumbnail || '/images/laguna69.jpg'}
                    alt={ruta.nombre}
                    className="ruta-card-img"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/laguna69.jpg';
                    }}
                  />

                  {/* Badge de Categoría (Superior Izquierda) */}
                  <div
                    className="ruta-card-badge"
                    style={{ backgroundColor: badge.bg, color: badge.color }}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>

                  {/* Botón de Favorito (Superior Derecha) */}
                  <button
                    type="button"
                    className={`ruta-card-heart-btn ${isFav ? 'active-fav' : ''}`}
                    onClick={(e) => toggleFavorite(ruta.id, e)}
                    title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  >
                    <Heart
                      size={15}
                      fill={isFav ? '#ef4444' : 'none'}
                      color={isFav ? '#ef4444' : '#ffffff'}
                    />
                  </button>
                </div>

                {/* Cuerpo de la Tarjeta */}
                <div className="ruta-card-body">
                  {/* Avatar Circular + Título y Ubicación */}
                  <div className="ruta-card-header-info">
                    <img
                      src={ruta.imagen_thumbnail || ruta.imagen || '/images/laguna69.jpg'}
                      alt={ruta.nombre}
                      className="ruta-avatar-circle"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/laguna69.jpg';
                      }}
                    />
                    <div className="ruta-header-details">
                      <h3 className="ruta-name-title">{ruta.nombre}</h3>
                      <div className="ruta-location-tag">
                        <MapPin size={13} className="pin-blue-icon" />
                        <span>{ruta.ubicacion}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fila de Atributos: Duración, Dificultad y Precio */}
                  <div className="ruta-attrs-bar">
                    <div className="ruta-attr-col">
                      <Calendar size={14} className="attr-muted-icon" />
                      <span>{ruta.duracion || '1 día'}</span>
                    </div>

                    <div className="ruta-attr-col">
                      <BarChart2 size={14} className="attr-muted-icon" />
                      <span>{ruta.dificultad || 'Moderado'}</span>
                    </div>

                    <div className="ruta-attr-col price-col">
                      <span className="price-symbol">$</span>
                      <span className="price-value">
                        S/ {Number(ruta.precio || 20).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* Botones de Acción según el Rol */}
                  {isAdmin ? (
                    <div className="ruta-actions-trio">
                      <button
                        type="button"
                        className="btn-trio-details"
                        onClick={() => navigate(`/rutas/${ruta.id}`)}
                      >
                        <Eye size={14} />
                        <span>Ver detalles</span>
                      </button>

                      <button
                        type="button"
                        className="btn-trio-edit"
                        onClick={() => navigate(`/rutas/editar/${ruta.id}`)}
                      >
                        <Edit3 size={14} />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        className="btn-trio-delete"
                        onClick={() => setRutaToDelete(ruta)}
                      >
                        <Trash2 size={14} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  ) : (
                    <div className="ruta-actions-user-duo">
                      <button
                        type="button"
                        className="btn-trio-details"
                        onClick={() => navigate(`/rutas/${ruta.id}`)}
                      >
                        <Eye size={14} />
                        <span>Ver detalles</span>
                      </button>

                      <button
                        type="button"
                        className="btn-user-reservar-action"
                        onClick={() => navigate(`/reservas/nueva?rutaId=${ruta.id}`)}
                      >
                        <Calendar size={14} />
                        <span>Reservar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Barra Inferior con Conteo y Paginación */}
      <div className="rutas-bottom-bar">
        <div className="rutas-count-indicator">
          <Calendar size={16} className="count-icon" />
          <span>
            Mostrando {rutas.length > 0 ? `${startIndex + 1} - ${endIndex}` : '0 - 0'} de {rutas.length} rutas
          </span>
        </div>

        <div className="rutas-pagination-controls">
          <button
            type="button"
            className="rutas-page-btn"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </button>

          {getVisiblePages().map((page, idx) => (
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="rutas-page-ellipsis">...</span>
            ) : (
              <button
                key={page}
                type="button"
                className={`rutas-page-btn number ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          ))}

          <button
            type="button"
            className="rutas-page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <DeleteConfirmModal
        isOpen={Boolean(rutaToDelete)}
        onClose={() => setRutaToDelete(null)}
        onConfirm={handleDelete}
        title="¿Eliminar Ruta?"
        message={`¿Estás seguro de que deseas eliminar la ruta "${rutaToDelete?.nombre}" de MySQL? Esta acción no se puede deshacer.`}
        isLoading={deleteLoading}
      />
    </div>
  );
}
