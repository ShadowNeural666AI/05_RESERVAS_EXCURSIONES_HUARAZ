import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, openCredentialModal, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const isClientes = location.pathname === '/clientes';
  const isReportes = location.pathname === '/reportes';
  const isReservas = location.pathname === '/reservas';
  const isConfiguracion = location.pathname === '/configuracion';
  const isRutas = location.pathname === '/rutas' || location.pathname.startsWith('/rutas/');
  const isDarkView = location.pathname === '/' || isReportes || isReservas || isConfiguracion || isRutas;

  let searchPlaceholder = isAdmin
    ? 'Buscar rutas, destinos, clientes...'
    : 'Explorar excursiones, lagunas, nevados...';
  if (isClientes) searchPlaceholder = 'Buscar clientes, rutas...';
  if (isReportes) searchPlaceholder = 'Buscar reportes, rutas, clientes...';
  if (isReservas) searchPlaceholder = isAdmin ? 'Buscar clientes, rutas, reservas...' : 'Buscar en mis reservas...';

  const notificationCount = isClientes ? 2 : ((isReportes || isReservas) ? 3 : 1);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/rutas?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <header className={`top-header ${isDarkView ? 'top-header-dark' : ''}`}>
      {/* Buscador de Lupa con Diseño Ultra-Moderno y Funcional */}
      <form className="header-search-wrap" onSubmit={handleSearchSubmit}>
        <Search size={18} className="header-search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="header-search-clear-btn"
            onClick={handleClearSearch}
            aria-label="Limpiar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </form>

      <div className="header-right-actions">
        {/* Notificaciones con Badge */}
        <button
          type="button"
          className="header-bell-btn"
          title="Notificaciones del sistema"
          aria-label="Notificaciones"
        >
          <Bell size={18} />
          <span className="bell-badge">{notificationCount}</span>
        </button>

        {/* Badge de Perfil de Usuario (Navega al Perfil del usuario que inició sesión) */}
        <div
          className="user-profile-badge"
          onClick={() => navigate('/perfil')}
          title="Haz clic para abrir tu perfil de usuario"
          role="button"
          tabIndex={0}
        >
          <div className="header-avatar-container">
            <img
              src={user.avatar}
              alt={user.nombre}
              className="user-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/avatar.jpg';
              }}
            />
            <span className="header-status-indicator" title="En línea"></span>
          </div>
          <div className="header-user-text-col">
            <span className="user-name">{user.nombre}</span>
            <span className="user-role-micro-label">
              {isAdmin ? 'Administrador' : 'Turista'}
            </span>
          </div>
          <ChevronDown size={14} className="user-chevron" />
        </div>

        {/* Botón Cerrar Sesión para volver al login */}
        <button
          type="button"
          className="header-logout-btn"
          onClick={logout}
          title="Cerrar sesión"
        >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
}
