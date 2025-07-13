/**
 * `article-populate` middleware
 */

import type { Core } from "@strapi/strapi";

const populateQuery = {
  cover_image: { // Changed from 'cover' to 'cover_image'
    fields: ["name", "alternativeText", "url", "width", "height"],
  },
  category: {
    fields: ["name", "slug", "description"],
    populate: {
      SEO: true, // Add SEO if needed
    },
  },
  author: {
    fields: ["name", "email", "jobTitle", "organization", "linkedin_url"], // Added missing fields
    populate: {
      avatar: {
        fields: ["url", "alternativeText", "width", "height"],
      },
    },
  },
  blocks: {
    on: {
      "content.rich-text": { // Updated component name
        fields: ["content"], // Changed from default to 'content'
      },
      "content.quote": { // Updated component name
        fields: ["quote_text", "author", "author_title", "style"], // Updated field names
      },
      "content.image": { // Updated component name
        fields: ["alt_text", "caption", "width"],
        populate: {
          image: { // Changed from 'file' to 'image'
            fields: ["url", "alternativeText", "width", "height"],
          },
        },
      },
      "content.video-embed": { // Added missing component
        fields: ["video_url", "title", "description", "autoplay"],
        populate: {
          thumbnail: {
            fields: ["url", "alternativeText", "width", "height"],
          },
        },
      },
      "content.code-block": { // Added missing component
        fields: ["code", "language", "title", "show_line_numbers"],
      },
      "content.gallery": { // Added missing component
        fields: ["title", "description", "layout", "columns"],
        populate: {
          images: {
            fields: ["name", "url", "alternativeText", "width", "height"],
          },
        },
      },
      "content.call-to-action": { // Added missing component
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
  SEO: { // Added SEO component
    fields: ["meta_title", "meta_description", "meta_keywords"],
    populate: {
      og_image: {
        fields: ["url", "alternativeText", "width", "height"],
      },
    },
  },
  magazine_issues: { // Added magazine issues relation
    fields: ["title", "slug", "issue_number", "publish_date", "is_featured"],
    populate: {
      cover_image: {
        fields: ["url", "alternativeText", "width", "height"],
      },
    },
  },
  newsletters: { // Added newsletters relation (changed from 'newsletters' if different)
    fields: ["subject", "slug", "sent_at"],
  },
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  console.log("--------------------------------");
  console.log("In article-populate middleware.");
  console.log("--------------------------------");

  return async (ctx, next) => {
    strapi.log.info("In article-populate middleware.");

    // Merge with existing query parameters to avoid overriding user queries
    ctx.query = {
      ...ctx.query,
      populate: {
        ...ctx.query.populate, // Preserve any existing populate queries
        ...populateQuery,
      },
    };

    await next();
  };
};