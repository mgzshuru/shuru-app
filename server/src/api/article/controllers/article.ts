/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // Custom method to get article views
  async getViews(ctx) {
    const { documentId } = ctx.params;

    try {
      // Verify the article exists using Document Service API
      const article = await strapi.documents('api::article.article').findOne({
        documentId,
        status: 'published' // Only count views for published articles
      });

      if (!article) {
        return ctx.notFound('Article not found');
      }

      // Find article view record using database query (more direct approach)
      const articleViews = await strapi.db.query('api::article-view.article-view').findMany({
        where: {
          article: article.id // Use the article's database ID from the document
        },
        limit: 1
      });

      const viewCount = articleViews.length > 0 ? articleViews[0].views : 0;

      return ctx.send({
        success: true,
        views: viewCount,
        documentId: documentId
      });
    } catch (error) {
      strapi.log.error('Error getting article views:', error);
      return ctx.internalServerError('Failed to get views');
    }
  },

  // Custom method to increment article views using separate tracking
  async incrementViews(ctx) {
    const { documentId } = ctx.params;

    try {
      // Verify the article exists and is published
      const article = await strapi.documents('api::article.article').findOne({
        documentId,
        status: 'published' // Only track views for published articles
      });

      if (!article) {
        return ctx.notFound('Article not found or not published');
      }

      // Find existing article view record using database query
      const existingViews = await strapi.db.query('api::article-view.article-view').findMany({
        where: {
          article: article.id // Use the article's database ID from the document
        },
        limit: 1
      });

      let articleView;

      if (existingViews.length > 0) {
        // Update existing view record
        articleView = await strapi.db.query('api::article-view.article-view').update({
          where: { id: existingViews[0].id },
          data: {
            views: existingViews[0].views + 1,
            last_viewed: new Date()
          }
        });
      } else {
        // Create new view record
        articleView = await strapi.db.query('api::article-view.article-view').create({
          data: {
            article: article.id, // Use the article's database ID for the relationship
            views: 1,
            last_viewed: new Date()
          }
        });
      }

      // Log successful tracking
      strapi.log.info(`Article view tracked: ${documentId}, total views: ${articleView.views}`);

      return ctx.send({
        success: true,
        views: articleView.views,
        documentId: documentId
      });
    } catch (error) {
      strapi.log.error('Error incrementing article views:', {
        documentId,
        error: error.message,
        stack: error.stack
      });
      return ctx.internalServerError('Failed to increment views');
    }
  }
}));
