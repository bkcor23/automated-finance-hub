
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.29.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Manejo de preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { adminEmail, adminPassword, adminName } = await req.json()

    // Validación básica
    if (!adminEmail || !adminPassword || !adminName) {
      return new Response(
        JSON.stringify({
          error: 'Se requieren email, contraseña y nombre para crear un admin',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Crear cliente de Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: adminName },
    })

    if (authError) throw authError

    // Verificar que se haya creado el usuario
    if (!authData.user) {
      throw new Error('No se pudo crear el usuario admin')
    }

    // Insertar perfil en la tabla de perfiles
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: adminEmail,
        full_name: adminName,
        roles: ['admin'],
        avatar_url: null,
      })

    if (profileError) throw profileError

    // Registrar evento de seguridad
    await supabaseClient
      .from('security_logs')
      .insert({
        user_id: authData.user.id,
        event_type: 'admin_created',
        description: `Admin user created: ${adminEmail}`,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Usuario admin creado exitosamente', 
        userId: authData.user.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Error al crear usuario admin', 
        details: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
