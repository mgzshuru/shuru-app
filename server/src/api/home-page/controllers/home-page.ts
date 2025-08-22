/**
 * home-page controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::home-page.home-page', ({ strapi }) => ({
  async find(ctx) {
    try {
      // Find any home page document - population is handled by middleware
      const entities = await strapi.documents('api::home-page.home-page').findMany({
        status: 'published',
        // Population is now handled by the middleware
      });

      if (!entities || entities.length === 0) {
        strapi.log.info('No home page found, creating empty response');
        return this.transformResponse({ blocks: [] });
      }

      // Use the first (and likely only) home page
      const entity = entities[0];
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      strapi.log.error('Error fetching home page:', error);
      return ctx.internalServerError('Unable to fetch home page');
    }
  }
}));
