import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [],
    // Custom theme/styles configuration
    theme: {
      light: {},
      dark: {},
    },
  },
  bootstrap(app: StrapiApp) {
    // Fix for media library pagination z-index issue
    const style = document.createElement('style');
    style.textContent = `
      /* Fix pagination controls in media library dialog */
      [data-strapi-dialog] [role="navigation"] {
        z-index: 1 !important;
        position: relative !important;
      }

      /* Ensure pagination buttons are clickable */
      [data-strapi-dialog] [role="navigation"] button,
      [data-strapi-dialog] [role="navigation"] a {
        pointer-events: auto !important;
        z-index: 2 !important;
        position: relative !important;
      }

      /* Fix for asset grid overlay */
      [data-strapi-dialog] [role="navigation"] {
        pointer-events: auto !important;
      }

      /* Ensure the pagination wrapper has proper stacking */
      [data-strapi-dialog] footer,
      [data-strapi-dialog] [class*="Footer"] {
        z-index: 1 !important;
        position: relative !important;
        pointer-events: auto !important;
      }

      /* Fix specifically for the entries per page dropdown and pagination */
      [data-strapi-dialog] [aria-label*="Pagination"],
      [data-strapi-dialog] [class*="PaginationFooter"],
      [data-strapi-dialog] [class*="pagination"] {
        z-index: 10 !important;
        position: relative !important;
        pointer-events: auto !important;
      }

      /* Make sure buttons in pagination are on top */
      [data-strapi-dialog] [aria-label*="Pagination"] button,
      [data-strapi-dialog] [aria-label*="Go to"],
      [data-strapi-dialog] select {
        z-index: 11 !important;
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(style);
  },
};
