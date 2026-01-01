import { strapi } from "@strapi/client";
import { getStrapiURL } from "./utils";
import { Article, Author, Category, GlobalData, MagazineIssue, NewsletterPageData, ContactMessage, ContactPageData } from "./types";

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
// ARTICLE FUNCTIONS
// =====================

export async function getAllArticles() {
  const articles = await client.collection("articles").find({
    filters: getCurrentDateFilter(),
    sort: ['publish_date:desc']
  });
  return articles;
}

export async function getArticleBySlug(slug: string, status: "draft" | "published" = "published") {
  console.log(slug, "slug")
  const article = await client.collection("articles").find({
    filters: {
      slug: { $eq: slug },
      ...getCurrentDateFilter()
    },
    status: status,
  });
  return article;
}

// Get featured articles
export async function getFeaturedArticles(limit?: number) {
  const query = {
    filters: {
      is_featured: { $eq: true },
      ...getCurrentDateFilter()
    },
    sort: ['publish_date:desc'],
    ...(limit && { pagination: { limit } }),
  };

  const articles = await client.collection("articles").find(query);
  return articles;
}

// Get articles by category non
export async function getArticlesByCategory(categorySlug: string, limit?: number, page?: number) {
  const query = {
    filters: {
      $and: [
        {
          categories: {
            slug: { $eq: categorySlug }
          }
        },
        getCurrentDateFilter()
      ]
    },
    sort: ['publish_date:desc'],
    ...(limit && page ? { pagination: { page, pageSize: limit } } : limit ? { pagination: { limit } } : {}),
  };

  const articles = await client.collection("articles").find(query);
  return articles;
}

// Get articles by author non
export async function getArticlesByAuthor(authorDocumentId: string, limit?: number) {
  const query = {
    filters: {
      $and: [
        {
          author: {
            documentId: { $eq: authorDocumentId }
          }
        },
        getCurrentDateFilter()
      ]
    },
    sort: ['publish_date:desc'],
    ...(limit && { pagination: { limit } }),
  };

  const articles = await client.collection("articles").find(query);
  return articles;
}

// Get articles featured in newsletters non
export async function getArticlesByNewsletter(newsletterId: string) {
  const query = {
    filters: {
      $and: [
        {
          newsletters: {
            id: { $eq: newsletterId }
          }
        },
        getCurrentDateFilter()
      ]
    },
    sort: ['publish_date:desc'],
  };

  const articles = await client.collection("articles").find(query);
  return articles;
}

// Search articles by title or description
export async function searchArticles(searchTerm: string, limit?: number) {
  const query = {
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
    ...(limit && { pagination: { limit } }),
  };

  const articles = await client.collection("articles").find(query);
  return articles;
}

// Get articles with pagination
export async function getArticlesPaginated(page: number = 1, pageSize: number = 10) {
  const query = {
    filters: getCurrentDateFilter(),
    sort: ['publish_date:desc'],
    pagination: {
      page,
      pageSize
    },
  };

  const articles = await client.collection("articles").find(query);
  return articles;
}

// Get related articles (by same category, excluding current article) non
export async function getRelatedArticles(articleId: string, categorySlug: string, limit: number = 3) {
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
  };

  const articles = await client.collection("articles").find(query);
  return articles;
}

// Get related articles from multiple categories
export async function getRelatedArticlesFromCategories(articleId: string, categorySlugs: string[], limit: number = 3) {
  if (categorySlugs.length === 0) return { data: [] };

  const query = {
    filters: {
      $and: [
        { documentId: { $ne: articleId } },
        {
          $or: categorySlugs.map(slug => ({
            categories: { slug: { $eq: slug } }
          }))
        },
        getCurrentDateFilter()
      ]
    },
    sort: ['publish_date:desc'],
    pagination: { limit },
  };

  const articles = await client.collection("articles").find(query);
  return articles;
}

// Get article count by category non
export async function getArticleCountByCategory(categorySlug: string) {
  const query = {
    filters: {
      $and: [
        {
          categories: {
            slug: { $eq: categorySlug }
          }
        },
        getCurrentDateFilter()
      ]
    },
    pagination: { limit: 1 },
  };

  const response = await client.collection("articles").find(query);
  return response.meta?.pagination?.total || 0;
}

// Get articles published in date range
export async function getArticlesByDateRange(startDate: string, endDate: string) {
  const query = {
    filters: {
      $and: [
        {
          publish_date: {
            $gte: startDate,
            $lte: endDate
          }
        },
        getCurrentDateFilter()
      ]
    },
    sort: ['publish_date:desc'],
  };

  const articles = await client.collection("articles").find(query);
  return articles;
}

