import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  CreditCard,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Compass,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import Badge from '../components/Badge';
import ReservaFormModal from '../components/ReservaFormModal';

export default function ReservaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const [resData, rutasData] = await Promise.all([
        api.getReservaById(id),
        api.getRutas().catch(() => []),
      ]);
      setReserva(resData);
      setRutas(rutasData);
    } catch (err) {
      console.error('Error fetching reserva detail:', err);
      setErrorMsg(err.message || 'Error al cargar los detalles de la reserva');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleCancelReserva = async () => {
    if (!reserva) return;
    if (reserva.estado === 'Cancelada') {
      alert('La reserva ya se encuentra cancelada.');
      return;
    }

    const confirmed = window.confirm(
      `¿Deseas cancelar la reserva #${reserva.id}? Se liberarán los ${reserva.personas} cupos asociados a la ruta.`
    );
    if (!confirmed) return;

    try {
      setCancelLoading(true);
      const updated = await api.cancelReserva(reserva.id);
      setReserva(updated);
      alert('La reserva ha sido cancelada exitosamente y los cupos han sido liberados.');
    } catch (err) {
      alert(err.message || 'Error al cancelar la reserva');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Cargando información de la reserva...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !reserva) {
    return (
      <div className="page-container">
        <div style={{ marginBottom: '20px' }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/reservas')}>
            <ArrowLeft size={16} />
            <span>Volver a Reservas</span>
          </button>
        </div>
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '20px', borderRadius: '10px' }}>
          <h3>Reserva no encontrada</h3>
          <p>{errorMsg || 'No existe ningún registro con el ID especificado.'}</p>
        </div>
      </div>
    );
  }

  const ruta = reserva.ruta_detalle || {};
  const totalCalculated = (reserva.precio_unitario || ruta.precio || 50) * reserva.personas;

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      {/* Breadcrumb (Panel 09) */}
      <div className="breadcrumb-nav">
        <Link to="/reservas" className="breadcrumb-link">Reservas</Link>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">#{reserva.id}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title">Reserva #{reserva.id}</h1>
        <Badge status={reserva.estado} />
      </div>

      {/* Two Column Grid */}
      <div className="detail-grid">
        {/* Left Column: Información del Cliente (Panel 09) */}
        <div className="detail-card">
          <div className="detail-card-header">
            <h3 className="detail-card-title">
              <User size={19} color="#2563eb" />
              <span>Información del cliente</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div className="detail-field-row">
              <div className="field-label-wrap">
                <User size={16} />
                <span>Nombre</span>
              </div>
              <div className="field-value">{reserva.cliente}</div>
            </div>

            <div className="detail-field-row">
              <div className="field-label-wrap">
                <CreditCard size={16} />
                <span>DNI</span>
              </div>
              <div className="field-value">{reserva.dni}</div>
            </div>

            <div className="detail-field-row">
              <div className="field-label-wrap">
                <Phone size={16} />
                <span>Teléfono</span>
              </div>
              <div className="field-value">{reserva.telefono}</div>
            </div>

            <div className="detail-field-row">
              <div className="field-label-wrap">
                <Mail size={16} />
                <span>Correo</span>
              </div>
              <div className="field-value" style={{ wordBreak: 'break-all' }}>{reserva.correo}</div>
            </div>
          </div>

          {/* Stepper del Estado de la Reserva (Panel 09) */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '18px', marginTop: 'auto' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '16px' }}>
              Estado de la reserva
            </h4>

            <div className="reserva-status-timeline">
              <div className="timeline-node completed">
                <div className="node-icon"><CheckCircle2 size={16} /></div>
                <div className="node-label">Creado</div>
                <div className="node-date">10/06/2025</div>
              </div>

              <div className={`timeline-line ${reserva.estado === 'Confirmada' ? 'completed' : ''}`}></div>

              <div className={`timeline-node ${reserva.estado === 'Confirmada' ? 'completed' : ''}`}>
                <div className="node-icon"><CheckCircle2 size={16} /></div>
                <div className="node-label">Confirmado</div>
                <div className="node-date">{reserva.fecha}</div>
              </div>

              <div className="timeline-line"></div>

              <div className="timeline-node">
                <div className="node-icon"><Clock size={16} /></div>
                <div className="node-label">En curso</div>
              </div>

              <div className="timeline-line"></div>

              <div className="timeline-node">
                <div className="node-icon"><Clock size={16} /></div>
                <div className="node-label">Finalizado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Información de la Ruta & Total (Panel 09) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="detail-card">
            <div className="detail-card-header">
              <h3 className="detail-card-title">
                <Compass size={19} color="#2563eb" />
                <span>Información de la ruta</span>
              </h3>
            </div>

            <div className="detail-tour-preview">
              <img
                src={ruta.imagen || '/images/laguna69.jpg'}
                alt={ruta.nombre || reserva.ruta_nombre}
                className="detail-tour-thumb"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=150&q=80';
                }}
              />
              <div className="detail-tour-info">
                <h4 className="detail-tour-title">{ruta.nombre || reserva.ruta_nombre}</h4>
                <div className="detail-tour-meta">
                  <strong>Ubicación:</strong> {ruta.ubicacion || 'Yungay'}
                </div>
                <div className="detail-tour-meta">
                  <strong>Fecha:</strong> {reserva.fecha}
                </div>
                <div className="detail-tour-meta">
                  <strong>Personas:</strong> {reserva.personas}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb', marginTop: '6px' }}>
                  Total: S/ {totalCalculated.toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setIsEditModalOpen(true)}
              >
                Editar
              </button>
              <button
                type="button"
                className="btn-danger-outline"
                style={{ flex: 1, justifyContent: 'center' }}
                disabled={reserva.estado === 'Cancelada' || cancelLoading}
                onClick={handleCancelReserva}
              >
                {cancelLoading ? 'Cancelando...' : 'Cancelar'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => navigate('/reservas')}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ReservaFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        reservaToEdit={reserva}
        rutas={rutas}
        onSuccess={loadData}
      />
    </div>
  );
}
