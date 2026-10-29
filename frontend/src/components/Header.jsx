import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, ShieldCheck, Compass, KeyRound, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const { user, isAdmin, openCredentialModal, logout } = useAuth();

  const isReportes = location.pathname === '/reportes';
  const isReservas = location.pathname === '/reservas';
  const isConfiguracion = location.pathname === '/configuracion';
  const isRutas = location.pathname === '/rutas' || location.pathname.startsWith('/rutas/');
  const isDarkView = location.pathname === '/' || isReportes || isReservas || isConfiguracion || isRutas;

  let searchPlaceholder = isAdmin
    ? 'Buscar rutas, destinos, clientes...'
    : 'Explorar excursiones, lagunas, nevados...';
  if (isReportes) searchPlaceholder = 'Buscar reportes, rutas, clientes...';
  if (isReservas) searchPlaceholder = isAdmin ? 'Buscar clientes, rutas, reservas...' : 'Buscar en mis reservas...';

  const notificationCount = (isReportes || isReservas) ? 3 : 1;

  return (
    <header className={`top-header ${isDarkView ? 'top-header-dark' : ''}`}>
      <div className="header-search-wrap">
        <Search size={16} className="header-search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder={searchPlaceholder}
        />
      </div>

      <div className="header-right-actions">
        {/* Botón Acceso Rápido a Credenciales y Roles */}
        <button
          type="button"
          className={`header-role-switcher-btn ${isAdmin ? 'role-btn-admin' : 'role-btn-user'}`}
          onClick={openCredentialModal}
          title="Abrir Panel de Credenciales y Roles"
        >
          {isAdmin ? <ShieldCheck size={15} /> : <Compass size={15} />}
          <span className="role-switcher-text">
            {isAdmin ? 'Admin' : 'Turista'}
          </span>
          <span className="role-switcher-pill">Cambiar</span>
        </button>

        {/* Notification Bell with Badge */}
        <button
          type="button"
          className="header-bell-btn"
          title="Notificaciones"
          aria-label="Notificaciones"
        >
          <Bell size={18} />
          <span className="bell-badge">{notificationCount}</span>
        </button>

        {/* User Profile Badge (Clickable para abrir panel de credenciales) */}
        <div
          className="user-profile-badge"
          onClick={openCredentialModal}
          title="Haz clic para ver credenciales y cambiar de rol"
        >
          <img
            src={user.avatar}
            alt={user.nombre}
            className="user-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/avatar.jpg';
            }}
          />
          <div className="header-user-text-col">
            <span className="user-name">{user.nombre}</span>
            <span className="user-role-micro-label">
              {isAdmin ? 'Administrador' : 'Turista / Cliente'}
            </span>
          </div>
          <ChevronDown size={14} className="user-chevron" />
        </div>

        {/* Botón Cerrar Sesión para volver al login */}
        <button
          type="button"
          className="header-logout-btn"
          onClick={logout}
          title="Cerrar sesión y volver a la pantalla de login"
        >
          <LogOut size={16} />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}
