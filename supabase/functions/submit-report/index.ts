
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { token, ip_hash, report_data, user_id } = await req.json()
    
    // Verify token first using our verify-turnstile function
    const verifyResult = await fetch(
      `https://mfirlsuuxpvgwaxymjor.supabase.co/functions/v1/verify-turnstile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.get('Authorization') || '',
        },
        body: JSON.stringify({ token, ip_address: ip_hash })
      }
    )
    
    const verifyData = await verifyResult.json()
    
    if (!verifyData.success) {
      console.error('Turnstile verification failed:', verifyData)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Turnstile verification failed', 
          details: verifyData.error 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }
    
    // Connect to Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // Check rate limits using our database function
    const { data: rateLimitCheck, error: rateLimitError } = await supabaseClient.rpc(
      'check_report_rate_limits',
      { 
        p_user_id: user_id || null,
        p_ip_hash: ip_hash 
      }
    )
    
    if (rateLimitError) {
      console.error('Error checking rate limits:', rateLimitError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Error checking rate limits' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
    
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: rateLimitCheck.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429 // Too Many Requests
        }
      )
    }
    
    // Process the report data
    // This would include your actual report submission logic from reportService.ts
    // For this example, we'll just return a success message
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Report submitted successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error submitting report:', error)
    
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
