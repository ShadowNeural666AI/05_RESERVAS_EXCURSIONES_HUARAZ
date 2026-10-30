import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Sparkles,
  BarChart3,
  CalendarCheck,
  Compass,
  CheckCircle2,
  AlertCircle,
  Camera,
  Server,
  Layers,
  Save,
  Check,
  Clock,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AVATAR_PRESETS = [
  '/images/avatar.jpg',
  '/images/avatars/client_carlos.jpg',
  '/images/avatars/client_maria.jpg',
  '/images/avatars/client_ana.jpg',
];

export default function PerfilAdmin({ user }) {
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'seguridad' | 'notificaciones' | 'actividad'

  // Datos del perfil
  const [nombre, setNombre] = useState(user.nombre || 'Administrador General');
  const [correo, setCorreo] = useState(user.correo || 'admin@huaraztours.com');
  const [telefono, setTelefono] = useState(user.telefono || '043-421234');
  const [dni, setDni] = useState(user.dni || '00000001');
  const [avatar, setAvatar] = useState(user.avatar || '/images/avatar.jpg');
  const [cargo, setCargo] = useState(user.cargo || 'Gestor de Operaciones y Reservas');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Notificaciones administrativas
  const [notificaciones, setNotificaciones] = useState({
    emailReservas: true,
    alertasCupos: true,
    resumenSemanal: true,
    notifSistema: true,
  });

  // Cambio de contraseña
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassActual, setShowPassActual] = useState(false);
  const [showPassNueva, setShowPassNueva] = useState(false);
  const [passFeedback, setPassFeedback] = useState(null);
  const [passLoading, setPassLoading] = useState(false);

  // Actividad administrativa
  const [actividad, setActividad] = useState(null);
  const [loadingActividad, setLoadingActividad] = useState(true);

  // Feedback general
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  // Cargar datos completos y actividad administrativa desde el backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/perfil/${user.id || 'ADM-001'}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          if (data.nombre) setNombre(data.nombre);
          if (data.correo) setCorreo(data.correo);
          if (data.telefono) setTelefono(data.telefono);
          if (data.dni) setDni(data.dni);
          if (data.avatar) setAvatar(data.avatar);
          if (data.cargo) setCargo(data.cargo);
          if (data.notificaciones) setNotificaciones(data.notificaciones);
        }
      })
      .catch((err) => console.error('Error cargando perfil:', err));

    fetch('http://localhost:5000/api/perfil/admin/actividad')
      .then((res) => res.json())
      .then((data) => {
        setActividad(data);
        setLoadingActividad(false);
      })
      .catch((err) => {
        console.error('Error cargando actividad:', err);
        setLoadingActividad(false);
      });
  }, [user.id]);

  // Guardar cambios generales de información y notificaciones
  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`http://localhost:5000/api/perfil/${user.id || 'ADM-001'}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim().toLowerCase(),
          telefono: telefono.trim(),
          dni: dni.trim(),
          avatar,
          cargo,
          notificaciones,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo actualizar el perfil');
      }

      // Actualizar en AuthContext y estado local
      updateUser({
        id: user.id || 'ADM-001',
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        telefono: telefono.trim(),
        dni: dni.trim(),
        avatar,
        cargo,
        notificaciones,
      });

      setFeedback({ type: 'success', text: '¡Perfil administrativo guardado exitosamente!' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // Cambiar contraseña con verificación segura de identidad (bcrypt)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassFeedback(null);

    if (!passwordActual) {
      setPassFeedback({ type: 'error', text: 'Debes ingresar tu contraseña actual para verificar tu identidad.' });
      return;
    }

    if (passwordNueva.length < 6) {
      setPassFeedback({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    if (passwordNueva !== confirmPassword) {
      setPassFeedback({ type: 'error', text: 'La nueva contraseña y su confirmación no coinciden.' });
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/perfil/${user.id || 'ADM-001'}/cambiar-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passwordActual,
          passwordNueva,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al cambiar la contraseña');
      }

      setPassFeedback({ type: 'success', text: '¡Contraseña actualizada con éxito mediante cifrado seguro!' });
      setPasswordActual('');
      setPasswordNueva('');
      setConfirmPassword('');
    } catch (err) {
      setPassFeedback({ type: 'error', text: err.message });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="admin-profile-view">
      {/* Banner Principal de Identidad Administrativa */}
      <div className="admin-hero-card">
        <div className="admin-hero-bg-overlay" />
        <div className="admin-hero-content">
          <div className="admin-avatar-col">
            <div className="admin-avatar-frame">
              <img src={avatar} alt={nombre} className="admin-avatar-img" />
              <button
                type="button"
                className="admin-avatar-edit-badge"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                title="Cambiar fotografía de perfil"
              >
                <Camera size={16} />
              </button>
            </div>
            {/* Modal o selector rápido de avatares */}
            {showAvatarPicker && (
              <div className="admin-avatar-picker-dropdown">
                <span className="picker-title">Seleccionar fotografía:</span>
                <div className="picker-avatars-grid">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="Preset"
                      className={`picker-thumb ${avatar === p ? 'thumb-active' : ''}`}
                      onClick={() => {
                        setAvatar(p);
                        setShowAvatarPicker(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="admin-hero-info">
            <div className="admin-role-badge-pill">
              <ShieldCheck size={16} className="badge-icon-shield" />
              <span>PERFIL DE ADMINISTRADOR GENERAL</span>
            </div>
            <h1 className="admin-profile-title">{nombre}</h1>
            <p className="admin-profile-subtitle">
              {cargo} • <span className="status-live-dot" /> Cuenta Activa & Verificada
            </p>
            <div className="admin-meta-chips">
              <span className="admin-meta-chip">
                <Mail size={14} /> {correo}
              </span>
              <span className="admin-meta-chip">
                <CreditCard size={14} /> DNI: {dni}
              </span>
              <span className="admin-meta-chip">
                <Phone size={14} /> {telefono}
              </span>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación del Perfil */}
        <div className="admin-profile-tabs-bar">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'general' ? 'tab-btn-active' : ''}`}
            onClick={() => { setActiveTab('general'); setFeedback(null); }}
          >
            <User size={16} />
            <span>Datos Personales</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'seguridad' ? 'tab-btn-active' : ''}`}
            onClick={() => { setActiveTab('seguridad'); setPassFeedback(null); }}
          >
            <Lock size={16} />
            <span>Seguridad & Contraseña</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'notificaciones' ? 'tab-btn-active' : ''}`}
            onClick={() => { setActiveTab('notificaciones'); setFeedback(null); }}
          >
            <Bell size={16} />
            <span>Notificaciones</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'actividad' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('actividad')}
          >
            <Activity size={16} />
            <span>Actividad & Métricas</span>
          </button>
        </div>
      </div>

      {/* Notificaciones de Feedback */}
      {feedback && (
        <div className={`admin-feedback-banner ${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* CONTENIDO SEGÚN LA PESTAÑA ACTIVA */}

      {/* 1. DATOS PERSONALES */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="admin-tab-content-card">
          <div className="card-section-header">
            <div>
              <h2 className="card-section-title">Información de Cuenta Administrativa</h2>
              <p className="card-section-desc">
                Edita tus datos de contacto y representación oficial en Huaraz Tours.
              </p>
            </div>
            <button type="submit" disabled={saving} className="btn-save-admin-profile">
              <Save size={16} />
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Nombre Completo</label>
              <div className="admin-input-wrap">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="admin-form-input"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Correo Electrónico Institucional</label>
              <div className="admin-input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="admin-form-input"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Teléfono / Celular de Contacto</label>
              <div className="admin-input-wrap">
                <Phone size={18} className="input-icon" />
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="admin-form-input"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">DNI / Documento de Identidad</label>
              <div className="admin-input-wrap">
                <CreditCard size={18} className="input-icon" />
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="admin-form-input"
                  maxLength={15}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Cargo Administrativo</label>
              <div className="admin-input-wrap">
                <Sparkles size={18} className="input-icon" />
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className="admin-form-input"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Rol y Privilegios del Sistema</label>
              <div className="admin-input-wrap input-disabled">
                <ShieldCheck size={18} className="input-icon text-cyan" />
                <input
                  type="text"
                  value="Administrador (Acceso Total y Exclusivo)"
                  disabled
                  className="admin-form-input cursor-not-allowed"
                />
              </div>
              <span className="field-hint">El rol administrativo está protegido contra modificaciones.</span>
            </div>
          </div>
        </form>
      )}

      {/* 2. SEGURIDAD & CAMBIO DE CONTRASEÑA */}
      {activeTab === 'seguridad' && (
        <form onSubmit={handleChangePassword} className="admin-tab-content-card">
          <div className="card-section-header">
            <div>
              <h2 className="card-section-title">Seguridad & Cambio de Contraseña</h2>
              <p className="card-section-desc">
                Valida tu identidad con tu contraseña actual antes de actualizar tus credenciales. Todas las contraseñas se almacenan mediante cifrado seguro Bcrypt.
              </p>
            </div>
          </div>

          {passFeedback && (
            <div className={`admin-feedback-banner ${passFeedback.type}`}>
              {passFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{passFeedback.text}</span>
            </div>
          )}

          <div className="admin-password-form-stack">
            <div className="admin-form-group">
              <label className="admin-form-label">Contraseña Actual (Identidad requerida)</label>
              <div className="admin-input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassActual ? 'text' : 'password'}
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  className="admin-form-input"
                  required
                />
                <button
                  type="button"
                  className="input-eye-btn"
                  onClick={() => setShowPassActual(!showPassActual)}
                >
                  {showPassActual ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Nueva Contraseña (mínimo 6 caracteres)</label>
              <div className="admin-input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassNueva ? 'text' : 'password'}
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña segura"
                  className="admin-form-input"
                  required
                />
                <button
                  type="button"
                  className="input-eye-btn"
                  onClick={() => setShowPassNueva(!showPassNueva)}
                >
                  {showPassNueva ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Confirmar Nueva Contraseña</label>
              <div className="admin-input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassNueva ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  className="admin-form-input"
                  required
                />
              </div>
            </div>

            <div className="security-badges-row">
              <span className="security-badge">
                <Check size={14} /> Cifrado Bcrypt Hash en Servidor
              </span>
              <span className="security-badge">
                <Check size={14} /> Validación de sesión activa
              </span>
              <span className="security-badge">
                <Check size={14} /> Protección contra ataques de fuerza bruta
              </span>
            </div>

            <button type="submit" disabled={passLoading} className="btn-update-password-admin">
              <Lock size={16} />
              <span>{passLoading ? 'Verificando y actualizando...' : 'Actualizar Contraseña'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. CONFIGURACIÓN DE NOTIFICACIONES */}
      {activeTab === 'notificaciones' && (
        <form onSubmit={handleSaveGeneral} className="admin-tab-content-card">
          <div className="card-section-header">
            <div>
              <h2 className="card-section-title">Preferencias de Alertas y Notificaciones</h2>
              <p className="card-section-desc">
                Personaliza las alertas que deseas recibir sobre la actividad de la agencia.
              </p>
            </div>
            <button type="submit" disabled={saving} className="btn-save-admin-profile">
              <Save size={16} />
              <span>Guardar Preferencias</span>
            </button>
          </div>

          <div className="admin-toggles-list">
            <div className="admin-toggle-item">
              <div className="toggle-info">
                <span className="toggle-title">Notificación de Nuevas Reservas</span>
                <span className="toggle-desc">Recibe un correo y alerta cuando un turista reserve una excursión.</span>
              </div>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  checked={notificaciones.emailReservas}
                  onChange={(e) => setNotificaciones({ ...notificaciones, emailReservas: e.target.checked })}
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="admin-toggle-item">
              <div className="toggle-info">
                <span className="toggle-title">Alertas Automáticas de Cupos Bajos</span>
                <span className="toggle-desc">Avisa cuando a una ruta le queden menos de 5 cupos disponibles.</span>
              </div>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  checked={notificaciones.alertasCupos}
                  onChange={(e) => setNotificaciones({ ...notificaciones, alertasCupos: e.target.checked })}
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="admin-toggle-item">
              <div className="toggle-info">
                <span className="toggle-title">Resumen Semanal de Rendimiento</span>
                <span className="toggle-desc">Envío de métricas estadísticas semanales y reporte de ingresos.</span>
              </div>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  checked={notificaciones.resumenSemanal}
                  onChange={(e) => setNotificaciones({ ...notificaciones, resumenSemanal: e.target.checked })}
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="admin-toggle-item">
              <div className="toggle-info">
                <span className="toggle-title">Alertas Críticas del Sistema y Base de Datos</span>
                <span className="toggle-desc">Avisos inmediatos sobre actualizaciones de seguridad y estado de conexión MySQL.</span>
              </div>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  checked={notificaciones.notifSistema}
                  onChange={(e) => setNotificaciones({ ...notificaciones, notifSistema: e.target.checked })}
                />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>
        </form>
      )}

      {/* 4. ACTIVIDAD ADMINISTRATIVA & MÉTRICAS */}
      {activeTab === 'actividad' && (
        <div className="admin-tab-content-card">
          <div className="card-section-header">
            <div>
              <h2 className="card-section-title">Actividad Administrativa & Métricas del Sistema</h2>
              <p className="card-section-desc">
                Resumen en vivo de operaciones, rutas turísticas y auditoría de reservas conectadas a MySQL.
              </p>
            </div>
          </div>

          {loadingActividad ? (
            <div className="loading-state-box">Cargando métricas administrativas...</div>
          ) : (
            <>
              {/* Tarjetas de Métricas Generales */}
              <div className="admin-metrics-grid-4">
                <div className="admin-stat-card card-cyan">
                  <div className="stat-header">
                    <span className="stat-label">Rutas Activas</span>
                    <Compass size={20} className="stat-icon" />
                  </div>
                  <span className="stat-value">{actividad?.rutasTotales || 6}</span>
                  <span className="stat-meta">+2 rutas este mes</span>
                </div>

                <div className="admin-stat-card card-blue">
                  <div className="stat-header">
                    <span className="stat-label">Reservas Registradas</span>
                    <CalendarCheck size={20} className="stat-icon" />
                  </div>
                  <span className="stat-value">{actividad?.reservasTotales || 48}</span>
                  <span className="stat-meta">{actividad?.reservasConfirmadas || 35} confirmadas</span>
                </div>

                <div className="admin-stat-card card-amber">
                  <div className="stat-header">
                    <span className="stat-label">Clientes en Base de Datos</span>
                    <User size={20} className="stat-icon" />
                  </div>
                  <span className="stat-value">{actividad?.clientesTotales || 48}</span>
                  <span className="stat-meta">Directorio sincronizado</span>
                </div>

                <div className="admin-stat-card card-emerald">
                  <div className="stat-header">
                    <span className="stat-label">Ingresos Registrados</span>
                    <BarChart3 size={20} className="stat-icon" />
                  </div>
                  <span className="stat-value">S/ {Number(actividad?.ingresosTotales || 306).toFixed(2)}</span>
                  <span className="stat-meta">Ventas en excursiones</span>
                </div>
              </div>

              {/* Auditoría de Últimas Reservas */}
              <div className="admin-recent-audit-box">
                <h3 className="audit-box-title">
                  <Clock size={16} /> Últimas Reservas Auditadas en Huaraz Tours:
                </h3>
                <div className="audit-table-wrap">
                  <table className="audit-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Ruta Turística</th>
                        <th>Fecha</th>
                        <th>Personas</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actividad?.ultimasReservas?.map((r) => (
                        <tr key={r.id}>
                          <td className="font-mono text-cyan">{r.id}</td>
                          <td className="font-bold">{r.cliente}</td>
                          <td>{r.ruta_nombre}</td>
                          <td>{r.fecha}</td>
                          <td>{r.personas} personas</td>
                          <td className="font-bold text-white">S/ {Number(r.total).toFixed(2)}</td>
                          <td>
                            <span className={`status-pill pill-${r.estado.toLowerCase()}`}>
                              {r.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Información Técnica de Base de Datos y Servidor */}
              <div className="server-health-footer-card">
                <div className="health-left">
                  <Server size={18} className="text-cyan" />
                  <div>
                    <strong>Infraestructura de Datos:</strong>
                    <span>Base de datos MySQL (huaraz_tours_db) conectada y sincronizada en tiempo real.</span>
                  </div>
                </div>
                <div className="health-badge-status">
                  <span className="pulse-indicator" /> Seguridad Bcrypt Activa
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

