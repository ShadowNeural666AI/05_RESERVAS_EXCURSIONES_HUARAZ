import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  CalendarCheck,
  Users,
  BarChart3,
  Settings,
  Mountain,
  ShieldCheck,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, isAdmin, isUser, openCredentialModal } = useAuth();

  return (
    <aside className="sidebar">
      {/* Top Logo */}
      <div className="sidebar-logo">
        <div className="logo-badge-container">
          <img
            src="/images/logo-huaraz-tours.png"
            alt="Logo Huaraz Tours"
            className="sidebar-brand-logo"
          />
        </div>
        <div className="sidebar-brand-text">
          <div className="logo-title">Huaraz Tours</div>
          <div className="logo-subtitle">Naturaleza que te inspira</div>
        </div>
      </div>

      {/* Nav Menu condicional según el rol */}
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Mountain size={19} />
          <span>Inicio</span>
        </NavLink>

        <NavLink
          to="/rutas"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Compass size={19} />
          <span>{isAdmin ? 'Rutas' : 'Explorar Rutas'}</span>
        </NavLink>

        <NavLink
          to="/reservas"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <CalendarCheck size={19} />
          <span>{isAdmin ? 'Reservas' : 'Mis Reservas'}</span>
        </NavLink>

        {/* Enlaces exclusivos para Administrador */}
        {isAdmin && (
          <>
            <NavLink
              to="/clientes"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Users size={19} />
              <span>Clientes</span>
            </NavLink>

            <NavLink
              to="/reportes"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <BarChart3 size={19} />
              <span>Reportes</span>
            </NavLink>

            <NavLink
              to="/configuracion"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Settings size={19} />
              <span>Configuración</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Mini Widget de Perfil Activo */}
      <div className="sidebar-role-widget">
        <div className="role-widget-card" onClick={openCredentialModal} title="Ver mi perfil de usuario">
          <div className="role-widget-avatar-wrap">
            <img src={user.avatar} alt={user.nombre} className="role-widget-avatar" />
            <span className={`role-dot ${isAdmin ? 'dot-admin' : 'dot-user'}`}></span>
          </div>
          <div className="role-widget-info">
            <span className="role-widget-name">{user.nombre.split(' ')[0]}</span>
            <span className="role-widget-role">
              {isAdmin ? '🛡️ Admin' : '🎒 Turista'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Mountain Graphic & Location */}
      <div className="sidebar-footer">
        <div className="sidebar-mountains-container">
          <img
            src="/images/montanas.png"
            alt="Cordillera de Huaraz"
            className="sidebar-montanas-asset"
          />
        </div>
        <div className="sidebar-location-info">
          <div className="sidebar-location-title">Huaraz</div>
          <div className="sidebar-location-sub">Áncash - Perú</div>
        </div>
      </div>
    </aside>
  );
}
