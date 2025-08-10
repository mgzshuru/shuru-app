import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::author.author', ({ strapi }) => ({
  async updateAuthorData(ctx) {
    try {
      // Verify user is authenticated
      if (!ctx.state.user) {
        return ctx.unauthorized('Authentication required');
      }

      const {
        authorName,
        authorPhone,
        authorTitle,
        authorOrganization,
        authorLinkedIn,
        authorBio
      } = ctx.request.body;

      const userEmail = ctx.state.user.email;

      strapi.log.info('Authenticated user updating author data:', {
        userId: ctx.state.user.id,
        userEmail: userEmail,
        updateData: {
          authorName,
          authorPhone,
          authorTitle,
          authorOrganization,
          authorLinkedIn,
          authorBio
        }
      });

      // Find the author record for this user
      const existingAuthors = await strapi.entityService.findMany('api::author.author', {
        filters: { email: userEmail },
        limit: 1
      });

      if (!existingAuthors || existingAuthors.length === 0) {
        return ctx.notFound('Author record not found for this user');
      }

      const existingAuthor = existingAuthors[0] as any;

      // Prepare update data
      const updateData = {
        name: authorName || existingAuthor.name,
        phone_number: authorPhone || existingAuthor.phone_number,
        jobTitle: authorTitle,
        organization: authorOrganization,
        linkedin_url: authorLinkedIn || existingAuthor.linkedin_url,
        bio: authorBio || existingAuthor.bio
      };

      strapi.log.info('Updating author with authenticated context:', {
        authorId: existingAuthor.id,
        documentId: existingAuthor.documentId,
        updateData
      });

      // Update using the authenticated context - this should have proper permissions
      const updatedAuthor = await strapi.entityService.update('api::author.author', existingAuthor.documentId, {
        data: updateData
      });

      strapi.log.info('Author update result:', {
        success: !!updatedAuthor,
        updatedAuthor: updatedAuthor
      });

      if (!updatedAuthor) {
        // Fallback: try with regular ID
        const updatedAuthorById = await strapi.entityService.update('api::author.author', existingAuthor.id, {
          data: updateData
        });

        if (updatedAuthorById) {
          return {
            success: true,
            message: 'Author data updated successfully',
            author: updatedAuthorById
          };
        }

        // Final fallback: direct database update
        await strapi.db.query('api::author.author').update({
          where: { id: existingAuthor.id },
          data: updateData
        });

        // Fetch the updated record
        const finalAuthor = await strapi.entityService.findOne('api::author.author', existingAuthor.documentId);

        return {
          success: true,
          message: 'Author data updated successfully (direct DB)',
          author: finalAuthor
        };
      }

      return {
        success: true,
        message: 'Author data updated successfully',
        author: updatedAuthor
      };

    } catch (error) {
      strapi.log.error('Error updating author data:', error);
      return ctx.internalServerError('Failed to update author data');
    }
  }
}));
