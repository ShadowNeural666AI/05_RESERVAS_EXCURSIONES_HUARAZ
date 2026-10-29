import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  Compass,
  Mail,
  Phone,
  CreditCard,
  Mountain,
  CalendarCheck,
  LogOut,
  MapPin,
  CheckCircle2,
  Sparkles,
  UserCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CredentialModal() {
  const navigate = useNavigate();
  const {
    user,
    isAdmin,
    isUser,
    switchRole,
    demoClients,
    isCredentialModalOpen,
    closeCredentialModal,
    logout
  } = useAuth();

  if (!isCredentialModalOpen) return null;

  const handleNavigate = (path) => {
    closeCredentialModal();
    navigate(path);
  };

  const handleLogout = () => {
    closeCredentialModal();
    logout();
  };

  return (
    <div className="credential-modal-backdrop" onClick={closeCredentialModal}>
      <div
        className="profile-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Banner Superior con Montañas y Botón de Cerrar */}
        <div className="profile-modal-hero-banner">
          <div className="hero-banner-overlay" />
          <div className="hero-banner-content">
            <div className="profile-banner-badge">
              <Mountain size={14} />
              <span>Huaraz Tours • Portal de Usuario</span>
            </div>
          </div>
          <button
            type="button"
            className="profile-modal-close-btn"
            onClick={closeCredentialModal}
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sección de Avatar y Título Principal */}
        <div className="profile-user-hero-section">
          <div className="profile-avatar-wrapper">
            <img
              src={user.avatar}
              alt={user.nombre}
              className="profile-hero-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/avatar.jpg';
              }}
            />
            <span className="profile-online-badge" title="Usuario Conectado">
              <span className="online-pulse"></span>
            </span>
          </div>

          <div className="profile-hero-details">
            <div className="profile-name-row">
              <h2 className="profile-user-name">{user.nombre}</h2>
              <span className={`profile-role-tag ${isAdmin ? 'tag-admin' : 'tag-user'}`}>
                {isAdmin ? <ShieldCheck size={14} /> : <Compass size={14} />}
                <span>{isAdmin ? 'Administrador Oficial' : 'Turista / Explorador'}</span>
              </span>
            </div>
            <p className="profile-user-cargo">
              {user.cargo || (isAdmin ? 'Gestor de Operaciones y Reservas' : 'Turista Registrado')}
            </p>
          </div>
        </div>

        {/* Tarjetas de Métricas de Usuario */}
        <div className="profile-metrics-row">
          {isAdmin ? (
            <>
              <div className="profile-metric-card">
                <span className="metric-num">6</span>
                <span className="metric-label">Rutas Activas</span>
              </div>
              <div className="profile-metric-card">
                <span className="metric-num">48</span>
                <span className="metric-label">Reservas Totales</span>
              </div>
              <div className="profile-metric-card">
                <span className="metric-num">146</span>
                <span className="metric-label">Cupos Totales</span>
              </div>
            </>
          ) : (
            <>
              <div className="profile-metric-card">
                <span className="metric-num">{user.reservasCount || 1}</span>
                <span className="metric-label">Reservas Realizadas</span>
              </div>
              <div className="profile-metric-card">
                <span className="metric-num">100%</span>
                <span className="metric-label">Confirmada</span>
              </div>
              <div className="profile-metric-card">
                <span className="metric-num">VIP</span>
                <span className="metric-label">Categoría Turista</span>
              </div>
            </>
          )}
        </div>

        {/* Cuadrícula de Datos Personales */}
        <div className="profile-info-grid">
          <div className="profile-info-item">
            <div className="info-item-icon">
              <Mail size={16} />
            </div>
            <div className="info-item-text">
              <span className="info-label">Correo Electrónico</span>
              <span className="info-value">{user.correo}</span>
            </div>
            <span className="info-badge-verified">Verificado</span>
          </div>

          <div className="profile-info-item">
            <div className="info-item-icon">
              <CreditCard size={16} />
            </div>
            <div className="info-item-text">
              <span className="info-label">DNI / Documento</span>
              <span className="info-value">{user.dni || '00000001'}</span>
            </div>
          </div>

          <div className="profile-info-item">
            <div className="info-item-icon">
              <Phone size={16} />
            </div>
            <div className="info-item-text">
              <span className="info-label">Teléfono / Celular</span>
              <span className="info-value">{user.telefono || '043-421234'}</span>
            </div>
          </div>

          <div className="profile-info-item">
            <div className="info-item-icon">
              <MapPin size={16} />
            </div>
            <div className="info-item-text">
              <span className="info-label">Ubicación Preferida</span>
              <span className="info-value">Laguna 69 • Cordillera Blanca</span>
            </div>
          </div>
        </div>

        {/* Sección de Permisos y Privilegios */}
        <div className="profile-privileges-box">
          <div className="privileges-box-header">
            <Sparkles size={15} />
            <span>Capacidades de tu perfil ({isAdmin ? 'Administrador' : 'Turista'}):</span>
          </div>
          <ul className="privileges-checklist">
            {isAdmin ? (
              <>
                <li>
                  <CheckCircle2 size={14} className="check-icon" />
                  <span>Gestión completa (CRUD) de rutas turísticas y excursiones.</span>
                </li>
                <li>
                  <CheckCircle2 size={14} className="check-icon" />
                  <span>Auditoría general de clientes, cupos y reservas.</span>
                </li>
                <li>
                  <CheckCircle2 size={14} className="check-icon" />
                  <span>Acceso a reportes estadísticos, gráficos y configuración.</span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <CheckCircle2 size={14} className="check-icon" />
                  <span>Exploración interactiva del catálogo de rutas en Huaraz.</span>
                </li>
                <li>
                  <CheckCircle2 size={14} className="check-icon" />
                  <span>Reserva de cupos en tiempo real con confirmación inmediata.</span>
                </li>
                <li>
                  <CheckCircle2 size={14} className="check-icon" />
                  <span>Panel personal exclusivo de "Mis Reservas" y comprobantes.</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Selector sutil de rol para testing demo */}
        <div className="profile-role-toggle-bar">
          <span className="role-toggle-hint">Alternar perfil de prueba:</span>
          <div className="role-toggle-pills">
            <button
              type="button"
              className={`role-toggle-pill ${isAdmin ? 'pill-active' : ''}`}
              onClick={() => switchRole('admin')}
            >
              <ShieldCheck size={13} />
              <span>Modo Administrador</span>
            </button>
            <button
              type="button"
              className={`role-toggle-pill ${isUser ? 'pill-active' : ''}`}
              onClick={() => switchRole('usuario', demoClients[0])}
            >
              <Compass size={13} />
              <span>Modo Turista</span>
            </button>
          </div>
        </div>

        {/* Botones de Acción del Perfil */}
        <div className="profile-modal-actions">
          {isAdmin ? (
            <button
              type="button"
              className="profile-btn-primary"
              onClick={() => handleNavigate('/rutas')}
            >
              <Mountain size={16} />
              <span>Gestionar Rutas</span>
            </button>
          ) : (
            <button
              type="button"
              className="profile-btn-primary"
              onClick={() => handleNavigate('/reservas')}
            >
              <CalendarCheck size={16} />
              <span>Ver Mis Reservas</span>
            </button>
          )}

          <button
            type="button"
            className="profile-btn-logout"
            onClick={handleLogout}
            title="Cerrar sesión actual"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}
