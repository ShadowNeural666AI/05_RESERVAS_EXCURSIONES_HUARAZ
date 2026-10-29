import React from 'react';
import { CheckCircle2, AlertOctagon, Info } from 'lucide-react';
import Modal from './Modal';

export function ReservaExitoModal({ isOpen, onClose, reservaId }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reserva Registrada" maxWidth="420px">
      <div style={{ textAlign: 'center', padding: '16px 10px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            animation: 'scaleIn 0.3s ease',
          }}
        >
          <CheckCircle2 size={36} />
        </div>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          ¡Reserva registrada con éxito!
        </h4>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '14px', lineHeight: '1.5' }}>
          La reserva se ha creado correctamente y los cupos han sido descontados de la ruta.
        </p>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 18px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            borderRadius: '20px',
            fontWeight: 700,
            fontSize: '1rem',
            marginBottom: '20px',
          }}
        >
          ID: {reservaId || 'R-001'}
        </div>
        <div>
          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onClose}
          >
            Aceptar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function CupoInsuficienteModal({ isOpen, onClose, disponibles = 0 }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cupo Insuficiente" maxWidth="420px">
      <div style={{ textAlign: 'center', padding: '16px 10px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            animation: 'scaleIn 0.3s ease',
          }}
        >
          <AlertOctagon size={36} />
        </div>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Cupo insuficiente
        </h4>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '12px', lineHeight: '1.5' }}>
          No hay suficientes cupos disponibles para esta ruta y fecha seleccionada.
        </p>
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#fff1f2',
            color: '#be123c',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.92rem',
            marginBottom: '20px',
            border: '1px solid #fecdd3',
          }}
        >
          Cupos disponibles actualmente: {disponibles}
        </div>
        <div>
          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', backgroundColor: '#ef4444' }}
            onClick={onClose}
          >
            Aceptar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function InfoCupoModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Información" maxWidth="400px">
      <div style={{ textAlign: 'center', padding: '16px 10px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
          }}
        >
          <Info size={32} />
        </div>
        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          Límite de Cupos
        </h4>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
          La cantidad de personas no puede ser mayor al cupo disponible de la ruta seleccionada.
        </p>
        <button
          type="button"
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={onClose}
        >
          Aceptar
        </button>
      </div>
    </Modal>
  );
}
