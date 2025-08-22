/**
 * home-page controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::home-page.home-page', ({ strapi }) => ({
  async find(ctx) {
    try {
      // First, try to find any home page document
      const entities = await strapi.documents('api::home-page.home-page').findMany({
        populate: {
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
                  sidebarArticles: {
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
                  mostReadArticles: {
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
                  categories: true
                }
              }
            }
          },
          seo: {
            populate: ['og_image']
          }
        }
      });

      if (!entities || entities.length === 0) {
        strapi.log.info('No home page found, creating empty response');
        return this.transformResponse({ blocks: [] });
      }

      // Use the first (and likely only) home page
      const entity = entities[0];
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      strapi.log.error('Error fetching home page:', error);
      return ctx.internalServerError('Unable to fetch home page');
    }
  }
}));
