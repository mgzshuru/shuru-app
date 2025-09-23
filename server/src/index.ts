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
          callback: 'https://www.shuru.sa/api/auth/callback/linkedin',
          scope: ['openid', 'profile', 'email'],
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
            callback: 'https://www.shuru.sa/api/auth/callback/linkedin',
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

    // Set up article-view permissions (public access for creating/updating view counts)
    console.log('Setting up article-view permissions...');
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });

      if (publicRole) {
        const viewEndpoints = ['create', 'update', 'find', 'findOne'];

        for (const endpoint of viewEndpoints) {
          const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: publicRole.id,
              action: `api::article-view.article-view.${endpoint}`
            }
          });

          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: publicRole.id,
                action: `api::article-view.article-view.${endpoint}`,
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

        console.log('Article-view permissions set up successfully');
      }
    } catch (error) {
      console.error('Error setting up article-view permissions:', error);
    }

    // Clean up and seed article views
    console.log('Cleaning up and seeding article views...');
    try {
      await cleanupAndSeedArticleViews(strapi);
    } catch (error) {
      console.error('Error setting up article views:', error);
    }
  },
};

async function cleanupAndSeedArticleViews(strapi: any) {
  try {
    // Get all articles
    const articles = await strapi.documents('api::article.article').findMany({
      status: 'published'
    });

    console.log(`Found ${articles.length} published articles`);

    // Get all existing article views
    const existingViews = await strapi.db.query('api::article-view.article-view').findMany({
      populate: ['article']
    });

    console.log(`Found ${existingViews.length} existing article views`);

    // Clean up orphaned views (views without valid articles)
    const orphanedViews = [];
    const validViews = [];

    for (const view of existingViews) {
      if (!view.article || !view.article.id) {
        orphanedViews.push(view.id);
      } else {
        // Check if the referenced article still exists
        const articleExists = articles.find(a => a.id === view.article.id);
        if (!articleExists) {
          orphanedViews.push(view.id);
        } else {
          validViews.push(view);
        }
      }
    }

    // Delete orphaned views
    if (orphanedViews.length > 0) {
      console.log(`Deleting ${orphanedViews.length} orphaned article views...`);
      await strapi.db.query('api::article-view.article-view').deleteMany({
        where: {
          id: {
            $in: orphanedViews
          }
        }
      });
    }

    // Create views for articles that don't have them yet
    const articlesWithViews = new Set(validViews.map(v => v.article.id));
    const articlesNeedingViews = articles.filter(article => !articlesWithViews.has(article.id));

    if (articlesNeedingViews.length > 0) {
      console.log(`Creating views for ${articlesNeedingViews.length} articles...`);

      // Create views for articles that don't have them
      for (const article of articlesNeedingViews) {
        await strapi.db.query('api::article-view.article-view').create({
          data: {
            article: article.id,
            views: 0,
            last_viewed: null
          }
        });
      }
    }

    console.log(`✅ Article views cleanup completed successfully!`);
    console.log(`- Deleted ${orphanedViews.length} orphaned views`);
    console.log(`- Kept ${validViews.length} valid existing views`);
    console.log(`- Created ${articlesNeedingViews.length} new views`);

  } catch (error) {
    console.error('❌ Error in article views cleanup:', error);
    throw error;
  }
}
