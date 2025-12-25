/**
 * top-banner controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::top-banner.top-banner', ({ strapi }) => ({
  async find(ctx) {
    // Call the default core find action
    return await super.find(ctx);
  },
}));

