export default ({ env }) => ({
  // Users & Permissions plugin configuration for OAuth
  'users-permissions': {
    config: {
      providers: {
        linkedin: {
          enabled: true,
          icon: 'linkedin',
          key: env('LINKEDIN_CLIENT_ID'),
          secret: env('LINKEDIN_CLIENT_SECRET'),
          callback: 'https://www.shuru.sa/api/auth/callback/linkedin',
          scope: ['openid', 'profile', 'email'],
        },
        google: {
          enabled: true,
          icon: 'google',
          key: env('GOOGLE_CLIENT_ID'),
          secret: env('GOOGLE_CLIENT_SECRET'),
          callback: 'https://www.shuru.sa/api/auth/callback/google',
          scope: ['openid', 'profile', 'email'],
        },
      },
    },
  },
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        // All S3-specific options should be inside s3Options
        s3Options: {
          accessKeyId: env('AWS_ACCESS_KEY_ID'),
          secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
          region: env('AWS_REGION'),
          params: {
            Bucket: env('AWS_BUCKET_NAME'),
            ACL: 'public-read',
          },
          // Move baseUrl and rootPath inside s3Options
          baseUrl: `https://${env('AWS_BUCKET_NAME')}.s3.${env('AWS_REGION')}.amazonaws.com`,
          rootPath: 'uploads/',
        },
      },
      // Move these options outside of providerOptions
      actionOptions: {
        upload: {
          // Ensure ACL is set for uploads
          ACL: 'public-read',
        },
        uploadStream: {
          ACL: 'public-read',
        },
        delete: {},
      },
      // Disable breakpoints to prevent multiple image sizes
      breakpoints: {},
      // Add size limits
      sizeLimit: 50 * 1024 * 1024, // 50MB
      // Disable responsive dimensions to prevent multiple versions
      responsiveDimensions: false,
    },
  },
  email: {
    config: {
      provider: 'strapi-provider-email-extra',
      providerOptions: {
        defaultProvider: 'nodemailer',
        providers: {
          nodemailer: {
            provider: 'nodemailer',
            providerOptions: {
              host: env('SMTP_HOST', 'smtp.hostinger.com'),
              port: env('SMTP_PORT', 465),
              secure: true,
              auth: {
                user: env('SMTP_USERNAME'),
                pass: env('SMTP_PASSWORD'),
              },
              requireTLS: true,
            },
          },
        },
        // DYNAMIC TEMPLATES FOR AUTH EMAILS
        dynamicTemplates: {
          enabled: true,
          collection: 'api::email-template.email-template',
          subjectMatcherField: 'subjectMatcher',
          testEmailSubjectToMatch: 'Strapi test mail',
          // Authentication email configurations
          forgotPasswordUrl: '/api/auth/forgot-password',
          sendEmailConfirmationUrl: '/api/auth/send-email-confirmation',
          registerUrl: '/api/auth/local/register',
          vars: {
            // Additional template variables
            appName: env('APP_NAME', 'شُرُوع'),
            appUrl: env('APP_URL', 'https://shuru.sa'),
            supportEmail: env('SUPPORT_EMAIL', 'info@shuru.sa'),
            companyName: env('COMPANY_NAME', 'شُرُوع'),
          },
        },
      },
      // Email settings
      settings: {
        defaultFrom: env('SMTP_FROM'),
        defaultFromName: env('APP_NAME', 'Shuru'),
        testAddress: env('SMTP_TEST_ADDRESS'),
      },
    },
  },
});