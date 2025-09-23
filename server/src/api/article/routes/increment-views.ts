export default {
  routes: [
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