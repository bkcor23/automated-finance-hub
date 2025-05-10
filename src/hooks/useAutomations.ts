
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Automation } from '@/types';
import { toast } from 'sonner';

export const useAutomations = (userId?: string) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  
  // Función para obtener todas las automatizaciones del usuario
  const fetchAutomations = async (filters?: {
    type?: 'schedule' | 'condition' | 'webhook';
    status?: 'active' | 'paused' | 'draft';
  }): Promise<Automation[]> => {
    let query = supabase
      .from('automations')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Aplicar filtros si existen
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  };

  // Función para obtener una automatización específica
  const fetchAutomation = async (id: string): Promise<Automation> => {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  };

  // Consulta para cargar automatizaciones
  const automationsQuery = useQuery({
    queryKey: ['automations'],
    queryFn: () => fetchAutomations(),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear una automatización
  const createMutation = useMutation({
    mutationFn: async (automation: Omit<Automation, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('automations')
        .insert({
          ...automation,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Automatización creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
    onError: (error: any) => {
      toast.error(`Error al crear la automatización: ${error.message}`);
    }
  });

  // Mutación para actualizar una automatización
  const updateMutation = useMutation({
    mutationFn: async (automation: Partial<Automation> & { id: string }) => {
      const { id, ...updates } = automation;
      const { data, error } = await supabase
        .from('automations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Automatización actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar la automatización: ${error.message}`);
    }
  });

  // Mutación para eliminar una automatización
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('automations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success('Automatización eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar la automatización: ${error.message}`);
    }
  });

  // Función para cambiar el estado de una automatización
  const toggleAutomationStatus = async (id: string, newStatus: 'active' | 'paused' | 'draft') => {
    try {
      const { data, error } = await supabase
        .from('automations')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast.success(`Automatización ${newStatus === 'active' ? 'activada' : 'pausada'}`);
      return data;
    } catch (error: any) {
      console.error('Error al cambiar estado de automatización:', error);
      toast.error(`Error: ${error.message}`);
      return null;
    }
  };

  return {
    automations: automationsQuery.data || [],
    isLoading: automationsQuery.isLoading || loading,
    error: automationsQuery.error,
    getAutomation: fetchAutomation,
    createAutomation: createMutation.mutate,
    updateAutomation: updateMutation.mutate,
    deleteAutomation: deleteMutation.mutate,
    toggleAutomationStatus,
    filterAutomations: fetchAutomations
  };
};
