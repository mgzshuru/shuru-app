module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/article-submissions',
      handler: 'article-submission.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/article-submissions/check-email',
      handler: 'article-submission.checkEmail',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    }
  ],
};
