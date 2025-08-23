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
            articles.sort((a: any, b: any) => (b.views || 0) - (a.views || 0));
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
