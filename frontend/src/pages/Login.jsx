import React, { useState } from 'react';
import {
  ShieldCheck,
  Compass,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Mountain,
  Users,
  CheckCircle2,
  CalendarCheck,
  Zap,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { loginAsAdmin, loginAsUser, demoClients, loginWithCredentials } = useAuth();
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' | 'usuario'
  const [selectedClient, setSelectedClient] = useState(demoClients[0]);
  const [adminEmail, setAdminEmail] = useState('admin@huaraztours.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const res = loginAsAdmin();
    setFeedback({ type: 'success', text: res.message });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const res = loginAsUser(selectedClient);
    setFeedback({ type: 'success', text: res.message });
  };

  return (
    <div className="login-page-wrapper">
      {/* Fondo panorámico con superposición cinemática */}
      <div className="login-panoramic-bg" />
      <div className="login-vignette-overlay" />

      {/* Contenedor Central */}
      <div className="login-card-container">
        {/* Logo y Encabezado de la Marca */}
        <div className="login-brand-header">
          <div className="login-logo-circle">
            <img
              src="/images/logo-huaraz-tours.png"
              alt="Huaraz Tours"
              className="login-brand-img"
            />
          </div>
          <div className="login-brand-text">
            <h1 className="login-title">Huaraz Tours</h1>
            <p className="login-tagline">Naturaleza que te inspira • Portal de Acceso</p>
          </div>
        </div>

        {/* Notificación de feedback si aplica */}
        {feedback && (
          <div className={`login-feedback-banner ${feedback.type}`}>
            <CheckCircle2 size={16} />
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Selector Visual de Rol Principal */}
        <div className="login-role-selector-tabs">
          <button
            type="button"
            className={`login-role-tab ${selectedRole === 'admin' ? 'active-admin' : ''}`}
            onClick={() => { setSelectedRole('admin'); setFeedback(null); }}
          >
            <ShieldCheck size={18} className="role-tab-icon" />
            <div className="role-tab-info">
              <span className="role-tab-title">Administrador</span>
              <span className="role-tab-sub">Gestión & Control Total</span>
            </div>
          </button>

          <button
            type="button"
            className={`login-role-tab ${selectedRole === 'usuario' ? 'active-user' : ''}`}
            onClick={() => { setSelectedRole('usuario'); setFeedback(null); }}
          >
            <Compass size={18} className="role-tab-icon" />
            <div className="role-tab-info">
              <span className="role-tab-title">Usuario / Turista</span>
              <span className="role-tab-sub">Exploración & Reservas</span>
            </div>
          </button>
        </div>

        {/* Panel para Administrador */}
        {selectedRole === 'admin' && (
          <form className="login-role-form" onSubmit={handleAdminSubmit}>
            <div className="role-privileges-box box-admin-privileges">
              <div className="privileges-title">
                <Sparkles size={14} />
                <span>Privilegios de Administrador:</span>
              </div>
              <ul className="privileges-list">
                <li>✓ Gestión integral (CRUD) de rutas turísticas</li>
                <li>✓ Auditoría general de reservas y control de clientes</li>
                <li>✓ Reportes estadísticos, gráficos y configuración</li>
              </ul>
            </div>

            <div className="login-field-group">
              <label className="login-field-label">Correo Administrativo</label>
              <div className="login-input-wrap">
                <Mail size={16} className="login-input-icon" />
                <input
                  type="email"
                  className="login-text-input"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@huaraztours.com"
                  required
                />
              </div>
            </div>

            <div className="login-field-group">
              <label className="login-field-label">Contraseña</label>
              <div className="login-input-wrap">
                <Lock size={16} className="login-input-icon" />
                <input
                  type="password"
                  className="login-text-input"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-submit-action-btn btn-admin-glow">
              <span>Ingresar como Administrador</span>
              <ArrowRight size={17} />
            </button>
          </form>
        )}

        {/* Panel para Turista / Usuario */}
        {selectedRole === 'usuario' && (
          <form className="login-role-form" onSubmit={handleUserSubmit}>
            <div className="role-privileges-box box-user-privileges">
              <div className="privileges-title">
                <Compass size={14} />
                <span>Experiencia de Usuario / Turista:</span>
              </div>
              <ul className="privileges-list">
                <li>✓ Catálogo de excursiones en la Cordillera Blanca</li>
                <li>✓ Reservas de cupos en vivo y confirmación inmediata</li>
                <li>✓ Panel personal exclusivo de "Mis Reservas"</li>
              </ul>
            </div>

            {/* Selector de Cliente / Turista de prueba */}
            <div className="login-field-group">
              <label className="login-field-label">Selecciona el perfil de Turista:</label>
              <div className="login-client-selector-grid">
                {demoClients.map((client) => {
                  const isSelected = selectedClient.id === client.id;
                  return (
                    <div
                      key={client.id}
                      className={`login-client-card ${isSelected ? 'client-card-selected' : ''}`}
                      onClick={() => setSelectedClient(client)}
                    >
                      <img
                        src={client.avatar}
                        alt={client.nombre}
                        className="login-client-avatar"
                      />
                      <div className="login-client-text">
                        <span className="client-name">{client.nombre}</span>
                        <span className="client-dni">DNI: {client.dni}</span>
                        <span className="client-badge">{client.categoria || 'Turista'}</span>
                      </div>
                      {isSelected && (
                        <div className="client-check-indicator">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="login-submit-action-btn btn-user-glow">
              <span>Ingresar como Turista ({selectedClient.nombre.split(' ')[0]})</span>
              <ArrowRight size={17} />
            </button>
          </form>
        )}

        {/* Accesos Rápidos con 1 Clic */}
        <div className="login-quick-access-footer">
          <div className="quick-access-label">
            <Zap size={14} className="zap-icon" />
            <span>Accesos Rápidos Demo (1 Clic):</span>
          </div>
          <div className="quick-access-buttons">
            <button
              type="button"
              className="quick-btn-admin"
              onClick={() => loginAsAdmin()}
            >
              <ShieldCheck size={14} />
              <span>Entrar como Admin</span>
            </button>

            <button
              type="button"
              className="quick-btn-user"
              onClick={() => loginAsUser(demoClients[0])}
            >
              <Compass size={14} />
              <span>Entrar como Turista (María)</span>
            </button>
          </div>
        </div>

        {/* Pie de página informativo */}
        <div className="login-card-bottom-bar">
          <Mountain size={14} className="bottom-mount-icon" />
          <span>Huaraz Tours • Cordillera Blanca, Áncash - Perú</span>
        </div>
      </div>
    </div>
  );
}
