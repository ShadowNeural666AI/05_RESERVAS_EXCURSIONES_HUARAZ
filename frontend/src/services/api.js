const API_BASE = '/api';

export class ApiError extends Error {
  constructor(message, status, payload = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  const headers = { ...options.headers };
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let payload = null;
    try {
      payload = await response.json();
    } catch (_) {}

    throw new ApiError(
      payload?.error || payload?.message || `Error en la solicitud (${response.status})`,
      response.status,
      payload
    );
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

export const api = {
  // Stats & Health & Reports
  getStats: () => request('/stats'),
  getReportes: () => request('/reportes'),
  getHealth: () => request('/health'),

  // Rutas
  getRutas: (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.categoria && params.categoria.toLowerCase() !== 'todas') query.append('categoria', params.categoria);
    if (params.estado) query.append('estado', params.estado);
    const queryString = query.toString();
    return request(`/rutas${queryString ? `?${queryString}` : ''}`);
  },
  getRutaById: (id) => request(`/rutas/${id}`),
  createRuta: (data) => {
    const isFormData = data instanceof FormData;
    return request('/rutas', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },
  updateRuta: (id, data) => {
    const isFormData = data instanceof FormData;
    return request(`/rutas/${id}`, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
    });
  },
  deleteRuta: (id) => request(`/rutas/${id}`, { method: 'DELETE' }),

  // Reservas
  getReservas: (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.estado) query.append('estado', params.estado);
    if (params.ruta_id) query.append('ruta_id', params.ruta_id);
    const queryString = query.toString();
    return request(`/reservas${queryString ? `?${queryString}` : ''}`);
  },
  getReservaById: (id) => request(`/reservas/${id}`),
  createReserva: (data) => request('/reservas', { method: 'POST', body: JSON.stringify(data) }),
  updateReserva: (id, data) => request(`/reservas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cancelReserva: (id) => request(`/reservas/${id}/cancelar`, { method: 'PATCH' }),
  deleteReserva: (id) => request(`/reservas/${id}`, { method: 'DELETE' }),

  // Clientes
  getClientes: (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    const queryString = query.toString();
    return request(`/clientes${queryString ? `?${queryString}` : ''}`);
  },
  createCliente: (data) => request('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  deleteCliente: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),
};