// Get most read articles with proper population
export async function getMostReadArticles(limit: number = 10) {
  const query = {
    filters: {
      views: { $gt: 0 }
    },
    sort: ['views:desc'],
    pagination: { limit },
    populate: {
      article: {
        populate: {
          cover_image: {
            fields: ["url", "alternativeText", "width", "height"]
          },
          categories: {
            fields: ["name", "slug"]
          },
          author: {
            fields: ["name", "jobTitle", "organization"]
          }
        }
      }
    }
  };

  const response = await client.collection("article-views").find(query);

  // Transform the data to include views count with article data
  const articles = response.data?.map((item: any) => ({
    ...item.article,
    views: item.views
  })) || [];

  return articles;
}

// Get article with full population (all relations and media)
export async function getArticleWithFullPopulation(slug: string, status: "draft" | "published" = "published") {
  const query = {
    filters: {
      slug: { $eq: slug },
      ...getCurrentDateFilter()
    },
    status: status,
    populate: {
      cover_image: {
        fields: ["name", "alternativeText", "url", "width", "height"]
      },
      categories: {
        fields: ["name", "slug", "description"],
        populate: {
          SEO: true
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
      magazine_issues: {
        filters: getCurrentDateFilter(),
        fields: ["title", "slug", "issue_number", "publish_date", "is_featured"],
        populate: {
          cover_image: {
            fields: ["url", "alternativeText", "width", "height"]
          }
        }
      },
      newsletters: {
        fields: ["subject", "slug", "sent_at"]
      },
      SEO: {
        fields: ["meta_title", "meta_description", "meta_keywords"],
        populate: {
          og_image: {
            fields: ["url", "alternativeText", "width", "height"]
          }
        }
      },
      blocks: {
        on: {
          "content.rich-text": {
            fields: ["content"]
          },
          "content.quote": {
            fields: ["quote_text", "author", "author_title", "style"]
          },
          "content.image": {
            fields: ["alt_text", "caption", "width"],
            populate: {
              image: {
                fields: ["url", "alternativeText", "width", "height"]
              }
            }
          },
          "content.video-embed": {
            fields: ["video_url", "title", "description", "autoplay"],
            populate: {
              thumbnail: {
                fields: ["url", "alternativeText", "width", "height"]
              }
            }
          },
          "content.code-block": {
            fields: ["code", "language", "title", "show_line_numbers"]
          },
          "content.gallery": {
            fields: ["title", "description", "layout", "columns"],
            populate: {
              images: {
                fields: ["name", "url", "alternativeText", "width", "height"]
              }
            }
          },
          "content.call-to-action": {
            fields: [
              "title",
              "description",
              "button_text",
              "button_url",
              "style",
              "background_color",
              "open_in_new_tab"
            ]
          }
        }
      }
    }
  };

  const response = await client.collection("articles").find(query);
  if (response && Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0];
  }
  return null;
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
      SEO: true
    }
  });
  return categories;
}

export async function getCategoryBySlug(slug: string) {
  const query = {
    filters: { slug: { $eq: slug } },
    populate: {
      parent_category: {
        fields: ['name', 'slug', 'description']
      },
      children_categories: {
        fields: ['name', 'slug', 'description']
      },
      articles: {
        filters: getCurrentDateFilter(),
        fields: ['title', 'slug', 'publish_date', 'is_featured'],
        populate: {
          cover_image: {
            fields: ["url", "alternativeText", "width", "height"]
          }
        }
      },
      SEO: true
    }
  };

  const response = await client.collection("categories").find(query);
  if (response && Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0];
  }
  return null;
}

// Get root categories (no parent)
export async function getRootCategories() {
  const query = {
    filters: {
      parent_category: { $null: true }
    },
    sort: ['name:asc'],
    populate: {
      children_categories: {
        fields: ['name', 'slug', 'description']
      }
    }
  };

  const categories = await client.collection("categories").find(query);
  return categories;
}

// =====================
// AUTHOR FUNCTIONS
// =====================

export async function getAllAuthors() {
  const authors = await client.collection("authors").find({
    sort: ['name:asc'],
    populate: {
      avatar: {
        fields: ["url", "alternativeText", "width", "height"]
      }
    }
  });
  return authors;
}

export async function getAuthorById(documentId: string) {
  try {
    const response = await client.collection("authors").findOne(documentId, {
      fields: ["name", "email", "jobTitle", "organization", "phone_number", "linkedin_url", "bio"],
      populate: {
        avatar: {
          fields: ["url", "alternativeText", "width", "height"]
        }
      }
    });

    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching author by documentId:', error);
  }

  return null;
}

// =====================
// MAGAZINE ISSUE FUNCTIONS
// =====================

