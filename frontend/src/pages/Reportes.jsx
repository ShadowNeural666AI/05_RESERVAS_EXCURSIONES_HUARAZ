import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  Mountain,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  PieChart,
  ArrowRight,
  Sparkles,
  Waves,
  Landmark,
  Compass,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function Reportes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');
  const [desdeDate, setDesdeDate] = useState('2025-06-01');
  const [hastaDate, setHastaDate] = useState('2025-06-30');
  const [hoveredBar, setHoveredBar] = useState(null);

  const [stats, setStats] = useState({
    reservasTotales: 62,
    clientesRegistrados: 48,
    reservasConfirmadas: 35,
    reservasCanceladas: 5,
    reservasPendientes: 8,
  });

  const [reservasPorRuta, setReservasPorRuta] = useState([
    {
      id: 1,
      nombre: 'Laguna 69',
      cantidad: 12,
      max: 15,
      colorTop: '#38bdf8',
      colorBottom: '#0284c7',
      icon: <Mountain size={14} />,
      ingresos: 'S/ 2,400',
    },
    {
      id: 2,
      nombre: 'Chavín',
      cantidad: 8,
      max: 15,
      colorTop: '#c084fc',
      colorBottom: '#7c3aed',
      icon: <Landmark size={14} />,
      ingresos: 'S/ 1,200',
    },
    {
      id: 3,
      nombre: 'Pastoruri',
      cantidad: 6,
      max: 15,
      colorTop: '#2dd4bf',
      colorBottom: '#0d9488',
      icon: <Mountain size={14} />,
      ingresos: 'S/ 900',
    },
    {
      id: 4,
      nombre: 'Hualcán',
      cantidad: 4,
      max: 15,
      colorTop: '#fbbf24',
      colorBottom: '#ea580c',
      icon: <Mountain size={14} />,
      ingresos: 'S/ 600',
    },
    {
      id: 5,
      nombre: 'Llanganuco',
      cantidad: 5,
      max: 15,
      colorTop: '#f472b6',
      colorBottom: '#c026d3',
      icon: <Waves size={14} />,
      ingresos: 'S/ 750',
    },
  ]);

  const [estadoReservas, setEstadoReservas] = useState({
    total: 48,
    items: [
      { estado: 'Confirmadas', count: 35, percentage: 73, color: '#10b981' },
      { estado: 'Pendientes', count: 8, percentage: 17, color: '#f59e0b' },
      { estado: 'Canceladas', count: 5, percentage: 10, color: '#ef4444' },
    ],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getReportes().catch(() => null);
        if (res && res.reservasPorRuta) {
          // Si el endpoint devuelve datos actualizados de MySQL, sincronizar
          if (res.totalReservas) {
            setEstadoReservas((prev) => ({
              ...prev,
              total: res.totalReservas,
              items: res.estadoReservas || prev.items,
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching report data:', err);
      }
    }
    loadData();
  }, []);

  const handleGenerarReporte = () => {
    // Feedback visual al generar reporte
    const btn = document.getElementById('btn-generar-reporte');
    if (btn) {
      btn.classList.add('btn-pulse');
      setTimeout(() => btn.classList.remove('btn-pulse'), 400);
    }
  };

  return (
    <div className="reportes-dark-view">
      {/* 1. Banner Panorámico Superior con Fotografía y Eslogan */}
      <section className="reportes-hero-banner">
        <div className="reportes-hero-left">
          <div className="reportes-title-badge-row">
            <div className="reportes-title-icon-box">
              <BarChart3 size={28} className="reportes-header-icon" />
            </div>
            <div>
              <h1 className="reportes-main-title">Reportes</h1>
              <p className="reportes-main-subtitle">
                Genera reportes y analiza el rendimiento de tus excursiones.
              </p>
            </div>
          </div>

          {/* Filtro de Rango de Fechas & Botón Generar */}
          <div className="reportes-filter-glass-card">
            <div className="reportes-date-field">
              <div className="date-field-label">
                <Calendar size={13} className="date-label-icon" />
                <span>Desde</span>
              </div>
              <input
                type="date"
                value={desdeDate}
                onChange={(e) => setDesdeDate(e.target.value)}
                className="reportes-dark-date-input"
              />
            </div>

            <div className="reportes-date-field">
              <div className="date-field-label">
                <Calendar size={13} className="date-label-icon" />
                <span>Hasta</span>
              </div>
              <input
                type="date"
                value={hastaDate}
                onChange={(e) => setHastaDate(e.target.value)}
                className="reportes-dark-date-input"
              />
            </div>

            <button
              id="btn-generar-reporte"
              type="button"
              className="reportes-generate-btn"
              onClick={handleGenerarReporte}
            >
              <BarChart3 size={16} />
              <span>Generar</span>
            </button>
          </div>
        </div>

        {/* Zona Panorámica Derecha con Fotografía y Eslogan Manuscrito */}
        <div className="reportes-hero-right">
          <div className="reportes-slogan-wrap">
            <span className="reportes-slogan-text">
              Datos que impulsan <br />
              tus mejores rutas
            </span>
          </div>
        </div>
      </section>

      {/* 2. Barra de Pestañas / Filtros de Reporte */}
      <section className="reportes-tabs-row">
        {[
          { id: 'resumen', label: 'Resumen general', icon: <BarChart3 size={15} /> },
          { id: 'rutas', label: 'Rutas más reservadas', icon: <Mountain size={15} /> },
          { id: 'clientes', label: 'Clientes', icon: <Users size={15} /> },
          { id: 'estados', label: 'Estados de reservas', icon: <Calendar size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`reportes-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </section>

      {/* 3. Cuadrícula de 4 Tarjetas KPI con Gradientes, Tendencias y Marcas de Agua */}
      <section className="reportes-kpi-grid">
        {/* KPI 1: Reservas totales */}
        <div className="dark-kpi-card kpi-card-blue">
          <div className="kpi-left-icon-box box-blue">
            <FileText size={24} strokeWidth={2.2} />
          </div>
          <div className="kpi-center-info">
            <div className="kpi-number">{stats.reservasTotales}</div>
            <div className="kpi-label">Reservas totales</div>
            <div className="kpi-trend">
              <TrendingUp size={13} />
              <span>+12%</span>
              <span className="trend-period">vs. mes anterior</span>
            </div>
          </div>
          <div className="kpi-watermark-icon">
            <Mountain size={68} strokeWidth={1.5} />
          </div>
        </div>

        {/* KPI 2: Clientes registrados */}
        <div className="dark-kpi-card kpi-card-green">
          <div className="kpi-left-icon-box box-green">
            <Users size={24} strokeWidth={2.2} />
          </div>
          <div className="kpi-center-info">
            <div className="kpi-number">{stats.clientesRegistrados}</div>
            <div className="kpi-label">Clientes registrados</div>
            <div className="kpi-trend">
              <TrendingUp size={13} />
              <span>+8%</span>
              <span className="trend-period">vs. mes anterior</span>
            </div>
          </div>
          <div className="kpi-watermark-icon">
            <Users size={68} strokeWidth={1.5} />
          </div>
        </div>

        {/* KPI 3: Reservas confirmadas */}
        <div className="dark-kpi-card kpi-card-amber">
          <div className="kpi-left-icon-box box-amber">
            <Calendar size={24} strokeWidth={2.2} />
          </div>
          <div className="kpi-center-info">
            <div className="kpi-number">{stats.reservasConfirmadas}</div>
            <div className="kpi-label">Reservas confirmadas</div>
            <div className="kpi-trend">
              <TrendingUp size={13} />
              <span>+10%</span>
              <span className="trend-period">vs. mes anterior</span>
            </div>
          </div>
          <div className="kpi-watermark-icon">
            <CheckCircle size={68} strokeWidth={1.5} />
          </div>
        </div>

        {/* KPI 4: Reservas canceladas */}
        <div className="dark-kpi-card kpi-card-red">
          <div className="kpi-left-icon-box box-red">
            <XCircle size={24} strokeWidth={2.2} />
          </div>
          <div className="kpi-center-info">
            <div className="kpi-number">{stats.reservasCanceladas}</div>
            <div className="kpi-label">Reservas canceladas</div>
            <div className="kpi-trend">
              <TrendingUp size={13} />
              <span>-17%</span>
              <span className="trend-period">vs. mes anterior</span>
            </div>
          </div>
          <div className="kpi-watermark-icon">
            <XCircle size={68} strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* 4. Cuadrícula de 2 Gráficos Visuales Principales */}
      <section className="reportes-charts-grid">
        {/* Gráfico 1: Reservas por Ruta (Gráfico de Barras Estilizado) */}
        <div className="report-chart-card">
          <div className="chart-card-top-row">
            <div className="chart-title-left">
              <div className="chart-icon-squircle">
                <BarChart3 size={18} color="#38bdf8" />
              </div>
              <div>
                <h3 className="chart-card-heading">Reservas por ruta</h3>
                <p className="chart-card-subheading">
                  Cantidad de reservas por cada destino turístico.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="chart-action-link"
              onClick={() => navigate('/rutas')}
            >
              <span>Ver detalles</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Área del Gráfico de Barras */}
          <div className="custom-bar-chart-stage">
            {/* Eje Y y Líneas Guía Horizontales */}
            <div className="bar-grid-lines">
              {[15, 12, 9, 6, 3, 0].map((val) => (
                <div key={val} className="grid-line-row">
                  <span className="y-axis-label">{val}</span>
                  <div className="grid-dashed-line"></div>
                </div>
              ))}
            </div>

            {/* Columnas de Barras con Iconos Inferiores y Valores Superiores */}
            <div className="bars-container">
              {reservasPorRuta.map((item, idx) => {
                const heightPercent = (item.cantidad / 15) * 100;
                const isHovered = hoveredBar === idx;

                return (
                  <div
                    key={item.id}
                    className="bar-column-wrap"
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip flotante al pasar el mouse */}
                    {isHovered && (
                      <div className="bar-hover-tooltip">
                        <span className="tooltip-title">{item.nombre}</span>
                        <span className="tooltip-value">{item.cantidad} reservas ({item.ingresos})</span>
                      </div>
                    )}

                    {/* Número superior */}
                    <div className="bar-top-value">{item.cantidad}</div>

                    {/* Barra con gradiente y bordes redondeados */}
                    <div className="bar-track">
                      <div
                        className="bar-gradient-fill"
                        style={{
                          height: `${heightPercent}%`,
                          background: `linear-gradient(180deg, ${item.colorTop} 0%, ${item.colorBottom} 100%)`,
                        }}
                      ></div>
                    </div>

                    {/* Nombre e Icono Inferior */}
                    <div className="bar-footer-item">
                      <span className="bar-destination-name">{item.nombre}</span>
                      <div className="bar-destination-icon">{item.icon}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gráfico 2: Estado de Reservas (Donut Chart con Leyenda) */}
        <div className="report-chart-card">
          <div className="chart-card-top-row">
            <div className="chart-title-left">
              <div className="chart-icon-squircle">
                <PieChart size={18} color="#38bdf8" />
              </div>
              <div>
                <h3 className="chart-card-heading">Estado de reservas</h3>
                <p className="chart-card-subheading">
                  Distribución de reservas según su estado.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="chart-action-link"
              onClick={() => navigate('/reservas')}
            >
              <span>Ver detalles</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Donut Chart & Legend Row */}
          <div className="custom-donut-stage">
            {/* Donut SVG con Anillo y Centro Total */}
            <div className="donut-visual-container">
              <svg width="200" height="200" viewBox="0 0 100 100" className="donut-svg">
                {/* Círculo base de fondo */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="18" />

                {/* Segmento Confirmadas (73% -> 173.8 de 238.76) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="18"
                  strokeDasharray="174 238.76"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                  className="donut-segment"
                />

                {/* Segmento Pendientes (17% -> 40.5 de 238.76) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="18"
                  strokeDasharray="41 238.76"
                  strokeDashoffset="-174"
                  transform="rotate(-90 50 50)"
                  className="donut-segment"
                />

                {/* Segmento Canceladas (10% -> 23.8 de 238.76) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="18"
                  strokeDasharray="24 238.76"
                  strokeDashoffset="-215"
                  transform="rotate(-90 50 50)"
                  className="donut-segment"
                />
              </svg>

              {/* Centro con el Total */}
              <div className="donut-center-overlay">
                <span className="donut-center-number">{estadoReservas.total}</span>
                <span className="donut-center-label">Total</span>
              </div>
            </div>

            {/* Leyenda a la Derecha */}
            <div className="donut-legend-container">
              {estadoReservas.items.map((item, index) => (
                <div key={index} className="legend-entry-row">
                  <div className="legend-dot-label">
                    <span
                      className="legend-colored-dot"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="legend-status-name">{item.estado}</span>
                  </div>

                  <div className="legend-values-pair">
                    <span className="legend-item-count">{item.count}</span>
                    <span className="legend-item-percent">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Marca de agua decorativa en la esquina inferior */}
            <div className="card-corner-watermark">
              <Mountain size={95} strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
