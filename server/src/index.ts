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
  },
};
