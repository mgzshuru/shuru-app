export default {
  routes: [
    {
      method: 'POST',
      path: '/linkedin-auth/callback',
      handler: 'linkedin-auth.callback',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
