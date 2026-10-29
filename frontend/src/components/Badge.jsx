import React from 'react';

export default function Badge({ status }) {
  const getBadgeClass = (s) => {
    switch (s?.toLowerCase()) {
      case 'disponible':
        return 'badge-disponible';
      case 'confirmada':
        return 'badge-confirmada';
      case 'pendiente':
        return 'badge-pendiente';
      case 'cancelada':
        return 'badge-cancelada';
      default:
        return 'badge-disponible';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {status || 'Disponible'}
    </span>
  );
}
