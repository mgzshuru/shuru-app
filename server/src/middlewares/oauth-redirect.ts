/**
 * OAuth redirect middleware
 * Handles proper redirects for OAuth authentication
 */

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Check if this is an OAuth callback request
    if (ctx.request.url.includes('/api/auth/') && ctx.request.url.includes('/callback')) {
      // Set proper CORS headers for OAuth callbacks
      ctx.set('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'https://www.shuru.sa');
      ctx.set('Access-Control-Allow-Credentials', 'true');
      ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
      ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

      // Handle OPTIONS preflight requests
      if (ctx.request.method === 'OPTIONS') {
        ctx.status = 200;
        return;
      }
    }

    await next();

    // After OAuth processing, check if we need to redirect to the client
    if (ctx.request.url.includes('/api/auth/') && ctx.request.url.includes('/callback')) {
      // Check if the authentication was successful and redirect accordingly
      if (ctx.status === 200 && ctx.response.body) {
        // If it's a successful OAuth callback, redirect to the client callback
        const clientUrl = process.env.CLIENT_URL || 'https://www.shuru.sa';
        const provider = ctx.request.url.split('/')[3]; // Extract provider from URL

        // Extract token or authentication data
        let redirectUrl = `${clientUrl}/api/auth/callback/${provider}`;

        // Pass along the authentication parameters
        if (ctx.query.access_token) {
          redirectUrl += `?access_token=${ctx.query.access_token}`;
        } else if (ctx.query.code) {
          redirectUrl += `?code=${ctx.query.code}`;
        }

        // Add state parameter if present
        if (ctx.query.state) {
          redirectUrl += `${redirectUrl.includes('?') ? '&' : '?'}state=${ctx.query.state}`;
        }

        strapi.log.info(`OAuth callback redirect: ${redirectUrl}`);
        ctx.redirect(redirectUrl);
      }
    }
  };
};
