import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Check, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { ReservaExitoModal, CupoInsuficienteModal } from '../components/AlertModals';

// Strict validation schemas using formik-patterns
const step1Schema = Yup.object().shape({
  cliente: Yup.string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre completo es obligatorio'),
  dni: Yup.string()
    .matches(/^\d{8}$/, 'El DNI debe contener exactamente 8 números')
    .required('El DNI es obligatorio'),
  telefono: Yup.string()
    .matches(/^9\d{8}$/, 'El teléfono debe iniciar con 9 y tener 9 dígitos (ej. 987654321)')
    .required('El teléfono es obligatorio'),
  correo: Yup.string()
    .email('Ingrese un correo electrónico válido')
    .required('El correo electrónico es obligatorio'),
});

const step2Schema = Yup.object().shape({
  ruta_id: Yup.number().required('Debe seleccionar una ruta turística'),
  fecha: Yup.string().required('La fecha de excursión es obligatoria'),
  personas: Yup.number()
    .typeError('Debe ser un número válido')
    .integer('Debe ser un número entero')
    .min(1, 'Mínimo 1 persona')
    .required('El número de personas es obligatorio'),
});

export default function ReservaWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedRutaId = location.state?.rutaId;

  const [currentStep, setCurrentStep] = useState(1);
  const [rutas, setRutas] = useState([]);
  const [loadingRutas, setLoadingRutas] = useState(true);
  const [createdReservaId, setCreatedReservaId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCupoAlert, setShowCupoAlert] = useState(false);

  useEffect(() => {
    async function fetchRutas() {
      try {
        const data = await api.getRutas();
        setRutas(data);
      } catch (err) {
        console.error('Error fetching rutas:', err);
      } finally {
        setLoadingRutas(false);
      }
    }
    fetchRutas();
  }, []);

  const formik = useFormik({
    initialValues: {
      cliente: '',
      dni: '',
      telefono: '',
      correo: '',
      ruta_id: preselectedRutaId || 1,
      fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      personas: 2,
      observaciones: '',
    },
    enableReinitialize: !preselectedRutaId,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        const ruta = rutas.find((r) => r.id === Number(values.ruta_id));
        if (ruta && Number(values.personas) > ruta.cupos_disponibles) {
          setShowCupoAlert(true);
          setSubmitting(false);
          return;
        }

        // Format date to DD/MM/YYYY
        const [year, month, day] = values.fecha.split('-');
        const formattedDate = `${day}/${month}/${year}`;

        const payload = {
          cliente: values.cliente.trim(),
          dni: values.dni.trim(),
          telefono: values.telefono.trim(),
          correo: values.correo.trim().toLowerCase(),
          ruta_id: Number(values.ruta_id),
          fecha: formattedDate,
          personas: Number(values.personas),
          estado: 'Confirmada',
          observaciones: values.observaciones,
        };

        const res = await api.createReserva(payload);
        setCreatedReservaId(res.id);
        setShowSuccessModal(true);
      } catch (err) {
        setStatus(err.message || 'Error al confirmar la reserva.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const selectedRuta = rutas.find((r) => r.id === Number(formik.values.ruta_id)) || rutas[0];
  const unitPrice = selectedRuta?.precio || 50;
  const totalPrice = unitPrice * Number(formik.values.personas || 1);
  const hasEnoughSeats = selectedRuta ? Number(formik.values.personas) <= selectedRuta.cupos_disponibles : false;

  // Next step navigation with validation
  const handleNextStep1 = async () => {
    formik.setFieldTouched('cliente', true);
    formik.setFieldTouched('dni', true);
    formik.setFieldTouched('telefono', true);
    formik.setFieldTouched('correo', true);

    try {
      await step1Schema.validate({
        cliente: formik.values.cliente,
        dni: formik.values.dni,
        telefono: formik.values.telefono,
        correo: formik.values.correo,
      }, { abortEarly: false });
      setCurrentStep(2);
    } catch (err) {
      // Formik will show field errors
    }
  };

  const handleNextStep2 = async () => {
    formik.setFieldTouched('ruta_id', true);
    formik.setFieldTouched('fecha', true);
    formik.setFieldTouched('personas', true);

    try {
      await step2Schema.validate({
        ruta_id: formik.values.ruta_id,
        fecha: formik.values.fecha,
        personas: formik.values.personas,
      }, { abortEarly: false });

      if (!hasEnoughSeats) {
        setShowCupoAlert(true);
        return;
      }
      setCurrentStep(3);
    } catch (err) {
      // Formik errors shown
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      {/* Wizard Header & Stepper */}
      <div className="wizard-card">
        <div className="wizard-stepper">
          <div className={`step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-circle">{currentStep > 1 ? <Check size={16} /> : '1'}</div>
            <div className="step-label">Datos del cliente</div>
          </div>
          <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>

          <div className={`step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-circle">{currentStep > 2 ? <Check size={16} /> : '2'}</div>
            <div className="step-label">Seleccionar ruta</div>
          </div>
          <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>

          <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-label">Confirmar</div>
          </div>
        </div>

        {/* STEP 1: Datos del Cliente (Panel 06) */}
        {currentStep === 1 && (
          <div className="step-content-pane">
            <h2 className="step-title">Datos del cliente</h2>
            <p className="step-desc">Ingrese la información personal del titular de la reserva.</p>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  name="cliente"
                  placeholder="Ej. María López"
                  className={`form-input ${formik.touched.cliente && formik.errors.cliente ? 'is-invalid' : ''}`}
                  value={formik.values.cliente}
                  onChange={(e) => {
                    // Only letters and spaces restriction
                    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(e.target.value)) {
                      formik.handleChange(e);
                    }
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.cliente && formik.errors.cliente && (
                  <span className="form-error">{formik.errors.cliente}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">DNI *</label>
                <input
                  type="text"
                  name="dni"
                  maxLength="8"
                  placeholder="12345678"
                  className={`form-input ${formik.touched.dni && formik.errors.dni ? 'is-invalid' : ''}`}
                  value={formik.values.dni}
                  onChange={(e) => {
                    // Digits only restriction
                    if (/^\d*$/.test(e.target.value)) {
                      formik.handleChange(e);
                    }
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.dni && formik.errors.dni && (
                  <span className="form-error">{formik.errors.dni}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Teléfono *</label>
                <input
                  type="text"
                  name="telefono"
                  maxLength="9"
                  placeholder="987654321"
                  className={`form-input ${formik.touched.telefono && formik.errors.telefono ? 'is-invalid' : ''}`}
                  value={formik.values.telefono}
                  onChange={(e) => {
                    // Digits only restriction
                    if (/^\d*$/.test(e.target.value)) {
                      formik.handleChange(e);
                    }
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.telefono && formik.errors.telefono && (
                  <span className="form-error">{formik.errors.telefono}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Correo *</label>
                <input
                  type="email"
                  name="correo"
                  placeholder="maria.lopez@email.com"
                  className={`form-input ${formik.touched.correo && formik.errors.correo ? 'is-invalid' : ''}`}
                  value={formik.values.correo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.correo && formik.errors.correo && (
                  <span className="form-error">{formik.errors.correo}</span>
                )}
              </div>
            </div>

            <div className="wizard-actions" style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={handleNextStep1}
              >
                <span>Siguiente</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Selecciona la Ruta y Fecha (Panel 07) */}
        {currentStep === 2 && (
          <div className="step-content-pane">
            <h2 className="step-title">Selecciona la ruta y fecha</h2>
            <p className="step-desc">Elige el destino en la Cordillera Blanca y la cantidad de viajeros.</p>

            <div className="form-group">
              <label className="form-label">Ruta *</label>
              <select
                name="ruta_id"
                className="form-select"
                value={formik.values.ruta_id}
                onChange={formik.handleChange}
              >
                {rutas.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre} — {r.ubicacion} (S/ {r.precio}.00 | {r.cupos_disponibles} cupos disponibles)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha de reserva *</label>
                <input
                  type="date"
                  name="fecha"
                  min={new Date().toISOString().split('T')[0]}
                  className="form-input"
                  value={formik.values.fecha}
                  onChange={formik.handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Personas *</label>
                <input
                  type="number"
                  name="personas"
                  min="1"
                  max={selectedRuta?.cupos_disponibles || 1}
                  className={`form-input ${!hasEnoughSeats ? 'is-invalid' : ''}`}
                  value={formik.values.personas}
                  onChange={formik.handleChange}
                />
              </div>
            </div>

            {/* Dynamic Cupo Availability Box */}
            {selectedRuta && (
              <div className={`cupo-status-box ${hasEnoughSeats ? 'box-success' : 'box-danger'}`}>
                {hasEnoughSeats ? (
                  <>
                    <CheckCircle2 size={20} color="#16a34a" />
                    <div>
                      <strong>Cupos disponibles: {selectedRuta.cupos_disponibles}</strong>
                      <p>La cantidad de personas no excede los cupos disponibles.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} color="#dc2626" />
                    <div>
                      <strong>Cupos insuficientes ({selectedRuta.cupos_disponibles} disponibles)</strong>
                      <p>Has seleccionado {formik.values.personas} personas, lo cual excede el límite disponible.</p>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="wizard-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCurrentStep(1)}
              >
                <ArrowLeft size={16} />
                <span>Anterior</span>
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleNextStep2}
              >
                <span>Siguiente</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmación de Reserva (Panel 08) */}
        {currentStep === 3 && (
          <div className="step-content-pane">
            <h2 className="step-title">Resumen de la reserva</h2>
            <p className="step-desc">Verifique todos los detalles antes de confirmar su registro.</p>

            <div className="summary-two-col">
              {/* Left Details */}
              <div className="summary-left-box">
                <h4 className="summary-subtitle">Cliente</h4>
                <p><strong>Nombre:</strong> {formik.values.cliente}</p>
                <p><strong>DNI:</strong> {formik.values.dni}</p>
                <p><strong>Teléfono:</strong> {formik.values.telefono}</p>
                <p><strong>Correo:</strong> {formik.values.correo}</p>
              </div>

              {/* Right Tour Card */}
              <div className="summary-right-box">
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img
                    src={selectedRuta?.imagen || '/images/laguna69.jpg'}
                    alt={selectedRuta?.nombre}
                    style={{ width: '85px', height: '85px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{selectedRuta?.nombre}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Ubicación: {selectedRuta?.ubicacion}</p>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Fecha: {formik.values.fecha}</p>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Personas: {formik.values.personas}</p>
                    <p style={{ fontSize: '1rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
                      Total: S/ {totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Preview Notice */}
            <div className="cupo-status-box box-success" style={{ marginTop: '20px' }}>
              <CheckCircle2 size={20} color="#16a34a" />
              <div>
                <strong>¡Éxito!</strong> La reserva se registrará y los cupos serán descontados automáticamente.
              </div>
            </div>

            <div className="wizard-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/reservas')}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={formik.isSubmitting}
                onClick={formik.handleSubmit}
              >
                {formik.isSubmitting ? 'Confirmando...' : 'Confirmar reserva'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <ReservaExitoModal
        isOpen={showSuccessModal}
        reservaId={createdReservaId}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/reservas');
        }}
      />

      {/* Insufficient Seats Modal */}
      <CupoInsuficienteModal
        isOpen={showCupoAlert}
        disponibles={selectedRuta?.cupos_disponibles || 0}
        onClose={() => setShowCupoAlert(false)}
      />
    </div>
  );
}
