import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CredentialModal from './components/CredentialModal';
import RestrictedAccess from './components/RestrictedAccess';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import Rutas from './pages/Rutas';
import RutaFormPage from './pages/RutaFormPage';
import RutaDetalle from './pages/RutaDetalle';
import Reservas from './pages/Reservas';
import ReservaWizard from './pages/ReservaWizard';
import ReservaDetalle from './pages/ReservaDetalle';
import Clientes from './pages/Clientes';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();

  // Si no ha iniciado sesión, mostrar primero la pantalla de Login
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app-container">
      {/* Barra Lateral fija con logotipo y cordillera */}
      <Sidebar />

      {/* Espacio de trabajo principal */}
      <div className="main-wrapper">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/rutas" element={<Rutas />} />
            <Route
              path="/rutas/nueva"
              element={isAdmin ? <RutaFormPage /> : <RestrictedAccess sectionName="Creación de Rutas" />}
            />
            <Route
              path="/rutas/editar/:id"
              element={isAdmin ? <RutaFormPage /> : <RestrictedAccess sectionName="Edición de Rutas" />}
            />
            <Route path="/rutas/:id" element={<RutaDetalle />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/reservas/nueva" element={<ReservaWizard />} />
            <Route path="/reservas/:id" element={<ReservaDetalle />} />
            <Route
              path="/clientes"
              element={isAdmin ? <Clientes /> : <RestrictedAccess sectionName="Directorio de Clientes" />}
            />
            <Route
              path="/reportes"
              element={isAdmin ? <Reportes /> : <RestrictedAccess sectionName="Reportes y Estadísticas" />}
            />
            <Route
              path="/configuracion"
              element={isAdmin ? <Configuracion /> : <RestrictedAccess sectionName="Configuración de Agencia" />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Panel de Credenciales y Control de Roles */}
      <CredentialModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
