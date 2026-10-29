import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, UserPlus } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../services/api';
import Modal from '../components/Modal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const clienteSchema = Yup.object().shape({
  nombre: Yup.string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras')
    .min(3, 'Mínimo 3 caracteres')
    .required('El nombre es obligatorio'),
  dni: Yup.string()
    .matches(/^\d{8}$/, 'El DNI debe tener exactamente 8 números')
    .required('El DNI es obligatorio'),
  telefono: Yup.string()
    .matches(/^9\d{8}$/, 'El teléfono debe iniciar con 9 y tener 9 dígitos')
    .required('El teléfono es obligatorio'),
  correo: Yup.string()
    .email('Correo inválido')
    .required('El correo es obligatorio'),
});

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await api.getClientes({ q: search });
      setClientes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadClientes();
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  const formik = useFormik({
    initialValues: {
      nombre: '',
      dni: '',
      telefono: '',
      correo: '',
    },
    validationSchema: clienteSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
      try {
        await api.createCliente(values);
        resetForm();
        setIsModalOpen(false);
        loadClientes();
      } catch (err) {
        setStatus(err.message || 'Error al guardar cliente');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDelete = async () => {
    if (!clienteToDelete) return;
    try {
      await api.deleteCliente(clienteToDelete.id);
      setClienteToDelete(null);
      loadClientes();
    } catch (err) {
      alert(err.message || 'Error al eliminar');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <p className="page-subtitle">Lista de clientes registrados en el sistema.</p>
      </div>

      <div className="table-action-bar">
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button type="button" className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Cargando clientes...</p>
          </div>
        ) : clientes.length === 0 ? (
          <div className="empty-box">
            <p>No se encontraron clientes registrados.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: '#64748b', fontWeight: 600 }}>{c.id}</td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{c.nombre}</td>
                  <td style={{ color: '#475569' }}>{c.dni}</td>
                  <td style={{ color: '#475569' }}>{c.telefono}</td>
                  <td style={{ color: '#475569' }}>{c.correo}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn-icon-square btn-icon-red"
                      title="Eliminar cliente"
                      onClick={() => setClienteToDelete(c)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Nuevo Cliente */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="+ Nuevo Cliente" maxWidth="480px">
        <form onSubmit={formik.handleSubmit}>
          {formik.status && (
            <div style={{ padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem' }}>
              {formik.status}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input
              type="text"
              name="nombre"
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
            <label className="form-label">DNI *</label>
            <input
              type="text"
              name="dni"
              maxLength="8"
              className={`form-input ${formik.touched.dni && formik.errors.dni ? 'is-invalid' : ''}`}
              value={formik.values.dni}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) formik.handleChange(e);
              }}
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
              maxLength="9"
              className={`form-input ${formik.touched.telefono && formik.errors.telefono ? 'is-invalid' : ''}`}
              value={formik.values.telefono}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) formik.handleChange(e);
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
              className={`form-input ${formik.touched.correo && formik.errors.correo ? 'is-invalid' : ''}`}
              value={formik.values.correo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.correo && formik.errors.correo && (
              <span className="form-error">{formik.errors.correo}</span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={Boolean(clienteToDelete)}
        onClose={() => setClienteToDelete(null)}
        onConfirm={handleDelete}
        title="¿Eliminar Cliente?"
        message={`¿Deseas eliminar a ${clienteToDelete?.nombre}?`}
      />
    </div>
  );
}
