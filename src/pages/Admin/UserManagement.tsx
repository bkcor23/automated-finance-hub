
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Shield, ShieldAlert, ShieldCheck, MoreVertical, User, Users, RefreshCw } from 'lucide-react';

const UserManagement = () => {
  const { authState, hasRole } = useAuth();
  const { addRole, removeRole } = useUserRoles();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Verificar que el usuario actual tiene rol de administrador
  useEffect(() => {
    if (!hasRole('admin')) {
      toast.error('No tienes permisos para acceder a esta sección');
    }
  }, [hasRole]);

  // Consultar todos los usuarios
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: hasRole('admin'),
  });

  // Consultar todos los roles de todos los usuarios
  const { data: allRoles, refetch: refetchRoles } = useQuery({
    queryKey: ['all-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
        
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: hasRole('admin'),
  });

  // Función para obtener roles de un usuario
  const getUserRoles = (userId: string) => {
    if (!allRoles) return [];
    return allRoles.filter(role => role.user_id === userId);
  };

  // Función para verificar si un usuario tiene un rol específico
  const userHasRole = (userId: string, roleName: string) => {
    const roles = getUserRoles(userId);
    return roles.some(role => role.role === roleName);
  };

  // Función para cambiar un rol
  const toggleRole = async (userId: string, roleName: 'admin' | 'user' | 'moderator') => {
    try {
      const userRoles = getUserRoles(userId);
      const existingRole = userRoles.find(r => r.role === roleName);
      
      if (existingRole) {
        // Si ya tiene el rol, eliminarlo
        await removeRole(existingRole.id);
      } else {
        // Si no tiene el rol, agregarlo
        await addRole({ userId, role: roleName });
      }
      
      // Refrescar los roles después de la actualización
      await refetchRoles();

    } catch (error) {
      console.error("Error al cambiar rol:", error);
      toast.error("Error al modificar roles de usuario");
    }
  };

  // Manejador para ver/editar roles de un usuario
  const handleManageRoles = (user: UserProfile) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  // Refrescar datos
  const handleRefreshData = async () => {
    try {
      toast.info("Actualizando datos...");
      await Promise.all([refetch(), refetchRoles()]);
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al refrescar datos:", error);
      toast.error("Error al actualizar datos");
    }
  };

  if (!hasRole('admin')) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Acceso Restringido</h2>
          <p className="text-muted-foreground mt-2">No tienes permisos de administrador para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="text-muted-foreground mt-2">Error al cargar usuarios: {(error as Error).message}</p>
          <Button onClick={handleRefreshData} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center my-8">Cargando usuarios...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los usuarios y sus roles en la plataforma</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-1" />
            <span className="font-medium">{users?.length || 0} usuarios</span>
          </div>
          <Button onClick={handleRefreshData} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Actualizar
          </Button>
        </div>
      </div>

      <Table>
        <TableCaption>Lista de usuarios registrados en la plataforma</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Fecha de registro</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span>{user.full_name || "Sin nombre"}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {userHasRole(user.id, 'admin') && (
                      <div className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-md flex items-center">
                        <ShieldAlert className="w-3 h-3 mr-1" /> Admin
                      </div>
                    )}
                    {userHasRole(user.id, 'moderator') && (
                      <div className="bg-warning/10 text-warning-foreground text-xs px-2 py-1 rounded-md flex items-center">
                        <Shield className="w-3 h-3 mr-1" /> Moderador
                      </div>
                    )}
                    {userHasRole(user.id, 'user') && (
                      <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Usuario
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleManageRoles(user)}>
                        <Shield className="w-4 h-4 mr-2" />
                        Gestionar roles
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                No hay usuarios registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedUser && (
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gestionar roles de usuario</DialogTitle>
              <DialogDescription>
                {selectedUser.full_name || selectedUser.email}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-destructive" />
                    <div>
                      <h4 className="font-medium">Administrador</h4>
                      <p className="text-sm text-muted-foreground">Acceso completo al sistema</p>
                    </div>
                  </div>
                  <Button
                    variant={userHasRole(selectedUser.id, 'admin') ? "destructive" : "outline"}
                    onClick={() => toggleRole(selectedUser.id, 'admin')}
                  >
                    {userHasRole(selectedUser.id, 'admin') ? "Quitar rol" : "Asignar rol"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-warning-foreground" />
                    <div>
                      <h4 className="font-medium">Moderador</h4>
                      <p className="text-sm text-muted-foreground">Gestión de contenido</p>
                    </div>
                  </div>
                  <Button
                    variant={userHasRole(selectedUser.id, 'moderator') ? "destructive" : "outline"}
                    onClick={() => toggleRole(selectedUser.id, 'moderator')}
                  >
                    {userHasRole(selectedUser.id, 'moderator') ? "Quitar rol" : "Asignar rol"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Usuario</h4>
                      <p className="text-sm text-muted-foreground">Acceso básico</p>
                    </div>
                  </div>
                  <Button
                    variant={userHasRole(selectedUser.id, 'user') ? "destructive" : "outline"}
                    onClick={() => toggleRole(selectedUser.id, 'user')}
                  >
                    {userHasRole(selectedUser.id, 'user') ? "Quitar rol" : "Asignar rol"}
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;
