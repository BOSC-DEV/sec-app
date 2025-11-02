import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import nacl from "https://esm.sh/tweetnacl@1.0.3"
import { PublicKey } from "https://esm.sh/@solana/web3.js@1.73.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface AuthRequest {
  walletAddress: string
  signature: string
  message: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  console.log('Auth request received:', req.method)

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    })

    const supabase = createClient(
      supabaseUrl ?? '',
      supabaseKey ?? ''
    )

    const { walletAddress, signature, message }: AuthRequest = await req.json()
    console.log('Authenticating wallet:', walletAddress)

    // Verify signature
    const messageBytes = new TextEncoder().encode(message)
    const signatureBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0))
    const publicKeyBytes = new PublicKey(walletAddress).toBytes()
    
    const verified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    )

    if (!verified) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Hash signature for password (64-char SHA-256 hex)
    const hashedPassword = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(signature))
      .then(h => Array.from(new Uint8Array(h))
        .map(b => b.toString(16).padStart(2, '0'))
        .join(''))

    const email = `${walletAddress}@sec.digital`.toLowerCase()

    // Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: hashedPassword,
    })

    if (!signInError && signInData.session) {
      return new Response(
        JSON.stringify({ 
          session: signInData.session,
          user: signInData.user 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If sign-in fails, try to sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
      options: {
        data: {
          wallet_address: walletAddress,
        },
      },
    })

    if (signUpError) {
      // If user already exists, password is wrong
      if (signUpError.message?.includes('already registered')) {
        return new Response(
          JSON.stringify({ error: 'User exists but password mismatch. Please delete user in Supabase Dashboard.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ error: signUpError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if we have a session (email confirmation disabled)
    if (signUpData.session) {
      return new Response(
        JSON.stringify({ 
          session: signUpData.session,
          user: signUpData.user 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If no session, try to sign in
    if (signUpData.user && !signUpData.session) {
      const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
        email,
        password: hashedPassword,
      })

      if (!retryError && retryData.session) {
        return new Response(
          JSON.stringify({ 
            session: retryData.session,
            user: retryData.user 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Email confirmation required. Please disable in Supabase Dashboard.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Auth error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

