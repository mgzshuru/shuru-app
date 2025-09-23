/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // Custom method to increment article views
  async incrementViews(ctx) {
    const { documentId } = ctx.params;

    try {
      // Get the current article
      const article = await strapi.documents('api::article.article').findOne({
        documentId
      });

      if (!article) {
        return ctx.notFound('Article not found');
      }

      // Increment views count - use any type to bypass TypeScript issues temporarily
      const currentViews = (article as any).views || 0;
      const updatedArticle = await strapi.documents('api::article.article').update({
        documentId,
        data: {
          views: currentViews + 1
        } as any
      });

      return ctx.send({
        success: true,
        views: (updatedArticle as any).views
      });
    } catch (error) {
      strapi.log.error('Error incrementing article views:', error);
      return ctx.internalServerError('Failed to increment views');
    }
  }
}));
