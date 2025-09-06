// Custom provider configurations for OAuth
export default {
  linkedin: {
    enabled: true,
    icon: 'linkedin',
    // LinkedIn OpenID Connect configuration
    oauth: 2,
    oauth2: {
      authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
      profileURL: 'https://api.linkedin.com/v2/userinfo',
      scope: ['openid', 'profile', 'email'],
      response_type: 'code',
      grant_type: 'authorization_code',
      // Custom field mapping for LinkedIn's userinfo response
      fieldMapping: {
        id: 'sub',
        username: 'given_name',
        email: 'email',
        firstName: 'given_name',
        lastName: 'family_name',
        profilePicture: 'picture'
      }
    }
  },
  google: {
    enabled: true,
    icon: 'google',
    oauth: 2,
    oauth2: {
      authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
      tokenURL: 'https://oauth2.googleapis.com/token',
      profileURL: 'https://www.googleapis.com/oauth2/v2/userinfo',
      scope: ['openid', 'profile', 'email'],
      response_type: 'code',
      grant_type: 'authorization_code'
    }
  }
};
