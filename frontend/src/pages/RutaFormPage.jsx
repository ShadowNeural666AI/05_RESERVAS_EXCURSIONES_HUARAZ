import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../services/api';
import ImageUploadField from '../components/ImageUploadField';

const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre de la ruta es obligatorio'),
  categoria: Yup.string().required('La categoría es obligatoria'),
  ubicacion: Yup.string().required('La ubicación es obligatoria'),
  duracion: Yup.string().required('La duración es obligatoria'),
  dificultad: Yup.string().required('La dificultad es obligatoria'),
  cupo_total: Yup.number()
    .integer('Debe ser un número entero')
    .min(1, 'Mínimo 1 cupo')
    .max(100, 'Máximo 100 cupos')
    .required('El cupo total es obligatorio'),
  precio: Yup.number()
    .min(10, 'Precio mínimo S/ 10')
    .required('El precio es obligatorio'),
  descripcion: Yup.string().nullable(),
  estado: Yup.string().required('El estado es obligatorio'),
});

export default function RutaFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [selectedFile, setSelectedFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      nombre: '',
      categoria: 'Laguna',
      ubicacion: '',
      duracion: '1 día',
      dificultad: 'Moderado',
      cupo_total: 20,
      precio: 50,
      descripcion: '',
      imagen: '/images/laguna69.jpg',
      estado: 'Disponible',
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
        formData.append('cupos_disponibles', Number(values.cupo_total));
        formData.append('precio', Number(values.precio));
        formData.append('estado', values.estado);
        formData.append('descripcion', values.descripcion || '');

        if (selectedFile) {
          formData.append('imagen', selectedFile);
        } else {
          formData.append('imagen', values.imagen || '/images/laguna69.jpg');
        }

        if (isEditing) {
          await api.updateRuta(id, formData);
        } else {
          await api.createRuta(formData);
        }
        navigate('/rutas');
      } catch (err) {
        setStatus(err.message || 'Error al guardar la ruta.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isEditing) {
      async function fetchRuta() {
        try {
          const r = await api.getRutaById(id);
          formik.setValues({
            nombre: r.nombre || '',
            categoria: r.categoria || 'Laguna',
            ubicacion: r.ubicacion || '',
            duracion: r.duracion || '1 día',
            dificultad: r.dificultad || 'Moderado',
            cupo_total: r.cupo_total || 20,
            precio: r.precio || 50,
            descripcion: r.descripcion || '',
            imagen: r.imagen || '/images/laguna69.jpg',
            estado: r.estado || 'Disponible',
          });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      fetchRuta();
    }
  }, [id, isEditing]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Cargando información de la ruta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '850px' }}>
      <div className="page-header">
        <h1 className="page-title">{isEditing ? `Editar Ruta #${id}` : 'Nueva Ruta'}</h1>
        <p className="page-subtitle">Gestiona la información de la ruta turística, sube imágenes optimizadas en WebP y configura cupos.</p>
      </div>

      <div className="table-card" style={{ padding: '32px' }}>
        <form onSubmit={formik.handleSubmit}>
          {formik.status && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px' }}>
              {formik.status}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre de la ruta *</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej. Laguna 69"
                className={`form-input ${formik.touched.nombre && formik.errors.nombre ? 'is-invalid' : ''}`}
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.nombre && formik.errors.nombre && (
                <span className="form-error">{formik.errors.nombre}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select
                name="categoria"
                className="form-select"
                value={formik.values.categoria}
                onChange={formik.handleChange}
              >
                <option value="Laguna">Laguna</option>
                <option value="Montaña">Montaña</option>
                <option value="Caminata">Caminata</option>
                <option value="Aventura">Aventura</option>
                <option value="Paisaje">Paisaje</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ubicación *</label>
              <input
                type="text"
                name="ubicacion"
                placeholder="Ej. Yungay - Huaraz"
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
              <select
                name="duracion"
                className="form-select"
                value={formik.values.duracion}
                onChange={formik.handleChange}
              >
                <option value="1 día">1 día</option>
                <option value="Medio día">Medio día</option>
                <option value="2 días / 1 noche">2 días / 1 noche</option>
                <option value="3 días">3 días</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Dificultad *</label>
              <select
                name="dificultad"
                className="form-select"
                value={formik.values.dificultad}
                onChange={formik.handleChange}
              >
                <option value="Fácil">Fácil</option>
                <option value="Moderado">Moderado</option>
                <option value="Difícil">Difícil</option>
                <option value="Experto">Experto</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Cupo total *</label>
              <input
                type="number"
                name="cupo_total"
                min="1"
                max="100"
                className={`form-input ${formik.touched.cupo_total && formik.errors.cupo_total ? 'is-invalid' : ''}`}
                value={formik.values.cupo_total}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.cupo_total && formik.errors.cupo_total && (
                <span className="form-error">{formik.errors.cupo_total}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Precio por persona (S/) *</label>
              <input
                type="number"
                name="precio"
                min="10"
                step="5"
                className="form-input"
                value={formik.values.precio}
                onChange={formik.handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estado *</label>
              <select
                name="estado"
                className="form-select"
                value={formik.values.estado}
                onChange={formik.handleChange}
              >
                <option value="Disponible">Disponible</option>
                <option value="Agotado">Agotado</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              name="descripcion"
              rows="3"
              placeholder="Hermosa laguna de aguas turquesas, rodeada de montañas nevadas. Ideal para amantes de la naturaleza..."
              className="form-textarea"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Imagen de la Ruta (Subida y optimización profesional)</label>
            <ImageUploadField
              currentImageUrl={formik.values.imagen}
              selectedFile={selectedFile}
              onFileSelect={(file) => setSelectedFile(file)}
              onClearFile={() => setSelectedFile(null)}
              disabled={formik.isSubmitting}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '30px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/rutas')}
              disabled={formik.isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Procesando y Guardando...' : 'Guardar Ruta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
