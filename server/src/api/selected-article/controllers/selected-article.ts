/**
 *  selected-article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::selected-article.selected-article', ({ strapi }) => ({
  async find(ctx) {
    // Set up population for articles with their relations
    ctx.query = {
      ...ctx.query,
      populate: {
        articles: {
          populate: {
            categories: {
              fields: ['name', 'slug']
            },
            cover_image: {
              fields: ['url', 'alternativeText', 'width', 'height']
            },
            author: {
              fields: ['name', 'jobTitle'],
              populate: {
                avatar: {
                  fields: ['url', 'alternativeText']
                }
              }
            }
          }
        }
      }
    };

    // Get the basic populated data
    const { data, meta } = await super.find(ctx);

    // Apply article limiting and sorting
    if (data?.articles && Array.isArray(data.articles)) {
      let articles = [...data.articles];

      // Sort articles if displayOrder is not manual
      if (data.displayOrder !== 'manual') {
        switch (data.displayOrder) {
          case 'newest':
            articles.sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
            break;
          case 'oldest':
            articles.sort((a: any, b: any) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
            break;
          case 'mostRead':
            // Fetch view counts for all articles and sort by them
            const articleIds = articles.map((article: any) => article.id);
            const articleViews = await strapi.db.query('api::article-view.article-view').findMany({
              where: {
                article: { $in: articleIds }
              },
              select: ['article', 'views']
            });

            // Create a map of article ID to view count
            const viewsMap = new Map();
            articleViews.forEach((view: any) => {
              viewsMap.set(view.article, view.views);
            });

            // Sort articles by view count
            articles.sort((a: any, b: any) => {
              const aViews = viewsMap.get(a.id) || 0;
              const bViews = viewsMap.get(b.id) || 0;
              return bViews - aViews;
            });
            break;
          default:
            // manual order - keep as is
            break;
        }
      }

      // Limit articles based on maxArticles setting
      const maxArticles = data.maxArticles || 3;
      data.articles = articles.slice(0, maxArticles);

      strapi.log.info(`Selected articles: returning ${data.articles.length} of ${articles.length} articles (max: ${maxArticles})`);
    }

    return { data, meta };
  }
}));
