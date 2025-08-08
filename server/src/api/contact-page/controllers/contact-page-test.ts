/**
 * contact-page-test controller
 * Simple endpoint to test contact page setup
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::contact-page.contact-page' as any, ({ strapi }) => ({
  async test(ctx) {
    try {
      // Test 1: Check if content type exists
      const contentType = strapi.contentTypes['api::contact-page.contact-page'];
      if (!contentType) {
        return ctx.send({
          success: false,
          error: 'Contact page content type not found',
          step: 'content-type-check'
        });
      }

      // Test 2: Try to fetch with minimal query
      let hasContent = false;
      let contentData = null;

      try {
        const result = await strapi.entityService.findMany('api::contact-page.contact-page' as any, {
          limit: 1
        });

        if (result && result.length > 0) {
          hasContent = true;
          contentData = result[0];
        }
      } catch (error) {
        return ctx.send({
          success: false,
          error: 'Error accessing contact page data',
          details: error.message,
          step: 'data-access-check'
        });
      }

      // Test 3: Check permissions
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { name: 'Public' }
      });

      let hasPermissions = false;
      if (publicRole) {
        const permissions = await strapi.query('plugin::users-permissions.permission').findMany({
          where: {
            role: publicRole.id,
            action: 'api::contact-page.contact-page.find'
          }
        });
        hasPermissions = permissions.length > 0 && permissions[0].enabled;
      }

      return ctx.send({
        success: true,
        tests: {
          contentTypeExists: !!contentType,
          hasContent: hasContent,
          hasPermissions: hasPermissions,
          contentCount: hasContent ? 1 : 0
        },
        data: contentData ? { id: contentData.id, createdAt: contentData.createdAt } : null,
        recommendations: [
          !hasContent ? 'Create content in Content Manager → Single Types → Contact Page' : null,
          !hasPermissions ? 'Enable public permissions for contact-page.find' : null
        ].filter(Boolean)
      });

    } catch (error) {
      console.error('Contact page test error:', error);
      return ctx.send({
        success: false,
        error: 'Unexpected error during test',
        details: error.message,
        step: 'general-error'
      });
    }
  }
}));
