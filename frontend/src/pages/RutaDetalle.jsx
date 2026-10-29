import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, CheckCircle, Edit, Trash2, CalendarPlus } from 'lucide-react';
import { api } from '../services/api';
import Badge from '../components/Badge';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function RutaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ruta, setRuta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getRutaById(id);
        setRuta(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Cargando detalle de la ruta...</p>
        </div>
      </div>
    );
  }

  if (!ruta) {
    return (
      <div className="page-container">
        <p>Ruta no encontrada.</p>
        <Link to="/rutas" className="btn-secondary" style={{ marginTop: '10px' }}>Volver</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await api.deleteRuta(ruta.id);
      navigate('/rutas');
    } catch (err) {
      alert(err.message || 'Error al eliminar');
    }
  };

  return (
    <div className="page-container">
      {/* Breadcrumb & Navigation */}
      <div className="breadcrumb-nav">
        <Link to="/rutas" className="breadcrumb-link">Rutas</Link>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">{ruta.nombre}</span>
      </div>

      {/* Hero Scenic Image */}
      <div className="ruta-detail-hero">
        <img
          src={ruta.imagen || '/images/laguna69.jpg'}
          alt={ruta.nombre}
          className="ruta-hero-img"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/laguna69.jpg';
          }}
        />
      </div>

      {/* Header Info */}
      <div className="ruta-detail-header-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 className="ruta-detail-title">{ruta.nombre}</h1>
          <Badge status={ruta.estado} />
        </div>

        {/* 4 Feature Pills */}
        <div className="metric-pills-grid">
          <div className="metric-pill">
            <MapPin size={18} color="#2563eb" />
            <div>
              <div className="pill-label">Ubicación</div>
              <div className="pill-value">{ruta.ubicacion}</div>
            </div>
          </div>

          <div className="metric-pill">
            <Clock size={18} color="#2563eb" />
            <div>
              <div className="pill-label">Duración</div>
              <div className="pill-value">{ruta.duracion}</div>
            </div>
          </div>

          <div className="metric-pill">
            <Users size={18} color="#2563eb" />
            <div>
              <div className="pill-label">Cupo total</div>
              <div className="pill-value">{ruta.cupo_total}</div>
            </div>
          </div>

          <div className="metric-pill" style={{ borderLeft: '3px solid #16a34a' }}>
            <CheckCircle size={18} color="#16a34a" />
            <div>
              <div className="pill-label">Cupos disponibles</div>
              <div className="pill-value" style={{ color: '#16a34a' }}>{ruta.cupos_disponibles}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>Descripción</h3>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.93rem' }}>
            {ruta.descripcion || 'Excursión guiada por los atractivos más emblemáticos del Parque Nacional Huascarán.'}
          </p>
        </div>

        {/* Gallery Thumbnails */}
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#64748b', marginBottom: '12px' }}>Galería fotográfica</h4>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {['/images/laguna69.jpg', '/images/chavin.jpg', '/images/pastoruri.jpg', '/images/llanganuco.jpg'].map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Miniatura tour"
                style={{ width: '110px', height: '75px', borderRadius: '8px', objectFit: 'cover' }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/rutas/editar/${ruta.id}`)}
          >
            <Edit size={16} />
            <span>Editar</span>
          </button>
          <button
            type="button"
            className="btn-danger-outline"
            style={{ width: 'auto', padding: '10px 18px' }}
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 size={16} />
            <span>Eliminar</span>
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/reservas/nueva', { state: { rutaId: ruta.id } })}
          >
            <CalendarPlus size={16} />
            <span>Reservar esta ruta</span>
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="¿Eliminar Ruta?"
        message={`¿Estás seguro de que deseas eliminar la ruta "${ruta.nombre}"?`}
      />
    </div>
  );
}
