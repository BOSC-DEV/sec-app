import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

function isCrawler(userAgent: string | null): boolean {
    if (!userAgent) return false;
    const ua = userAgent.toLowerCase();
    return BOT_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

function getAbsoluteImageUrl(imageUrl: string | null): string {
    const defaultImage = "https://sec.digital/lovable-uploads/3f23090d-4e36-43fc-b230-a8f898d7edd2.png";
    if (!imageUrl) return defaultImage;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `https://sec.digital${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}

function generateReportMetaHTML(scammer: any, reportUrl: string, isBot: boolean): string {
    const title = `${scammer.name} - Scam Report | SEC.digital`;
    const description = `${scammer.name} has been reported for ${scammer.accused_of}`;
    const imageUrl = getAbsoluteImageUrl(scammer.photo_url);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <meta property="og:type" content="article">
  <meta property="og:url" content="${reportUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <link rel="canonical" href="${reportUrl}">
  ${!isBot ? `<meta http-equiv="refresh" content="0; url=${reportUrl}">` : ''}
</head>
<body>
  <h1>${scammer.name}</h1>
  <p>${description}</p>
  <p>Read more: <a href="${reportUrl}">${reportUrl}</a></p>
</body>
</html>`;
}

function generateProfileMetaHTML(profile: any, profileUrl: string, isBot: boolean): string {
    const title = `${profile.display_name} (@${profile.username}) | SEC.digital`;
    const description = `View scam fighting activity by ${profile.display_name}`;
    const imageUrl = getAbsoluteImageUrl(profile.profile_pic_url);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <meta property="og:type" content="profile">
  <meta property="og:url" content="${profileUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <link rel="canonical" href="${profileUrl}">
  ${!isBot ? `<meta http-equiv="refresh" content="0; url=${profileUrl}">` : ''}
</head>
<body>
  <h1>${profile.display_name}</h1>
  <p>${description}</p>
  <p>View profile: <a href="${profileUrl}">${profileUrl}</a></p>
</body>
</html>`;
}

function generateDefaultMetaHTML(targetUrl: string, isBot: boolean): string {
    const title = "SEC.digital - The Scams & E-crimes Commission";
    const description = "Report Today - Tracking and exposing digital & cryptocurrency scammers worldwide";
    const imageUrl = "https://sec.digital/lovable-uploads/3f23090d-4e36-43fc-b230-a8f898d7edd2.png";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${targetUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta name="twitter:card" content="summary_large_image">
  ${!isBot ? `<meta http-equiv="refresh" content="0; url=${targetUrl}">` : ''}
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
</body>
</html>`;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);
        const userAgent = req.headers.get('user-agent');
        const isBot = isCrawler(userAgent);

        const path = url.searchParams.get('path') || '';
        const baseDomain = "https://sec.digital";
        const fullUrl = `${baseDomain}${path}`;

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Handle Report Pages
        if (path.startsWith('/report/') || path.startsWith('/scammer/')) {
            const id = path.split('/').pop();
            if (id) {
                // Find by report_number or id
                const { data: scammer } = await supabase
                    .from('scammers')
                    .select('*')
                    .or(`report_number.eq.${id},id.eq.${id}`)
                    .maybeSingle();

                if (scammer) {
                    return new Response(generateReportMetaHTML(scammer, fullUrl, isBot), {
                        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
                    });
                }
            }
        }

        // Handle Profile Pages
        if (path.startsWith('/profile/')) {
            const username = path.split('/').pop();
            if (username) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .or(`username.eq.${username},wallet_address.eq.${username},id.eq.${username}`)
                    .maybeSingle();

                if (profile) {
                    return new Response(generateProfileMetaHTML(profile, fullUrl, isBot), {
                        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
                    });
                }
            }
        }

        // Default Fallback
        return new Response(generateDefaultMetaHTML(fullUrl, isBot), {
            headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
        });

    } catch (error) {
        console.error('Error in SSR function:', error);
        return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
    }
});
