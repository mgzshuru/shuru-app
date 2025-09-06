import jwt from 'jsonwebtoken';

interface LinkedInUserInfo {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  name?: string;
  picture?: string;
  email_verified?: boolean | string;
}

// LinkedIn OpenID Connect provider extension
export default {
  async linkedin(ctx: any) {
    const { id_token, access_token } = ctx.query;

    try {
      let userInfo;

      // If we have an id_token (JWT), decode it directly
      if (id_token) {
        // Decode the JWT without verification (LinkedIn's public keys would be needed for verification)
        const decoded = jwt.decode(id_token) as LinkedInUserInfo;

        if (decoded) {
          userInfo = {
            id: decoded.sub,
            email: decoded.email,
            firstName: decoded.given_name,
            lastName: decoded.family_name,
            username: decoded.given_name || decoded.name?.split(' ')[0] || decoded.email?.split('@')[0],
            picture: decoded.picture,
            provider: 'linkedin',
            emailVerified: decoded.email_verified === 'true' || decoded.email_verified === true,
          };
        }
      }

      // Fallback to access_token if id_token is not available or parsing failed
      if (!userInfo && access_token) {
        const response = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json() as LinkedInUserInfo;
          userInfo = {
            id: data.sub,
            email: data.email,
            firstName: data.given_name,
            lastName: data.family_name,
            username: data.given_name || data.name?.split(' ')[0] || data.email?.split('@')[0],
            picture: data.picture,
            provider: 'linkedin',
            emailVerified: data.email_verified === 'true' || data.email_verified === true,
          };
        }
      }

      if (!userInfo) {
        throw new Error('Failed to retrieve user information from LinkedIn');
      }

      return userInfo;
    } catch (error) {
      console.error('LinkedIn OAuth error:', error);
      throw error;
    }
  },
};
