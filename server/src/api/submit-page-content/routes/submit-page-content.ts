export default {
  routes: [
    {
      method: 'GET',
      path: '/submit-page-content',
      handler: 'api::submit-page-content.submit-page-content.find',
      config: {
        auth: false, // Allow public access
        policies: [],
        middlewares: [],
      },
    },
  ],
};
