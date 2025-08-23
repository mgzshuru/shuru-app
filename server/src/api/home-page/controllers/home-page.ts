/**
 *  home-page controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::home-page.home-page', ({ strapi }) => ({
  async find(ctx) {
    // Get the basic populated data with exact article relations as configured in admin
    const { data, meta } = await super.find(ctx);

    return { data, meta };
  }
}));
