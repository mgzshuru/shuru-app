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
  linkedin: async function (access_token: string, ctx: any) {
    const { id_token } = ctx.query;

    console.log('Custom LinkedIn provider called');
    console.log('Has access_token:', !!access_token);
    console.log('Has id_token:', !!id_token);

    try {
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

        return {
          id: payload.sub,
          email: payload.email,
          username: payload.given_name || payload.name?.split(' ')[0] || payload.email?.split('@')[0],
          provider: 'linkedin',
          firstName: payload.given_name,
          lastName: payload.family_name,
          profilePicture: payload.picture,
          emailVerified: payload.email_verified === 'true' || payload.email_verified === true,
        };
      }

      // Fallback to access_token if id_token is not available
      if (access_token) {
        console.log('Processing LinkedIn access_token');
        const response = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json() as LinkedInUserInfo;
          console.log('Successfully fetched user info from LinkedIn API for:', data.email);

          return {
            id: data.sub,
            email: data.email,
            username: data.given_name || data.name?.split(' ')[0] || data.email?.split('@')[0],
            provider: 'linkedin',
            firstName: data.given_name,
            lastName: data.family_name,
            profilePicture: data.picture,
            emailVerified: data.email_verified === 'true' || data.email_verified === true,
          };
        } else {
          console.error('Failed to fetch user info from LinkedIn API:', response.status, response.statusText);
          throw new Error(`LinkedIn API returned ${response.status}: ${response.statusText}`);
        }
      }

      throw new Error('No valid authentication token provided');
    } catch (error) {
      console.error('LinkedIn OAuth error:', error);
      throw error;
    }
  },
};
