import { strapi } from "@strapi/client";
import { getStrapiURL } from "./utils";

const PATH = "/api";
const STRAPI_BASE_URL = getStrapiURL();
const url = new URL(PATH, STRAPI_BASE_URL);

const client = strapi({ baseURL: url.toString() });

// =====================
// OPTIMIZED POPULATION STRATEGIES
// =====================

// Minimal population for article listings
const ARTICLE_LIST_POPULATE = {
  cover_image: {
    fields: ["url", "alternativeText", "width", "height"]
  },
  category: {
    fields: ["name", "slug"]
  },
  author: {
    fields: ["name", "jobTitle"],
    populate: {
      avatar: {
        fields: ["url", "alternativeText"]
      }
    }
  }
};

// Full population for article detail pages
const ARTICLE_DETAIL_POPULATE = {
  cover_image: {
    fields: ["name", "alternativeText", "url", "width", "height"]
  },
  category: {
    fields: ["name", "slug", "description"],
    populate: {
      SEO: {
        fields: ["meta_title", "meta_description"]
      }
    }
  },
  author: {
    fields: ["name", "email", "jobTitle", "organization", "linkedin_url"],
    populate: {
      avatar: {
        fields: ["url", "alternativeText", "width", "height"]
      }
    }
  },
  blocks: {
    populate: true // Only populate when needed for detail view
  },
  SEO: {
    fields: ["meta_title", "meta_description", "meta_keywords"],
    populate: {
      og_image: {
        fields: ["url", "alternativeText", "width", "height"]
      }
    }
  }
};

// SEO-only population for metadata generation
const ARTICLE_SEO_POPULATE = {
  cover_image: {
    fields: ["url", "alternativeText", "width", "height"]
  },
  category: {
    fields: ["name", "slug"]
  },
  author: {
    fields: ["name"]
  },
  SEO: {
    fields: ["meta_title", "meta_description", "meta_keywords"],
    populate: {
      og_image: {
        fields: ["url", "alternativeText", "width", "height"]
      }
    }
  }
};

// =====================
// OPTIMIZED FUNCTIONS
// =====================

// Get articles for listing pages (minimal data)
export async function getArticlesOptimized(options: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  featured?: boolean;
  authorId?: string;
} = {}) {
  const { page = 1, pageSize = 12, categorySlug, featured, authorId } = options;

  const filters: any = {};

  if (categorySlug) {
    filters.category = { slug: { $eq: categorySlug } };
  }

  if (featured) {
    filters.is_featured = { $eq: true };
  }

  if (authorId) {
    filters.author = { id: { $eq: authorId } };
  }

  const query = {
    filters,
    sort: ['publish_date:desc'],
    pagination: { page, pageSize },
    populate: ARTICLE_LIST_POPULATE
  };

  return await client.collection("articles").find(query);
}

// Get single article for detail page
export async function getArticleForDetail(slug: string, status: "draft" | "published" = "published") {
  const query = {
    filters: { slug: { $eq: slug } },
    status: status,
    populate: ARTICLE_DETAIL_POPULATE
  };

  const response = await client.collection("articles").find(query);
  if (response && Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0];
  }
  return null;
}

// Get article for SEO metadata only
export async function getArticleForSEO(slug: string, status: "draft" | "published" = "published") {
  const query = {
    filters: { slug: { $eq: slug } },
    status: status,
    populate: ARTICLE_SEO_POPULATE
  };

  const response = await client.collection("articles").find(query);
  if (response && Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0];
  }
  return null;
}

// =====================
// PARALLEL DATA FETCHING
// =====================

// Fetch multiple data types in parallel for article page
export async function getArticlePageData(slug: string) {
  const [article, relatedArticlesResponse] = await Promise.all([
    getArticleForDetail(slug),
    // Only fetch related articles if we have the article
    getArticleForDetail(slug).then(async (art) => {
      if (art?.category?.slug) {
        return getRelatedArticlesOptimized(art.id, art.category.slug, 3);
      }
      return null;
    })
  ]);

  return {
    article,
    relatedArticles: relatedArticlesResponse?.data || []
  };
}

// Get related articles with minimal data
export async function getRelatedArticlesOptimized(articleId: string, categorySlug: string, limit: number = 3) {
  const query = {
    filters: {
      $and: [
        { id: { $ne: articleId } },
        { category: { slug: { $eq: categorySlug } } }
      ]
    },
    sort: ['publish_date:desc'],
    pagination: { limit },
    populate: ARTICLE_LIST_POPULATE
  };

  return await client.collection("articles").find(query);
}

// =====================
// CACHED GLOBAL DATA
// =====================

