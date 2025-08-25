# Email Template Setup for Article Submission

## Overview

The article submission system now works with `strapi-provider-email-extra` to send confirmation emails. The system includes fallback content but for better customization, you should create an email template in the Strapi admin panel.

## Current Status

✅ **strapi-provider-email-extra** is installed and configured
✅ **Email controller** updated to work with the provider
✅ **Fallback content** added for immediate functionality
✅ **Template variables** properly configured

## Quick Setup

### Step 1: Start your Strapi server
```bash
cd server
yarn develop
```

### Step 2: Access Strapi Admin
Go to `http://localhost:1337/admin` and log in.

### Step 3: Create Email Template

1. Navigate to **Content Manager** > **EmailTemplate** (in Collection Types)
2. Click **"Create new entry"**
3. Fill in the following fields:

#### Required Fields:
- **subjectMatcher**: `Article Submission Confirmation`
- **subject**: `تم استلام مقالك بنجاح - شُرُوع`
- **from**: `info@shuru.sa` (or your preferred sender email)

#### HTML Content:
```html
<div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #1a202c; font-size: 28px; font-weight: bold; margin: 0;">تم استلام مقالك بنجاح</h1>
      <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #3182ce, #63b3ed); margin: 20px auto; border-radius: 2px;"></div>
    </div>

    <!-- Greeting -->
    <p style="font-size: 18px; line-height: 1.6; color: #2d3748; margin-bottom: 24px;">
      مرحباً <strong>{{user.username}}</strong>،
    </p>

    <!-- Main Message -->
    <p style="font-size: 16px; line-height: 1.7; color: #4a5568; margin-bottom: 32px;">
      شكراً لك على إرسال مقالك إلى منصة <strong>{{appName}}</strong>. نقدر ثقتك بنا ونتطلع لمراجعة محتواك القيم.
    </p>

    <!-- Article Details Card -->
    <div style="background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%); padding: 24px; border-radius: 8px; margin: 32px 0; border-right: 4px solid #3182ce;">
      <h3 style="color: #1a202c; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">تفاصيل المقال المُرسل:</h3>

      <div style="background-color: white; padding: 20px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 12px; color: #718096; font-weight: 500; border-bottom: 1px solid #e2e8f0;">العنوان:</td>
            <td style="padding: 8px 12px; color: #2d3748; font-weight: 600; border-bottom: 1px solid #e2e8f0;">{{article.title}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #718096; font-weight: 500; border-bottom: 1px solid #e2e8f0;">الوصف:</td>
            <td style="padding: 8px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">{{article.description}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #718096; font-weight: 500; border-bottom: 1px solid #e2e8f0;">عدد الكلمات:</td>
            <td style="padding: 8px 12px; color: #2d3748; font-weight: 600; border-bottom: 1px solid #e2e8f0;">{{article.wordCount}} كلمة</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #718096; font-weight: 500; border-bottom: 1px solid #e2e8f0;">تاريخ الإرسال:</td>
            <td style="padding: 8px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">{{article.submissionDate}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #718096; font-weight: 500;">وقت الإرسال:</td>
            <td style="padding: 8px 12px; color: #2d3748;">{{article.submissionTime}}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Process Info -->
    <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; border: 1px solid #cbd5e0; margin: 24px 0;">
      <h4 style="color: #2b6cb0; margin: 0 0 12px 0; font-size: 16px;">الخطوات القادمة:</h4>
      <ul style="color: #4a5568; line-height: 1.6; margin: 0; padding-right: 20px;">
        <li style="margin-bottom: 8px;">سيقوم فريق التحرير بمراجعة مقالك خلال 3-5 أيام عمل</li>
        <li style="margin-bottom: 8px;">سنتواصل معك عبر البريد الإلكتروني بخصوص حالة المراجعة</li>
        <li>في حالة الموافقة، سيتم نشر المقال وإشعارك</li>
      </ul>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="{{appUrl}}"
         style="background: linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%);
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 6px;
                display: inline-block;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 4px 6px rgba(50, 130, 206, 0.3);
                transition: all 0.3s ease;">
        زيارة الموقع
      </a>
    </div>

    <!-- Footer -->
    <div style="border-top: 2px solid #e2e8f0; padding-top: 24px; margin-top: 40px; text-align: center;">
      <p style="font-size: 14px; color: #718096; margin: 0 0 12px 0;">مع تحيات فريق {{companyName}}</p>
      <div style="font-size: 14px; color: #a0aec0;">
        <a href="mailto:{{supportEmail}}" style="color: #3182ce; text-decoration: none; margin: 0 8px;">{{supportEmail}}</a>
        |
        <a href="{{appUrl}}" style="color: #3182ce; text-decoration: none; margin: 0 8px;">{{appUrl}}</a>
      </div>
    </div>

  </div>
</div>
```

