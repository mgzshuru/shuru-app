import { setupProviders } from '@strapi/plugin-users-permissions/server/services/providers';

export default ({ strapi }) => {
  setupProviders({
    providers: {
      linkedin: {
        enabled: true,
        icon: 'linkedin',
        key: process.env.LINKEDIN_CLIENT_ID,
        secret: process.env.LINKEDIN_CLIENT_SECRET,
        callback: `${process.env.STRAPI_URL || 'http://localhost:1337'}/api/auth/linkedin/callback`,
        scope: ['email', 'openid', 'profile'], // Updated LinkedIn v2 API scopes
      },
      google: {
        enabled: true,
        icon: 'google',
        key: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
        callback: `${process.env.STRAPI_URL || 'http://localhost:1337'}/api/auth/google/callback`,
        scope: ['email', 'profile'],
      },
    },
  });
};
