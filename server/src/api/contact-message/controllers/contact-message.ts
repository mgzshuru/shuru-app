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

      // Send email notification to info@shuru.sa
      try {
        const emailService = strapi.plugins.email.services.email;

        await emailService.send({
          to: 'info@shuru.sa',
          subject: 'Contact Form Submission', // This matches the subjectMatcher in the template
          contactData: {
            name: name,
            email: email,
            phone: ctx.request.body.data.phone || null,
            company: ctx.request.body.data.company || null,
            subject: subject,
            message: message,
            submissionDate: new Date().toLocaleDateString('ar-EG'),
            submissionTime: new Date().toLocaleTimeString('ar-EG')
          }
        });

        strapi.log.info('Contact form notification email sent successfully', {
          contactName: name,
          contactEmail: email,
          subject: subject,
          timestamp: new Date().toISOString()
        });

      } catch (emailError) {
        strapi.log.error('Failed to send contact form notification email:', emailError);
        // Don't fail the contact form submission if email fails
      }

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      ctx.throw(500, 'Failed to create contact message');
    }
  }
}));
