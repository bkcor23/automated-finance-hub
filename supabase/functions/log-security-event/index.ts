// Follow this setup guide to integrate the Deno runtime:
// https://docs.deno.land/runtime/manual/getting_started/setup_your_environment
// This entrypoint file does NOT use deno-specific functionality,
// so could be renamed to .js (but keeping as .ts).

// Import using the latest Supabase JS URL format
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Security log event function initialized");

interface SecurityLogRequest {
  event_type: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { event_type, description, ip_address, user_agent } = await req.json() as SecurityLogRequest;
    
    // Create a Supabase client with the Admin key
    const supabase = createClient(
      // Supabase API URL - env var exported by default when deployed.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API SERVICE ROLE KEY - env var exported by default when deployed.
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }
    
    // Log the security event
    const { error } = await supabase.rpc('log_security_event', { 
      event_type, 
      description, 
      ip_address, 
      user_agent 
    });
    
    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Security event logged successfully'
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
