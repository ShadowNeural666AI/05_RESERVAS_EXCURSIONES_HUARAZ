import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Settings,
  Bell,
  Clock,
  Palette,
  X,
  Save,
  Camera,
  Crown,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

export default function Configuracion() {
  const [nombre, setNombre] = useState('Administrador');
  const [correo, setCorreo] = useState('admin@huaraztours.com');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [reservaNotifs, setReservaNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Estados para notificación y modales
  const [toast, setToast] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('/images/avatar.jpg');

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = () => {
    triggerToast('Preferencias y perfil guardados correctamente.');
  };

  const handleCancel = () => {
    setNombre('Administrador');
    setCorreo('admin@huaraztours.com');
    setEmailNotifs(true);
    setReservaNotifs(true);
    setDarkMode(false);
    triggerToast('Cambios revertidos a valores predeterminados.', 'info');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      triggerToast('Por favor completa todos los campos de contraseña.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('La nueva contraseña y su confirmación no coinciden.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      triggerToast('La nueva contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    }
    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    triggerToast('Contraseña actualizada con éxito.');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      triggerToast('Foto de perfil actualizada.');
    }
  };

  return (
    <div className="configuracion-dark-view">
      {/* Toast Notificación */}
      {toast && (
        <div className={`config-floating-toast toast-${toast.type}`}>
          <CheckCircle2 size={18} className="toast-icon" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* 1. Header de la página: Icono azul, Mi perfil, Subtítulo */}
      <div className="configuracion-header-row">
        <div className="configuracion-profile-icon-badge">
          <User size={26} className="configuracion-icon-svg" />
        </div>
        <div className="configuracion-title-texts">
          <h1 className="configuracion-title">Mi perfil</h1>
          <p className="configuracion-subtitle">
            Administra tu cuenta y preferencias de la agencia.
          </p>
        </div>
      </div>

      {/* 2. Tarjeta Glassmorphism Principal */}
      <div className="configuracion-glass-card">
        {/* Banner Superior Panorámico con Foto de Montaña y Eslogan Cursivo */}
        <div className="configuracion-cover-banner">
          {/* Fondo de montaña */}
          <div className="configuracion-banner-bg" />

          {/* Gradiente izquierdo para la información del usuario */}
          <div className="configuracion-banner-overlay" />

          {/* Información del Perfil (Izquierda) */}
          <div className="configuracion-banner-user">
            {/* Avatar circular con aro neón y botón de cámara */}
            <div className="config-avatar-wrapper">
              <img
                src={avatarPreview}
                alt="Administrador"
                className="config-avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                }}
              />
              <label
                htmlFor="avatar-file-input"
                className="config-avatar-camera-btn"
                title="Cambiar foto de perfil"
              >
                <Camera size={13} />
                <input
                  type="file"
                  id="avatar-file-input"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            {/* Datos y Rol */}
            <div className="config-banner-meta">
              <div className="config-role-badge">
                <Crown size={13} className="config-crown-icon" />
                <span>Administrador Principal</span>
              </div>
              <h2 className="config-user-fullname">{nombre}</h2>
              <div className="config-user-email-wrap">
                <Mail size={14} className="config-email-icon" />
                <span>{correo}</span>
              </div>
            </div>
          </div>

          {/* Eslogan Manuscrito y Paisaje Alpino (Derecha) */}
          <div className="configuracion-banner-slogan">
            <span className="config-slogan-script">
              Juntos llegamos más lejos
            </span>
            <span className="config-slogan-heart">🤍</span>
          </div>
        </div>

        {/* 3. Formulario de Datos: Nombre y Correo */}
        <div className="config-form-fields-grid">
          {/* Nombre */}
          <div className="config-field-group">
            <label className="config-field-label">
              <User size={15} />
              <span>Nombre</span>
            </label>
            <div className="config-input-wrapper">
              <User size={16} className="config-input-icon" />
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="config-dark-input"
                placeholder="Nombre del administrador"
              />
            </div>
          </div>

          {/* Correo */}
          <div className="config-field-group">
            <label className="config-field-label">
              <Mail size={15} />
              <span>Correo</span>
            </label>
            <div className="config-input-wrapper">
              <Mail size={16} className="config-input-icon" />
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="config-dark-input"
                placeholder="admin@huaraztours.com"
              />
            </div>
          </div>
        </div>

        {/* Botón Cambiar Contraseña */}
        <div className="config-password-btn-row">
          <button
            type="button"
            className="config-change-pass-btn"
            onClick={() => setShowPasswordModal(true)}
          >
            <Lock size={15} className="pass-btn-icon-lock" />
            <span>Cambiar contraseña</span>
            <ArrowRight size={15} className="pass-btn-icon-arrow" />
          </button>
        </div>

        {/* Línea divisoria */}
        <div className="config-section-divider" />

        {/* 4. Sección de Preferencias */}
        <div className="config-preferences-section">
          <div className="config-prefs-header">
            <div className="config-prefs-gear-box">
              <Settings size={18} className="gear-icon-svg" />
            </div>
            <div>
              <h3 className="config-prefs-heading">Preferencias</h3>
              <p className="config-prefs-desc">
                Personaliza tu experiencia en la plataforma.
              </p>
            </div>
          </div>

          {/* Lista de Filas de Preferencias con Switch Interactivo */}
          <div className="config-switches-container">
            {/* Opción 1: Notificaciones por correo */}
            <div className="config-switch-row">
              <div className="config-switch-left">
                <div className="config-pref-icon-bubble pref-bubble-blue">
                  <Bell size={18} />
                </div>
                <div>
                  <div className="config-switch-title">
                    Notificaciones por correo
                  </div>
                  <div className="config-switch-desc">
                    Recibe resúmenes de reservas confirmadas en tu bandeja.
                  </div>
                </div>
              </div>
              <label className="config-ios-toggle">
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                />
                <span className="config-toggle-pill" />
              </label>
            </div>

            {/* Opción 2: Notificaciones de reservas */}
            <div className="config-switch-row">
              <div className="config-switch-left">
                <div className="config-pref-icon-bubble pref-bubble-purple">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="config-switch-title">
                    Notificaciones de reservas
                  </div>
                  <div className="config-switch-desc">
                    Alertas en tiempo real cuando un cliente realiza una reserva.
                  </div>
                </div>
              </div>
              <label className="config-ios-toggle">
                <input
                  type="checkbox"
                  checked={reservaNotifs}
                  onChange={(e) => setReservaNotifs(e.target.checked)}
                />
                <span className="config-toggle-pill" />
              </label>
            </div>

            {/* Opción 3: Modo oscuro */}
            <div className="config-switch-row">
              <div className="config-switch-left">
                <div className="config-pref-icon-bubble pref-bubble-teal">
                  <Palette size={18} />
                </div>
                <div>
                  <div className="config-switch-title">Modo oscuro</div>
                  <div className="config-switch-desc">
                    Cambia la aperiencia a un esquema de colores oscuros.
                  </div>
                </div>
              </div>
              <label className="config-ios-toggle">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                <span className="config-toggle-pill" />
              </label>
            </div>
          </div>
        </div>

        {/* 5. Botones de Acción Inferiores (Cancelar y Guardar cambios) */}
        <div className="config-action-footer">
          <button
            type="button"
            className="config-footer-btn-cancel"
            onClick={handleCancel}
          >
            <X size={16} />
            <span>Cancelar</span>
          </button>
          <button
            type="button"
            className="config-footer-btn-save"
            onClick={handleSave}
          >
            <Save size={16} />
            <span>Guardar cambios</span>
          </button>
        </div>
      </div>

      {/* Modal interactivo de Cambiar Contraseña */}
      {showPasswordModal && (
        <div className="config-modal-backdrop" onClick={() => setShowPasswordModal(false)}>
          <div
            className="config-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="config-modal-header">
              <div className="config-modal-title-box">
                <Lock size={20} className="modal-lock-icon" />
                <h3>Cambiar Contraseña</h3>
              </div>
              <button
                type="button"
                className="config-modal-close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="config-modal-form">
              <div className="config-field-group">
                <label className="config-field-label">Contraseña Actual</label>
                <div className="config-input-wrapper">
                  <Lock size={16} className="config-input-icon" />
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="config-dark-input"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="config-input-eye-btn"
                    onClick={() => setShowOldPass(!showOldPass)}
                  >
                    {showOldPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="config-field-group">
                <label className="config-field-label">Nueva Contraseña</label>
                <div className="config-input-wrapper">
                  <Lock size={16} className="config-input-icon" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="config-dark-input"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    className="config-input-eye-btn"
                    onClick={() => setShowNewPass(!showNewPass)}
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="config-field-group">
                <label className="config-field-label">Confirmar Nueva Contraseña</label>
                <div className="config-input-wrapper">
                  <Lock size={16} className="config-input-icon" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="config-dark-input"
                    placeholder="Repite la nueva contraseña"
                  />
                </div>
              </div>

              <div className="config-modal-footer">
                <button
                  type="button"
                  className="config-footer-btn-cancel"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="config-footer-btn-save">
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