#### Text Content:
```
مرحباً {{user.username}},

تم استلام مقالك "{{article.title}}" بنجاح على منصة {{appName}}.

تفاصيل المقال:
- العنوان: {{article.title}}
- الوصف: {{article.description}}
- عدد الكلمات: {{article.wordCount}} كلمة
- تاريخ الإرسال: {{article.submissionDate}}
- وقت الإرسال: {{article.submissionTime}}

الخطوات القادمة:
- سيقوم فريق التحرير بمراجعة مقالك خلال 3-5 أيام عمل
- سنتواصل معك عبر البريد الإلكتروني بخصوص حالة المراجعة
- في حالة الموافقة، سيتم نشر المقال وإشعارك

مع تحيات فريق {{companyName}}
{{supportEmail}} | {{appUrl}}
```

### Step 4: Publish the Template
1. Click **"Save"**
2. Click **"Publish"** to make the template active

## Available Template Variables

The following variables are available in your email templates:

### User Variables
- `{{user.username}}` - Author name
- `{{user.email}}` - Author email

### Article Variables
- `{{article.title}}` - Article title
- `{{article.description}}` - Article description
- `{{article.slug}}` - Article URL slug
- `{{article.wordCount}}` - Number of words
- `{{article.submissionDate}}` - Submission date (Arabic format)
- `{{article.submissionTime}}` - Submission time (Arabic format)
- `{{article.hasCoverImage}}` - Boolean for cover image

### Author Variables
- `{{author.name}}` - Author name
- `{{author.email}}` - Author email
- `{{author.title}}` - Author job title
- `{{author.organization}}` - Author organization
- `{{author.phone}}` - Author phone number

### App Variables
- `{{appName}}` - Application name (شُرُوع)
- `{{appUrl}}` - Application URL
- `{{supportEmail}}` - Support email
- `{{companyName}}` - Company name

## Testing

### Test the Email System
1. Start your server: `yarn develop`
2. Go to your article submission form
3. Submit a test article
4. Check the email delivery

### Troubleshooting

#### Email not sending:
1. Check SMTP credentials in your `.env` file
2. Verify the email template is published
3. Check server logs for detailed error messages

#### Template not found:
- Ensure `subjectMatcher` exactly matches: `Article Submission Confirmation`
- Verify the template is published (not draft)
- Check that the email-template content type exists

#### Variables not working:
- Make sure to use double curly braces: `{{variable.name}}`
- Check spelling and case sensitivity
- Verify the variable is available in the controller

## Email Provider Configuration

Your current configuration in `config/plugins.ts`:

```typescript
email: {
  config: {
    provider: 'strapi-provider-email-extra',
    providerOptions: {
      defaultProvider: 'nodemailer',
      providers: {
        nodemailer: {
          provider: 'nodemailer',
          providerOptions: {
            host: env('SMTP_HOST'),
            port: env('SMTP_PORT', 465),
            secure: true,
            auth: {
              user: env('SMTP_USERNAME'),
              pass: env('SMTP_PASSWORD'),
            },
          },
        },
      },
      dynamicTemplates: {
        enabled: true,
        collection: 'api::email-template.email-template',
        subjectMatcherField: 'subjectMatcher',
      },
    },
  },
}
```

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USERNAME=your-email@domain.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@shuru.sa
APP_NAME=شُرُوع
APP_URL=https://shuru.sa
SUPPORT_EMAIL=info@shuru.sa
COMPANY_NAME=شُرُوع
```

## Benefits of This Setup

✅ **Professional emails** with custom branding
✅ **Template reusability** for other email types
✅ **Fallback content** if template is missing
✅ **Rich HTML** with Arabic RTL support
✅ **Template variables** for dynamic content
✅ **Easy customization** via Strapi admin panel

## Next Steps

1. **Create the email template** following the instructions above
2. **Test the submission** with a real email address
3. **Customize the template** styling to match your brand
4. **Create additional templates** for other email types (article approval, rejection, etc.)

The system will work immediately with the fallback content, but creating the template will give you full control over the email design and content.