let globalDataCache: any = null;
let globalDataCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getGlobalCached() {
  const now = Date.now();

  // Return cached data if still valid
  if (globalDataCache && (now - globalDataCacheTime) < CACHE_DURATION) {
    return globalDataCache;
  }

  // Fetch minimal global data
  const response = await client.single("global").find({
    populate: {
      favicon: {
        fields: ["url", "alternativeText"]
      },
      defaultSeo: {
        fields: ["meta_title", "meta_description", "meta_keywords"],
        populate: {
          og_image: {
            fields: ["url", "alternativeText", "width", "height"]
          }
        }
      },
      header: {
        populate: {
          logo: {
            populate: {
              logoImage: {
                fields: ["url", "alternativeText", "width", "height"]
              }
            }
          },
          navigation: {
            populate: {
              primaryMenuItems: {
                fields: ["label", "url", "openInNewTab", "isActive", "order"]
              }
            }
          }
        }
      },
      footer: {
        populate: {
          logo: {
            populate: {
              logoImage: {
                fields: ["url", "alternativeText", "width", "height"]
              },
              mobileImage: {
                fields: ["url", "alternativeText", "width", "height"]
              }
            }
          },
          socialLinks: {
            populate: {
              link: {
                fields: ["text", "href", "openInNewTab"]
              }
            }
          },
          bottomLinks: {
            populate: {
              link: {
                fields: ["text", "href", "openInNewTab"]
              }
            }
          },
          copyright: {
            fields: ["companyName", "year", "allRightsReserved", "customText", "showCurrentYear"]
          }
        }
      }
    }
  });

  // Update cache
  globalDataCache = response?.data || null;
  globalDataCacheTime = now;

  return globalDataCache;
}

// =====================
// BULK OPERATIONS
// =====================

// Get multiple articles by IDs in a single request
export async function getArticlesByIds(ids: string[]) {
  const query = {
    filters: {
      id: { $in: ids }
    },
    populate: ARTICLE_LIST_POPULATE
  };

  return await client.collection("articles").find(query);
}

// Search with optimized population
export async function searchOptimized(searchTerm: string, contentTypes: string[] = ['articles'], limit: number = 10) {
  const results: any = {
    articles: [],
    categories: [],
    authors: []
  };

  const promises = [];

  if (contentTypes.includes('articles')) {
    promises.push(
      client.collection("articles").find({
        filters: {
          $or: [
            { title: { $containsi: searchTerm } },
            { description: { $containsi: searchTerm } }
          ]
        },
        sort: ['publish_date:desc'],
        pagination: { limit },
        populate: ARTICLE_LIST_POPULATE
      }).then(res => {
        results.articles = res?.data || [];
      })
    );
  }

  if (contentTypes.includes('categories')) {
    promises.push(
      client.collection("categories").find({
        filters: {
          $or: [
            { name: { $containsi: searchTerm } },
            { description: { $containsi: searchTerm } }
          ]
        },
        sort: ['name:asc'],
        pagination: { limit },
        populate: {
          // Minimal category data
          parent_category: {
            fields: ['name', 'slug']
          }
        }
      }).then(res => {
        results.categories = res?.data || [];
      })
    );
  }

  if (contentTypes.includes('authors')) {
    promises.push(
      client.collection("authors").find({
        filters: {
          name: { $containsi: searchTerm }
        },
        sort: ['name:asc'],
        pagination: { limit },
        populate: {
          avatar: {
            fields: ["url", "alternativeText"]
          }
        }
      }).then(res => {
        results.authors = res?.data || [];
      })
    );
  }

  await Promise.all(promises);
  return results;
}

// =====================
// CATEGORY FUNCTIONS
// =====================

export async function getAllCategories() {
  const categories = await client.collection("categories").find({
    sort: ['name:asc'],
    populate: {
      parent_category: {
        fields: ['name', 'slug']
      },
      children_categories: {
        fields: ['name', 'slug']
      }
    }
  });
  return categories;
}

export async function getCategoryBySlug(slug: string) {
  const query = {
    filters: { slug: { $eq: slug } },
    populate: {
      parent_category: {
        fields: ['name', 'slug']
      },
      children_categories: {
        fields: ['name', 'slug', 'description']
      },
      SEO: {
        fields: ["meta_title", "meta_description", "meta_keywords"]
      }
    }
  };

  const response = await client.collection("categories").find(query);
  if (response && Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0];
  }
  return null;
}

// =====================
// PAGE FUNCTIONS
// =====================

export async function getAllPages() {
  const query = {
    fields: ['slug', 'title'],
    sort: ['createdAt:desc'],
  };

  const pages = await client.collection("pages").find(query);
  return pages;
}

export async function getPageBySlug(slug: string) {
  const query = {
    filters: {
      slug: { $eq: slug },
    },
    populate: ["SEO", "blocks"],
  };

  try {
    const response = await client.collection("pages").find(query);

    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}
