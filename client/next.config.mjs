/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'localhost',
      'cms.shuru.sa',
      'shuru-bkt.s3.eu-west-3.amazonaws.com', // S3 bucket URL
    ],
    // Add image optimization
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  env: {
    // Make sure environment variables are available
    STRAPI_BASE_URL: process.env.STRAPI_BASE_URL,
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  },

  // Enable compression
  compress: true,

  // SEO optimizations
  generateEtags: false,
  poweredByHeader: false,

  // Server external packages (moved from experimental)
  serverExternalPackages: ['@strapi/client'],

  // Performance optimizations
  experimental: {
    // Enable PPR for better performance
    ppr: false, // Set to true when stable
    // Optimize CSS
    optimizeCss: true,
  },

  // Redirect configuration - commented out to prevent redirect loops
  // Only enable this after properly configuring domains in Vercel
  async redirects() {
    return [
      // Redirect www to non-www or vice versa
      // Uncomment and modify after fixing domain configuration
      /*
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.shuru.sa',
          },
        ],
        destination: 'https://shuru.sa/:path*',
        permanent: true,
      },
      */
    ]
  },

  // Headers for SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://cms.shuru.sa https://shuru.sa http://localhost:1337",
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
