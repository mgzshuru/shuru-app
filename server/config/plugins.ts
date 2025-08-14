export default () => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        // All S3-specific options should be inside s3Options
        s3Options: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
          params: {
            Bucket: process.env.AWS_BUCKET_NAME,
            ACL: 'public-read',
          },
          // Move baseUrl and rootPath inside s3Options
          baseUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
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
});