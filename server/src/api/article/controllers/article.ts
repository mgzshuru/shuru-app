/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // Custom method to increment article views using separate tracking
  async incrementViews(ctx) {
    const { documentId } = ctx.params;

    try {
      // Get the current article to verify it exists
      const article = await strapi.documents('api::article.article').findOne({
        documentId
      });

      if (!article) {
        return ctx.notFound('Article not found');
      }

      // Find or create article view record
      let articleView = await strapi.db.query('api::article-view.article-view').findOne({
        where: {
          article: article.id
        }
      });

      if (articleView) {
        // Update existing view record
        articleView = await strapi.db.query('api::article-view.article-view').update({
          where: { id: articleView.id },
          data: {
            views: articleView.views + 1,
            last_viewed: new Date()
          }
        });
      } else {
        // Create new view record
        articleView = await strapi.db.query('api::article-view.article-view').create({
          data: {
            article: article.id,
            views: 1,
            last_viewed: new Date()
          }
        });
      }

      return ctx.send({
        success: true,
        views: articleView.views
      });
    } catch (error) {
      strapi.log.error('Error incrementing article views:', error);
      return ctx.internalServerError('Failed to increment views');
    }
  }
}));
