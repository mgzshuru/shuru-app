interface LinkedInUserInfo {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  name?: string;
  picture?: string;
  email_verified?: boolean | string;
}

export default {
  async callback(ctx) {
    const { access_token, id_token } = ctx.request.body;

    console.log('Custom LinkedIn API callback called');
    console.log('Has access_token:', !!access_token);
    console.log('Has id_token:', !!id_token);

    try {
      let userInfo;

      // If we have an id_token (JWT), decode it directly
      if (id_token) {
        console.log('Processing LinkedIn id_token');

        // Decode the JWT payload (base64 decode the middle part)
        const parts = id_token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid JWT format');
        }

        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString()) as LinkedInUserInfo;

        console.log('Successfully decoded LinkedIn id_token for user:', payload.email);

        userInfo = {
          id: payload.sub,
          email: payload.email,
          username: payload.given_name || payload.name?.split(' ')[0] || payload.email?.split('@')[0],
          firstName: payload.given_name,
          lastName: payload.family_name,
          picture: payload.picture,
          emailVerified: payload.email_verified === 'true' || payload.email_verified === true,
        };
      } else if (access_token) {
        console.log('Processing LinkedIn access_token');
        const response = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json() as LinkedInUserInfo;
          console.log('Successfully fetched user info from LinkedIn API for:', data.email);

          userInfo = {
            id: data.sub,
            email: data.email,
            username: data.given_name || data.name?.split(' ')[0] || data.email?.split('@')[0],
            firstName: data.given_name,
            lastName: data.family_name,
            picture: data.picture,
            emailVerified: data.email_verified === 'true' || data.email_verified === true,
          };
        } else {
          console.error('Failed to fetch user info from LinkedIn API:', response.status, response.statusText);
          throw new Error(`LinkedIn API returned ${response.status}: ${response.statusText}`);
        }
      } else {
        throw new Error('No valid authentication token provided');
      }

      // Find or create user
      let user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email: userInfo.email },
      });

      const role = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      if (!user) {
        // Create new user
        user = await strapi.query('plugin::users-permissions.user').create({
          data: {
            username: userInfo.username,
            email: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            provider: 'linkedin',
            confirmed: true,
            role: role.id,
          },
        });
        console.log('Created new LinkedIn user:', user.email);
      } else {
        console.log('Found existing user:', user.email);
      }

      // Generate JWT
      const jwtService = strapi.plugin('users-permissions').service('jwt');
      const jwt = jwtService.issue({ id: user.id });

      console.log('LinkedIn authentication successful for user:', user.email);

      return ctx.send({
        jwt,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          provider: user.provider,
        },
      });

    } catch (error) {
      console.error('LinkedIn OAuth error:', error);
      return ctx.badRequest(error.message);
    }
  },
};
