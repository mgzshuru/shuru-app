/**
 * `home-page-populate` middleware
 */

import type { Core } from "@strapi/strapi";

const populateQuery = {
  blocks: {
    on: {
      'home.hero-complex-section': {
        populate: {
          featuredArticle: {
            populate: {
              categories: {
                fields: ['name', 'slug']
              },
              cover_image: {
                fields: ['url', 'alternativeText', 'width', 'height']
              }
            }
          },
          sidebarArticles: {
            populate: {
              categories: {
                fields: ['name', 'slug']
              },
              cover_image: {
                fields: ['url', 'alternativeText', 'width', 'height']
              }
            }
          },
          mostReadArticles: {
            populate: {
              categories: {
                fields: ['name', 'slug']
              },
              cover_image: {
                fields: ['url', 'alternativeText', 'width', 'height']
              }
            }
          }
        },
        fields: ['title', 'subtitle', 'showMostRead', 'maxSidebarArticles', 'maxMostReadArticles']
      },
      'home.article-grid-section': {
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
          },
          category: {
            fields: ['name', 'slug', 'description']
          }
        }
      },
      'home.featured-categories-section': {
        populate: {
          categories: {
            fields: ['name', 'slug', 'description']
          }
        }
      }
    }
  },
  seo: {
    populate: ['og_image']
  }
};
export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const { method, path } = ctx.request;

    // Only apply to GET requests for home-page
    if (method !== 'GET' || !path.includes('home-page')) {
      return await next();
    }

    strapi.log.info('Applying home-page population middleware for path:', path);

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