import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Eliminar elemento?',
  message = '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="440px">
      <div style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <AlertTriangle size={28} />
        </div>
        <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.5' }}>
          {message}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn-primary"
          style={{ backgroundColor: '#ef4444' }}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
      </div>
    </Modal>
  );
}
