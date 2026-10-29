import React from 'react';
import { ShieldAlert, ArrowLeft, KeyRound, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RestrictedAccess({ sectionName = 'Esta sección' }) {
  const navigate = useNavigate();
  const { user, openCredentialModal } = useAuth();

  return (
    <div className="restricted-access-view">
      <div className="restricted-access-card">
        <div className="restricted-icon-box">
          <ShieldAlert size={36} className="restricted-shield-icon" />
        </div>
        <h2 className="restricted-title">Acceso Exclusivo para Administradores</h2>
        <p className="restricted-desc">
          <strong>{sectionName}</strong> requiere permisos de gestión de la agencia. Actualmente estás navegando en el sistema con el perfil de <strong>Turista ({user.nombre})</strong>.
        </p>

        <div className="restricted-actions-row">
          <button
            type="button"
            className="btn-restricted-back"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
            <span>Volver al Inicio</span>
          </button>

          <button
            type="button"
            className="btn-restricted-switch"
            onClick={openCredentialModal}
          >
            <KeyRound size={16} />
            <span>Cambiar a Administrador</span>
          </button>
        </div>
      </div>
    </div>
  );
}

