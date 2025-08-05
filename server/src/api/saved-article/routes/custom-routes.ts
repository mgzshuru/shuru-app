export default {
  routes: [
    {
      method: 'POST',
      path: '/saved-articles/toggle/:articleId',
      handler: 'saved-article.toggle',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/saved-articles/user',
      handler: 'saved-article.findUserSaved',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/saved-articles/check/:articleId',
      handler: 'saved-article.checkSaved',
      config: {
        policies: []
      }
    }
  ]
};
