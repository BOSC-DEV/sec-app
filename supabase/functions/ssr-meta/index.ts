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
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="${title}">
  <meta name="description" content="${description}">
  <link rel="icon" href="https://sec.digital/lovable-uploads/c850a89f-266d-4c68-abc5-e825eb8d23a5.png" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${reportUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="SEC.digital">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${reportUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <link rel="canonical" href="${reportUrl}">
  
  ${!isBot ? `
  <meta http-equiv="refresh" content="0; url=${reportUrl}">
  <script>
    if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
      window.location.href = '${reportUrl}';
    }
  </script>` : ''}
</head>
<body>
  <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 100px auto; text-align: center; padding: 20px;">
    <h1>${scammer.name}</h1>
    <p>${description}</p>
    <p>Read more: <a href="${reportUrl}">${reportUrl}</a></p>
  </div>
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
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="${title}">
  <meta name="description" content="${description}">
  <link rel="icon" href="https://sec.digital/lovable-uploads/c850a89f-266d-4c68-abc5-e825eb8d23a5.png" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="profile">
  <meta property="og:url" content="${profileUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="600">
  <meta property="og:image:height" content="600">
  <meta property="og:site_name" content="SEC.digital">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${profileUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <link rel="canonical" href="${profileUrl}">
  ${!isBot ? `
  <meta http-equiv="refresh" content="0; url=${profileUrl}">
  <script>
    if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
      window.location.href = '${profileUrl}';
    }
  </script>` : ''}
</head>
<body>
  <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 100px auto; text-align: center; padding: 20px;">
    <h1>${profile.display_name}</h1>
    <p>${description}</p>
    <p>View profile: <a href="${profileUrl}">${profileUrl}</a></p>
  </div>
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
  <link rel="icon" href="https://sec.digital/lovable-uploads/c850a89f-266d-4c68-abc5-e825eb8d23a5.png" />
  
  <meta property="og:type" content="website">
  <meta property="og:url" content="${targetUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:site_name" content="SEC.digital">
  
  <meta name="twitter:card" content="summary_large_image">
  ${!isBot ? `<meta http-equiv="refresh" content="0; url=${targetUrl}">` : ''}
</head>
<body>
  <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 100px auto; text-align: center; padding: 20px;">
    <h1>${title}</h1>
    <p>${description}</p>
  </div>
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

        console.log(`[SSR] Request for path: ${path}, isBot: ${isBot}`);

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Handle Report Pages
        if (path.startsWith('/report/') || path.startsWith('/scammer/')) {
            const segments = path.split('/').filter(Boolean);
            const id = segments.pop();
            console.log(`[SSR] Extracted Scammer ID: ${id}`);

            if (id) {
                // Check if id is a number (report_number) or UUID
                const isNumeric = /^\d+$/.test(id);
                console.log(`[SSR] ID is numeric: ${isNumeric}`);

                let query = supabase.from('scammers').select('*');

                if (isNumeric) {
                    query = query.eq('report_number', parseInt(id));
                } else {
                    query = query.eq('id', id);
                }

                const { data: scammer, error } = await query.maybeSingle();

                if (error) console.error('[SSR] Supabase DB Error (Scammer):', error);

                if (scammer) {
                    console.log(`[SSR] Success! Found Scammer: ${scammer.name}`);
                    return new Response(generateReportMetaHTML(scammer, fullUrl, isBot), {
                        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
                    });
                } else {
                    console.log(`[SSR] Scammer NOT found for identifier: ${id}`);
                }
            }
        }

        // Handle Profile Pages
        if (path.startsWith('/profile/')) {
            const segments = path.split('/').filter(Boolean);
            const username = segments.pop();
            console.log(`[SSR] Extracted Profile identifier: ${username}`);

            if (username) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .or(`username.eq.${username},wallet_address.eq.${username},id.eq.${username}`)
                    .maybeSingle();

                if (error) console.error('[SSR] Supabase DB Error (Profile):', error);

                if (profile) {
                    console.log(`[SSR] Success! Found Profile: ${profile.display_name}`);
                    return new Response(generateProfileMetaHTML(profile, fullUrl, isBot), {
                        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
                    });
                } else {
                    console.log(`[SSR] Profile NOT found for: ${username}`);
                }
            }
        }

        // Default Fallback
        console.log(`[SSR] Falling back to default meta for URL: ${fullUrl}`);
        return new Response(generateDefaultMetaHTML(fullUrl, isBot), {
            headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
        });

    } catch (error) {
        console.error('[SSR] Critical Error in SSR function:', error);
        return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
    }
});
