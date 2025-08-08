/**
 * contact-page controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::contact-page.contact-page' as any, ({ strapi }) => ({
  async find(ctx) {
    try {
      // Use the default controller behavior but with better error handling
      const { data, meta } = await super.find(ctx);

      if (!data) {
        return ctx.notFound('Contact page not found. Please create content in the admin panel.');
      }

      return { data, meta };
    } catch (error) {
      console.error('Error fetching contact page:', error);
      strapi.log.error('Contact page fetch error details:', {
        error: error.message,
        stack: error.stack,
        query: ctx.query
      });

      // Check if it's a validation error (like invalid populate)
      if (error.message.includes('ValidationError') || error.message.includes('Invalid key')) {
        return ctx.badRequest('Invalid query parameters. Check your populate syntax.');
      }

      // Check if it's a content type not found error
      if (error.message.includes('Unknown attribute') || error.message.includes('does not exist')) {
        return ctx.notFound('Contact page content type not properly configured. Please check the schema.');
      }

      ctx.throw(500, 'Failed to fetch contact page data');
    }
  }
}));
