
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.9.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Obtenemos las variables de entorno
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    
    // Creamos un cliente de Supabase con credenciales administrativas
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Datos del usuario admin
    const email = 'admin@automated-finance.com'
    const password = 'AdminSecure2024!'
    const fullName = 'Administrador Sistema'
    
    // Verificamos si el usuario ya existe
    const { data: existingUsers } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', email)
    
    if (existingUsers && existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ 
          message: 'El usuario administrador ya existe', 
          adminCredentials: {
            email,
            password,
            fullName
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
    
    // Creamos el usuario
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Marcamos el email como confirmado
      user_metadata: { 
        full_name: fullName
      }
    })
    
    if (error) throw error
    
    // Asignamos el rol de administrador manualmente
    const userId = data.user.id
    
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' })
    
    if (roleError) throw roleError
    
    // Registramos el evento
    await supabase
      .from('security_logs')
      .insert({
        user_id: userId,
        event_type: 'admin_created',
        description: 'Usuario administrador creado por script'
      })
    
    return new Response(
      JSON.stringify({ 
        message: 'Usuario administrador creado correctamente',
        adminCredentials: {
          email,
          password,
          fullName
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ message: 'Error al crear usuario administrador', error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
