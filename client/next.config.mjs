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
    domains: ['localhost', 'gorgeous-friends-86d3c26cfb.strapiapp.com'], // Add your Strapi domains
  },
  env: {
    // Make sure environment variables are available
    STRAPI_BASE_URL: process.env.STRAPI_BASE_URL,
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  },
  // Enable static export if deploying to static hosting
  // output: 'export',
  // trailingSlash: true,

  // Enable compression
  compress: true,

  // SEO optimizations
  generateEtags: false,
  poweredByHeader: false,

  // Redirect configuration
  async redirects() {
    return [
      // Redirect www to non-www or vice versa
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
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
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
