import type { VercelRequest, VercelResponse } from '@vercel/node';

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      res.status(400).send('Missing authorization code');
      return;
    }

    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    const redirectUri = process.env.ZOOM_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('[Zoomi] Missing env vars:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        hasRedirectUri: !!redirectUri,
      });
      res.status(500).send('Missing environment variables');
      return;
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenRes = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      console.error('[Zoomi] Token exchange failed:', tokenRes.status, body);
      res.status(500).send('OAuth token exchange failed');
      return;
    }

    // Token exchanged successfully — Marketplace compliance satisfied.
    // Redirect user to the app's Home URL inside Zoom.
    res.redirect(302, '/');
  } catch (error) {
    console.error('[Zoomi] Callback error:', error);
    res.status(500).send('Internal server error');
  }
}

module.exports = handler;
