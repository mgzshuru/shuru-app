import { strapi } from "@strapi/client";
import { getStrapiURL } from "./utils";
import { GlobalData, NewsletterPageData, ContactPageData } from "./types";

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
  categories: {
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
  categories: {
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
  categories: {
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
    // Get the category and its children to include articles from child categories
    const category = await getCategoryBySlug(categorySlug);

    if (category) {
      const categorySlugs = [categorySlug];

      // Add child category slugs if they exist
      if (category.children_categories && category.children_categories.length > 0) {
        const childSlugs = category.children_categories.map((child: any) => child.slug);
        categorySlugs.push(...childSlugs);
      }

      // Use $or to match articles from parent category or any child category
      filters.categories = {
        slug: { $in: categorySlugs }
      };
    } else {
      // Fallback to original behavior if category not found
      filters.categories = { slug: { $eq: categorySlug } };
    }
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
      if (art?.categories?.[0]?.slug) {
        return getRelatedArticlesOptimized(art.id, art.categories[0].slug, 3);
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
        { categories: { slug: { $eq: categorySlug } } },
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
      },
      articles: {
        fields: ['title', 'slug', 'publish_date'],
        populate: {
          cover_image: {
            fields: ['url', 'alternativeText']
          }
        }
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
        fields: ["meta_title", "meta_description", "meta_keywords"],
        populate: {
          og_image: {
            fields: ["url", "alternativeText", "width", "height"]
          }
        }
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
  console.log(`Fetching page with slug: ${slug}`);

  // Try query with deep populate for SEO
  const deepQuery = {
    filters: {
      slug: { $eq: slug },
    },
    populate: {
      SEO: {
        populate: {
          og_image: true
        }
      },
      blocks: true
    }
  };

  try {
    console.log(`Attempting deep query for ${slug}`);
    const response = await client.collection("pages").find(deepQuery);
    console.log(`Page response for ${slug}:`, JSON.stringify(response, null, 2));

    if (response && Array.isArray(response.data) && response.data.length > 0) {
      const pageData = response.data[0];
      console.log(`Found page with title: ${pageData.title}`);
      console.log(`SEO og_image data:`, pageData.SEO?.og_image);
      return pageData;
    }

    console.log(`No page found with slug: ${slug}`);
    return null;
  } catch (error) {
    console.error(`Error fetching page with deep query ${slug}:`, error);

    // Fallback to specific populate with fields
    try {
      console.log(`Attempting specific query for ${slug}`);
      const specificQuery = {
        filters: {
          slug: { $eq: slug },
        },
        populate: {
          SEO: {
            fields: ["meta_title", "meta_description", "meta_keywords"],
            populate: {
              og_image: {
                fields: ["url", "alternativeText", "width", "height"]
              }
            }
          },
          blocks: {
            populate: true
          }
        }
      };

      const specificResponse = await client.collection("pages").find(specificQuery);
      console.log(`Specific response for ${slug}:`, JSON.stringify(specificResponse, null, 2));

      if (specificResponse && Array.isArray(specificResponse.data) && specificResponse.data.length > 0) {
        const pageData = specificResponse.data[0];
        console.log(`Found page with specific query - title: ${pageData.title}`);
        console.log(`SEO og_image data:`, pageData.SEO?.og_image);
        return pageData;
      }

      console.log(`No page found with specific query for slug: ${slug}`);
      return null;
    } catch (specificError) {
      console.error(`Specific query failed for slug ${slug}:`, specificError);

      // Fallback to minimal populate
      try {
        console.log(`Attempting minimal query for ${slug}`);
        const minimalQuery = {
          filters: {
            slug: { $eq: slug },
          },
          populate: "*"
        };

        const minimalResponse = await client.collection("pages").find(minimalQuery);
        console.log(`Minimal response for ${slug}:`, JSON.stringify(minimalResponse, null, 2));

        if (minimalResponse && Array.isArray(minimalResponse.data) && minimalResponse.data.length > 0) {
          const pageData = minimalResponse.data[0];
          console.log(`Found page with minimal query - title: ${pageData.title}`);
          return pageData;
        }

        console.log(`No page found with minimal query for slug: ${slug}`);
        return null;
      } catch (fallbackError) {
        console.error(`Minimal query also failed for slug ${slug}:`, fallbackError);

        // Final fallback without populate
        try {
          console.log(`Attempting fallback query without populate for ${slug}`);
          const fallbackQuery = {
            filters: {
              slug: { $eq: slug },
            }
          };

          const fallbackResponse = await client.collection("pages").find(fallbackQuery);
          console.log(`Fallback response for ${slug}:`, JSON.stringify(fallbackResponse, null, 2));

          if (fallbackResponse && Array.isArray(fallbackResponse.data) && fallbackResponse.data.length > 0) {
            const pageData = fallbackResponse.data[0];
            console.log(`Found page with fallback query - title: ${pageData.title}`);
            return pageData;
          }

          console.log(`No page found with fallback query for slug: ${slug}`);
          return null;
        } catch (finalError) {
          console.error(`All queries failed for slug ${slug}:`, finalError);
          return null;
        }
      }
    }
  }
}// =====================
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

// =====================
// CONTACT PAGE FUNCTIONS (OPTIMIZED)
// =====================

// Contact page cache
let contactPageCache: ContactPageData | null = null;
let contactPageCacheTime = 0;
const CONTACT_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Minimal population for contact page SEO only
const CONTACT_PAGE_SEO_POPULATE = {
  seo: {
    fields: ["meta_title", "meta_description", "meta_keywords"],
    populate: {
      og_image: {
        fields: ["url", "alternativeText", "width", "height"]
      }
    }
  }
};

// Full population for contact page
const CONTACT_PAGE_FULL_POPULATE = {
  seo: {
    fields: ["meta_title", "meta_description", "meta_keywords"],
    populate: {
      og_image: {
        fields: ["url", "alternativeText", "width", "height"]
      }
    }
  },
  heroSection: {
    populate: {
      backgroundImage: {
        fields: ["url", "alternativeText", "width", "height"]
      }
    }
  },
  contactInformation: {
    populate: {
      emails: true,
      phones: true,
      addresses: true,
      officeHours: true,
      socialLinks: true
    }
  },
  formSettings: true,
  additionalSections: {
    populate: {
      // Map section
      markers: true,
      // Office locations
      offices: {
        populate: {
          address: true,
          contact: true,
          officeHours: true,
          image: {
            fields: ["url", "alternativeText", "width", "height"]
          }
        }
      },
      // FAQ section
      faqs: true
    }
  }
};

// Get contact page data with full population
export async function getContactPageDataOptimized(): Promise<ContactPageData | null> {
  try {
    const response = await client.single("contact-page").find({
      populate: CONTACT_PAGE_FULL_POPULATE
    });

    if (response && response.data) {
      return response.data as unknown as ContactPageData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching contact page data:", error);
    return null;
  }
}

// Get contact page data for SEO only (lighter payload)
export async function getContactPageSEOOptimized(): Promise<Pick<ContactPageData, 'seo' | 'id' | 'documentId'> | null> {
  try {
    const response = await client.single("contact-page").find({
      fields: ["id", "documentId"],
      populate: CONTACT_PAGE_SEO_POPULATE
    });

    if (response && response.data) {
      return response.data as unknown as Pick<ContactPageData, 'seo' | 'id' | 'documentId'>;
    }
    return null;
  } catch (error) {
    console.error("Error fetching contact page SEO data:", error);
    return null;
  }
}

// Cached version for better performance
export async function getContactPageCached(): Promise<ContactPageData | null> {
  const now = Date.now();

  // Return cached data if still valid
  if (contactPageCache && (now - contactPageCacheTime) < CONTACT_CACHE_DURATION) {
    return contactPageCache;
  }

  // Fetch fresh data
  const freshData = await getContactPageDataOptimized();

  // Update cache
  contactPageCache = freshData;
  contactPageCacheTime = now;

  return freshData;
}

// =====================
// SUBMIT PAGE CONTENT FUNCTIONS (OPTIMIZED)
// =====================

// Submit page data types
export interface SubmitPageData {
  id: number;
  documentId: string;
  pageTitle: string;
  pageSubtitle?: string;
  headerIcon?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  emailStepTitle: string;
  emailStepDescription?: string;
  authorStepTitle: string;
  authorStepDescription?: string;
  articleStepTitle: string;
  articleStepDescription?: string;
  reviewStepTitle: string;
  reviewStepDescription?: string;
  successTitle: string;
  successMessage: string;
  successSteps?: Array<{
    stepText: string;
  }>;
  returnButtonText: string;
  guidelinesTitle: string;
  contentCriteriaTitle: string;
  contentCriteriaItems?: Array<{
    itemText: string;
  }>;
  reviewProcessTitle: string;
  reviewProcessItems?: Array<{
    itemText: string;
  }>;
  validationMessages?: any;
  systemMessages?: any;
  enableEmailCheck?: boolean;
  minWordCount?: number;
  maxWordCount?: number;
  maxFileSize?: number;
  allowedFileTypes?: string;
  termsAndConditionsUrl?: string;
  privacyPolicyUrl?: string;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: {
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
    };
  };
}

// Submit page cache
let submitPageCache: SubmitPageData | null = null;
let submitPageCacheTime = 0;
const SUBMIT_PAGE_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Full population for submit page
const SUBMIT_PAGE_FULL_POPULATE = {
  headerIcon: {
    fields: ['url', 'alternativeText', 'width', 'height']
  },
  successSteps: {
    fields: ['stepText']
  },
  contentCriteriaItems: {
    fields: ['itemText']
  },
  reviewProcessItems: {
    fields: ['itemText']
  },
  seo: {
    fields: ['meta_title', 'meta_description', 'meta_keywords'],
    populate: {
      og_image: {
        fields: ['url', 'alternativeText', 'width', 'height']
      }
    }
  }
};

// SEO-only population for submit page
const SUBMIT_PAGE_SEO_POPULATE = {
  seo: {
    fields: ['meta_title', 'meta_description', 'meta_keywords'],
    populate: {
      og_image: {
        fields: ['url', 'alternativeText', 'width', 'height']
      }
    }
  }
};

// Get submit page data with full population
export async function getSubmitPageDataOptimized(): Promise<SubmitPageData | null> {
  try {
    const response = await client.single("submit-page-content").find({
      populate: SUBMIT_PAGE_FULL_POPULATE
    });

    if (response && response.data) {
      return response.data as unknown as SubmitPageData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching submit page data:", error);
    return null;
  }
}

// Get submit page data for SEO only (lighter payload)
export async function getSubmitPageSEOOptimized(): Promise<Pick<SubmitPageData, 'seo' | 'id' | 'documentId'> | null> {
  try {
    const response = await client.single("submit-page-content").find({
      fields: ["id", "documentId"],
      populate: SUBMIT_PAGE_SEO_POPULATE
    });

    if (response && response.data) {
      return response.data as unknown as Pick<SubmitPageData, 'seo' | 'id' | 'documentId'>;
    }
    return null;
  } catch (error) {
    console.error("Error fetching submit page SEO data:", error);
    return null;
  }
}

// Cached version for better performance
export async function getSubmitPageCached(): Promise<SubmitPageData | null> {
  const now = Date.now();

  // Return cached data if still valid
  if (submitPageCache && (now - submitPageCacheTime) < SUBMIT_PAGE_CACHE_DURATION) {
    return submitPageCache;
  }

  // Fetch fresh data
  const freshData = await getSubmitPageDataOptimized();

  // Update cache
  submitPageCache = freshData;
  submitPageCacheTime = now;

  return freshData;
}
