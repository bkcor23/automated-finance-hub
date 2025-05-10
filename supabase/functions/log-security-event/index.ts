
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

// Configuramos CORS para permitir llamadas desde la aplicación
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Manejamos solicitudes CORS preflight
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

serve(async (req: Request) => {
  try {
    // Manejar CORS preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Verificar que la solicitud es POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ 
        error: 'Método no permitido' 
      }), {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Crear cliente Supabase usando el token de autorización de la solicitud
    const authHeader = req.headers.get('Authorization') || '';
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        },
        auth: {
          persistSession: false
        }
      }
    );

    // Obtener la sesión del usuario (para verificar que está autenticado)
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !session) {
      return new Response(JSON.stringify({
        error: 'Unauthorized',
        message: 'No hay una sesión activa'
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Extraer datos del cuerpo de la solicitud
    const requestData = await req.json();
    const { event_type, description, ip_address, user_agent } = requestData;

    // Validar datos
    if (!event_type || !description) {
      return new Response(JSON.stringify({
        error: 'Datos incompletos',
        message: 'El tipo de evento y la descripción son obligatorios'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Registrar evento usando la función RPC
    const { data, error } = await supabaseClient.rpc(
      'log_security_event',
      {
        event_type,
        description,
        ip_address,
        user_agent
      }
    );

    if (error) throw error;

    // Devolver respuesta exitosa
    return new Response(JSON.stringify({
      success: true,
      message: 'Evento registrado exitosamente',
      data
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Manejar errores
    console.error('Error en la función log-security-event:', error);
    
    return new Response(JSON.stringify({
      error: 'Error interno',
      message: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
