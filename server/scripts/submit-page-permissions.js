/**
 * Script to configure Strapi API permissions for submit page content
 * This should be run in Strapi admin panel or through API to set public access
 * to the submit-page-content single type
 */

const strapiPermissions = {
  // Public role permissions for submit-page-content
  public: {
    'api::submit-page-content.submit-page-content': {
      find: true,
      findOne: false,
      create: false,
      update: false,
      delete: false
    }
  },

  // Authenticated role permissions (same as public for this use case)
  authenticated: {
    'api::submit-page-content.submit-page-content': {
      find: true,
      findOne: false,
      create: false,
      update: false,
      delete: false
    }
  }
};

/**
 * Instructions for manual configuration:
 *
 * 1. Go to Strapi Admin Panel
 * 2. Navigate to Settings > Users & Permissions Plugin > Roles
 * 3. Click on "Public"
 * 4. Under "Permissions", expand "Submit-page-content"
 * 5. Check "find" permission
 * 6. Save the role
 *
 * This will allow public access to the submit page content API endpoint
 */

export default strapiPermissions;
