
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Get the secret key from the environment variables
  const turnstileSecretKey = Deno.env.get('TURNSTILE_SECRET_KEY')
  if (!turnstileSecretKey) {
    console.error('Missing TURNSTILE_SECRET_KEY environment variable')
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Server configuration error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }

  try {
    const { token, ip_address } = await req.json()
    
    if (!token) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing token' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }
    
    // Make request to Cloudflare Turnstile API
    const formData = new FormData()
    formData.append('secret', turnstileSecretKey)
    formData.append('response', token)
    
    // Add IP address if provided
    if (ip_address) {
      formData.append('remoteip', ip_address)
    }
    
    const result = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        body: formData,
        method: 'POST',
      }
    )
    
    const outcome = await result.json()
    console.log('Turnstile verification result:', outcome)
    
    // Return the verification result
    return new Response(
      JSON.stringify({ 
        success: outcome.success,
        error: outcome.error_codes,
        challenge_ts: outcome.challenge_ts,
        hostname: outcome.hostname,
        action: outcome.action
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error verifying Turnstile token:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
