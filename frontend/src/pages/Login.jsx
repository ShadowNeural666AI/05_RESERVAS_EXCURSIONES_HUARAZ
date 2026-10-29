import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  UserPlus,
  Mountain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Camera,
  CheckCircle2,
  X,
  Compass,
  Sparkles
} from 'lucide-react';
import { useAuth, DEMO_CLIENTS } from '../context/AuthContext';

export default function Login() {
  const { loginAsAdmin, loginAsUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' | 'usuario'
  const [email, setEmail] = useState('admin@huaraztours.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [showTouristDrawer, setShowTouristDrawer] = useState(false);
  const [selectedClient, setSelectedClient] = useState(DEMO_CLIENTS[0]);

  // Selección de rol (Administrador vs Usuario / Turista)
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFeedback(null);
    if (role === 'admin') {
      setEmail('admin@huaraztours.com');
      setPassword('admin123');
      setShowTouristDrawer(false);
    } else {
      setEmail(selectedClient ? selectedClient.correo : 'maria.lopez@email.com');
      setPassword('turista123');
    }
  };

  // Selección rápida de perfil de turista
  const handleSelectTourist = (client) => {
    setSelectedClient(client);
    setEmail(client.correo);
    setPassword('turista123');
    setSelectedRole('usuario');
    setShowTouristDrawer(false);
    const res = loginAsUser(client);
    setFeedback({ type: 'success', text: res.message });
  };

  // Envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'admin') {
      const res = loginAsAdmin();
      setFeedback({ type: 'success', text: res.message });
    } else {
      const matched = DEMO_CLIENTS.find((c) => c.correo.toLowerCase() === email.toLowerCase());
      const res = loginAsUser(matched || selectedClient);
      setFeedback({ type: 'success', text: res.message });
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setFeedback({
      type: 'info',
      text: selectedRole === 'admin'
        ? 'Credenciales Demo Administrador: admin@huaraztours.com / admin123'
        : 'Credenciales Demo Turista: ' + (selectedClient?.correo || 'maria.lopez@email.com') + ' / turista123'
    });
  };

  return (
    <div className="huaraz-login-universe">
      {/* Fondo Panorámico de la Cordillera Blanca */}
      <div className="huaraz-login-panoramic-bg" />
      <div className="huaraz-login-vignette" />

      {/* Contenedor Principal (2 Columnas) */}
      <div className="huaraz-login-container">
        
        {/* COLUMNA IZQUIERDA: Marca & Identidad */}
        <div className="huaraz-brand-showcase">
          {/* Logo Oficial de Huaraz Tours */}
          <div className="huaraz-emblem-wrapper">
            <img
              src="/images/logo-huaraz-tours.png"
              alt="Huaraz Tours Logo"
              className="huaraz-emblem-img"
            />
          </div>

          {/* Título de Marca */}
          <h1 className="huaraz-brand-title">
            HUARAZ <span className="brand-accent-text">TOURS</span>
          </h1>

          {/* Subtítulo */}
          <h2 className="huaraz-brand-subtitle">
            NATURALEZA QUE TE INSPIRA
          </h2>

          {/* Arco cian de acento */}
          <div className="huaraz-brand-arc" />

          {/* Eslogan cursivo elegante */}
          <p className="huaraz-brand-slogan">
            Descubre, explora y disfruta
          </p>

          {/* Arco de acento dorado/cian */}
          <div className="huaraz-slogan-gold-accent" />

          {/* Insignias / Pills de características */}
          <div className="huaraz-badges-row">
            <div className="huaraz-badge-pill">
              <div className="badge-icon-circle">
                <Mountain size={18} strokeWidth={2.2} />
              </div>
              <div className="badge-text">
                <span>Rutas</span>
                <span>Increíbles</span>
              </div>
            </div>

            <div className="huaraz-badge-pill">
              <div className="badge-icon-circle">
                <Camera size={18} strokeWidth={2.2} />
              </div>
              <div className="badge-text">
                <span>Paisajes</span>
                <span>Únicos</span>
              </div>
            </div>

            <div className="huaraz-badge-pill">
              <div className="badge-icon-circle">
                <ShieldCheck size={18} strokeWidth={2.2} />
              </div>
              <div className="badge-text">
                <span>Viaja</span>
                <span>Seguro</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Tarjeta Glassmorphism */}
        <div className="huaraz-glass-card">
          
          {/* Selector de Rol Superior (Tabs) */}
          <div className="huaraz-role-tabs-grid">
            <button
              type="button"
              className={`huaraz-role-tab-btn ${selectedRole === 'admin' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => handleRoleChange('admin')}
            >
              <div className="tab-icon-wrap">
                <ShieldCheck size={18} strokeWidth={2.3} />
              </div>
              <div className="tab-text-wrap">
                <span className="tab-title">Administrador</span>
                <span className="tab-desc">Gestión & Control</span>
              </div>
            </button>

            <button
              type="button"
              className={`huaraz-role-tab-btn ${selectedRole === 'usuario' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => handleRoleChange('usuario')}
            >
              <div className="tab-icon-wrap">
                <User size={18} strokeWidth={2.3} />
              </div>
              <div className="tab-text-wrap">
                <span className="tab-title">Usuario / Turista</span>
                <span className="tab-desc">Exploración & Reservas</span>
              </div>
            </button>
          </div>

          {/* Encabezado del Formulario */}
          <div className="huaraz-card-header">
            <div className="heading-title-row">
              <Mountain size={28} strokeWidth={2.2} className="heading-mountain-icon" />
              <h2 className="heading-title-text">Iniciar sesión</h2>
            </div>
            <div className="heading-subtitle-row">
              <span className="heading-line" />
              <span className="heading-subtitle-text">Accede a tu cuenta para continuar</span>
              <span className="heading-line" />
            </div>
          </div>

          {/* Feedback de estado */}
          {feedback && (
            <div className={`huaraz-feedback-banner ${feedback.type}`}>
              <CheckCircle2 size={16} />
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Formulario de Login */}
          <form onSubmit={handleSubmit} className="huaraz-login-form">
            {/* Input de Correo */}
            <div className="huaraz-input-pill">
              <Mail size={18} strokeWidth={2.2} className="input-pill-icon" />
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-pill-field"
                required
              />
            </div>

            {/* Input de Contraseña */}
            <div className="huaraz-input-pill">
              <Lock size={18} strokeWidth={2.2} className="input-pill-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-pill-field"
                required
              />
              <button
                type="button"
                className="input-pill-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Ver u ocultar contraseña"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Opciones: Recordarme / Olvidaste contraseña */}
            <div className="huaraz-options-row">
              <label className="huaraz-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="huaraz-checkbox-input"
                />
                <span>Recordarme</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="huaraz-forgot-link"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón Principal Ingresar */}
            <button type="submit" className="huaraz-btn-submit">
              <ArrowRight size={20} strokeWidth={2.4} className="btn-arrow-icon" />
              <span>Ingresar</span>
            </button>

            {/* Separador de Registro */}
            <div className="huaraz-card-divider">
              ¿No tienes una cuenta?
            </div>

            {/* Botón Registrarse / Explorar como Turista */}
            <button
              type="button"
              className="huaraz-btn-register"
              onClick={() => {
                setSelectedRole('usuario');
                setShowTouristDrawer(!showTouristDrawer);
              }}
            >
              <UserPlus size={18} strokeWidth={2.2} />
              <span>Registrarse</span>
            </button>
          </form>

          {/* Cajón interactivo para seleccionar o probar turistas demo */}
          {showTouristDrawer && (
            <div className="huaraz-tourist-drawer">
              <div className="drawer-header">
                <span className="drawer-title">
                  <Compass size={15} /> Selecciona un perfil de Turista:
                </span>
                <button
                  type="button"
                  className="drawer-close-btn"
                  onClick={() => setShowTouristDrawer(false)}
                >
                  <X size={14} />
                </button>
              </div>
              <div className="drawer-tourists-list">
                {DEMO_CLIENTS.map((client) => (
                  <div
                    key={client.id}
                    className="drawer-tourist-item"
                    onClick={() => handleSelectTourist(client)}
                  >
                    <img
                      src={client.avatar}
                      alt={client.nombre}
                      className="drawer-tourist-avatar"
                    />
                    <div className="drawer-tourist-info">
                      <span className="tourist-name">{client.nombre}</span>
                      <span className="tourist-role">{client.categoria || 'Turista'} • DNI: {client.dni}</span>
                    </div>
                    <span className="tourist-select-chip">Entrar ➜</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pie de la tarjeta */}
          <div className="huaraz-card-footer">
            <Mountain size={15} strokeWidth={2.2} className="footer-mountain-icon" />
            <span>Cordillera Blanca • Áncash • Perú</span>
          </div>

        </div>

      </div>
    </div>
  );
}
