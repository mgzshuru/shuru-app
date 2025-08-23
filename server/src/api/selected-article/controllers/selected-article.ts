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

    // If displayOrder is not manual, sort the articles accordingly
    if (data?.attributes?.articles?.data && data.attributes.displayOrder !== 'manual') {
      const articles = data.attributes.articles.data;

      switch (data.attributes.displayOrder) {
        case 'newest':
          articles.sort((a: any, b: any) => new Date(b.attributes.publishedAt).getTime() - new Date(a.attributes.publishedAt).getTime());
          break;
        case 'oldest':
          articles.sort((a: any, b: any) => new Date(a.attributes.publishedAt).getTime() - new Date(b.attributes.publishedAt).getTime());
          break;
        case 'mostRead':
          articles.sort((a: any, b: any) => (b.attributes.views || 0) - (a.attributes.views || 0));
          break;
        default:
          // manual order - keep as is
          break;
      }

      // Limit articles based on maxArticles setting
      const maxArticles = data.attributes.maxArticles || 3;
      data.attributes.articles.data = articles.slice(0, maxArticles);
    }

    return { data, meta };
  }
}));
