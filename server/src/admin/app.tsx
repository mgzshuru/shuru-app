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
      /* Fix the entire dialog footer with pagination */
      [role="dialog"] footer {
        z-index: 100 !important;
        position: relative !important;
        pointer-events: auto !important;
      }

      /* Fix pagination navigation and all its children */
      [role="dialog"] nav[aria-label="pagination"],
      [role="dialog"] nav[aria-label="pagination"] *,
      [role="dialog"] nav[aria-label="pagination"] ul,
      [role="dialog"] nav[aria-label="pagination"] li,
      [role="dialog"] nav[aria-label="pagination"] button {
        z-index: 101 !important;
        position: relative !important;
        pointer-events: auto !important;
        cursor: pointer !important;
      }

      /* Fix entries per page dropdown */
      [role="dialog"] [aria-label="Entries per page"],
      [role="dialog"] [aria-label="Entries per page"] *,
      [role="dialog"] [role="combobox"] {
        z-index: 101 !important;
        position: relative !important;
        pointer-events: auto !important;
        cursor: pointer !important;
      }

      /* Ensure scroll area doesn't overlay pagination */
      [role="dialog"] [data-radix-scroll-area-viewport] {
        z-index: 1 !important;
      }

      /* Fix the tabpanel that contains assets */
      [role="dialog"] [role="tabpanel"] {
        z-index: 1 !important;
      }

      /* Ensure buttons work */
      [role="dialog"] footer button,
      [role="dialog"] nav button {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);
  },
};
