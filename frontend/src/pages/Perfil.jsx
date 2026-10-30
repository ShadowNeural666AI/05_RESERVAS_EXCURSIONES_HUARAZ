import React from 'react';
import { useAuth } from '../context/AuthContext';
import PerfilAdmin from './PerfilAdmin';
import PerfilUsuario from './PerfilUsuario';

export default function Perfil() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="perfil-page-container">
      {isAdmin ? <PerfilAdmin user={user} /> : <PerfilUsuario user={user} />}
    </div>
  );
}
