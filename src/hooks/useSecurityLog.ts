
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSecurityLog = () => {
  const [loading, setLoading] = useState(false);

  const logEvent = async (
    eventType: string,
    description: string,
    ipAddress?: string,
    userAgent?: string
  ) => {
    try {
      setLoading(true);
      
      // Usar la función RPC que creamos en la base de datos
      const { data, error } = await supabase.rpc('log_security_event', {
        event_type: eventType,
        description,
        ip_address: ipAddress || null,
        user_agent: userAgent || navigator.userAgent
      });

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error al registrar evento de seguridad:', error);
      toast.error(`Error de seguridad: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    logEvent,
    loading
  };
};
