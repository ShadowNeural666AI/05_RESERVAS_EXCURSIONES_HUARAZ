import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from './Modal';
import { api } from '../services/api';

const validationSchema = Yup.object().shape({
  cliente: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre del cliente es obligatorio'),
  dni: Yup.string()
    .matches(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos numéricos')
    .required('El DNI es obligatorio'),
  telefono: Yup.string()
    .matches(/^[0-9\s]{9,12}$/, 'Ingrese un número telefónico válido (ej. 987654321)')
    .required('El teléfono es obligatorio'),
  correo: Yup.string()
    .email('Ingrese un correo electrónico válido')
    .required('El correo electrónico es obligatorio'),
  ruta_id: Yup.number()
    .typeError('Seleccione una ruta válida')
    .required('Debe seleccionar una ruta'),
  fecha: Yup.string()
    .required('La fecha de excursión es obligatoria'),
  personas: Yup.number()
    .typeError('Debe ingresar un número')
    .integer('Debe ser un número entero')
    .min(1, 'Mínimo 1 persona')
    .required('El número de personas es obligatorio'),
  estado: Yup.string()
    .oneOf(['Confirmada', 'Pendiente', 'Cancelada'], 'Estado no válido')
    .required('El estado es obligatorio'),
  observaciones: Yup.string().nullable(),
});

export default function ReservaFormModal({
  isOpen,
  onClose,
  reservaToEdit = null,
  rutas = [],
  onSuccess,
}) {
  const isEditing = Boolean(reservaToEdit);

  // Convert date format DD/MM/YYYY to YYYY-MM-DD for html5 date input if editing
  const parseDateForInput = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return dateStr;
  };

  const formatDateForApi = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return dateStr;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      cliente: reservaToEdit?.cliente || '',
      dni: reservaToEdit?.dni || '',
      telefono: reservaToEdit?.telefono || '',
      correo: reservaToEdit?.correo || '',
      ruta_id: reservaToEdit?.ruta_id || (rutas.length > 0 ? rutas[0].id : ''),
      fecha: parseDateForInput(reservaToEdit?.fecha) || new Date().toISOString().split('T')[0],
      personas: reservaToEdit?.personas || 1,
      estado: reservaToEdit?.estado || 'Confirmada',
      observaciones: reservaToEdit?.observaciones || '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        const payload = {
          ...values,
          fecha: formatDateForApi(values.fecha),
          personas: Number(values.personas),
          ruta_id: Number(values.ruta_id),
        };

        if (isEditing) {
          await api.updateReserva(reservaToEdit.id, payload);
        } else {
          await api.createReserva(payload);
        }

        onSuccess();
        onClose();
      } catch (err) {
        setStatus(err.message || 'Error al guardar la reserva');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const selectedRuta = rutas.find((r) => r.id === Number(formik.values.ruta_id));
  const availableSeats = selectedRuta
    ? isEditing && reservaToEdit?.ruta_id === selectedRuta.id
      ? selectedRuta.cupos_disponibles + (reservaToEdit.estado !== 'Cancelada' ? reservaToEdit.personas : 0)
      : selectedRuta.cupos_disponibles
    : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar Reserva #${reservaToEdit?.id}` : '+ Nueva Reserva'}
      maxWidth="600px"
    >
      <form onSubmit={formik.handleSubmit}>
        {formik.status && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '0.85rem',
            }}
          >
            {formik.status}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Nombre del Cliente *</label>
          <input
            type="text"
            name="cliente"
            placeholder="Ej. María López"
            className={`form-input ${formik.touched.cliente && formik.errors.cliente ? 'is-invalid' : ''}`}
            value={formik.values.cliente}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.cliente && formik.errors.cliente && (
            <span className="form-error">{formik.errors.cliente}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">DNI *</label>
            <input
              type="text"
              name="dni"
              maxLength="8"
              placeholder="12345678"
              className={`form-input ${formik.touched.dni && formik.errors.dni ? 'is-invalid' : ''}`}
              value={formik.values.dni}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.dni && formik.errors.dni && (
              <span className="form-error">{formik.errors.dni}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono *</label>
            <input
              type="text"
              name="telefono"
              placeholder="987 654 321"
              className={`form-input ${formik.touched.telefono && formik.errors.telefono ? 'is-invalid' : ''}`}
              value={formik.values.telefono}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.telefono && formik.errors.telefono && (
              <span className="form-error">{formik.errors.telefono}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Correo Electrónico *</label>
          <input
            type="email"
            name="correo"
            placeholder="cliente@email.com"
            className={`form-input ${formik.touched.correo && formik.errors.correo ? 'is-invalid' : ''}`}
            value={formik.values.correo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.correo && formik.errors.correo && (
            <span className="form-error">{formik.errors.correo}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Ruta Turística *</label>
            <select
              name="ruta_id"
              className={`form-select ${formik.touched.ruta_id && formik.errors.ruta_id ? 'is-invalid' : ''}`}
              value={formik.values.ruta_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {rutas.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre} ({r.ubicacion} - {r.cupos_disponibles} cupos disp.)
                </option>
              ))}
            </select>
            {formik.touched.ruta_id && formik.errors.ruta_id && (
              <span className="form-error">{formik.errors.ruta_id}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de Excursión *</label>
            <input
              type="date"
              name="fecha"
              className={`form-input ${formik.touched.fecha && formik.errors.fecha ? 'is-invalid' : ''}`}
              value={formik.values.fecha}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.fecha && formik.errors.fecha && (
              <span className="form-error">{formik.errors.fecha}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Personas *{' '}
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                (Máx: {availableSeats})
              </span>
            </label>
            <input
              type="number"
              name="personas"
              min="1"
              max={availableSeats > 0 ? availableSeats : 1}
              className={`form-input ${formik.touched.personas && formik.errors.personas ? 'is-invalid' : ''}`}
              value={formik.values.personas}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.personas && formik.errors.personas && (
              <span className="form-error">{formik.errors.personas}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Estado *</label>
            <select
              name="estado"
              className={`form-select ${formik.touched.estado && formik.errors.estado ? 'is-invalid' : ''}`}
              value={formik.values.estado}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="Confirmada">Confirmada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            {formik.touched.estado && formik.errors.estado && (
              <span className="form-error">{formik.errors.estado}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Observaciones</label>
          <textarea
            name="observaciones"
            rows="2"
            placeholder="Requerimientos especiales, alergias, bastones de trekking..."
            className="form-textarea"
            value={formik.values.observaciones}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={formik.isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Reserva'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
