import React, { useState, useEffect } from 'react';
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
  Phone,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useAuth, DEMO_CLIENTS } from '../context/AuthContext';

export default function Login() {
  const { loginAsAdmin, loginAsUser, loginWithCredentials, registerUser, registeredUsers } = useAuth();
  
  // Modo de pantalla: 'login' (Iniciar sesión) o 'register' (Registrarse)
  const [authMode, setAuthMode] = useState('login');
  // Rol seleccionado en login: 'admin' o 'usuario'
  const [selectedRole, setSelectedRole] = useState('admin');
  
  // CAMPOS VACÍOS POR DEFECTO PARA QUE LOS LLENE EL USUARIO O EL ADMIN
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Campos para el registro de nuevos usuarios
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de visibilidad y UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sistema de seguridad: Intentos fallidos y bloqueo temporal
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Contador de bloqueo regresivo por seguridad
  useEffect(() => {
    let interval = null;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setFeedback(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lockoutTimer]);

  // Validaciones en tiempo real de campos
  const validateField = (fieldName, value) => {
    let error = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,60}$/;
    const phoneRegex = /^9\d{8}$/;

    switch (fieldName) {
      case 'email':
        if (!value.trim()) {
          error = 'El correo electrónico es obligatorio.';
        } else if (!emailRegex.test(value.trim())) {
          error = 'Ingresa un formato de correo válido (ej. usuario@correo.com).';
        } else if (authMode === 'login' && selectedRole === 'admin' && !value.trim().endsWith('@huaraztours.com')) {
          error = 'Para Administrador debes usar el correo institucional (@huaraztours.com).';
        }
        break;

      case 'password':
        if (!value) {
          error = 'La contraseña es obligatoria.';
        } else if (value.length < 6) {
          error = 'La contraseña debe tener al menos 6 caracteres.';
        }
        break;

      case 'nombre':
        if (!value.trim()) {
          error = 'El nombre completo es obligatorio.';
        } else if (!nameRegex.test(value.trim())) {
          error = 'El nombre solo debe contener letras y al menos 3 caracteres.';
        }
        break;

      case 'dni':
        if (!value.trim()) {
          error = 'El número de DNI es obligatorio.';
        } else if (value.trim().length !== 8) {
          error = 'El DNI debe tener exactamente 8 dígitos numéricos.';
        }
        break;

      case 'telefono':
        if (value.trim() && !phoneRegex.test(value.trim())) {
          error = 'El celular debe tener 9 dígitos y comenzar con 9 (ej. 987654321).';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Confirma tu contraseña.';
        } else if (value !== password) {
          error = 'Las contraseñas no coinciden.';
        }
        break;

      default:
        break;
    }

    setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error;
  };

  const handleBlur = (fieldName, value) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
  };

  // Cambio de rol en Login
  const handleRoleChange = (role) => {
    if (lockoutTimer > 0) return;
    setSelectedRole(role);
    setFeedback(null);
    setEmail('');
    setPassword('');
    setFieldErrors({});
    setTouched({});
  };

  // Cambiar a modo Registro
  const handleGoToRegister = () => {
    if (lockoutTimer > 0) return;
    setAuthMode('register');
    setSelectedRole('usuario');
    setFeedback(null);
    setEmail('');
    setPassword('');
    setNombre('');
    setDni('');
    setTelefono('');
    setConfirmPassword('');
    setFieldErrors({});
    setTouched({});
  };

  // Cambiar a modo Login
  const handleGoToLogin = () => {
    setAuthMode('login');
    setFeedback(null);
    setEmail('');
    setPassword('');
    setFieldErrors({});
    setTouched({});
  };

  // Envío del formulario de Login con verificación estricta de restricciones
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (lockoutTimer > 0) {
      setFeedback({
        type: 'error',
        text: `Acceso restringido temporalmente por seguridad. Espera ${lockoutTimer} segundos.`
      });
      return;
    }

    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);

    setTouched({ email: true, password: true });

    if (emailErr || passErr) {
      setFeedback({
        type: 'error',
        text: 'Por favor corrige los campos señalados antes de ingresar.'
      });
      return;
    }

    // Validación de credenciales
    const res = loginWithCredentials(email, password, selectedRole);
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setFailedAttempts(0);
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= 3) {
        setLockoutTimer(30);
        setFeedback({
          type: 'error',
          text: 'Restricción de Seguridad: 3 intentos fallidos consecutivos. El acceso ha sido bloqueado por 30 segundos.'
        });
      } else {
        setFeedback({
          type: 'error',
          text: `${res.message} (Intento fallido ${nextAttempts}/3)`
        });
      }
    }
  };

  // Envío del formulario de Registro con validaciones estrictas
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    const nombreErr = validateField('nombre', nombre);
    const dniErr = validateField('dni', dni);
    const emailErr = validateField('email', email);
    const telErr = validateField('telefono', telefono);
    const passErr = validateField('password', password);
    const confErr = validateField('confirmPassword', confirmPassword);

    setTouched({
      nombre: true,
      dni: true,
      email: true,
      telefono: true,
      password: true,
      confirmPassword: true
    });

    if (nombreErr || dniErr || emailErr || telErr || passErr || confErr) {
      setFeedback({
        type: 'error',
        text: 'Existen restricciones en los campos. Revisa los datos ingresados.'
      });
      return;
    }

    const res = registerUser({
      nombre: nombre.trim(),
      correo: email.trim(),
      dni: dni.trim(),
      telefono: telefono.trim(),
      password: password.trim(),
    });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  // Indicador de fuerza de contraseña
  const getPasswordStrength = (pass) => {
    if (!pass) return null;
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[!@#$%^&*]/.test(pass)) score++;

    if (score <= 2) return { label: 'Débil', color: '#ef4444', percent: '33%' };
    if (score <= 4) return { label: 'Media', color: '#f59e0b', percent: '66%' };
    return { label: 'Segura', color: '#10b981', percent: '100%' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setFeedback({
      type: 'info',
      text: selectedRole === 'admin'
        ? 'Restricción Admin: Usa exclusivamente admin@huaraztours.com y contraseña admin123'
        : 'Para ingresar como Turista de prueba usa maria.lopez@email.com / turista123 o regístrate.'
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
                  disabled={lockoutTimer > 0}
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
                  disabled={lockoutTimer > 0}
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

              {/* Banner de bloqueo por intentos fallidos */}
              {lockoutTimer > 0 && (
                <div className="huaraz-lockout-banner">
                  <Clock size={18} className="lockout-clock-icon" />
                  <div>
                    <strong>Acceso temporalmente restringido</strong>
                    <span>Por seguridad, espera <strong>{lockoutTimer}s</strong> para reintentar.</span>
                  </div>
                </div>
              )}

              {/* Feedback de estado */}
              {feedback && (
                <div className={`huaraz-feedback-banner ${feedback.type}`}>
                  {feedback.type === 'error' ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
                  <span>{feedback.text}</span>
                </div>
              )}

              {/* Formulario de Login */}
              <form onSubmit={handleLoginSubmit} className="huaraz-login-form" noValidate>
                {/* Input de Correo con Restricciones */}
                <div className="huaraz-field-block">
                  <div className={`huaraz-input-pill ${fieldErrors.email && touched.email ? 'input-pill-error' : ''}`}>
                    <Mail size={18} strokeWidth={2.2} className="input-pill-icon" />
                    <input
                      type="email"
                      placeholder="Correo Electrónico"
                      value={email}
                      disabled={lockoutTimer > 0}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setEmail(val);
                        if (touched.email) validateField('email', val);
                      }}
                      onBlur={() => handleBlur('email', email)}
                      className="input-pill-field"
                      autoComplete="email"
                    />
                  </div>
                  {fieldErrors.email && touched.email && (
                    <div className="huaraz-field-error-msg">
                      <AlertCircle size={13} />
                      <span>{fieldErrors.email}</span>
                    </div>
                  )}
                </div>

                {/* Input de Contraseña con Restricciones */}
                <div className="huaraz-field-block">
                  <div className={`huaraz-input-pill ${fieldErrors.password && touched.password ? 'input-pill-error' : ''}`}>
                    <Lock size={18} strokeWidth={2.2} className="input-pill-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Contraseña"
                      value={password}
                      disabled={lockoutTimer > 0}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPassword(val);
                        if (touched.password) validateField('password', val);
                      }}
                      onBlur={() => handleBlur('password', password)}
                      className="input-pill-field"
                      autoComplete="current-password"
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
                  {fieldErrors.password && touched.password && (
                    <div className="huaraz-field-error-msg">
                      <AlertCircle size={13} />
                      <span>{fieldErrors.password}</span>
                    </div>
                  )}
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
                <button
                  type="submit"
                  className={`huaraz-btn-submit ${lockoutTimer > 0 ? 'btn-disabled' : ''}`}
                  disabled={lockoutTimer > 0}
                >
                  <ArrowRight size={20} strokeWidth={2.4} className="btn-arrow-icon" />
                  <span>{lockoutTimer > 0 ? `Bloqueado (${lockoutTimer}s)` : 'Ingresar'}</span>
                </button>

                {/* Ayudas sutiles de demo al hacer clic */}
                <div className="huaraz-demo-tips">
                  {selectedRole === 'admin' ? (
                    <span onClick={() => { setEmail('admin@huaraztours.com'); setPassword('admin123'); setFieldErrors({}); }} className="demo-hint-click">
                      💡 Credencial Admin oficial: <strong>admin@huaraztours.com</strong> / <strong>admin123</strong>
                    </span>
                  ) : (
                    <span onClick={() => { setEmail('maria.lopez@email.com'); setPassword('turista123'); setFieldErrors({}); }} className="demo-hint-click">
                      💡 Turista demo registrado: <strong>maria.lopez@email.com</strong> / <strong>turista123</strong>
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
                  disabled={lockoutTimer > 0}
                >
                  <UserPlus size={18} strokeWidth={2.2} />
                  <span>Registrarse</span>
                </button>
              </form>
            </>
          )}

          {/* MODO 2: REGISTRARSE (Crear cuenta y entrar) CON RESTRICCIONES */}
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
                  {feedback.type === 'error' ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
                  <span>{feedback.text}</span>
                </div>
              )}

              {/* Formulario de Registro con Restricciones */}
              <form onSubmit={handleRegisterSubmit} className="huaraz-login-form" noValidate>
                {/* Nombre Completo: Solo letras y espacios, mín 3 caracteres */}
                <div className="huaraz-field-block">
                  <div className={`huaraz-input-pill ${fieldErrors.nombre && touched.nombre ? 'input-pill-error' : ''}`}>
                    <User size={18} strokeWidth={2.2} className="input-pill-icon" />
                    <input
                      type="text"
                      placeholder="Nombre Completo (solo letras)"
                      value={nombre}
                      onChange={(e) => {
                        // Restricción en vivo: solo letras, espacios y tildes
                        const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                        setNombre(val);
                        if (touched.nombre) validateField('nombre', val);
                      }}
                      onBlur={() => handleBlur('nombre', nombre)}
                      className="input-pill-field"
                      maxLength={50}
                    />
                  </div>
                  {fieldErrors.nombre && touched.nombre && (
                    <div className="huaraz-field-error-msg">
                      <AlertCircle size={13} />
                      <span>{fieldErrors.nombre}</span>
                    </div>
                  )}
                </div>

                {/* DNI: Exactamente 8 dígitos numéricos */}
                <div className="huaraz-field-block">
                  <div className={`huaraz-input-pill ${fieldErrors.dni && touched.dni ? 'input-pill-error' : ''}`}>
                    <FileText size={18} strokeWidth={2.2} className="input-pill-icon" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="DNI (exactamente 8 dígitos)"
                      value={dni}
                      onChange={(e) => {
                        // Restricción en vivo: solo números, máx 8 dígitos
                        const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                        setDni(val);
                        if (touched.dni) validateField('dni', val);
                      }}
                      onBlur={() => handleBlur('dni', dni)}
                      className="input-pill-field"
                      maxLength={8}
                    />
                  </div>
                  {fieldErrors.dni && touched.dni && (
                    <div className="huaraz-field-error-msg">
                      <AlertCircle size={13} />
                      <span>{fieldErrors.dni}</span>
                    </div>
                  )}
                </div>

                {/* Correo Electrónico: Formato de correo válido y sin espacios */}
                <div className="huaraz-field-block">
                  <div className={`huaraz-input-pill ${fieldErrors.email && touched.email ? 'input-pill-error' : ''}`}>
                    <Mail size={18} strokeWidth={2.2} className="input-pill-icon" />
                    <input
                      type="email"
                      placeholder="Correo Electrónico (ej. usuario@correo.com)"
                      value={email}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setEmail(val);
                        if (touched.email) validateField('email', val);
                      }}
                      onBlur={() => handleBlur('email', email)}
                      className="input-pill-field"
                      autoComplete="email"
                    />
                  </div>
                  {fieldErrors.email && touched.email && (
                    <div className="huaraz-field-error-msg">
                      <AlertCircle size={13} />
                      <span>{fieldErrors.email}</span>
                    </div>
                  )}
                </div>

                {/* Celular / Teléfono (Opcional): 9 dígitos iniciando en 9 */}
                <div className="huaraz-field-block">
                  <div className={`huaraz-input-pill ${fieldErrors.telefono && touched.telefono ? 'input-pill-error' : ''}`}>
                    <Phone size={18} strokeWidth={2.2} className="input-pill-icon" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Celular (9 dígitos, opcional)"
                      value={telefono}
                      onChange={(e) => {
                        // Restricción en vivo: solo números, máx 9 dígitos
                        const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                        setTelefono(val);
                        if (touched.telefono) validateField('telefono', val);
                      }}
                      onBlur={() => handleBlur('telefono', telefono)}
                      className="input-pill-field"
                      maxLength={9}
                    />
                  </div>
                  {fieldErrors.telefono && touched.telefono && (
                    <div className="huaraz-field-error-msg">
                      <AlertCircle size={13} />
                      <span>{fieldErrors.telefono}</span>
                    </div>
                  )}
                </div>

                {/* Contraseña: Mínimo 6 caracteres con medidor de fuerza */}
                <div className="huaraz-field-block">
                  <div className={`huaraz-input-pill ${fieldErrors.password && touched.password ? 'input-pill-error' : ''}`}>
                    <Lock size={18} strokeWidth={2.2} className="input-pill-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Contraseña (mínimo 6 caracteres)"
                      value={password}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPassword(val);
                        if (touched.password) validateField('password', val);
                        if (touched.confirmPassword && confirmPassword) {
                          if (val !== confirmPassword) {
                            setFieldErrors((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden.' }));
                          } else {
                            setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                          }
                        }
                      }}
                      onBlur={() => handleBlur('password', password)}
                      className="input-pill-field"
                      autoComplete="new-password"
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

                  {/* Medidor visual de seguridad de contraseña */}
                  {passwordStrength && (
                    <div className="huaraz-strength-meter">
                      <div className="strength-bar-track">
                        <div
                          className="strength-bar-fill"
                          style={{
                            width: passwordStrength.percent,
                            backgroundColor: passwordStrength.color,
                          }}
                        />
                      </div>
                      <span className="strength-label" style={{ color: passwordStrength.color }}>
                        Seguridad: {passwordStrength.label}
                      </span>
                    </div>
                  )}

                  {fieldErrors.password && touched.password && (
                    <div className="huaraz-field-error-msg">
                      <AlertCircle size={13} />
                      <span>{fieldErrors.password}</span>
                    </div>
                  )}
                </div>

                {/* Confirmar Contraseña: Debe coincidir */}
                <div className="huaraz-field-block">
                  <div className={`huaraz-input-pill ${fieldErrors.confirmPassword && touched.confirmPassword ? 'input-pill-error' : ''}`}>
                    <ShieldCheck size={18} strokeWidth={2.2} className="input-pill-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirma tu Contraseña"
                      value={confirmPassword}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfirmPassword(val);
                        if (touched.confirmPassword) validateField('confirmPassword', val);
                      }}
                      onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                      className="input-pill-field"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="input-pill-eye-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Ver u ocultar confirmación de contraseña"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && touched.confirmPassword && (
                    <div className="huaraz-field-error-msg">
                      <AlertCircle size={13} />
                      <span>{fieldErrors.confirmPassword}</span>
                    </div>
                  )}
                </div>

                {/* Botón Crear Cuenta y Entrar */}
                <button type="submit" className="huaraz-btn-submit" style={{ marginTop: '8px' }}>
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
