
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SecurityLog } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';

export const useSecurityLogs = (userId?: string) => {
  const [loading, setLoading] = useState(false);
  
  // Función para obtener logs de seguridad con filtros
  const fetchSecurityLogs = async (filters?: {
    eventType?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<SecurityLog[]> => {
    let query = supabase
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Aplicar filtros
    if (filters?.eventType) {
      query = query.eq('event_type', filters.eventType);
    }
    
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  };

  // Consulta para cargar logs de seguridad (últimos 30 por defecto)
  const logsQuery = useQuery({
    queryKey: ['security_logs'],
    queryFn: () => fetchSecurityLogs({ limit: 30 }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Función para filtrar logs
  const filterLogs = async (filters: any) => {
    try {
      setLoading(true);
      return await fetchSecurityLogs(filters);
    } catch (error: any) {
      console.error('Error al filtrar logs de seguridad:', error);
      toast.error(`Error: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    logs: logsQuery.data || [],
    isLoading: logsQuery.isLoading || loading,
    error: logsQuery.error,
    filterLogs,
  };
};
