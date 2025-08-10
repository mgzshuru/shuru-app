import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::submit-page-content.submit-page-content', ({ strapi }) => ({
  async find(ctx) {
    try {
      const entity = await strapi.entityService.findOne('api::submit-page-content.submit-page-content', 1, {
        populate: {
          headerIcon: {
            fields: ['url', 'alternativeText', 'width', 'height']
          },
          successSteps: {
            fields: ['stepText']
          },
          contentCriteriaItems: {
            fields: ['itemText']
          },
          reviewProcessItems: {
            fields: ['itemText']
          },
          seo: {
            fields: ['meta_title', 'meta_description', 'meta_keywords'],
            populate: {
              og_image: {
                fields: ['url', 'alternativeText', 'width', 'height']
              }
            }
          }
        }
      });

      if (!entity) {
        return ctx.notFound('Submit page content not found');
      }

      return { data: entity };
    } catch (error) {
      strapi.log.error('Error fetching submit page content:', error);
      return ctx.internalServerError('Unable to fetch submit page content');
    }
  }
}));
