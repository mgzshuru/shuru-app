/**
 * `article-performance` middleware - Optimized population
 */

import type { Core } from "@strapi/strapi";

// Lightweight population for list views
const listPopulateQuery = {
  cover_image: {
    fields: ["url", "alternativeText", "width", "height"],
  },
  categories: {
    fields: ["name", "slug"],
  },
  author: {
    fields: ["name", "jobTitle"],
    populate: {
      avatar: {
        fields: ["url", "alternativeText"],
      },
    },
  },
};

// Full population for single article views
const detailPopulateQuery = {
  cover_image: {
    fields: ["name", "alternativeText", "url", "width", "height"],
  },
  categories: {
    fields: ["name", "slug", "description"],
    populate: {
      SEO: {
        fields: ["meta_title", "meta_description"],
      },
    },
  },
  author: {
    fields: ["name", "email", "jobTitle", "organization", "linkedin_url"],
    populate: {
      avatar: {
        fields: ["url", "alternativeText", "width", "height"],
      },
    },
  },
  blocks: {
    on: {
      "content.rich-text": {
        fields: ["content"],
      },
      "content.quote": {
        fields: ["quote_text", "author", "author_title", "style"],
      },
      "content.image": {
        fields: ["alt_text", "caption", "width"],
        populate: {
          image: {
            fields: ["url", "alternativeText", "width", "height"],
          },
        },
      },
      "content.video-embed": {
        fields: ["video_url", "title", "description", "autoplay"],
        populate: {
          thumbnail: {
            fields: ["url", "alternativeText", "width", "height"],
          },
        },
      },
      "content.code-block": {
        fields: ["code", "language", "title", "show_line_numbers"],
      },
      "content.gallery": {
        fields: ["title", "description", "layout", "columns"],
        populate: {
          images: {
            fields: ["name", "url", "alternativeText", "width", "height"],
          },
        },
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
        ],
      },
    },
  },
  SEO: {
    fields: ["meta_title", "meta_description", "meta_keywords"],
    populate: {
      og_image: {
        fields: ["url", "alternativeText", "width", "height"],
      },
    },
  },
  magazine_issues: {
    fields: ["title", "slug", "issue_number", "publish_date", "is_featured"],
    populate: {
      cover_image: {
        fields: ["url", "alternativeText", "width", "height"],
      },
    },
  },
  newsletters: {
    fields: ["subject", "slug", "sent_at"],
  },
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const { method, path } = ctx.request;

    // Only apply to GET requests for articles
    if (method !== 'GET' || !path.includes('/articles')) {
      return await next();
    }

    // Determine if this is a list or detail request
    const isDetailRequest = ctx.params?.id || ctx.query?.filters?.slug;
    const isListRequest = !isDetailRequest;

    // Apply appropriate population strategy
    if (isListRequest) {
      // Use lightweight population for lists
      ctx.query = {
        ...ctx.query,
        populate: {
          ...ctx.query.populate,
          ...listPopulateQuery,
        },
      };
    } else {
      // Use full population for detail views
      ctx.query = {
        ...ctx.query,
        populate: {
          ...ctx.query.populate,
          ...detailPopulateQuery,
        },
      };
    }

    await next();
  };
};
