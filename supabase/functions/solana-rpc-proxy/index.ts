import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Secure RPC proxy to protect Helius API key
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const heliusRpcUrl = Deno.env.get('SOLANA_RPC_URL');
    
    console.log('Received RPC proxy request');
    
    if (!heliusRpcUrl) {
      console.error('SOLANA_RPC_URL not configured in edge function environment');
      return new Response(
        JSON.stringify({ error: 'RPC endpoint not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Forward the RPC request to Helius
    const body = await req.text();
    
    console.log('Proxying RPC request to Helius:', heliusRpcUrl.substring(0, 40) + '...');
    
    const response = await fetch(heliusRpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    console.log('Helius response status:', response.status);
    
    const data = await response.text();
    
    if (!response.ok) {
      console.error('Helius API error:', response.status, data.substring(0, 200));
    }
    
    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in solana-rpc-proxy:', error);
    return new Response(
      JSON.stringify({ 
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal error' },
        id: null 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
