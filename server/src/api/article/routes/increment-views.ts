export default {
  routes: [
    {
      method: 'GET',
      path: '/articles/:documentId/views',
      handler: 'article.getViews',
      config: {
        policies: [],
        middlewares: [],
        auth: false, // Allow public access
      },
    },
    {
      method: 'POST',
      path: '/articles/:documentId/increment-views',
      handler: 'article.incrementViews',
      config: {
        policies: [],
        middlewares: [],
        auth: false, // Allow public access
      },
    },
  ],
};