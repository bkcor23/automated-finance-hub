
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthLayout = () => {
  const { authState } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  if (authState.user && !authState.isLoading) {
    return <Navigate to="/" replace />;
  }
  
  // Si está cargando, mostrar indicador
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <Outlet />;
};

export default AuthLayout;
