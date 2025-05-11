
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

const AdminRoute = () => {
  const { hasRole, authState } = useAuth();
  const { isLoading } = authState;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si el usuario no es administrador, redirigir al dashboard
  if (!hasRole('admin')) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-bold text-center">Acceso Restringido</h1>
        <p className="text-muted-foreground text-center">
          No tienes los permisos necesarios para acceder a esta sección.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
