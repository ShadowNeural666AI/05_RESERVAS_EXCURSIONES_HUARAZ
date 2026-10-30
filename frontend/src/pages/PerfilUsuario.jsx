import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Heart,
  CalendarCheck,
  Mountain,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Camera,
  Save,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  Tag,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TOURIST_AVATAR_PRESETS = [
  '/images/avatars/client_maria.jpg',
  '/images/avatars/client_carlos.jpg',
  '/images/avatars/client_ana.jpg',
  '/images/avatar.jpg',
];

export default function PerfilUsuario({ user }) {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('datos'); // 'datos' | 'reservas' | 'favoritos' | 'seguridad' | 'preferencias'

  // Datos del perfil
  const [nombre, setNombre] = useState(user.nombre || 'Turista');
  const [correo, setCorreo] = useState(user.correo || 'turista@email.com');
  const [telefono, setTelefono] = useState(user.telefono || '');
  const [dni, setDni] = useState(user.dni || '');
  const [fechaNacimiento, setFechaNacimiento] = useState(user.fecha_nacimiento || '1996-05-18');
  const [avatar, setAvatar] = useState(user.avatar || '/images/avatars/client_maria.jpg');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Reservas del usuario
  const [historialReservas, setHistorialReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);

  // Rutas favoritas del usuario
  const [rutasFavoritas, setRutasFavoritas] = useState([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(true);

  // Preferencias turísticas
  const [preferencias, setPreferencias] = useState({
    dificultad: 'Moderado',
    tipoExcursion: 'Lagunas & Trekking',
    notifPromociones: true,
    notifRecordatorios: true,
  });

  // Cambio de contraseña
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassActual, setShowPassActual] = useState(false);
  const [showPassNueva, setShowPassNueva] = useState(false);
  const [passFeedback, setPassFeedback] = useState(null);
  const [passLoading, setPassLoading] = useState(false);

  // Feedback general
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  // Cargar datos del perfil, historial de reservas y favoritos desde el backend
  useEffect(() => {
    // 1. Cargar perfil
    fetch(`http://localhost:5000/api/perfil/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          if (data.nombre) setNombre(data.nombre);
          if (data.correo) setCorreo(data.correo);
          if (data.telefono) setTelefono(data.telefono);
          if (data.dni) setDni(data.dni);
          if (data.fecha_nacimiento) setFechaNacimiento(data.fecha_nacimiento);
          if (data.avatar) setAvatar(data.avatar);
          if (data.preferencias) setPreferencias(data.preferencias);
        }
      })
      .catch((err) => console.error('Error cargando perfil turista:', err));

    // 2. Cargar historial de reservas
    fetch(`http://localhost:5000/api/perfil/${user.id}/reservas`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHistorialReservas(data);
        }
        setLoadingReservas(false);
      })
      .catch((err) => {
        console.error('Error cargando reservas:', err);
        setLoadingReservas(false);
      });

    // 3. Cargar rutas favoritas
    fetch(`http://localhost:5000/api/perfil/${user.id}/favoritos`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRutasFavoritas(data);
        }
        setLoadingFavoritos(false);
      })
      .catch((err) => {
        console.error('Error cargando favoritos:', err);
        setLoadingFavoritos(false);
      });
  }, [user.id]);

  // Cálculo de edad si tiene fecha de nacimiento
  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const birthday = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  const edad = calculateAge(fechaNacimiento);

  // Resumen de estado de reservas
  const reservasConfirmadas = historialReservas.filter((r) => r.estado === 'Confirmada').length;
  const reservasPendientes = historialReservas.filter((r) => r.estado === 'Pendiente').length;
  const reservasCanceladas = historialReservas.filter((r) => r.estado === 'Cancelada').length;

  // Guardar datos del perfil de usuario
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`http://localhost:5000/api/perfil/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim().toLowerCase(),
          telefono: telefono.trim(),
          dni: dni.trim(),
          fecha_nacimiento: fechaNacimiento,
          avatar,
          preferencias,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo guardar el perfil');
      }

      // Actualizar en AuthContext
      updateUser({
        id: user.id,
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        telefono: telefono.trim(),
        dni: dni.trim(),
        fecha_nacimiento: fechaNacimiento,
        avatar,
        preferencias,
      });

      setFeedback({ type: 'success', text: '¡Tus datos de turista fueron guardados exitosamente!' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // Cambiar contraseña con validación de identidad en backend
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
      setPassFeedback({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/perfil/${user.id}/cambiar-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passwordActual,
          passwordNueva,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al cambiar contraseña');
      }

      setPassFeedback({ type: 'success', text: '¡Tu contraseña ha sido cambiada y protegida exitosamente!' });
      setPasswordActual('');
      setPasswordNueva('');
      setConfirmPassword('');
    } catch (err) {
      setPassFeedback({ type: 'error', text: err.message });
    } finally {
      setPassLoading(false);
    }
  };

  // Alternar ruta favorita
  const handleToggleFavorito = async (rutaId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/perfil/${user.id}/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rutaId }),
      });
      const data = await res.json();
      if (res.ok) {
        // Recargar favoritos
        const favRes = await fetch(`http://localhost:5000/api/perfil/${user.id}/favoritos`);
        const favData = await favRes.json();
        if (Array.isArray(favData)) setRutasFavoritas(favData);
      }
    } catch (err) {
      console.error('Error al alternar favorito:', err);
    }
  };

  return (
    <div className="tourist-profile-view">
      {/* Banner Paisajístico de la Cordillera Blanca */}
      <div className="tourist-hero-card">
        <div className="tourist-hero-backdrop" />
        <div className="tourist-hero-content">
          <div className="tourist-avatar-box">
            <img src={avatar} alt={nombre} className="tourist-avatar-img" />
            <button
              type="button"
              className="tourist-avatar-btn"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              title="Cambiar foto de perfil"
            >
              <Camera size={15} />
            </button>

            {/* Selector de fotos de turista */}
            {showAvatarPicker && (
              <div className="tourist-avatar-picker-popover">
                <span className="picker-pop-title">Elegir fotografía:</span>
                <div className="picker-pop-grid">
                  {TOURIST_AVATAR_PRESETS.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="Avatar"
                      className={`picker-pop-thumb ${avatar === p ? 'active' : ''}`}
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

          <div className="tourist-hero-text">
            <div className="tourist-tag-pill">
              <Compass size={15} />
              <span>EXPLORADOR HUARAZ TOURS</span>
            </div>
            <h1 className="tourist-name-title">{nombre}</h1>
            <p className="tourist-desc-subtitle">
              {edad ? `${edad} años • ` : ''}Amante de la naturaleza andina y lagunas glaciares
            </p>
            <div className="tourist-badges-summary">
              <span className="tourist-chip">
                <Mail size={13} /> {correo}
              </span>
              <span className="tourist-chip">
                <CreditCard size={13} /> DNI: {dni || '12345678'}
              </span>
              <span className="tourist-chip">
                <CalendarCheck size={13} /> {historialReservas.length} Reservas Realizadas
              </span>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación del Turista */}
        <div className="tourist-tabs-navigation">
          <button
            type="button"
            className={`tourist-nav-tab ${activeTab === 'datos' ? 'active-tab' : ''}`}
            onClick={() => { setActiveTab('datos'); setFeedback(null); }}
          >
            <User size={16} />
            <span>Mis Datos Personales</span>
          </button>

          <button
            type="button"
            className={`tourist-nav-tab ${activeTab === 'reservas' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('reservas')}
          >
            <CalendarCheck size={16} />
            <span>Mis Reservas ({historialReservas.length})</span>
          </button>

          <button
            type="button"
            className={`tourist-nav-tab ${activeTab === 'favoritos' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('favoritos')}
          >
            <Heart size={16} />
            <span>Rutas Favoritas ({rutasFavoritas.length})</span>
          </button>

          <button
            type="button"
            className={`tourist-nav-tab ${activeTab === 'seguridad' ? 'active-tab' : ''}`}
            onClick={() => { setActiveTab('seguridad'); setPassFeedback(null); }}
          >
            <Lock size={16} />
            <span>Cambiar Contraseña</span>
          </button>

          <button
            type="button"
            className={`tourist-nav-tab ${activeTab === 'preferencias' ? 'active-tab' : ''}`}
            onClick={() => { setActiveTab('preferencias'); setFeedback(null); }}
          >
            <Sparkles size={16} />
            <span>Preferencias de Viaje</span>
          </button>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {feedback && (
        <div className={`tourist-feedback-alert ${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* CONTENIDO DE PESTAÑAS */}

      {/* 1. DATOS PERSONALES */}
      {activeTab === 'datos' && (
        <form onSubmit={handleSaveProfile} className="tourist-card-body">
          <div className="tourist-card-header">
            <div>
              <h2 className="tourist-card-title">Información de Perfil de Turista</h2>
              <p className="tourist-card-desc">
                Mantén tus datos actualizados para agilizar tus reservas en la Cordillera Blanca.
              </p>
            </div>
            <button type="submit" disabled={saving} className="tourist-btn-save">
              <Save size={16} />
              <span>{saving ? 'Guardando...' : 'Guardar Información'}</span>
            </button>
          </div>

          <div className="tourist-fields-grid">
            <div className="tourist-field-group">
              <label className="tourist-label">Nombres y Apellidos</label>
              <div className="tourist-input-box">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="tourist-input"
                  required
                />
              </div>
            </div>

            <div className="tourist-field-group">
              <label className="tourist-label">Correo Electrónico</label>
              <div className="tourist-input-box">
                <Mail size={18} className="field-icon" />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="tourist-input"
                  required
                />
              </div>
            </div>

            <div className="tourist-field-group">
              <label className="tourist-label">Número Telefónico / Celular</label>
              <div className="tourist-input-box">
                <Phone size={18} className="field-icon" />
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 987 654 321"
                  className="tourist-input"
                  required
                />
              </div>
            </div>

            <div className="tourist-field-group">
              <label className="tourist-label">DNI o Documento de Identidad</label>
              <div className="tourist-input-box">
                <CreditCard size={18} className="field-icon" />
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="8 dígitos"
                  className="tourist-input"
                  maxLength={12}
                  required
                />
              </div>
            </div>

            <div className="tourist-field-group">
              <label className="tourist-label">Fecha de Nacimiento</label>
              <div className="tourist-input-box">
                <Calendar size={18} className="field-icon" />
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="tourist-input"
                />
              </div>
              {edad && <span className="tourist-input-hint">Edad calculada: {edad} años</span>}
            </div>

            <div className="tourist-field-group">
              <label className="tourist-label">Tipo de Cuenta</label>
              <div className="tourist-input-box input-readonly">
                <Compass size={18} className="field-icon text-emerald" />
                <input
                  type="text"
                  value="Usuario / Turista (Exploración & Reservas)"
                  disabled
                  className="tourist-input cursor-not-allowed"
                />
              </div>
              <span className="tourist-input-hint">Solo el administrador puede gestionar roles institucionales.</span>
            </div>
          </div>
        </form>
      )}

      {/* 2. HISTORIAL DE RESERVAS */}
      {activeTab === 'reservas' && (
        <div className="tourist-card-body">
          <div className="tourist-card-header">
            <div>
              <h2 className="tourist-card-title">Historial y Estado de Mis Reservas</h2>
              <p className="tourist-card-desc">
                Revisa el estado de tus cupos y excursiones programadas en Huaraz.
              </p>
            </div>

            {/* Badges de Conteo de Estados */}
            <div className="status-counters-row">
              <span className="status-counter-pill counter-confirmed">
                <CheckCircle2 size={14} /> {reservasConfirmadas} Confirmadas
              </span>
              <span className="status-counter-pill counter-pending">
                <Clock size={14} /> {reservasPendientes} Pendientes
              </span>
              <span className="status-counter-pill counter-cancelled">
                <XCircle size={14} /> {reservasCanceladas} Canceladas
              </span>
            </div>
          </div>

          {loadingReservas ? (
            <div className="tourist-loading-box">Cargando tus reservas...</div>
          ) : historialReservas.length === 0 ? (
            <div className="tourist-empty-state">
              <CalendarCheck size={48} className="empty-icon" />
              <h3 className="empty-title">Aún no tienes reservas registradas</h3>
              <p className="empty-desc">
                Explora las lagunas y nevados de la Cordillera Blanca y reserva tu cupo ahora mismo.
              </p>
              <button
                type="button"
                className="tourist-btn-primary"
                onClick={() => navigate('/rutas')}
              >
                <Mountain size={16} />
                <span>Explorar Rutas Disponibles</span>
              </button>
            </div>
          ) : (
            <div className="tourist-bookings-grid">
              {historialReservas.map((r) => (
                <div key={r.id} className="booking-item-card">
                  <div className="booking-img-wrap">
                    <img
                      src={r.ruta_imagen || '/images/laguna69.jpg'}
                      alt={r.ruta_nombre}
                      className="booking-img"
                    />
                    <span className={`booking-status-tag status-${r.estado.toLowerCase()}`}>
                      {r.estado === 'Confirmada' && <CheckCircle2 size={13} />}
                      {r.estado === 'Pendiente' && <Clock size={13} />}
                      {r.estado === 'Cancelada' && <XCircle size={13} />}
                      <span>{r.estado}</span>
                    </span>
                  </div>

                  <div className="booking-info-wrap">
                    <div className="booking-code-row">
                      <span className="booking-id-tag">Reserva #{r.id}</span>
                      <span className="booking-date">
                        <Calendar size={13} /> {r.fecha}
                      </span>
                    </div>

                    <h3 className="booking-route-name">{r.ruta_nombre}</h3>
                    <p className="booking-location">
                      <MapPin size={13} /> {r.ruta_ubicacion || 'Cordillera Blanca - Huaraz'}
                    </p>

                    <div className="booking-details-footer">
                      <div className="booking-people">
                        <span>👥 {r.personas} {r.personas === 1 ? 'persona' : 'personas'}</span>
                      </div>
                      <div className="booking-total">
                        <span className="total-label">Total pagado:</span>
                        <span className="total-amount">S/ {Number(r.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. RUTAS FAVORITAS */}
      {activeTab === 'favoritos' && (
        <div className="tourist-card-body">
          <div className="tourist-card-header">
            <div>
              <h2 className="tourist-card-title">Mis Rutas Favoritas de la Cordillera</h2>
              <p className="tourist-card-desc">
                Tus excursiones guardadas para explorar en tu próximo viaje a Huaraz.
              </p>
            </div>
          </div>

          {loadingFavoritos ? (
            <div className="tourist-loading-box">Cargando rutas favoritas...</div>
          ) : rutasFavoritas.length === 0 ? (
            <div className="tourist-empty-state">
              <Heart size={48} className="empty-icon text-rose" />
              <h3 className="empty-title">No tienes rutas en favoritos</h3>
              <p className="empty-desc">
                Navega por nuestro catálogo de rutas y presiona el ícono del corazón para guardarlas aquí.
              </p>
              <button
                type="button"
                className="tourist-btn-primary"
                onClick={() => navigate('/rutas')}
              >
                <Compass size={16} />
                <span>Ver Catálogo de Rutas</span>
              </button>
            </div>
          ) : (
            <div className="tourist-favs-grid">
              {rutasFavoritas.map((ruta) => (
                <div key={ruta.id} className="fav-route-card">
                  <div className="fav-card-img-wrap">
                    <img src={ruta.imagen} alt={ruta.nombre} className="fav-card-img" />
                    <button
                      type="button"
                      className="fav-toggle-btn active"
                      onClick={() => handleToggleFavorito(ruta.id)}
                      title="Quitar de favoritos"
                    >
                      <Heart size={16} fill="#ef4444" color="#ef4444" />
                    </button>
                    <span className="fav-difficulty-badge">{ruta.dificultad}</span>
                  </div>

                  <div className="fav-card-body">
                    <div className="fav-location">
                      <MapPin size={13} /> {ruta.ubicacion}
                    </div>
                    <h3 className="fav-title">{ruta.nombre}</h3>
                    <p className="fav-desc">{ruta.descripcion?.slice(0, 90)}...</p>

                    <div className="fav-card-footer">
                      <div className="fav-price">
                        <span className="price-label">Desde:</span>
                        <span className="price-num">S/ {Number(ruta.precio).toFixed(2)}</span>
                      </div>
                      <button
                        type="button"
                        className="fav-book-btn"
                        onClick={() => navigate(`/reservas/nueva?rutaId=${ruta.id}`)}
                      >
                        <span>Reservar</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. CAMBIAR CONTRASEÑA */}
      {activeTab === 'seguridad' && (
        <form onSubmit={handleChangePassword} className="tourist-card-body">
          <div className="tourist-card-header">
            <div>
              <h2 className="tourist-card-title">Cambiar Contraseña de Cuenta</h2>
              <p className="tourist-card-desc">
                Protege tu cuenta de turista con una contraseña segura cifrada mediante Bcrypt.
              </p>
            </div>
          </div>

          {passFeedback && (
            <div className={`tourist-feedback-alert ${passFeedback.type}`}>
              {passFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{passFeedback.text}</span>
            </div>
          )}

          <div className="tourist-password-form">
            <div className="tourist-field-group">
              <label className="tourist-label">Contraseña Actual</label>
              <div className="tourist-input-box">
                <Lock size={18} className="field-icon" />
                <input
                  type={showPassActual ? 'text' : 'password'}
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  className="tourist-input"
                  required
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassActual(!showPassActual)}
                >
                  {showPassActual ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="tourist-field-group">
              <label className="tourist-label">Nueva Contraseña (mínimo 6 caracteres)</label>
              <div className="tourist-input-box">
                <Lock size={18} className="field-icon" />
                <input
                  type={showPassNueva ? 'text' : 'password'}
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  className="tourist-input"
                  required
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassNueva(!showPassNueva)}
                >
                  {showPassNueva ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="tourist-field-group">
              <label className="tourist-label">Confirmar Nueva Contraseña</label>
              <div className="tourist-input-box">
                <Lock size={18} className="field-icon" />
                <input
                  type={showPassNueva ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  className="tourist-input"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={passLoading} className="tourist-btn-save">
              <Lock size={16} />
              <span>{passLoading ? 'Actualizando...' : 'Guardar Nueva Contraseña'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 5. PREFERENCIAS DE VIAJE Y NOTIFICACIONES */}
      {activeTab === 'preferencias' && (
        <form onSubmit={handleSaveProfile} className="tourist-card-body">
          <div className="tourist-card-header">
            <div>
              <h2 className="tourist-card-title">Preferencias de Excursiones y Notificaciones</h2>
              <p className="tourist-card-desc">
                Personaliza tu experiencia de senderismo y las alertas que deseas recibir.
              </p>
            </div>
            <button type="submit" disabled={saving} className="tourist-btn-save">
              <Save size={16} />
              <span>Guardar Preferencias</span>
            </button>
          </div>

          <div className="tourist-prefs-section">
            <h3 className="prefs-subtitle">Nivel de Dificultad Preferido en Trekking:</h3>
            <div className="prefs-options-row">
              {['Fácil', 'Moderado', 'Difícil'].map((dif) => (
                <button
                  key={dif}
                  type="button"
                  className={`pref-option-chip ${preferencias.dificultad === dif ? 'active' : ''}`}
                  onClick={() => setPreferencias({ ...preferencias, dificultad: dif })}
                >
                  <Mountain size={14} />
                  <span>{dif}</span>
                </button>
              ))}
            </div>

            <h3 className="prefs-subtitle" style={{ marginTop: '24px' }}>
              Tipo de Excursión Favorita:
            </h3>
            <div className="prefs-options-row">
              {['Lagunas & Glaciares', 'Alta Montaña', 'Cultura & Arqueología', 'Bosques Andinos'].map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  className={`pref-option-chip ${preferencias.tipoExcursion === tipo ? 'active' : ''}`}
                  onClick={() => setPreferencias({ ...preferencias, tipoExcursion: tipo })}
                >
                  <Compass size={14} />
                  <span>{tipo}</span>
                </button>
              ))}
            </div>

            <h3 className="prefs-subtitle" style={{ marginTop: '24px' }}>
              Notificaciones por Correo:
            </h3>
            <div className="tourist-toggles-stack">
              <label className="tourist-toggle-item">
                <input
                  type="checkbox"
                  checked={preferencias.notifPromociones}
                  onChange={(e) => setPreferencias({ ...preferencias, notifPromociones: e.target.checked })}
                />
                <div className="toggle-label-wrap">
                  <span className="toggle-name">Promociones y Descuentos Especiales</span>
                  <span className="toggle-sub">Recibir ofertas exclusivas para excursiones en Huaraz.</span>
                </div>
              </label>

              <label className="tourist-toggle-item">
                <input
                  type="checkbox"
                  checked={preferencias.notifRecordatorios}
                  onChange={(e) => setPreferencias({ ...preferencias, notifRecordatorios: e.target.checked })}
                />
                <div className="toggle-label-wrap">
                  <span className="toggle-name">Recordatorios de Excursiones Reservadas</span>
                  <span className="toggle-sub">Avisos y recomendaciones 24 horas antes de cada salida.</span>
                </div>
              </label>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
