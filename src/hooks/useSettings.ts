
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserSettings } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useSettings = () => {
  const queryClient = useQueryClient();
  const { authState } = useAuth();
  const userId = authState.user?.id;
  
  // Función para obtener las configuraciones del usuario
  const fetchSettings = async (): Promise<UserSettings | null> => {
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    
    // Ensure proper typing for settings
    return {
      ...data,
      theme: (data.theme as 'light' | 'dark') || 'light',
      language: (data.language as 'es' | 'en') || 'es',
      notifications: !!data.notifications,
      email_notifications: !!data.email_notifications,
      // Ensure dashboard_widgets is always an array
      dashboard_widgets: Array.isArray(data.dashboard_widgets) ? data.dashboard_widgets : []
    } as UserSettings;
  };

  // Consulta para cargar configuraciones
  const settingsQuery = useQuery({
    queryKey: ['settings', userId],
    queryFn: fetchSettings,
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });

  // Mutación para actualizar configuraciones
  const updateMutation = useMutation({
    mutationFn: async (settings: Partial<UserSettings>) => {
      if (!userId) throw new Error('Usuario no autenticado');
      
      const { data, error } = await supabase
        .from('settings')
        .update(settings)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      
      // Ensure proper typing for updated settings
      return {
        ...data,
        theme: (data.theme as 'light' | 'dark') || 'light',
        language: (data.language as 'es' | 'en') || 'es',
        notifications: !!data.notifications,
        email_notifications: !!data.email_notifications,
        // Ensure dashboard_widgets is always an array
        dashboard_widgets: Array.isArray(data.dashboard_widgets) ? data.dashboard_widgets : []
      } as UserSettings;
    },
    onSuccess: (data) => {
      toast.success('Configuración actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['settings', userId] });
      
      // Si se cambió el tema, aplicarlo
      if (data?.theme) {
        document.documentElement.classList.toggle('dark', data.theme === 'dark');
      }
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar la configuración: ${error.message}`);
    }
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error,
    updateSettings: updateMutation.mutate
  };
};
