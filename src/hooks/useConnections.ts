
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Connection } from '@/types';
import { toast } from 'sonner';

export const useConnections = (userId?: string) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  
  // Función para obtener todas las conexiones del usuario
  const fetchConnections = async (): Promise<Connection[]> => {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Función para obtener una conexión específica
  const fetchConnection = async (id: string): Promise<Connection> => {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  };

  // Consulta para cargar conexiones
  const connectionsQuery = useQuery({
    queryKey: ['connections'],
    queryFn: fetchConnections,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear una conexión
  const createMutation = useMutation({
    mutationFn: async (connection: Omit<Connection, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('connections')
        .insert({
          ...connection,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Conexión creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error: any) => {
      toast.error(`Error al crear la conexión: ${error.message}`);
    }
  });

  // Mutación para actualizar una conexión
  const updateMutation = useMutation({
    mutationFn: async (connection: Partial<Connection> & { id: string }) => {
      const { id, ...updates } = connection;
      const { data, error } = await supabase
        .from('connections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Conexión actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar la conexión: ${error.message}`);
    }
  });

  // Mutación para eliminar una conexión
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast.success('Conexión eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar la conexión: ${error.message}`);
    }
  });

  // Función para refrescar una conexión (sincronizar)
  const refreshConnection = async (id: string) => {
    try {
      setLoading(true);
      
      // Simulamos actualización con un timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { data, error } = await supabase
        .from('connections')
        .update({ 
          last_sync: new Date().toISOString(),
          status: 'active', // Asumimos éxito
          error_message: null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Conexión sincronizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      return data;
    } catch (error: any) {
      console.error('Error al sincronizar conexión:', error);
      toast.error(`Error al sincronizar: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    connections: connectionsQuery.data || [],
    isLoading: connectionsQuery.isLoading || loading,
    error: connectionsQuery.error,
    getConnection: fetchConnection,
    createConnection: createMutation.mutate,
    updateConnection: updateMutation.mutate,
    deleteConnection: deleteMutation.mutate,
    refreshConnection
  };
};
