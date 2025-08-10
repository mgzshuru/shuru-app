module.exports = {
  routes: [
    {
      method: 'PUT',
      path: '/author-update/update-data',
      handler: 'author-update.updateAuthorData',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
