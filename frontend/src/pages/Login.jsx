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
  AlertCircle,
  X,
  Compass,
  FileText,
  Phone
} from 'lucide-react';
import { useAuth, DEMO_CLIENTS } from '../context/AuthContext';

export default function Login() {
  const { loginAsAdmin, loginAsUser, loginWithCredentials, registerUser, registeredUsers } = useAuth();
  
  // Modo de pantalla: 'login' (Iniciar sesión) o 'register' (Registrarse)
  const [authMode, setAuthMode] = useState('login');
  // Rol seleccionado en modo login: 'admin' o 'usuario'
  const [selectedRole, setSelectedRole] = useState('admin');
  
  // CAMPOS VACÍOS POR DEFECTO PARA QUE LOS LLENE EL USUARIO O EL ADMIN
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Campos adicionales para el registro de nuevos usuarios
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [showTouristDrawer, setShowTouristDrawer] = useState(false);

  // Cambio de Rol en modo Login
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFeedback(null);
    setEmail('');
    setPassword('');
    setShowTouristDrawer(false);
  };

  // Cambio a modo Registro
  const handleGoToRegister = () => {
    setAuthMode('register');
    setSelectedRole('usuario');
    setFeedback(null);
    setEmail('');
    setPassword('');
    setNombre('');
    setDni('');
    setTelefono('');
    setShowTouristDrawer(false);
  };

  // Cambio a modo Login
  const handleGoToLogin = () => {
    setAuthMode('login');
    setFeedback(null);
    setEmail('');
    setPassword('');
    setShowTouristDrawer(false);
  };

  // Envío del formulario de Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setFeedback({ type: 'error', text: 'Por favor ingresa tu correo electrónico.' });
      return;
    }
    const res = loginWithCredentials(email, password, selectedRole);
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  // Envío del formulario de Registro
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      setFeedback({ type: 'error', text: 'Por favor completa al menos tu nombre y correo electrónico.' });
      return;
    }
    if (!password.trim()) {
      setFeedback({ type: 'error', text: 'Por favor ingresa una contraseña para tu cuenta.' });
      return;
    }

    const res = registerUser({
      nombre: nombre.trim(),
      correo: email.trim(),
      dni: dni.trim() || '12345678',
      telefono: telefono.trim(),
      password: password.trim(),
    });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  // Selección rápida de perfiles de prueba
  const handleSelectTourist = (client) => {
    setEmail(client.correo);
    setPassword('turista123');
    setSelectedRole('usuario');
    setShowTouristDrawer(false);
    const res = loginAsUser(client);
    setFeedback({ type: 'success', text: res.message });
  };

  // Rellenar credenciales demo de admin para comodidad si el usuario hace clic en el tip
  const handleFillDemoAdmin = () => {
    setEmail('admin@huaraztours.com');
    setPassword('admin123');
  };

  // Rellenar credenciales demo de turista si el usuario hace clic en el tip
  const handleFillDemoTourist = () => {
    setEmail('maria.lopez@email.com');
    setPassword('turista123');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setFeedback({
      type: 'info',
      text: selectedRole === 'admin'
        ? 'Credenciales Administrador: admin@huaraztours.com / admin123'
        : 'Para entrar como Turista puedes usar maria.lopez@email.com / turista123 o crear tu cuenta.'
    });
  };

  return (
    <div className="huaraz-login-universe">
      {/* Fondo Panorámico de la Cordillera Blanca */}
      <div className="huaraz-login-panoramic-bg" />
      <div className="huaraz-login-vignette" />

      {/* Contenedor Principal (2 Columnas) */}
      <div className="huaraz-login-container">
        
        {/* COLUMNA IZQUIERDA: Marca & Identidad Huaraz Tours */}
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
          
          {/* MODO 1: INICIAR SESIÓN */}
          {authMode === 'login' && (
            <>
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
                  {feedback.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                  <span>{feedback.text}</span>
                </div>
              )}

              {/* Formulario de Login */}
              <form onSubmit={handleLoginSubmit} className="huaraz-login-form">
                {/* Input de Correo (Vacío por defecto) */}
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

                {/* Input de Contraseña (Vacío por defecto) */}
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

                {/* Ayudas sutiles de demo al hacer clic */}
                <div className="huaraz-demo-tips">
                  {selectedRole === 'admin' ? (
                    <span onClick={handleFillDemoAdmin} className="demo-hint-click">
                      💡 ¿Probar Admin demo? Rellenar <strong>admin@huaraztours.com</strong>
                    </span>
                  ) : (
                    <span onClick={handleFillDemoTourist} className="demo-hint-click">
                      💡 ¿Probar Turista demo? Rellenar <strong>maria.lopez@email.com</strong>
                    </span>
                  )}
                </div>

                {/* Separador de Registro */}
                <div className="huaraz-card-divider">
                  ¿No tienes una cuenta?
                </div>

                {/* Botón Registrarse (Abre el formulario de registro) */}
                <button
                  type="button"
                  className="huaraz-btn-register"
                  onClick={handleGoToRegister}
                >
                  <UserPlus size={18} strokeWidth={2.2} />
                  <span>Registrarse</span>
                </button>
              </form>
            </>
          )}

          {/* MODO 2: REGISTRARSE (Crear cuenta y entrar) */}
          {authMode === 'register' && (
            <>
              {/* Encabezado de Registro */}
              <div className="huaraz-card-header">
                <div className="heading-title-row">
                  <UserPlus size={28} strokeWidth={2.2} className="heading-mountain-icon" />
                  <h2 className="heading-title-text">Crear Cuenta</h2>
                </div>
                <div className="heading-subtitle-row">
                  <span className="heading-line" />
                  <span className="heading-subtitle-text">Regístrate como turista para explorar y reservar</span>
                  <span className="heading-line" />
                </div>
              </div>

              {/* Feedback de estado */}
              {feedback && (
                <div className={`huaraz-feedback-banner ${feedback.type}`}>
                  {feedback.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                  <span>{feedback.text}</span>
                </div>
              )}

              {/* Formulario de Registro */}
              <form onSubmit={handleRegisterSubmit} className="huaraz-login-form">
                {/* Nombre Completo */}
                <div className="huaraz-input-pill">
                  <User size={18} strokeWidth={2.2} className="input-pill-icon" />
                  <input
                    type="text"
                    placeholder="Nombre Completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="input-pill-field"
                    required
                  />
                </div>

                {/* DNI / Documento */}
                <div className="huaraz-input-pill">
                  <FileText size={18} strokeWidth={2.2} className="input-pill-icon" />
                  <input
                    type="text"
                    placeholder="DNI o Documento de Identidad"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="input-pill-field"
                    maxLength={12}
                  />
                </div>

                {/* Correo Electrónico */}
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

                {/* Teléfono (Opcional) */}
                <div className="huaraz-input-pill">
                  <Phone size={18} strokeWidth={2.2} className="input-pill-icon" />
                  <input
                    type="tel"
                    placeholder="Teléfono / Celular (Opcional)"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="input-pill-field"
                  />
                </div>

                {/* Contraseña */}
                <div className="huaraz-input-pill">
                  <Lock size={18} strokeWidth={2.2} className="input-pill-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Crea una Contraseña"
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

                {/* Botón Crear Cuenta y Entrar */}
                <button type="submit" className="huaraz-btn-submit" style={{ marginTop: '6px' }}>
                  <UserPlus size={20} strokeWidth={2.4} className="btn-arrow-icon" />
                  <span>Crear Cuenta y Entrar</span>
                </button>

                {/* Separador */}
                <div className="huaraz-card-divider">
                  ¿Ya tienes una cuenta?
                </div>

                {/* Volver a Iniciar Sesión */}
                <button
                  type="button"
                  className="huaraz-btn-register"
                  onClick={handleGoToLogin}
                >
                  <ArrowRight size={18} strokeWidth={2.2} />
                  <span>Iniciar sesión</span>
                </button>
              </form>
            </>
          )}

          {/* Cajón interactivo para probar turistas demo (opcional) */}
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
