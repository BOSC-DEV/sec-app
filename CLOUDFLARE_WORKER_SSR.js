/**
 * Cloudflare Worker for SEC.digital SSR/SEO
 * Intercepts requests to /report/:id and /profile/:username for bots.
 * 
 * Deployment:
 * 1. Create a new Cloudflare Worker.
 * 2. Paste this code.
 * 3. Set up a custom domain or route (e.g., sec.digital/*).
 */

const SUPABASE_FUNCTION_URL = 'https://gparwhzrrvudmrxbxanb.supabase.co/functions/v1/ssr-meta';

const BOT_AGENTS = [
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'slackbot',
  'discordbot',
  'googlebot',
  'bingbot',
  'crawler',
  'spider',
  'bot',
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = BOT_AGENTS.some(bot => userAgent.toLowerCase().includes(bot));

    // Define which routes should be intercepted for bots
    const isInterceptable = 
      url.pathname.startsWith('/report/') || 
      url.pathname.startsWith('/scammer/') || 
      url.pathname.startsWith('/profile/');

    if (isBot && isInterceptable) {
      // Append the original path as a query parameter so the Supabase function knows what to fetch
      const ssrUrl = `${SUPABASE_FUNCTION_URL}?path=${encodeURIComponent(url.pathname)}`;
      
      try {
        const response = await fetch(ssrUrl, {
          headers: {
            'User-Agent': userAgent,
          }
        });
        
        // Ensure we return the response correctly
        return response;
      } catch (error) {
        console.error('SSR Fetch Error:', error);
        // Fallback to default if SSR fails
        return fetch(request);
      }
    }

    // Default: Continue to the original request (the SPA)
    return fetch(request);
  },
};
