import { strapi } from "@strapi/client";
import { getStrapiURL } from "./utils";
import { GlobalData, NewsletterPageData } from "./types";

const PATH = "/api";
const STRAPI_BASE_URL = getStrapiURL();
const url = new URL(PATH, STRAPI_BASE_URL);

const client = strapi({ baseURL: url.toString() });

// =====================
// HELPER FUNCTIONS
// =====================

// Helper function to get current date filter to exclude future content
function getCurrentDateFilter() {
  return {
    publish_date: { $lte: new Date().toISOString() }
  };
}

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

  const filters: any = {
    ...getCurrentDateFilter()
  };

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
    filters: {
      slug: { $eq: slug },
      ...getCurrentDateFilter()
    },
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
    filters: {
      slug: { $eq: slug },
      ...getCurrentDateFilter()
    },
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
        { documentId: { $ne: articleId } },
        { category: { slug: { $eq: categorySlug } } },
        getCurrentDateFilter()
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

let globalDataCache: GlobalData | null = null;
let globalDataCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getGlobalCached(): Promise<GlobalData | null> {
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
                fields: ["label", "url", "openInNewTab", "order", "onHeader", "onSideBar"]
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
  globalDataCache = (response?.data as unknown as GlobalData) || null;
  globalDataCacheTime = now;

  return globalDataCache;
}

// Non-cached version for when fresh data is needed
export async function getGlobal(): Promise<GlobalData | null> {
  try {
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
                  fields: ["label", "url", "openInNewTab", "order", "onHeader", "onSideBar"]
                }
              }
            },
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

    if (response && response.data) {
      return response.data as unknown as GlobalData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching global data:", error);
    return null;
  }
}

// =====================
// BULK OPERATIONS
// =====================

// Get multiple articles by IDs in a single request
export async function getArticlesByIds(ids: string[]) {
  const query = {
    filters: {
      $and: [
        { id: { $in: ids } },
        getCurrentDateFilter()
      ]
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
          $and: [
            {
              $or: [
                { title: { $containsi: searchTerm } },
                { description: { $containsi: searchTerm } }
              ]
            },
            getCurrentDateFilter()
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

// =====================
// MAGAZINE ISSUE FUNCTIONS (OPTIMIZED)
// =====================

// Minimal population for magazine listings
const MAGAZINE_LIST_POPULATE = {
  cover_image: {
    fields: ["url", "alternativeText", "width", "height"]
  },
  pdf_attachment: {
    fields: ["name", "url"]
  }
};

// Full population for magazine detail pages
const MAGAZINE_DETAIL_POPULATE = {
  cover_image: {
    fields: ["url", "alternativeText", "width", "height"]
  },
  pdf_attachment: {
    fields: ["name", "url"]
  },
  articles: {
    filters: getCurrentDateFilter(),
    fields: ['title', 'slug', 'description', 'publish_date', 'is_featured'],
    populate: {
      cover_image: {
        fields: ["url", "alternativeText", "width", "height"]
      },
      author: {
        fields: ['name']
      }
    }
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

export async function getMagazineIssuesOptimized() {
  const query = {
    filters: getCurrentDateFilter(),
    sort: ['issue_number:desc'],
    populate: MAGAZINE_LIST_POPULATE
  };

  const issues = await client.collection("magazine-issues").find(query);
  return issues;
}

export async function getMagazineIssueBySlugOptimized(slug: string) {
  const query = {
    filters: {
      slug: { $eq: slug },
      ...getCurrentDateFilter()
    },
    populate: MAGAZINE_DETAIL_POPULATE
  };

  try {
    const response = await client.collection("magazine-issues").find(query);
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching magazine issue:", error);
    return null;
  }
}

export async function getFeaturedMagazineIssuesOptimized(limit?: number) {
  const query = {
    filters: {
      is_featured: { $eq: true },
      ...getCurrentDateFilter()
    },
    sort: ['publish_date:desc'],
    ...(limit && { pagination: { limit } }),
    populate: MAGAZINE_LIST_POPULATE
  };

  const issues = await client.collection("magazine-issues").find(query);
  return issues;
}

// =====================
// NEWSLETTER PAGE FUNCTIONS (OPTIMIZED)
// =====================

// Minimal population for newsletter page (for SEO metadata only)
const NEWSLETTER_PAGE_SEO_POPULATE = {
  seo: {
    fields: ["meta_title", "meta_description", "meta_keywords"],
    populate: {
      og_image: {
        fields: ["url", "alternativeText", "width", "height"]
      }
    }
  }
};

// Full population for newsletter page
const NEWSLETTER_PAGE_FULL_POPULATE = {
  seo: {
    fields: ["meta_title", "meta_description", "meta_keywords"],
    populate: {
      og_image: {
        fields: ["url", "alternativeText", "width", "height"]
      }
    }
  },
  heroSection: {
    fields: ["title", "subtitle", "backgroundColor"],
    populate: {
      newsletterCategories: {
        fields: ["name", "content"]
      }
    }
  },
  subscriptionSection: {
    fields: [
      "formTitle",
      "formSubtitle",
      "emailPlaceholder",
      "namePlaceholder",
      "submitButtonText",
      "loadingText",
      "successTitle",
      "successMessage",
      "privacyPolicyText",
      "termsOfServiceText",
      "privacyPolicyUrl",
      "termsOfServiceUrl"
    ],
    populate: {
      mainImage: {
        fields: ["url", "alternativeText", "width", "height"]
      },
      features: {
        fields: ["icon", "text"]
      }
    }
  }
};

// Get newsletter page data with full population
export async function getNewsletterPageDataOptimized(): Promise<NewsletterPageData | null> {
  try {
    const response = await client.single("newsletter-page").find({
      populate: NEWSLETTER_PAGE_FULL_POPULATE
    });

    if (response && response.data) {
      return response.data as unknown as NewsletterPageData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching newsletter page data:", error);
    return null;
  }
}

// Get newsletter page data for SEO only (lighter payload)
export async function getNewsletterPageSEOOptimized(): Promise<Pick<NewsletterPageData, 'seo' | 'id' | 'documentId'> | null> {
  try {
    const response = await client.single("newsletter-page").find({
      fields: ["id", "documentId"],
      populate: NEWSLETTER_PAGE_SEO_POPULATE
    });

    if (response && response.data) {
      return response.data as unknown as Pick<NewsletterPageData, 'seo' | 'id' | 'documentId'>;
    }
    return null;
  } catch (error) {
    console.error("Error fetching newsletter page SEO data:", error);
    return null;
  }
}

// =====================
// CACHED NEWSLETTER PAGE DATA
// =====================

let newsletterPageCache: NewsletterPageData | null = null;
let newsletterPageCacheTime = 0;
const NEWSLETTER_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function getNewsletterPageCached(): Promise<NewsletterPageData | null> {
  const now = Date.now();

  // Return cached data if still valid
  if (newsletterPageCache && (now - newsletterPageCacheTime) < NEWSLETTER_CACHE_DURATION) {
    return newsletterPageCache;
  }

  // Fetch fresh data
  const freshData = await getNewsletterPageDataOptimized();

  // Update cache
  newsletterPageCache = freshData;
  newsletterPageCacheTime = now;

  return freshData;
}
