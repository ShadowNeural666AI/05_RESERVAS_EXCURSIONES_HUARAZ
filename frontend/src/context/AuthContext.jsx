import React, { createContext, useContext, useState, useEffect } from 'react';

const PRESET_USERS = {
  admin: {
    id: 'ADM-001',
    nombre: 'Administrador General',
    correo: 'admin@huaraztours.com',
    dni: '00000001',
    telefono: '043-421234',
    avatar: '/images/avatar.jpg',
    role: 'admin',
    roleLabel: 'Administrador',
    cargo: 'Gestor de Operaciones y Reservas',
  },
  usuario: {
    id: 'C-001',
    nombre: 'María López',
    correo: 'maria.lopez@email.com',
    dni: '12345678',
    telefono: '987 654 321',
    avatar: '/images/avatars/client_maria.jpg',
    role: 'usuario',
    roleLabel: 'Usuario / Turista',
    cargo: 'Viajera Aventura (3 reservas)',
  },
};

export const DEMO_CLIENTS = [
  {
    id: 'C-001',
    nombre: 'María López',
    correo: 'maria.lopez@email.com',
    dni: '12345678',
    telefono: '987 654 321',
    avatar: '/images/avatars/client_maria.jpg',
    reservasCount: 3,
    categoria: 'Aventura & Trekking',
  },
  {
    id: 'C-002',
    nombre: 'Carlos Ramos',
    correo: 'carlos.ramos@email.com',
    dni: '87654321',
    telefono: '912 345 678',
    avatar: '/images/avatars/client_carlos.jpg',
    reservasCount: 2,
    categoria: 'Cultural & Arqueología',
  },
  {
    id: 'C-003',
    nombre: 'Ana Torres',
    correo: 'ana.torres@email.com',
    dni: '45678912',
    telefono: '998 712 345',
    avatar: '/images/avatars/client_ana.jpg',
    reservasCount: 1,
    categoria: 'Senderismo Andino',
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Estado de autenticación: por defecto false para que primero aparezca el Login
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = sessionStorage.getItem('huaraz_is_authenticated');
      return savedAuth === 'true';
    } catch (e) {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('huaraz_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading user from localStorage:', e);
    }
    return PRESET_USERS.admin;
  });

  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('huaraz_current_user', JSON.stringify(currentUser));
    } catch (e) {
      console.error('Error saving user to localStorage:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      sessionStorage.setItem('huaraz_is_authenticated', isAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.error('Error saving auth to sessionStorage:', e);
    }
  }, [isAuthenticated]);

  const loginAsAdmin = () => {
    setCurrentUser(PRESET_USERS.admin);
    setIsAuthenticated(true);
    return { success: true, message: 'Bienvenido, Administrador General' };
  };

  const loginAsUser = (client = null) => {
    const selected = client || DEMO_CLIENTS[0];
    setCurrentUser({
      id: selected.id,
      nombre: selected.nombre,
      correo: selected.correo,
      dni: selected.dni,
      telefono: selected.telefono,
      avatar: selected.avatar,
      role: 'usuario',
      roleLabel: 'Usuario / Turista',
      cargo: `Turista Registrado (${selected.reservasCount || 1} reservas)`,
    });
    setIsAuthenticated(true);
    return { success: true, message: `Bienvenido(a), ${selected.nombre}` };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsCredentialModalOpen(false);
    sessionStorage.removeItem('huaraz_is_authenticated');
  };

  const switchRole = (newRole, customClient = null) => {
    if (newRole === 'admin') {
      setCurrentUser(PRESET_USERS.admin);
    } else {
      if (customClient) {
        setCurrentUser({
          id: customClient.id,
          nombre: customClient.nombre,
          correo: customClient.correo,
          dni: customClient.dni,
          telefono: customClient.telefono,
          avatar: customClient.avatar,
          role: 'usuario',
          roleLabel: 'Usuario / Turista',
          cargo: `Turista Registrado (${customClient.reservasCount || 1} reservas)`,
        });
      } else {
        setCurrentUser(PRESET_USERS.usuario);
      }
    }
    setIsAuthenticated(true);
  };

  const loginWithCredentials = (email, password, desiredRole) => {
    if (desiredRole === 'admin' || email.toLowerCase().includes('admin')) {
      return loginAsAdmin();
    }
    const matched = DEMO_CLIENTS.find((c) => c.correo.toLowerCase() === email.toLowerCase());
    if (matched) {
      return loginAsUser(matched);
    }
    setCurrentUser({
      id: 'C-NEW',
      nombre: email.split('@')[0],
      correo: email,
      dni: '99887766',
      telefono: '999 000 111',
      avatar: '/images/avatars/client_maria.jpg',
      role: 'usuario',
      roleLabel: 'Usuario / Turista',
      cargo: 'Turista Nuevo',
    });
    setIsAuthenticated(true);
    return { success: true, message: 'Acceso concedido como Turista' };
  };

  const openCredentialModal = () => setIsCredentialModalOpen(true);
  const closeCredentialModal = () => setIsCredentialModalOpen(false);

  const value = {
    isAuthenticated,
    user: currentUser,
    role: currentUser.role,
    isAdmin: currentUser.role === 'admin',
    isUser: currentUser.role === 'usuario',
    availableUsers: PRESET_USERS,
    demoClients: DEMO_CLIENTS,
    loginAsAdmin,
    loginAsUser,
    logout,
    switchRole,
    loginWithCredentials,
    isCredentialModalOpen,
    openCredentialModal,
    closeCredentialModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
