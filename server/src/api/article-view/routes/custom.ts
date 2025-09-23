/**
 * Custom article-view routes
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/article-views/cleanup',
      handler: 'api::article-view.article-view.cleanupOrphanedViews',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ]
};