// Follow this setup guide to integrate the Deno runtime:
// https://docs.deno.land/runtime/manual/getting_started/setup_your_environment
// This entrypoint file does NOT use deno-specific functionality,
// so could be renamed to .js (but keeping as .ts).

// Import using the latest Supabase JS URL format
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Admin user creation function initialized");

interface RequestBody {
  email: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json() as RequestBody;
    
    // Create a Supabase client with the Admin key
    const supabase = createClient(
      // Supabase API URL - env var exported by default when deployed.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API SERVICE ROLE KEY - env var exported by default when deployed.
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Create user
    const { data, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the user
    });

    if (signUpError) {
      return new Response(JSON.stringify({
        error: signUpError.message,
        success: false,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      user: data.user,
      message: 'Admin user created successfully',
      success: true,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

// Set handler for serverless function
Deno.serve(handler);
