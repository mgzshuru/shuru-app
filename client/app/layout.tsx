import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans_Arabic, Noto_Sans_Arabic, Tajawal } from "next/font/google"
import "./globals.css"

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-arabic",
})

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
})

export const metadata: Metadata = {
  title: {
    default: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
    template: '%s | شروع',
  },
  description: 'المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية',
  keywords: [
    'ريادة الأعمال',
    'الابتكار',
    'القيادة',
    'التحول الرقمي',
    'التقنيات الناشئة',
    'الشركات الناشئة',
    'الاستثمار',
    'التطوير',
  ],
  authors: [{ name: 'شروع للنشر الرقمي' }],
  creator: 'شروع للنشر الرقمي',
  publisher: 'شروع للنشر الرقمي',
  
  // Open Graph metadata
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://yoursite.com', // Replace with your actual domain
    siteName: 'شروع',
    title: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
    description: 'المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية',
    images: [
      {
        url: '/og-image.jpg', // Main OG image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
      },
      {
        url: '/og-image-square.jpg', // Square image for some platforms (1200x1200px)
        width: 1200,
        height: 1200,
        alt: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
      },
    ],
  },

  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    site: '@YourTwitterHandle', // Replace with your Twitter handle
    creator: '@YourTwitterHandle', // Replace with your Twitter handle
    title: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
    description: 'المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية',
    images: ['/twitter-image.jpg'], // Twitter image (1200x600px recommended)
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification tags (add your actual verification codes)
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    // Other verification services as needed
  },

  // Alternate languages
  alternates: {
    canonical: 'https://yoursite.com', // Replace with your actual domain
    languages: {
      'ar': 'https://yoursite.com',
      'en': 'https://yoursite.com/en', // If you have English version
    },
  },

  // Additional meta tags
  other: {
    // Facebook App ID (if you have one)
    'fb:app_id': 'your-facebook-app-id',
    
    // Apple mobile web app
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'شروع',
    
    // Microsoft application
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/ms-icon-144x144.png',
    
    // Theme color
    'theme-color': '#ffffff',
    
    // Robots
    'revisit-after': '7 days',
    
    // Language and direction
    'content-language': 'ar',
    'dir': 'rtl',
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome',
        url: '/android-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" suppressHydrationWarning dir="rtl" className={`${ibmPlexSansArabic.variable} ${notoSansArabic.variable} ${tajawal.variable}`}>
      <head>
        {/* Additional meta tags that can't be set via Metadata API */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="شروع" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for social media domains */}
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://twitter.com" />
        <link rel="dns-prefetch" href="https://www.linkedin.com" />
        
        {/* Structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "شروع",
              "description": "المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية",
              "url": "https://yoursite.com",
              "logo": "https://yoursite.com/logo.png",
              "sameAs": [
                "https://www.facebook.com/YourPage",
                "https://twitter.com/YourHandle",
                "https://www.linkedin.com/company/YourCompany",
                "https://www.instagram.com/YourHandle"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "areaServed": "SA",
                "availableLanguage": "Arabic"
              }
            })
          }}
        />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        {/* <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-center">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                شروع
              </Link>
            </h1>
          </div>
        </header> */}
        {children}
        {/* <footer className="bg-gray-50 mt-12">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-gray-600">
            © {new Date().getFullYear()} شروع. جميع الحقوق محفوظة
            </p>
          </div>
        </footer> */}
      </body>
    </html>
  )
}