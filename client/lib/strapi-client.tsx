import { strapi } from "@strapi/client";
import { getStrapiURL } from "./utils";
import { Article, Author, Category, GlobalData, MagazineIssue } from "./types";

const PATH = "/api";
const STRAPI_BASE_URL = getStrapiURL();
const url = new URL(PATH, STRAPI_BASE_URL);

const client = strapi({ baseURL: url.toString() });

// =====================
// ARTICLE FUNCTIONS
// =====================

export async function getAllArticles() {
  const articles = await client.collection("articles").find();
  return articles;
}

export async function getArticleBySlug(slug: string, status: "draft" | "published" = "published") {
  console.log(slug, "slug")
  const article = await client.collection("articles").find({
    filters: { slug: { $eq: slug } },
    status: status,
  });
  return article;
}

// Get featured articles
export async function getFeaturedArticles(limit?: number) {
  const query = {
    filters: { is_featured: { $eq: true } },
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
      category: {
        slug: { $eq: categorySlug }
      }
    },
    sort: ['publish_date:desc'],
    ...(limit && page ? { pagination: { page, pageSize: limit } } : limit ? { pagination: { limit } } : {}),
  };

  const articles = await client.collection("articles").find(query);
  return articles;
}

// Get articles by author non
export async function getArticlesByAuthor(authorId: string, limit?: number) {
  const query = {
    filters: {
      author: {
        id: { $eq: authorId }
      }
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
      newsletters: {
        id: { $eq: newsletterId }
      }
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
      $or: [
        { title: { $containsi: searchTerm } },
        { description: { $containsi: searchTerm } }
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
        { id: { $ne: articleId } },
        { category: { slug: { $eq: categorySlug } } }
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
      category: {
        slug: { $eq: categorySlug }
      }
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
      publish_date: {
        $gte: startDate,
        $lte: endDate
      }
    },
    sort: ['publish_date:desc'],
  };

  const articles = await client.collection("articles").find(query);
  return articles;
}

// Get article with full population (all relations and media)
export async function getArticleWithFullPopulation(slug: string, status: "draft" | "published" = "published") {
  const query = {
    filters: { slug: { $eq: slug } },
    status: status,
    populate: {
      cover_image: {
        fields: ["name", "alternativeText", "url", "width", "height"]
      },
      category: {
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

export async function getAuthorById(id: string) {
  const query = {
    filters: { id: { $eq: id } },
    populate: {
      avatar: {
        fields: ["url", "alternativeText", "width", "height"]
      },
      articles: {
        fields: ['title', 'slug', 'publish_date', 'is_featured'],
        populate: {
          cover_image: {
            fields: ["url", "alternativeText", "width", "height"]
          }
        }
      }
    }
  };

  const response = await client.collection("authors").find(query);
  if (response && Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0];
  }
  return null;
}

// =====================
// MAGAZINE ISSUE FUNCTIONS
// =====================

export async function getAllMagazineIssues() {
  const issues = await client.collection("magazine-issues").find({
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
    filters: { slug: { $eq: slug } },
    populate: {
      cover_image: {
        fields: ["url", "alternativeText", "width", "height"]
      },
      pdf_attachment: {
        fields: ["name", "url"]
      },
      articles: {
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
    filters: { is_featured: { $eq: true } },
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
        $or: [
          { title: { $containsi: searchTerm } },
          { description: { $containsi: searchTerm } }
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