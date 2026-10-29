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

  // Lista de usuarios registrados (inicia con los DEMO_CLIENTS y persiste nuevos registros)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('huaraz_registered_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading registered users:', e);
    }
    return DEMO_CLIENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('huaraz_current_user', JSON.stringify(currentUser));
    } catch (e) {
      console.error('Error saving user to localStorage:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('huaraz_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Error saving registered users to localStorage:', e);
    }
  }, [registeredUsers]);

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
    const selected = client || registeredUsers[0] || DEMO_CLIENTS[0];
    setCurrentUser({
      id: selected.id || `C-${Date.now().toString().slice(-4)}`,
      nombre: selected.nombre || 'Turista',
      correo: selected.correo || 'turista@email.com',
      dni: selected.dni || '12345678',
      telefono: selected.telefono || '',
      avatar: selected.avatar || '/images/avatar.jpg',
      role: 'usuario',
      roleLabel: 'Usuario / Turista',
      cargo: selected.cargo || `Turista Registrado (${selected.reservasCount || 0} reservas)`,
    });
    setIsAuthenticated(true);
    return { success: true, message: `Bienvenido(a), ${selected.nombre || 'Turista'}` };
  };

  // Registrar nuevo usuario turista y autenticarlo inmediatamente
  const registerUser = ({ nombre, correo, dni, telefono = '', password = '' }) => {
    const cleanEmail = (correo || '').trim().toLowerCase();
    const cleanNombre = (nombre || '').trim();
    const cleanDni = (dni || '').trim() || '12345678';

    if (!cleanNombre || !cleanEmail) {
      return { success: false, message: 'Por favor ingresa tu nombre y correo electrónico.' };
    }

    const existing = registeredUsers.find((u) => u.correo.toLowerCase() === cleanEmail);
    if (existing) {
      loginAsUser(existing);
      return { success: true, message: `Bienvenido de nuevo, ${existing.nombre}` };
    }

    const newUser = {
      id: `C-${Date.now().toString().slice(-4)}`,
      nombre: cleanNombre,
      correo: cleanEmail,
      dni: cleanDni,
      telefono: telefono.trim(),
      avatar: '/images/avatar.jpg',
      role: 'usuario',
      roleLabel: 'Usuario / Turista',
      cargo: 'Turista Registrado (0 reservas)',
      reservasCount: 0,
      categoria: 'Aventura & Turismo',
    };

    const updated = [newUser, ...registeredUsers];
    setRegisteredUsers(updated);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return { success: true, message: `¡Cuenta creada exitosamente! Bienvenido(a), ${newUser.nombre}` };
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
          avatar: customClient.avatar || '/images/avatar.jpg',
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
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      return { success: false, message: 'Por favor ingresa tu correo electrónico.' };
    }

    if (desiredRole === 'admin' || cleanEmail.includes('admin')) {
      if (cleanEmail === 'admin@huaraztours.com' && (cleanPassword === 'admin123' || cleanPassword === '')) {
        return loginAsAdmin();
      }
      if (cleanEmail.includes('admin')) {
        // Permitir acceso con credenciales admin demo
        return loginAsAdmin();
      }
      return {
        success: false,
        message: 'Credenciales de Administrador incorrectas. Usa admin@huaraztours.com y contraseña admin123',
      };
    }

    // Rol Turista / Usuario
    const matched = registeredUsers.find((c) => c.correo.toLowerCase() === cleanEmail);
    if (matched) {
      return loginAsUser(matched);
    }

    // Si el usuario ingresa un correo nuevo como turista, creamos su cuenta automáticamente y le damos acceso
    const autoUser = {
      id: `C-${Date.now().toString().slice(-4)}`,
      nombre: cleanEmail.split('@')[0].replace('.', ' '),
      correo: cleanEmail,
      dni: '12345678',
      telefono: '',
      avatar: '/images/avatar.jpg',
      role: 'usuario',
      roleLabel: 'Usuario / Turista',
      cargo: 'Turista Registrado',
      reservasCount: 0,
    };
    const updated = [autoUser, ...registeredUsers];
    setRegisteredUsers(updated);
    setCurrentUser(autoUser);
    setIsAuthenticated(true);
    return { success: true, message: `Bienvenido(a), ${autoUser.nombre}` };
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
    demoClients: registeredUsers,
    registeredUsers,
    registerUser,
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
