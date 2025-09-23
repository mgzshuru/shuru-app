/**
 * article-view controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article-view.article-view', ({ strapi }) => ({
  async find(ctx) {
    // Custom find method to ensure article data is properly populated
    const { query } = ctx;
    
    try {
      // Get the standard response first
      const { data, meta } = await super.find(ctx);
      
      // Filter out any entries where the article relation is null or invalid
      const validData = data.filter(item => item.article && item.article.id);
      
      // Update meta to reflect the actual count after filtering
      const updatedMeta = {
        ...meta,
        pagination: {
          ...meta.pagination,
          total: validData.length,
          pageCount: Math.ceil(validData.length / (meta.pagination.limit || 25))
        }
      };
      
      return { data: validData, meta: updatedMeta };
    } catch (error) {
      strapi.log.error('Error in article-view find:', error);
      return ctx.internalServerError('Failed to fetch article views');
    }
  },

  // Clean up orphaned article-view records
  async cleanupOrphanedViews(ctx) {
    try {
      // Find all article-view records
      const allViews = await strapi.db.query('api::article-view.article-view').findMany({
        populate: ['article']
      });

      const orphanedViews = [];
      const validViews = [];

      // Check each view record
      for (const view of allViews) {
        if (!view.article || !view.article.id) {
          orphanedViews.push(view.id);
        } else {
          // Double-check if the article still exists
          const article = await strapi.documents('api::article.article').findOne({
            documentId: view.article.documentId
          });
          
          if (!article) {
            orphanedViews.push(view.id);
          } else {
            validViews.push(view);
          }
        }
      }

      // Delete orphaned records
      if (orphanedViews.length > 0) {
        await strapi.db.query('api::article-view.article-view').deleteMany({
          where: {
            id: {
              $in: orphanedViews
            }
          }
        });
      }

      return ctx.send({
        success: true,
        message: `Cleaned up ${orphanedViews.length} orphaned article-view records`,
        orphanedCount: orphanedViews.length,
        validCount: validViews.length
      });
    } catch (error) {
      strapi.log.error('Error cleaning up orphaned views:', error);
      return ctx.internalServerError('Failed to cleanup orphaned views');
    }
  }
}));