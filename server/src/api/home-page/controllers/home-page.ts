/**
 *  home-page controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::home-page.home-page', ({ strapi }) => ({
  async find(ctx) {
    // Get the basic populated data
    const { data, meta } = await super.find(ctx);

    // Process blocks to limit relations based on their max settings
    if (data?.blocks) {
      data.blocks = data.blocks.map((block: any) => {
        if (block.__component === 'home.hero-complex-section') {
          // Limit sidebarArticles based on maxSidebarArticles
          if (block.sidebarArticles && block.maxSidebarArticles) {
            block.sidebarArticles = block.sidebarArticles.slice(0, block.maxSidebarArticles);
          }

          // Limit mostReadArticles based on maxMostReadArticles
          if (block.mostReadArticles && block.maxMostReadArticles) {
            block.mostReadArticles = block.mostReadArticles.slice(0, block.maxMostReadArticles);
          }
        }
        return block;
      });
    }

    return { data, meta };
  }
}));
