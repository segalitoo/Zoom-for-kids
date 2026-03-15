import type { VercelRequest, VercelResponse } from '@vercel/node';

function handler(_req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.ZOOM_CLIENT_ID;
  const redirectUri = process.env.ZOOM_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    res.status(500).send('Missing environment variables');
    return;
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
  });

  res.redirect(302, `https://zoom.us/oauth/authorize?${params.toString()}`);
}

module.exports = handler;
