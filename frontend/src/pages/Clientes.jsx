import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
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
    .email('Correo electrónico inválido')
    .required('El correo es obligatorio'),
});

const ITEMS_PER_PAGE = 5;

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [clienteToEdit, setClienteToEdit] = useState(null);
  const [clienteToView, setClienteToView] = useState(null);
  const [viewDetails, setViewDetails] = useState({ cliente: null, reservas: [], loading: false });
  const [clienteToDelete, setClienteToDelete] = useState(null);

  // Cargar clientes desde la API
  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await api.getClientes({ q: search });
      setClientes(data || []);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadClientes();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Cargar detalles y reservas para el modal de visualización
  const handleOpenView = async (cliente) => {
    setClienteToView(cliente);
    setViewDetails({ cliente, reservas: [], loading: true });
    try {
      const res = await api.getClienteById(cliente.id);
      setViewDetails({
        cliente: res.cliente || cliente,
        reservas: res.reservas || [],
        loading: false,
      });
    } catch (err) {
      console.error('Error al cargar detalle de cliente:', err);
      setViewDetails((prev) => ({ ...prev, loading: false }));
    }
  };

  // Filtrado local adicional
  const filteredClientes = useMemo(() => {
    return clientes.filter((c) => {
      if (activeFilter === 'Con reservas') {
        return (c.reservas_count || 0) > 0;
      }
      if (activeFilter === 'Sin reservas') {
        return !c.reservas_count || c.reservas_count === 0;
      }
      return true;
    });
  }, [clientes, activeFilter]);

  // Paginación
  const totalPages = Math.ceil(filteredClientes.length / ITEMS_PER_PAGE) || 1;
  const paginatedClientes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClientes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClientes, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Formik para Crear Cliente
  const createFormik = useFormik({
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
        setIsCreateOpen(false);
        await loadClientes();
      } catch (err) {
        setStatus(err.message || 'Error al registrar cliente');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Formik para Editar Cliente
  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: clienteToEdit?.nombre || '',
      dni: clienteToEdit?.dni || '',
      telefono: clienteToEdit?.telefono || '',
      correo: clienteToEdit?.correo || '',
    },
    validationSchema: clienteSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await api.updateCliente(clienteToEdit.id, values);
        setClienteToEdit(null);
        await loadClientes();
      } catch (err) {
        setStatus(err.message || 'Error al actualizar cliente');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Eliminar Cliente
  const handleDelete = async () => {
    if (!clienteToDelete) return;
    try {
      await api.deleteCliente(clienteToDelete.id);
      setClienteToDelete(null);
      await loadClientes();
    } catch (err) {
      alert(err.message || 'Error al eliminar cliente');
    }
  };

  return (
    <div className="clientes-page-container">
      {/* 1. HERO BANNER DE CLIENTES CON FOTO PANORÁMICA DE HUARAZ */}
      <div className="clientes-hero-banner">
        <div className="clientes-hero-overlay"></div>

        {/* Lado izquierdo: Ícono circular brillante + Título y subtítulo */}
        <div className="clientes-hero-left">
          <div className="clientes-banner-badge" aria-hidden="true">
            <Users size={32} strokeWidth={2.2} />
          </div>
          <div className="clientes-hero-text">
            <h1 className="clientes-hero-title">Clientes</h1>
            <p className="clientes-hero-subtitle">
              Lista de clientes registrados en el sistema.
            </p>
          </div>
        </div>

        {/* Lado derecho: Botón "+ Nuevo Cliente" */}
        <div className="clientes-hero-right">
          <button
            type="button"
            className="clientes-banner-add-btn"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* 2. BARRA DE HERRAMIENTAS: Búsqueda, Filtro Todos y Botón Buscar */}
      <div className="clientes-toolbar">
        {/* Input Buscador con Lupa */}
        <div className="clientes-search-pill">
          <Search size={18} className="clientes-search-icon" />
          <input
            type="text"
            className="clientes-search-input"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          {search && (
            <button
              type="button"
              className="clientes-search-clear"
              onClick={() => {
                setSearch('');
                setCurrentPage(1);
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Selector de filtro "Todos" */}
        <div className="clientes-filter-dropdown-wrap">
          <button
            type="button"
            className="clientes-filter-pill"
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
          >
            <span>{activeFilter}</span>
            <ChevronDown size={16} className={`filter-chevron ${filterMenuOpen ? 'open' : ''}`} />
          </button>

          {filterMenuOpen && (
            <div className="clientes-filter-menu">
              {['Todos', 'Con reservas', 'Sin reservas'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`filter-menu-item ${activeFilter === opt ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter(opt);
                    setFilterMenuOpen(false);
                    setCurrentPage(1);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón Buscar */}
        <button
          type="button"
          className="clientes-btn-buscar"
          onClick={() => loadClientes()}
        >
          <Search size={16} strokeWidth={2.5} />
          <span>Buscar</span>
        </button>
      </div>

      {/* 3. TARJETA CONTENEDORA DE TABLA DE CLIENTES */}
      <div className="clientes-table-card">
        {loading ? (
          <div className="clientes-state-box">
            <div className="spinner"></div>
            <p>Cargando lista de clientes...</p>
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className="clientes-state-box">
            <Users size={48} className="empty-icon" />
            <h3>No se encontraron clientes</h3>
            <p>No hay coincidencias con la búsqueda o filtros aplicados.</p>
          </div>
        ) : (
          <div className="clientes-table-wrapper">
            <table className="clientes-table">
              <thead>
                <tr>
                  <th className="th-id">ID</th>
                  <th className="th-nombre">NOMBRE</th>
                  <th className="th-dni">DNI</th>
                  <th className="th-telefono">TELÉFONO</th>
                  <th className="th-correo">CORREO</th>
                  <th className="th-acciones">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClientes.map((c) => (
                  <tr key={c.id} className="clientes-table-row">
                    {/* Badge de ID con estilo píldora azul celeste */}
                    <td className="td-id">
                      <span className="cliente-id-badge">{c.id}</span>
                    </td>

                    {/* Nombre en negrita */}
                    <td className="td-nombre">
                      <span className="cliente-nombre-text">{c.nombre}</span>
                    </td>

                    {/* DNI */}
                    <td className="td-dni">
                      <span>{c.dni}</span>
                    </td>

                    {/* Teléfono */}
                    <td className="td-telefono">
                      <span>{c.telefono}</span>
                    </td>

                    {/* Correo */}
                    <td className="td-correo">
                      <span className="cliente-correo-text">{c.correo}</span>
                    </td>

                    {/* 3 Botones de Acción: Ver, Editar, Eliminar */}
                    <td className="td-acciones">
                      <div className="clientes-actions-row">
                        <button
                          type="button"
                          className="btn-action-round btn-action-view"
                          title="Ver detalle del cliente y sus reservas"
                          onClick={() => handleOpenView(c)}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn-action-round btn-action-edit"
                          title="Editar información del cliente"
                          onClick={() => setClienteToEdit(c)}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="btn-action-round btn-action-delete"
                          title="Eliminar cliente"
                          onClick={() => setClienteToDelete(c)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. FOOTER DE PAGINACIÓN */}
        {!loading && filteredClientes.length > 0 && (
          <div className="clientes-pagination-footer">
            <div className="clientes-count-info">
              <Users size={16} className="count-icon" />
              <span>
                Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredClientes.length)} -{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredClientes.length)} de{' '}
                {filteredClientes.length} clientes
              </span>
            </div>

            <div className="clientes-pagination-controls">
              <button
                type="button"
                className="btn-page-nav"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`btn-page-number ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                className="btn-page-nav"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: REGISTRAR NUEVO CLIENTE */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="+ Nuevo Cliente"
        maxWidth="500px"
      >
        <form onSubmit={createFormik.handleSubmit} className="cliente-form">
          {createFormik.status && (
            <div className="form-alert-error">{createFormik.status}</div>
          )}

          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input
              type="text"
              name="nombre"
              className={`form-input ${
                createFormik.touched.nombre && createFormik.errors.nombre ? 'is-invalid' : ''
              }`}
              placeholder="Ej. María López"
              value={createFormik.values.nombre}
              onChange={createFormik.handleChange}
              onBlur={createFormik.handleBlur}
            />
            {createFormik.touched.nombre && createFormik.errors.nombre && (
              <span className="form-error">{createFormik.errors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">DNI / Documento *</label>
            <input
              type="text"
              name="dni"
              maxLength="8"
              className={`form-input ${
                createFormik.touched.dni && createFormik.errors.dni ? 'is-invalid' : ''
              }`}
              placeholder="8 dígitos numéricos"
              value={createFormik.values.dni}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) createFormik.handleChange(e);
              }}
              onBlur={createFormik.handleBlur}
            />
            {createFormik.touched.dni && createFormik.errors.dni && (
              <span className="form-error">{createFormik.errors.dni}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Número telefónico *</label>
            <input
              type="text"
              name="telefono"
              maxLength="9"
              className={`form-input ${
                createFormik.touched.telefono && createFormik.errors.telefono ? 'is-invalid' : ''
              }`}
              placeholder="Ej. 987654321"
              value={createFormik.values.telefono}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) createFormik.handleChange(e);
              }}
              onBlur={createFormik.handleBlur}
            />
            {createFormik.touched.telefono && createFormik.errors.telefono && (
              <span className="form-error">{createFormik.errors.telefono}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico *</label>
            <input
              type="email"
              name="correo"
              className={`form-input ${
                createFormik.touched.correo && createFormik.errors.correo ? 'is-invalid' : ''
              }`}
              placeholder="correo@ejemplo.com"
              value={createFormik.values.correo}
              onChange={createFormik.handleChange}
              onBlur={createFormik.handleBlur}
            />
            {createFormik.touched.correo && createFormik.errors.correo && (
              <span className="form-error">{createFormik.errors.correo}</span>
            )}
          </div>

          <div className="modal-actions-bar">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={createFormik.isSubmitting}
            >
              {createFormik.isSubmitting ? 'Registrando...' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDITAR CLIENTE */}
      <Modal
        isOpen={Boolean(clienteToEdit)}
        onClose={() => setClienteToEdit(null)}
        title="✏️ Editar Cliente"
        maxWidth="500px"
      >
        <form onSubmit={editFormik.handleSubmit} className="cliente-form">
          {editFormik.status && (
            <div className="form-alert-error">{editFormik.status}</div>
          )}

          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input
              type="text"
              name="nombre"
              className={`form-input ${
                editFormik.touched.nombre && editFormik.errors.nombre ? 'is-invalid' : ''
              }`}
              value={editFormik.values.nombre}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
            />
            {editFormik.touched.nombre && editFormik.errors.nombre && (
              <span className="form-error">{editFormik.errors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">DNI / Documento *</label>
            <input
              type="text"
              name="dni"
              maxLength="8"
              className={`form-input ${
                editFormik.touched.dni && editFormik.errors.dni ? 'is-invalid' : ''
              }`}
              value={editFormik.values.dni}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) editFormik.handleChange(e);
              }}
              onBlur={editFormik.handleBlur}
            />
            {editFormik.touched.dni && editFormik.errors.dni && (
              <span className="form-error">{editFormik.errors.dni}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Número telefónico *</label>
            <input
              type="text"
              name="telefono"
              maxLength="9"
              className={`form-input ${
                editFormik.touched.telefono && editFormik.errors.telefono ? 'is-invalid' : ''
              }`}
              value={editFormik.values.telefono}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) editFormik.handleChange(e);
              }}
              onBlur={editFormik.handleBlur}
            />
            {editFormik.touched.telefono && editFormik.errors.telefono && (
              <span className="form-error">{editFormik.errors.telefono}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico *</label>
            <input
              type="email"
              name="correo"
              className={`form-input ${
                editFormik.touched.correo && editFormik.errors.correo ? 'is-invalid' : ''
              }`}
              value={editFormik.values.correo}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
            />
            {editFormik.touched.correo && editFormik.errors.correo && (
              <span className="form-error">{editFormik.errors.correo}</span>
            )}
          </div>

          <div className="modal-actions-bar">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setClienteToEdit(null)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={editFormik.isSubmitting}
            >
              {editFormik.isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: VER DETALLES Y RESERVAS DEL CLIENTE */}
      <Modal
        isOpen={Boolean(clienteToView)}
        onClose={() => setClienteToView(null)}
        title="👁️ Ficha del Cliente"
        maxWidth="640px"
      >
        {clienteToView && (
          <div className="cliente-view-modal">
            {/* Header con tarjeta de perfil */}
            <div className="cliente-view-header-card">
              <div className="cliente-view-avatar-badge">
                <Users size={32} />
              </div>
              <div className="cliente-view-meta">
                <div className="cliente-view-id-tag">{clienteToView.id}</div>
                <h3>{clienteToView.nombre}</h3>
                <div className="cliente-view-contact-pills">
                  <span>
                    <CreditCard size={14} /> DNI: {clienteToView.dni}
                  </span>
                  <span>
                    <Phone size={14} /> {clienteToView.telefono}
                  </span>
                  <span>
                    <Mail size={14} /> {clienteToView.correo}
                  </span>
                </div>
              </div>
            </div>

            {/* Sección de Reservas del Cliente */}
            <div className="cliente-view-reservas-section">
              <h4 className="cliente-view-section-title">
                <Calendar size={18} />
                <span>Historial de Excursiones y Reservas</span>
                <span className="reservas-count-badge">
                  {viewDetails.reservas.length}
                </span>
              </h4>

              {viewDetails.loading ? (
                <div className="loading-box">
                  <div className="spinner"></div>
                  <p>Cargando reservas del cliente...</p>
                </div>
              ) : viewDetails.reservas.length === 0 ? (
                <div className="empty-reservas-box">
                  <p>Este cliente aún no registra reservas en el sistema.</p>
                </div>
              ) : (
                <div className="cliente-view-reservas-list">
                  {viewDetails.reservas.map((r) => (
                    <div key={r.id} className="cliente-reserva-item-card">
                      <div className="item-card-left">
                        <span className="reserva-code">{r.id}</span>
                        <h5>{r.ruta_nombre || 'Excursión'}</h5>
                        <div className="reserva-item-meta">
                          {r.ubicacion && (
                            <span>
                              <MapPin size={13} /> {r.ubicacion}
                            </span>
                          )}
                          <span>
                            <Calendar size={13} /> {r.fecha}
                          </span>
                          <span>
                            <Users size={13} /> {r.personas} personas
                          </span>
                        </div>
                      </div>
                      <div className="item-card-right">
                        <span className="reserva-total-price">
                          S/ {Number(r.total).toFixed(2)}
                        </span>
                        <span
                          className={`reserva-status-pill status-${(
                            r.estado || 'pendiente'
                          ).toLowerCase()}`}
                        >
                          {r.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions-bar" style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setClienteToView(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 4: CONFIRMAR ELIMINACIÓN */}
      <DeleteConfirmModal
        isOpen={Boolean(clienteToDelete)}
        onClose={() => setClienteToDelete(null)}
        onConfirm={handleDelete}
        title="¿Eliminar Cliente?"
        message={`¿Estás seguro de que deseas eliminar a ${clienteToDelete?.nombre}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
