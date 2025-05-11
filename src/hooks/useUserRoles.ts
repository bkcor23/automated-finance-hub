
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserRole } from '@/types';

interface AddRoleParams {
  userId: string;
  role: 'admin' | 'user' | 'moderator';
}

export const useUserRoles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Obtener roles de un usuario
  const getUserRoles = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return data as UserRole[];
    } catch (err) {
      setError(err as Error);
      console.error('Error al obtener roles:', err);
      toast.error('Error al cargar roles de usuario');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar un rol a un usuario
  const addRole = async ({ userId, role }: AddRoleParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role }])
        .select();
        
      if (error) throw error;
      
      toast.success(`Rol ${role} asignado correctamente`);
      return data[0] as UserRole;
    } catch (err) {
      setError(err as Error);
      console.error('Error al agregar rol:', err);
      toast.error('Error al asignar rol de usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar un rol de usuario
  const removeRole = async (roleId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);
        
      if (error) throw error;
      
      toast.success('Rol eliminado correctamente');
      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error al eliminar rol:', err);
      toast.error('Error al eliminar rol de usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si un usuario tiene un rol específico
  const checkIfUserHasRole = async (userId: string, roleName: string) => {
    try {
      const roles = await getUserRoles(userId);
      return roles.some(role => role.role === roleName);
    } catch (err) {
      console.error('Error al verificar rol:', err);
      return false;
    }
  };

  return {
    getUserRoles,
    addRole,
    removeRole,
    checkIfUserHasRole,
    isLoading,
    error
  };
};
