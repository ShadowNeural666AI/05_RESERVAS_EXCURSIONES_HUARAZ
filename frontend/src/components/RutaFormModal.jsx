import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from './Modal';
import { api } from '../services/api';
import ImageUploadField from './ImageUploadField';

const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre de la ruta es obligatorio'),
  categoria: Yup.string().required('La categoría es obligatoria'),
  ubicacion: Yup.string()
    .required('La ubicación es obligatoria (ej. Yungay, Huari, Ancash)'),
  duracion: Yup.string()
    .required('La duración es obligatoria (ej. 1 día, medio día)'),
  dificultad: Yup.string().required('La dificultad es obligatoria'),
  cupo_total: Yup.number()
    .typeError('Debe ser un número válido')
    .integer('Debe ser entero')
    .min(1, 'El cupo total mínimo es 1')
    .required('El cupo total es obligatorio'),
  cupos_disponibles: Yup.number()
    .typeError('Debe ser un número válido')
    .integer('Debe ser entero')
    .min(0, 'No puede ser negativo')
    .required('Los cupos disponibles son obligatorios'),
  estado: Yup.string()
    .oneOf(['Disponible', 'Agotado', 'Mantenimiento'], 'Estado inválido')
    .required('El estado es obligatorio'),
  descripcion: Yup.string().nullable(),
});

export default function RutaFormModal({
  isOpen,
  onClose,
  rutaToEdit = null,
  onSuccess,
}) {
  const isEditing = Boolean(rutaToEdit);
  const [selectedFile, setSelectedFile] = useState(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: rutaToEdit?.nombre || '',
      categoria: rutaToEdit?.categoria || 'Laguna',
      ubicacion: rutaToEdit?.ubicacion || '',
      duracion: rutaToEdit?.duracion || '1 día',
      dificultad: rutaToEdit?.dificultad || 'Moderado',
      cupo_total: rutaToEdit?.cupo_total || 15,
      cupos_disponibles: rutaToEdit?.cupos_disponibles !== undefined ? rutaToEdit.cupos_disponibles : 15,
      estado: rutaToEdit?.estado || 'Disponible',
      imagen: rutaToEdit?.imagen || '/images/laguna69.jpg',
      descripcion: rutaToEdit?.descripcion || '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);

        const formData = new FormData();
        formData.append('nombre', values.nombre);
        formData.append('categoria', values.categoria);
        formData.append('ubicacion', values.ubicacion);
        formData.append('duracion', values.duracion);
        formData.append('dificultad', values.dificultad);
        formData.append('cupo_total', Number(values.cupo_total));
        formData.append('cupos_disponibles', Number(values.cupos_disponibles));
        formData.append('estado', values.estado);
        formData.append('descripcion', values.descripcion || '');

        if (selectedFile) {
          formData.append('imagen', selectedFile);
        } else {
          formData.append('imagen', values.imagen || '/images/laguna69.jpg');
        }

        if (isEditing) {
          await api.updateRuta(rutaToEdit.id, formData);
        } else {
          await api.createRuta(formData);
        }

        setSelectedFile(null);
        onSuccess();
        onClose();
      } catch (err) {
        setStatus(err.message || 'Error al guardar la ruta');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar Ruta #${rutaToEdit?.id}` : '+ Nueva Ruta'}
      maxWidth="560px"
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
          <label className="form-label">Nombre de la Ruta *</label>
          <input
            type="text"
            name="nombre"
            placeholder="Ej. Nevado Pastoruri"
            className={`form-input ${formik.touched.nombre && formik.errors.nombre ? 'is-invalid' : ''}`}
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.nombre && formik.errors.nombre && (
            <span className="form-error">{formik.errors.nombre}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Ubicación *</label>
            <input
              type="text"
              name="ubicacion"
              placeholder="Ej. Yungay"
              className={`form-input ${formik.touched.ubicacion && formik.errors.ubicacion ? 'is-invalid' : ''}`}
              value={formik.values.ubicacion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.ubicacion && formik.errors.ubicacion && (
              <span className="form-error">{formik.errors.ubicacion}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Duración *</label>
            <input
              type="text"
              name="duracion"
              placeholder="Ej. 1 día"
              className={`form-input ${formik.touched.duracion && formik.errors.duracion ? 'is-invalid' : ''}`}
              value={formik.values.duracion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.duracion && formik.errors.duracion && (
              <span className="form-error">{formik.errors.duracion}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Cupo Total *</label>
            <input
              type="number"
              name="cupo_total"
              min="1"
              className={`form-input ${formik.touched.cupo_total && formik.errors.cupo_total ? 'is-invalid' : ''}`}
              value={formik.values.cupo_total}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.cupo_total && formik.errors.cupo_total && (
              <span className="form-error">{formik.errors.cupo_total}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Cupos Disponibles *</label>
            <input
              type="number"
              name="cupos_disponibles"
              min="0"
              className={`form-input ${formik.touched.cupos_disponibles && formik.errors.cupos_disponibles ? 'is-invalid' : ''}`}
              value={formik.values.cupos_disponibles}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.cupos_disponibles && formik.errors.cupos_disponibles && (
              <span className="form-error">{formik.errors.cupos_disponibles}</span>
            )}
          </div>
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
            <option value="Disponible">Disponible</option>
            <option value="Agotado">Agotado</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Imagen de la Ruta (Subida y optimización)</label>
          <ImageUploadField
            currentImageUrl={formik.values.imagen}
            selectedFile={selectedFile}
            onFileSelect={(file) => setSelectedFile(file)}
            onClearFile={() => setSelectedFile(null)}
            disabled={formik.isSubmitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            rows="2"
            placeholder="Breve reseña del circuito o altitud máxima..."
            className="form-textarea"
            value={formik.values.descripcion}
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
            {formik.isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Ruta'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