export async function getAllMagazineIssues() {
  const issues = await client.collection("magazine-issues").find({
    filters: getCurrentDateFilter(),
    sort: ['issue_number:desc'],
    populate: {
      cover_image: {
        fields: ["url", "alternativeText", "width", "height"]
      },
      pdf_attachment: {
        fields: ["name", "url"]
      },
      SEO: true
    }
  });
  return issues;
}

export async function getMagazineIssueBySlug(slug: string) {
  const query = {
    filters: {
      slug: { $eq: slug },
      ...getCurrentDateFilter()
    },
    populate: {
      cover_image: {
        fields: ["url", "alternativeText", "width", "height"]
      },
      pdf_attachment: {
        fields: ["name", "url"]
      },
      articles: {
        filters: getCurrentDateFilter(),
        fields: ['title', 'slug', 'publish_date', 'is_featured'],
        populate: {
          cover_image: {
            fields: ["url", "alternativeText", "width", "height"]
          },
          author: {
            fields: ['name']
          }
        }
      },
      SEO: true
    }
  };

  const response = await client.collection("magazine-issues").find(query);
  if (response && Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0];
  }
  return null;
}

export async function getFeaturedMagazineIssues(limit?: number) {
  const query = {
    filters: {
      is_featured: { $eq: true },
      ...getCurrentDateFilter()
    },
    sort: ['publish_date:desc'],
    ...(limit && { pagination: { limit } }),
    populate: {
      cover_image: {
        fields: ["url", "alternativeText", "width", "height"]
      }
    }
  };

  const issues = await client.collection("magazine-issues").find(query);
  return issues;
}



// =====================
// NEWSLETTER FUNCTIONS
// =====================

export async function getAllNewsletterEditions() {
  const newsletters = await client.collection("newsletter-editions").find({
    sort: ['sent_at:desc'],
    populate: {
      featured_articles: {
        filters: getCurrentDateFilter(),
        fields: ['title', 'slug'],
        populate: {
          cover_image: {
            fields: ["url", "alternativeText", "width", "height"]
          }
        }
      },
      pdf_archive: {
        fields: ["name", "url"]
      }
    }
  });
  return newsletters;
}

export async function getNewsletterEditionBySlug(slug: string) {
  const query = {
    filters: { slug: { $eq: slug } },
    populate: {
      featured_articles: {
        filters: getCurrentDateFilter(),
        populate: {
          cover_image: {
            fields: ["url", "alternativeText", "width", "height"]
          },
          author: {
            fields: ['name']
          }
        }
      },
      pdf_archive: {
        fields: ["name", "url"]
      }
    }
  };

  const response = await client.collection("newsletter-editions").find(query);
  if (response && Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0];
  }
  return null;
}

// =====================
// SUBSCRIBER FUNCTIONS
// =====================

