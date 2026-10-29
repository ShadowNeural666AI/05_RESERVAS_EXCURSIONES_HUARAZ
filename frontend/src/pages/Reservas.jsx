import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mountain,
  Users,
  MapPin,
  Tag,
  Settings,
  CheckCircle2,
  Clock,
  XCircle,
  Hash,
  User
} from 'lucide-react';
import { api } from '../services/api';
import ReservaFormModal from '../components/ReservaFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useAuth } from '../context/AuthContext';

export default function Reservas() {
  const navigate = useNavigate();
  const { user, isAdmin, isUser } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reservaToEdit, setReservaToEdit] = useState(null);
  const [reservaToDelete, setReservaToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [onlyMyReservas, setOnlyMyReservas] = useState(true);

  // Paginación: 5 elementos por página exactamente como en la imagen
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const [resData, rutasData] = await Promise.all([
        api.getReservas({ q: search }),
        api.getRutas(),
      ]);
      setReservas(resData || []);
      setRutas(rutasData || []);
    } catch (err) {
      console.error('Error loading reservas:', err);
      setErrorMsg('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenCreate = () => {
    setReservaToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (reserva) => {
    setReservaToEdit(reserva);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reservaToDelete) return;
    try {
      setDeleteLoading(true);
      await api.deleteReserva(reservaToDelete.id);
      setReservaToDelete(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Error al eliminar la reserva');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper para asignar avatar según el nombre o id del cliente
  const getClientAvatar = (cliente, id) => {
    const lower = cliente?.toLowerCase() || '';
    if (lower.includes('maría') || lower.includes('maria')) return '/images/avatars/client_maria.jpg';
    if (lower.includes('carlos')) return '/images/avatars/client_carlos.jpg';
    if (lower.includes('ana')) return '/images/avatars/client_ana.jpg';
    if (lower.includes('luis')) return '/images/avatars/client_luis.jpg';
    if (lower.includes('sofía') || lower.includes('sofia')) return '/images/avatars/client_sofia.jpg';
    return '/images/avatar.jpg';
  };

  // Helper para obtener imagen y ubicación de la ruta
  const getRutaDetails = (rutaId, rutaNombre) => {
    const found = rutas.find((r) => r.id === rutaId || r.nombre === rutaNombre);
    if (found) {
      return {
        imagen: found.imagen_thumbnail || found.imagen || '/images/laguna69.jpg',
        ubicacion: found.ubicacion || 'Huaraz - Ancash',
      };
    }
    // Mapeo por defecto según los destinos de la imagen de referencia
    const lower = rutaNombre?.toLowerCase() || '';
    if (lower.includes('laguna 69')) return { imagen: '/images/laguna69.jpg', ubicacion: 'Yungay' };
    if (lower.includes('chavín') || lower.includes('chavin')) return { imagen: '/images/chavin.jpg', ubicacion: 'Chavín de Huántar' };
    if (lower.includes('pastoruri')) return { imagen: '/images/pastoruri.jpg', ubicacion: 'Ancash' };
    if (lower.includes('hualcán') || lower.includes('hualcan')) return { imagen: '/images/hualcan.jpg', ubicacion: 'Recuay' };
    if (lower.includes('llanganuco')) return { imagen: '/images/llanganuco.jpg', ubicacion: 'Yungay' };
    return { imagen: '/images/laguna69.jpg', ubicacion: 'Huaraz' };
  };

  // Renderizador de Badge de Estado
  const renderStatusBadge = (estado) => {
    const st = estado?.toLowerCase();
    if (st === 'confirmada' || st === 'confirmado') {
      return (
        <span className="reservas-status-badge status-confirmada">
          <CheckCircle2 size={13} className="badge-status-icon" />
          <span>Confirmada</span>
        </span>
      );
    }
    if (st === 'pendiente') {
      return (
        <span className="reservas-status-badge status-pendiente">
          <Clock size={13} className="badge-status-icon" />
          <span>Pendiente</span>
        </span>
      );
    }
    return (
      <span className="reservas-status-badge status-cancelada">
        <XCircle size={13} className="badge-status-icon" />
        <span>Cancelada</span>
      </span>
    );
  };

  // Filtrado según el rol: Turista ve principalmente sus reservas o todas
  const myReservas = reservas.filter((r) => {
    if (!user) return true;
    const matchDni = user.dni && r.dni === user.dni;
    const matchEmail = user.correo && r.correo?.toLowerCase() === user.correo?.toLowerCase();
    const matchName = user.nombre && r.cliente?.toLowerCase().includes(user.nombre.toLowerCase().split(' ')[0]);
    return matchDni || matchEmail || matchName;
  });

  const activeReservas = isUser && onlyMyReservas ? myReservas : reservas;
  const totalPages = Math.ceil(activeReservas.length / itemsPerPage) || 1;
  const paginatedReservas = activeReservas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="reservas-dark-view">
      {/* 1. Banner Panorámico Superior con Fotografía y Eslogan */}
      <section className="reservas-hero-banner">
        <div className="reservas-hero-left">
          <div className="reservas-title-row">
            <div className="reservas-title-icon-box">
              <Calendar size={28} className="reservas-header-icon" />
            </div>
            <div>
              <div className="reservas-title-with-mountain">
                <h1 className="reservas-main-title">
                  {isAdmin ? 'Reservas' : 'Mis Reservas'}
                </h1>
                <Mountain size={24} className="reservas-mountain-glow-icon" />
              </div>
              <p className="reservas-main-subtitle">
                {isAdmin
                  ? 'Lista general de reservas realizadas en la agencia'
                  : `Historial de excursiones reservadas para ${user?.nombre || 'turista'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Zona Panorámica Derecha con Fotografía y Eslogan Manuscrito */}
        <div className="reservas-hero-right">
          <div className="reservas-slogan-wrap">
            <span className="reservas-slogan-text">
              Grandes aventuras, <br />
              mejores historias
            </span>
          </div>
        </div>
      </section>

      {/* 2. Barra de Búsqueda y Botón + Nueva Reserva */}
      <section className="reservas-action-bar">
        <div className="reservas-action-bar-left">
          <div className="reservas-search-input-pill">
            <Search size={17} className="reservas-search-icon" />
            <input
              type="text"
              className="reservas-search-field"
              placeholder={isUser ? "Buscar en mis reservas..." : "Buscar cliente, ruta, fecha..."}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Selector de Mis Reservas / Todas para Turistas */}
          {isUser && (
            <div className="reservas-role-filter-pills">
              <button
                type="button"
                className={`reserva-tab-filter-btn ${onlyMyReservas ? 'active' : ''}`}
                onClick={() => { setOnlyMyReservas(true); setCurrentPage(1); }}
              >
                Mis Reservas ({myReservas.length})
              </button>
              <button
                type="button"
                className={`reserva-tab-filter-btn ${!onlyMyReservas ? 'active' : ''}`}
                onClick={() => { setOnlyMyReservas(false); setCurrentPage(1); }}
              >
                Todas ({reservas.length})
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="reservas-new-btn"
          onClick={() => navigate('/reservas/nueva')}
        >
          <Plus size={18} strokeWidth={2.4} />
          <span>{isUser ? 'Reservar Excursión' : 'Nueva Reserva'}</span>
        </button>
      </section>

      {errorMsg && (
        <div style={{ padding: '12px 18px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
          {errorMsg}
        </div>
      )}

      {/* 3. Contenedor de la Tabla de Reservas con Tarjetas-Fila Estilizadas */}
      <section className="reservas-table-card">
        {loading ? (
          <div className="loading-box" style={{ padding: '60px 0' }}>
            <div className="spinner"></div>
            <p style={{ color: '#94a3b8' }}>Cargando reservas de Huaraz Tours...</p>
          </div>
        ) : paginatedReservas.length === 0 ? (
          <div className="empty-box" style={{ padding: '60px 0' }}>
            <p style={{ color: '#94a3b8' }}>No se encontraron reservas con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="reservas-capsules-container">
            {/* Cabecera de Columnas */}
            <div className="reservas-capsule-header">
              <div className="col-header col-id">
                <Hash size={13} />
                <span>ID</span>
              </div>
              <div className="col-header col-cliente">
                <User size={13} />
                <span>CLIENTE</span>
              </div>
              <div className="col-header col-ruta">
                <MapPin size={13} />
                <span>RUTA</span>
              </div>
              <div className="col-header col-fecha">
                <Calendar size={13} />
                <span>FECHA</span>
              </div>
              <div className="col-header col-personas">
                <Users size={13} />
                <span>PERSONAS</span>
              </div>
              <div className="col-header col-estado">
                <Tag size={13} />
                <span>ESTADO</span>
              </div>
              <div className="col-header col-acciones">
                <Settings size={13} />
                <span>ACCIONES</span>
              </div>
            </div>

            {/* Filas de Reservas (Cada una como Cápsula con Borde Luminoso) */}
            <div className="reservas-rows-list">
              {paginatedReservas.map((res) => {
                const rutaMeta = getRutaDetails(res.ruta_id, res.ruta_nombre);
                const avatarImg = getClientAvatar(res.cliente, res.id);

                return (
                  <div key={res.id} className="reservas-row-capsule">
                    {/* ID */}
                    <div className="capsule-col col-id">
                      <span className="reserva-id-pill">{res.id}</span>
                    </div>

                    {/* Cliente */}
                    <div className="capsule-col col-cliente">
                      <div className="cliente-avatar-cell">
                        <img
                          src={avatarImg}
                          alt={res.cliente}
                          className="cliente-avatar-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/avatar.jpg';
                          }}
                        />
                        <div className="cliente-info-box">
                          <span className="cliente-name">{res.cliente}</span>
                          <User size={12} className="cliente-sub-icon" />
                        </div>
                      </div>
                    </div>

                    {/* Ruta */}
                    <div className="capsule-col col-ruta">
                      <div className="ruta-thumbnail-cell">
                        <img
                          src={rutaMeta.imagen}
                          alt={res.ruta_nombre}
                          className="ruta-thumb-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/laguna69.jpg';
                          }}
                        />
                        <div className="ruta-info-box">
                          <span className="ruta-title">{res.ruta_nombre}</span>
                          <span className="ruta-location">{rutaMeta.ubicacion}</span>
                        </div>
                      </div>
                    </div>

                    {/* Fecha */}
                    <div className="capsule-col col-fecha">
                      <div className="fecha-cell">
                        <Calendar size={14} className="fecha-calendar-icon" />
                        <span>{res.fecha}</span>
                      </div>
                    </div>

                    {/* Personas */}
                    <div className="capsule-col col-personas">
                      <div className="personas-cell">
                        <Users size={14} className="personas-users-icon" />
                        <span>{res.personas}</span>
                      </div>
                    </div>

                    {/* Estado */}
                    <div className="capsule-col col-estado">
                      {renderStatusBadge(res.estado)}
                    </div>

                    {/* Acciones */}
                    <div className="capsule-col col-acciones">
                      <div className="capsule-actions-group">
                        <button
                          type="button"
                          className="capsule-action-btn btn-view"
                          title="Ver detalles de la reserva"
                          onClick={() => navigate(`/reservas/${res.id}`)}
                        >
                          <Eye size={15} />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              className="capsule-action-btn btn-edit"
                              title="Editar reserva"
                              onClick={() => handleOpenEdit(res)}
                            >
                              <Edit2 size={15} />
                            </button>

                            <button
                              type="button"
                              className="capsule-action-btn btn-delete"
                              title="Eliminar reserva"
                              onClick={() => setReservaToDelete(res)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Paginación Inferior */}
        <div className="reservas-pagination-bar">
          <button
            type="button"
            className="dark-page-arrow-btn"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            title="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`dark-page-num-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="dark-page-arrow-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            title="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Marca de agua decorativa de silueta montañosa */}
        <div className="reservas-card-watermark">
          <Mountain size={110} strokeWidth={1.2} />
        </div>
      </section>

      {/* Modal de Formulario (Formik + Yup) */}
      <ReservaFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        reservaToEdit={reservaToEdit}
        rutas={rutas}
        onSuccess={loadData}
      />

      {/* Modal de Confirmación de Eliminación */}
      <DeleteConfirmModal
        isOpen={Boolean(reservaToDelete)}
        onClose={() => setReservaToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Reserva?"
        message={`¿Estás seguro de que deseas eliminar la reserva #${reservaToDelete?.id} de ${reservaToDelete?.cliente}? Los cupos reservados serán restituidos a la ruta.`}
        isLoading={deleteLoading}
      />
    </div>
  );
}
