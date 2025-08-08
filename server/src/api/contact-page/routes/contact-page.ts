/**
 * contact-page router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::contact-page.contact-page' as any, {
  only: ['find'], // Only allow read access for public use
  config: {
    find: {
      auth: false, // Allow public access
      policies: [],
      middlewares: [],
    }
  }
});