export async function subscribe(email: string, name: string) {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          email: email,
          name: name,
          subscribed_at: new Date().toISOString(),
          is_verified: false
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// export async function checkSubscriptionStatus(email: string) {
//   try {
//     const response = await fetch(`${STRAPI_BASE_URL}/api/subscribers?filters[email][$eq]=${encodeURIComponent(email)}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       return { success: false, isSubscribed: false, error: `HTTP ${response.status}` };
//     }

//     const result = await response.json();
//     const isSubscribed = result.data && result.data.length > 0;

//     return {
//       success: true,
//       isSubscribed: isSubscribed,
//       subscriber: isSubscribed ? result.data[0] : null
//     };
//   } catch (error: any) {
//     return { success: false, isSubscribed: false, error: error.message };
//   }
// }

// =====================
// PAGE FUNCTIONS
// =====================

export async function getAllPages() {
  const query = {
    fields: ['slug', 'title'],
    sort: ['createdAt:desc'],
  };

  const pages = await client.collection("pages").find(query);
  console.log(pages, "pages")
  return pages;
}

export async function getPageBySlug(slug: string) {
  const query = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: ["SEO", "blocks"],
  };

  try {
    const response = await client.collection("pages").find(query);
    console.log(response, "response");

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
// NEWSLETTER PAGE FUNCTIONS
// =====================

export async function getNewsletterPageData(): Promise<NewsletterPageData | null> {
  try {
    const response = await client.single("newsletter-page").find({
      populate: {
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
      }
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

// =====================
// SEARCH & FILTER FUNCTIONS
// =====================

export interface SearchResults {
  articles: Article[];
  categories: Category[];
  authors: Author[];
  magazine_issues: MagazineIssue[];
}

export async function searchContent(searchTerm: string, contentTypes?: string[], limit?: number): Promise<SearchResults> {
  const results: SearchResults = {
    articles: [],
    categories: [],
    authors: [],
    magazine_issues: [],
  };

  const searchTypes = contentTypes || ['articles', 'categories', 'authors', 'magazine-issues'];

  // Search articles
  if (searchTypes.includes('articles')) {
    const articlesResult = await searchArticles(searchTerm, limit);
    results.articles = (articlesResult as any)?.data || [];
  }

  // Search categories
  if (searchTypes.includes('categories')) {
    const categoriesQuery = {
      filters: {
        $or: [
          { name: { $containsi: searchTerm } },
          { description: { $containsi: searchTerm } }
        ]
      },
      sort: ['name:asc'],
      ...(limit && { pagination: { limit } }),
    };
    const categoriesResult = await client.collection("categories").find(categoriesQuery);
    results.categories = (categoriesResult as any)?.data || [];
  }

  // Search authors
  if (searchTypes.includes('authors')) {
    const authorsQuery = {
      filters: {
        $or: [
          { name: { $containsi: searchTerm } },
          { organization: { $containsi: searchTerm } },
          { jobTitle: { $containsi: searchTerm } }
        ]
      },
      sort: ['name:asc'],
      ...(limit && { pagination: { limit } }),
    };
    const authorsResult = await client.collection("authors").find(authorsQuery);
    results.authors = (authorsResult as any)?.data || [];
  }

  // Search magazine issues
  if (searchTypes.includes('magazine-issues')) {
    const issuesQuery = {
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
      sort: ['issue_number:desc'],
      ...(limit && { pagination: { limit } }),
    };
    const issuesResult = await client.collection("magazine-issues").find(issuesQuery);
    results.magazine_issues = (issuesResult as any)?.data || [];
  }

  return results;
}

// =====================
// Home Page FUNCTIONS fetchHomePageData
// =====================
export async function fetchHomePageData() {
  try {
    const response = await client.single("home-page").find();

    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return null;
  }
}
// =====================
// GLOBAL FUNCTIONS
// =====================

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
            loginButton: {
              fields: ["text", "url"]
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
// SAVED ARTICLES FUNCTIONS
// =====================

export async function toggleSavedArticle(articleId: string, jwt: string) {
  try {
    const response = await fetch(`${getStrapiURL()}/api/saved-articles/toggle/${articleId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to toggle saved article');
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling saved article:', error);
    throw error;
  }
}

export async function checkArticleSaved(articleId: string, jwt: string) {
  try {
    const response = await fetch(`${getStrapiURL()}/api/saved-articles/check/${articleId}`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return { saved: false };
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking saved article:', error);
    return { saved: false };
  }
}

export async function getUserSavedArticles(jwt: string) {
  try {
    const response = await fetch(`${getStrapiURL()}/api/saved-articles/user`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saved articles');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching saved articles:', error);
    throw error;
  }
}

// =====================
// CONTACT MESSAGE FUNCTIONS
// =====================

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}) {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/api/contact-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          company: data.company || '',
          subject: data.subject,
          message: data.message,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =====================
// CONTACT PAGE FUNCTIONS
// =====================

export async function getContactPageData(): Promise<ContactPageData | null> {
  try {
    // Try with specific population first
    const response = await client.single("contact-page").find({
      populate: {
        seo: true,
        heroSection: true,
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
        additionalSections: true
      }
    });

    if (response && response.data) {
      return response.data as unknown as ContactPageData;
    }
    return null;
  } catch (error) {
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('404') || error.message.includes('not found')) {
        console.warn("Contact page not found. Please create content in Strapi admin panel.");
        return null;
      }
      if (error.message.includes('500') || error.message.includes('ValidationError')) {
        console.error("Strapi server error. Check server logs for details:", error.message);
        // Try a simpler query as fallback
        try {
          const simpleResponse = await client.single("contact-page").find();
          if (simpleResponse && simpleResponse.data) {
            return simpleResponse.data as unknown as ContactPageData;
          }
        } catch (fallbackError) {
          console.error("Fallback query also failed:", fallbackError);
        }
        return null;
      }
    }
    console.error("Error fetching contact page data:", error);
    return null;
  }
}

// Simple function to test connectivity
export async function testContactPageExists(): Promise<boolean> {
  try {
    const response = await client.single("contact-page").find();
    return !!response;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('404') || error.message.includes('not found'))) {
      console.warn("Contact page Single Type exists but no content created yet.");
      return true; // Content type exists, just no content
    }
    console.error("Contact page Single Type does not exist or is not accessible:", error);
    return false;
  }
}

// Test with minimal population
export async function getContactPageDataSimple(): Promise<any> {
  try {
    const response = await client.single("contact-page").find();
    return response?.data || null;
  } catch (error) {
    console.error("Simple contact page fetch failed:", error);
    return null;
  }
}