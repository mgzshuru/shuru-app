/**
 * saved-article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::saved-article.saved-article', ({ strapi }) => ({
  // Custom controller to handle saving/unsaving articles
  async toggle(ctx) {
    const { user } = ctx.state;
    const { articleId } = ctx.params;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to save articles');
    }

    try {
      // First, verify the article exists
      const article = await strapi.documents('api::article.article').findOne({
        documentId: articleId
      });

      if (!article) {
        return ctx.notFound('Article not found');
      }

      // Find or create the user's saved articles collection
      let userSavedArticles = await strapi.documents('api::saved-article.saved-article').findMany({
        filters: {
          user: { id: user.id }
        },
        populate: ['articles']
      });

      if (userSavedArticles.length === 0) {
        // Create new saved articles collection for this user
        const newSavedCollection = await strapi.documents('api::saved-article.saved-article').create({
          data: {
            user: user.id,
            articles: [articleId],
            publishedAt: new Date()
          },
          populate: ['articles']
        });

        return ctx.send({
          message: 'Article saved successfully',
          saved: true,
          data: newSavedCollection
        });
      } else {
        // User already has a saved articles collection
        const savedCollection = userSavedArticles[0];
        const currentArticles = savedCollection.articles || [];

        // Check if article is already saved
        const isAlreadySaved = currentArticles.some(savedArticle =>
          savedArticle.documentId === articleId || savedArticle.id === articleId
        );

        if (isAlreadySaved) {
          // Remove article from saved list
          const updatedArticles = currentArticles.filter(savedArticle =>
            savedArticle.documentId !== articleId && savedArticle.id !== articleId
          );

          const updatedCollection = await strapi.documents('api::saved-article.saved-article').update({
            documentId: savedCollection.documentId,
            data: {
              articles: updatedArticles.map(a => a.documentId || a.id)
            },
            populate: ['articles']
          });

          return ctx.send({
            message: 'Article unsaved successfully',
            saved: false,
            data: updatedCollection
          });
        } else {
          // Add article to saved list
          const updatedArticles = [...currentArticles.map(a => a.documentId || a.id), articleId];

          const updatedCollection = await strapi.documents('api::saved-article.saved-article').update({
            documentId: savedCollection.documentId,
            data: {
              articles: updatedArticles
            },
            populate: ['articles']
          });

          return ctx.send({
            message: 'Article saved successfully',
            saved: true,
            data: updatedCollection
          });
        }
      }
    } catch (error) {
      console.error('Error toggling saved article:', error);
      return ctx.internalServerError(`An error occurred while saving/unsaving the article: ${error.message}`);
    }
  },

  // Get all saved articles for authenticated user
  async findUserSaved(ctx) {
    const { user } = ctx.state;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to view saved articles');
    }

    try {
      const userSavedArticles = await strapi.documents('api::saved-article.saved-article').findMany({
        filters: {
          user: { id: user.id }
        },
        populate: {
          articles: {
            populate: {
              cover_image: {
                fields: ['url', 'alternativeText', 'width', 'height']
              },
              category: {
                fields: ['name', 'slug']
              },
              author: {
                fields: ['name', 'jobTitle'],
                populate: {
                  avatar: {
                    fields: ['url', 'alternativeText']
                  }
                }
              }
            }
          }
        }
      });

      // Return the articles array from the saved collection
      const articles = userSavedArticles.length > 0 ? userSavedArticles[0].articles || [] : [];

      return ctx.send({
        data: articles
      });
    } catch (error) {
      console.error('Error fetching saved articles:', error);
      return ctx.internalServerError('An error occurred while fetching saved articles');
    }
  },

  // Check if specific article is saved by user
  async checkSaved(ctx) {
    const { user } = ctx.state;
    const { articleId } = ctx.params;

    console.log('CheckSaved called:', {
      userId: user?.id,
      articleId,
      hasUser: !!user,
      authHeaders: ctx.request.headers.authorization ? 'present' : 'missing'
    });

    if (!user) {
      console.log('No user found in context state');
      return ctx.send({ saved: false });
    }

    try {
      const userSavedArticles = await strapi.documents('api::saved-article.saved-article').findMany({
        filters: {
          user: { id: user.id }
        },
        populate: ['articles']
      });

      console.log('Found saved collections:', userSavedArticles.length);

      if (userSavedArticles.length === 0) {
        console.log('No saved collections found for user');
        return ctx.send({ saved: false });
      }

      const savedCollection = userSavedArticles[0];
      const currentArticles = savedCollection.articles || [];

      console.log('Current articles in collection:', currentArticles.map(a => ({
        id: a.id,
        documentId: a.documentId
      })));

      const isAlreadySaved = currentArticles.some(savedArticle => {
        const match = savedArticle.documentId === articleId || savedArticle.id === articleId;
        console.log(`Checking article ${savedArticle.documentId || savedArticle.id} against ${articleId}: ${match}`);
        return match;
      });

      console.log('Final result - saved:', isAlreadySaved);

      return ctx.send({
        saved: isAlreadySaved
      });
    } catch (error) {
      console.error('Error checking saved article:', error);
      return ctx.send({ saved: false });
    }
  }
}));
