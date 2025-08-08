/**
 * contact-message router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::contact-message.contact-message' as any, {
  only: ['create'], // Only allow create operation for public use
  config: {
    create: {
      middlewares: ['api::contact-message.rate-limit'],
      policies: [],
      auth: false, // Allow public access
    }
  }
});
