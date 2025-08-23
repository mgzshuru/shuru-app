/**
 * `selected-article-populate` middleware
 */

import type { Core } from "@strapi/strapi";

const populateQuery = {
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
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const { method, path } = ctx.request;

    // Only apply to GET requests for selected-article
    if (method !== 'GET' || !path.includes('selected-article')) {
      return await next();
    }

    strapi.log.info('Applying selected-article population middleware for path:', path);

    // Apply population strategy
    ctx.query = {
      ...ctx.query,
      populate: {
        ...ctx.query.populate,
        ...populateQuery,
      },
    };

    await next();
  };
};
