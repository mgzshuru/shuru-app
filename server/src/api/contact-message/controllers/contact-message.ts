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

      // Create the contact message using Document Service API
      const entity = await strapi.documents('api::contact-message.contact-message').create({
        data: {
          ...ctx.request.body.data,
          is_read: false,
          status: 'new',
          priority: 'medium'
        }
      });

      // Send email notification to info@shuru.sa
      try {
        // Use the email service directly
        const emailService = strapi.service('plugin::email.email');

        await emailService.send({
          to: 'info@shuru.sa',
          replyTo: email,
          // subject: 'Contact Form Submission', // This matches the subjectMatcher in the template
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);">
                <h1 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  📧 رسالة جديدة من نموذج التواصل
                </h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">
                  تم استلام رسالة جديدة في ${new Date().toLocaleDateString('ar-EG')} الساعة ${new Date().toLocaleTimeString('ar-EG')}
                </p>
              </div>

              <!-- Content Body -->
              <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">

                <!-- Contact Information -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 25px;">

                  <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <h3 style="color: #374151; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; opacity: 0.8;">👤 الاسم</h3>
                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${name}</p>
                  </div>

                  <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                    <h3 style="color: #374151; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; opacity: 0.8;">📧 البريد الإلكتروني</h3>
                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                      <a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a>
                    </p>
                  </div>

                  ${ctx.request.body.data.phone ? `
                  <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <h3 style="color: #374151; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; opacity: 0.8;">📱 رقم الهاتف</h3>
                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                      <a href="tel:${ctx.request.body.data.phone}" style="color: #f59e0b; text-decoration: none;">${ctx.request.body.data.phone}</a>
                    </p>
                  </div>
                  ` : ''}

                  ${ctx.request.body.data.company ? `
                  <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <h3 style="color: #374151; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; opacity: 0.8;">🏢 الشركة</h3>
                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${ctx.request.body.data.company}</p>
                  </div>
                  ` : ''}
                </div>

                <!-- Subject -->
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                    📋 موضوع الرسالة
                  </h3>
                  <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border: 1px solid #f59e0b; color: #92400e; font-weight: 600; font-size: 16px;">
                    ${subject}
                  </div>
                </div>

                <!-- Message Content -->
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                    💬 نص الرسالة
                  </h3>
                  <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; line-height: 1.6; color: #374151; white-space: pre-wrap; font-size: 15px;">
                    ${message}
                  </div>
                </div>

                <!-- Action Buttons -->
                <div style="text-align: center; margin: 25px 0;">
                  <a href="mailto:${email}?subject=رد على: ${subject}"
                     style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; margin: 0 10px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);">
                    📧 رد مباشر
                  </a>
                  ${ctx.request.body.data.phone ? `
                  <a href="tel:${ctx.request.body.data.phone}"
                     style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; margin: 0 10px; box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);">
                    📞 اتصال مباشر
                  </a>
                  ` : ''}
                </div>

                <!-- Priority Notice -->
                <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
                  <p style="color: #dc2626; margin: 0; font-weight: 600; font-size: 14px;">
                    ⏰ يُرجى الرد على هذه الرسالة خلال 24 ساعة لضمان أفضل تجربة للعميل
                  </p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; margin: 0; font-size: 13px;">
                    هذه رسالة تلقائية من نظام إدارة المحتوى<br>
                    <strong style="color: #374151;">فريق شُرُوع</strong> | <a href="https://shuru.sa" style="color: #2563eb; text-decoration: none;">https://shuru.sa</a>
                  </p>
                </div>

              </div>
            </div>
          `
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
      strapi.log.error('Contact message creation error:', error);
      ctx.throw(500, 'Failed to create contact message');
    }
  }
}));
