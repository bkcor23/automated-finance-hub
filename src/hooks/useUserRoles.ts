
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRoles = () => {
  const queryClient = useQueryClient();
  const { authState } = useAuth();
  const userId = authState.user?.id;
  
  // Fetch all roles if the current user is an admin
  const fetchAllRoles = async (): Promise<UserRole[]> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as UserRole[];
  };
  
  // Fetch roles for a specific user
  const fetchUserRoles = async (targetUserId: string): Promise<UserRole[]> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', targetUserId);
      
    if (error) throw error;
    return data as UserRole[];
  };

  // Query for all roles (admin only)
  const allRolesQuery = useQuery({
    queryKey: ['roles', 'all'],
    queryFn: fetchAllRoles,
    enabled: !!userId && authState.roles?.some(r => r.role === 'admin'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Query for the current user's roles
  const userRolesQuery = useQuery({
    queryKey: ['roles', userId],
    queryFn: () => fetchUserRoles(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation to add a role to a user
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'user' | 'moderator' }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role
        })
        .select()
        .single();
        
      if (error) throw error;
      return data as UserRole;
    },
    onSuccess: (_, variables) => {
      toast.success(`Rol ${variables.role} asignado correctamente`);
      queryClient.invalidateQueries({ queryKey: ['roles', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['roles', 'all'] });
    },
    onError: (error: any) => {
      toast.error(`Error al asignar rol: ${error.message}`);
    }
  });
  
  // Mutation to remove a role from a user
  const removeRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const { data, error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      toast.success('Rol eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['roles', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['roles', 'all'] });
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar rol: ${error.message}`);
    }
  });

  return {
    userRoles: userRolesQuery.data || [],
    allRoles: allRolesQuery.data || [],
    isLoading: userRolesQuery.isLoading || allRolesQuery.isLoading,
    isFetching: userRolesQuery.isFetching || allRolesQuery.isFetching,
    error: userRolesQuery.error || allRolesQuery.error,
    addRole: addRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
    fetchUserRoles,
  };
};
