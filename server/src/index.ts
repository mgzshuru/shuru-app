import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    console.log('Setting up OAuth providers...');

    try {
      // Register OAuth providers programmatically
      const pluginStore = strapi.store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
      });

      // Get current providers
      const grantConfig = await pluginStore.get({ key: 'grant' }) as any;

      const defaultOAuthConfig = {
        linkedin: {
          enabled: true,
          icon: 'linkedin',
          key: process.env.LINKEDIN_CLIENT_ID,
          secret: process.env.LINKEDIN_CLIENT_SECRET,
          callback: '/api/auth/linkedin/callback',
          scope: ['openid', 'profile', 'email'],
          // Add LinkedIn-specific configuration
          oauth: 2,
          oauth2: {
            authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
            tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
            clientID: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            callbackURL: '/api/auth/linkedin/callback',
            scope: ['openid', 'profile', 'email'],
          },
        },
        google: {
          enabled: true,
          icon: 'google',
          key: process.env.GOOGLE_CLIENT_ID,
          secret: process.env.GOOGLE_CLIENT_SECRET,
          callback: '/api/auth/google/callback',
          scope: ['openid', 'profile', 'email'],
        },
      };

      if (!grantConfig || typeof grantConfig !== 'object') {
        // Initialize grant config if it doesn't exist
        await pluginStore.set({ key: 'grant', value: defaultOAuthConfig });
        console.log('OAuth providers configured successfully');
      } else {
        // Update existing config with correct scopes
        const updatedConfig = {
          ...grantConfig,
          linkedin: {
            ...(grantConfig.linkedin || {}),
            enabled: true,
            scope: ['openid', 'profile', 'email'],
            key: process.env.LINKEDIN_CLIENT_ID,
            secret: process.env.LINKEDIN_CLIENT_SECRET,
            callback: '/api/auth/linkedin/callback',
            // Add LinkedIn-specific OAuth2 configuration
            oauth: 2,
            oauth2: {
              authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
              tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
              clientID: process.env.LINKEDIN_CLIENT_ID,
              clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
              callbackURL: '/api/auth/linkedin/callback',
              scope: ['openid', 'profile', 'email'],
            },
          },
          google: {
            ...(grantConfig.google || {}),
            enabled: true,
            scope: ['openid', 'profile', 'email'],
            key: process.env.GOOGLE_CLIENT_ID,
            secret: process.env.GOOGLE_CLIENT_SECRET,
          },
        };

        await pluginStore.set({ key: 'grant', value: updatedConfig });
        console.log('OAuth providers updated successfully');
      }

      // Configure advanced settings for OAuth
      const advancedConfig = await pluginStore.get({ key: 'advanced' }) as any;
      if (advancedConfig && typeof advancedConfig === 'object') {
        const updatedAdvanced = {
          ...advancedConfig,
          allow_register: true,
          default_role: 'authenticated',
        };
        await pluginStore.set({ key: 'advanced', value: updatedAdvanced });
      }

    } catch (error) {
      console.error('Error configuring OAuth providers:', error);
    }

    console.log('Setting up saved-article permissions...');

    try {
      // Get the authenticated role
      const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' }
      });

      if (authenticatedRole) {
        // Set permissions for saved-article collection
        const permissions = [
          'find',
          'findOne',
          'create',
          'update',
          'delete'
        ];

        for (const action of permissions) {
          const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: authenticatedRole.id,
              action: `api::saved-article.saved-article.${action}`
            }
          });

          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: authenticatedRole.id,
                action: `api::saved-article.saved-article.${action}`,
                enabled: true
              }
            });
          } else {
            await strapi.query('plugin::users-permissions.permission').update({
              where: { id: existingPermission.id },
              data: { enabled: true }
            });
          }
        }

        // Also set permissions for custom endpoints
        const customEndpoints = [
          'toggle',
          'findUserSaved',
          'checkSaved'
        ];

        for (const endpoint of customEndpoints) {
          const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: authenticatedRole.id,
              action: `api::saved-article.saved-article.${endpoint}`
            }
          });

          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: authenticatedRole.id,
                action: `api::saved-article.saved-article.${endpoint}`,
                enabled: true
              }
            });
          } else {
            await strapi.query('plugin::users-permissions.permission').update({
              where: { id: existingPermission.id },
              data: { enabled: true }
            });
          }
        }

        console.log('Saved-article permissions set up successfully');
      }
    } catch (error) {
      console.error('Error setting up saved-article permissions:', error);
    }

    // Set up article-submission permissions
    console.log('Setting up article-submission permissions...');
    try {
      // Get the public role for article submissions
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });

      if (publicRole) {
        // Set permissions for article-submission endpoints
        const submissionEndpoints = [
          'create',
          'checkEmail',
          'confirm',
          'approve',
          'reject'
        ];

        for (const endpoint of submissionEndpoints) {
          const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: publicRole.id,
              action: `api::article-submission.article-submission.${endpoint}`
            }
          });

          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: publicRole.id,
                action: `api::article-submission.article-submission.${endpoint}`,
                enabled: true
              }
            });
          } else {
            await strapi.query('plugin::users-permissions.permission').update({
              where: { id: existingPermission.id },
              data: { enabled: true }
            });
          }
        }

        console.log('Article-submission permissions set up successfully');
      }
    } catch (error) {
      console.error('Error setting up article-submission permissions:', error);
    }

    // Set up author permissions for authenticated users
    console.log('Setting up author permissions...');
    try {
      const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' }
      });

      if (authenticatedRole) {
        // Set permissions for author endpoints that authenticated users need
        const authorEndpoints = [
          'find',
          'findOne'
        ];

        for (const endpoint of authorEndpoints) {
          const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: authenticatedRole.id,
              action: `api::author.author.${endpoint}`
            }
          });

          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: authenticatedRole.id,
                action: `api::author.author.${endpoint}`,
                enabled: true
              }
            });
          } else {
            await strapi.query('plugin::users-permissions.permission').update({
              where: { id: existingPermission.id },
              data: { enabled: true }
            });
          }
        }

        console.log('Author permissions set up successfully');
      }
    } catch (error) {
      console.error('Error setting up author permissions:', error);
    }

    // Set up article and category permissions for public role (for submission process)
    console.log('Setting up article and category permissions...');
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });

      if (publicRole) {
        // Set permissions for article creation (needed for direct article submission)
        const articlePermissions = ['create', 'find', 'findOne'];

        for (const action of articlePermissions) {
          const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: publicRole.id,
              action: `api::article.article.${action}`
            }
          });

          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: publicRole.id,
                action: `api::article.article.${action}`,
                enabled: true
              }
            });
          } else {
            await strapi.query('plugin::users-permissions.permission').update({
              where: { id: existingPermission.id },
              data: { enabled: true }
            });
          }
        }

        // Set permissions for category creation and access
        const categoryPermissions = ['create', 'find', 'findOne'];

        for (const action of categoryPermissions) {
          const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: publicRole.id,
              action: `api::category.category.${action}`
            }
          });

          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: publicRole.id,
                action: `api::category.category.${action}`,
                enabled: true
              }
            });
          } else {
            await strapi.query('plugin::users-permissions.permission').update({
              where: { id: existingPermission.id },
              data: { enabled: true }
            });
          }
        }

        // Set permissions for author creation and access
        const authorCreatePermissions = ['create', 'update', 'find', 'findOne'];

        for (const action of authorCreatePermissions) {
          const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: publicRole.id,
              action: `api::author.author.${action}`
            }
          });

          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: publicRole.id,
                action: `api::author.author.${action}`,
                enabled: true
              }
            });
          } else {
            await strapi.query('plugin::users-permissions.permission').update({
              where: { id: existingPermission.id },
              data: { enabled: true }
            });
          }
        }

        console.log('Article, category, and author permissions set up successfully');
      }
    } catch (error) {
      console.error('Error setting up article and category permissions:', error);
    }
  },
};
