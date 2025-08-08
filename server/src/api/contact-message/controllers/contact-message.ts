/**
 * contact-message controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::contact-message.contact-message', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Validate required fields
      const { name, email, subject, message } = ctx.request.body.data;

      if (!name || !email || !subject || !message) {
        return ctx.badRequest('Missing required fields');
      }

      // Create the contact message
      const entity = await strapi.entityService.create('api::contact-message.contact-message' as any, {
        data: {
          ...ctx.request.body.data,
          is_read: false,
          status: 'new',
          priority: 'medium'
        }
      });

      // You can add email notification logic here if needed
      // await strapi.plugins['email'].services.email.send({
      //   to: 'admin@shuru.sa',
      //   subject: `New Contact Message: ${subject}`,
      //   text: `New message from ${name} (${email}): ${message}`
      // });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      ctx.throw(500, 'Failed to create contact message');
    }
  }
}));
