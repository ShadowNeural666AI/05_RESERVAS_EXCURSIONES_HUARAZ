import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  User,
  Users,
  Compass,
  CheckCircle2,
  Lock,
  Mail,
  KeyRound,
  Sparkles,
  Phone,
  CreditCard,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CredentialModal() {
  const {
    user,
    role,
    isAdmin,
    isUser,
    switchRole,
    demoClients,
    isCredentialModalOpen,
    closeCredentialModal,
    loginWithCredentials
  } = useAuth();

  const [selectedClientIndex, setSelectedClientIndex] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  if (!isCredentialModalOpen) return null;

  const handleSelectAdmin = () => {
    switchRole('admin');
    setFeedbackMsg({ type: 'success', text: '¡Modo Administrador activado con éxito!' });
    setTimeout(() => {
      setFeedbackMsg(null);
      closeCredentialModal();
    }, 900);
  };

  const handleSelectUser = (client) => {
    switchRole('usuario', client || demoClients[selectedClientIndex]);
    setFeedbackMsg({
      type: 'success',
      text: `¡Modo Usuario activado como ${client?.nombre || demoClients[selectedClientIndex].nombre}!`,
    });
    setTimeout(() => {
      setFeedbackMsg(null);
      closeCredentialModal();
    }, 900);
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    if (!emailInput) {
      setFeedbackMsg({ type: 'error', text: 'Por favor ingresa un correo electrónico.' });
      return;
    }
    const res = loginWithCredentials(emailInput, passwordInput, emailInput.includes('admin') ? 'admin' : 'usuario');
    setFeedbackMsg({ type: 'success', text: res.message });
    setTimeout(() => {
      setFeedbackMsg(null);
      closeCredentialModal();
    }, 900);
  };

  return (
    <div className="credential-modal-backdrop" onClick={closeCredentialModal}>
      <div
        className="credential-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header con gradiente y botón de cerrar */}
        <div className="credential-modal-header">
          <div className="modal-header-brand">
            <div className="modal-brand-badge">
              <Sparkles size={18} className="brand-sparkle-icon" />
            </div>
            <div>
              <h2 className="modal-title">Panel de Credenciales & Roles</h2>
              <p className="modal-subtitle">
                Alterna entre la vista de <strong>Administrador</strong> y <strong>Usuario / Turista</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeCredentialModal}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tarjeta de Sesión Activa */}
        <div className={`active-session-card ${isAdmin ? 'session-admin' : 'session-user'}`}>
          <div className="session-card-left">
            <div className="session-avatar-wrapper">
              <img
                src={user.avatar}
                alt={user.nombre}
                className="session-avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/avatar.jpg';
                }}
              />
              <span className="session-status-dot" title="En línea"></span>
            </div>
            <div className="session-user-details">
              <div className="session-name-row">
                <span className="session-user-name">{user.nombre}</span>
                <span className={`role-pill-badge ${isAdmin ? 'pill-admin' : 'pill-user'}`}>
                  {isAdmin ? <ShieldCheck size={13} /> : <Compass size={13} />}
                  <span>{user.roleLabel}</span>
                </span>
              </div>
              <div className="session-meta-grid">
                <span className="session-meta-item">
                  <Mail size={12} />
                  <span>{user.correo}</span>
                </span>
                {user.dni && (
                  <span className="session-meta-item">
                    <CreditCard size={12} />
                    <span>DNI: {user.dni}</span>
                  </span>
                )}
                {user.telefono && (
                  <span className="session-meta-item">
                    <Phone size={12} />
                    <span>{user.telefono}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="session-card-right">
            <div className="session-mode-indicator">
              <span className="indicator-label">Estado de Acceso:</span>
              <span className="indicator-value">
                {isAdmin ? 'Acceso Total (CRUD + Reportes)' : 'Vista Turista (Rutas + Mis Reservas)'}
              </span>
            </div>
          </div>
        </div>

        {/* Mensaje de Feedback */}
        {feedbackMsg && (
          <div className={`feedback-alert-banner ${feedbackMsg.type}`}>
            <CheckCircle2 size={16} />
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Selector de Roles Rápidos */}
        <div className="roles-cards-section">
          <h3 className="section-label">Seleccionar Perfil de Acceso:</h3>
          <div className="roles-grid">
            {/* Tarjeta Administrador */}
            <div
              className={`role-choice-card ${isAdmin ? 'is-active-choice' : ''}`}
              onClick={handleSelectAdmin}
            >
              <div className="role-card-header">
                <div className="role-choice-icon-box icon-admin">
                  <Shield size={24} />
                </div>
                {isAdmin && <span className="active-tag-pill">✓ ACTIVO</span>}
              </div>
              <h4 className="role-choice-title">Administrador</h4>
              <p className="role-choice-desc">
                Gestión total de la agencia: Crear, editar y eliminar excursiones, control global de clientes, auditoría de todas las reservas y reportes estadísticos.
              </p>
              <div className="role-credentials-preview">
                <span className="cred-tag">admin@huaraztours.com</span>
                <span className="cred-tag">Rol: Administrador</span>
              </div>
              <button
                type="button"
                className={`role-select-action-btn ${isAdmin ? 'btn-active-role' : 'btn-switch-admin'}`}
              >
                {isAdmin ? '✓ Perfil Activo' : 'Cambiar a Administrador'}
              </button>
            </div>

            {/* Tarjeta Usuario / Turista */}
            <div
              className={`role-choice-card ${isUser ? 'is-active-choice' : ''}`}
              onClick={() => handleSelectUser(demoClients[selectedClientIndex])}
            >
              <div className="role-card-header">
                <div className="role-choice-icon-box icon-user">
                  <Compass size={24} />
                </div>
                {isUser && <span className="active-tag-pill user-tag">✓ ACTIVO</span>}
              </div>
              <h4 className="role-choice-title">Usuario / Turista</h4>
              <p className="role-choice-desc">
                Experiencia de cliente: Explorar rutas disponibles, reservar excursiones con cupos en vivo y gestionar su propio panel de "Mis Reservas".
              </p>

              {/* Selector de Turista Demo */}
              <div className="demo-client-picker" onClick={(e) => e.stopPropagation()}>
                <span className="picker-label">Turista de prueba:</span>
                <div className="client-chips-row">
                  {demoClients.map((client, idx) => (
                    <button
                      key={client.id}
                      type="button"
                      className={`client-chip ${user.id === client.id ? 'chip-selected' : ''}`}
                      onClick={() => handleSelectUser(client)}
                    >
                      <img src={client.avatar} alt={client.nombre} className="chip-avatar" />
                      <span>{client.nombre.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={`role-select-action-btn ${isUser ? 'btn-active-role' : 'btn-switch-user'}`}
              >
                {isUser ? `✓ Turista Activo (${user.nombre})` : 'Cambiar a Modo Turista'}
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Acceso por Credenciales Manuales */}
        <div className="manual-login-section">
          <div className="manual-login-header">
            <KeyRound size={16} className="key-icon" />
            <span>Ingreso rápido con credenciales de prueba</span>
          </div>
          <form className="manual-login-form" onSubmit={handleManualLogin}>
            <div className="login-inputs-row">
              <div className="login-input-group">
                <Mail size={15} className="input-icon" />
                <input
                  type="email"
                  placeholder="admin@huaraztours.com o maria.lopez@email.com"
                  className="login-input"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
              <div className="login-input-group">
                <Lock size={15} className="input-icon" />
                <input
                  type="password"
                  placeholder="Contraseña (opcional en demo)"
                  className="login-input"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>
              <button type="submit" className="login-submit-btn">
                <span>Ingresar</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="credential-modal-footer">
          <span className="footer-note">
            Huaraz Tours v1.0 • Sistema con Control de Acceso Basado en Roles (RBAC)
          </span>
          <button type="button" className="footer-dismiss-btn" onClick={closeCredentialModal}>
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}

