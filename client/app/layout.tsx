import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans_Arabic, Noto_Sans_Arabic, Tajawal } from "next/font/google"
import "./globals.css"
import { getGlobal } from '@/lib/strapi-client'
import MainLayout from '@/components/layout/MainLayout'
import Link from "next/link"
import type { GlobalData } from '@/lib/types';
import { getStrapiMedia } from '@/components/custom/strapi-image';

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

// Generate metadata from Strapi or fallback to static Arabic metadata
export async function generateMetadata(): Promise<Metadata> {
  const globalData = await getGlobal();

  // If Strapi data is available, use it; otherwise fallback to static metadata
  if (globalData?.defaultSeo) {
    const seo = globalData.defaultSeo;
    console.log('SEO Data:', seo);
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

    return {
      title: {
        default: seo.meta_title || globalData.siteName || 'شروع - منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال',
        template: `%s | ${globalData.siteName || 'شروع'}`,
      },
      description: seo.meta_description || globalData.siteDescription || 'منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال والقيادة والتحول الرقمي والتقنيات الناشئة والشركات الناشئة والاستثمار والتطوير المؤسسي',
      keywords: seo.meta_keywords?.split(',').map(k => k.trim()) || [
        'شروع',
        'ريادة الأعمال',
        'الابتكار',
        'القيادة',
        'التحول الرقمي',
        'التقنيات الناشئة',
        'الشركات الناشئة',
        'الاستثمار',
        'التطوير المؤسسي',
        'إدارة المشاريع',
        'الحوكمة',
        'الاستراتيجية',
        'التميز المؤسسي',
        'منصة عربية',
        'إعلام متخصص',
      ],
      authors: [{ name: globalData.siteName || 'شروع للنشر الرقمي' }],
      creator: globalData.siteName || 'شروع للنشر الرقمي',
      publisher: globalData.siteName || 'شروع للنشر الرقمي',
      category: 'business',
      classification: 'Business & Professional',

      openGraph: {
        type: 'website',
        locale: 'ar_SA',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shurumag.com',
        siteName: globalData.siteName || 'شروع',
        title: seo.meta_title || globalData.siteName || 'شروع - منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال',
        description: seo.meta_description || globalData.siteDescription || 'منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال والقيادة والتحول الرقمي والتقنيات الناشئة والشركات الناشئة والاستثمار والتطوير المؤسسي',
        ...(seo.og_image && {
          images: [
            {
              url: getStrapiMedia(seo.og_image.url) || '/og-image.svg',
              width: seo.og_image.width || 1200,
              height: seo.og_image.height || 630,
              alt: seo.og_image.alternativeText || globalData.siteName || 'شروع',
            },
          ],
        }) || {
          images: [
            {
              url: '/og-image.svg',
              width: 1200,
              height: 630,
              alt: globalData.siteName || 'شروع',
            },
          ],
        },
      },

      twitter: {
        card: 'summary_large_image',
        title: seo.meta_title || globalData.siteName || 'شروع - منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال',
        description: seo.meta_description || globalData.siteDescription || 'منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال والقيادة والتحول الرقمي والتقنيات الناشئة والشركات الناشئة والاستثمار والتطوير المؤسسي',
        ...(seo.og_image && {
          images: [getStrapiMedia(seo.og_image.url) || '/twitter-image.svg'],
        }) || {
          images: ['/twitter-image.svg'],
        },
        creator: '@shurumag',
        site: '@shurumag',
      },

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

      verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
      },

      alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shurumag.com',
        languages: {
          'ar': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shurumag.com',
          'en': (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shurumag.com') + '/en',
        },
      },

      manifest: '/manifest.json',

      icons: {
        icon: globalData.favicon?.url
          ? [{ url: getStrapiMedia(globalData.favicon.url) || '/favicon.ico', sizes: '32x32' }]
          : [
              { url: '/favicon.ico', sizes: '32x32' },
              { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
              { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
            ],
        apple: [
          { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        other: [
          {
            rel: 'mask-icon',
            url: '/logos/Shuru-black-logo.svg',
            color: '#000000',
          },
        ],
      },

      other: {
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'apple-mobile-web-app-title': globalData.siteName || 'شروع',
        'msapplication-TileColor': '#ffffff',
        'msapplication-TileImage': '/icon-192x192.png',
        'theme-color': '#ffffff',
        'color-scheme': 'light',
        'content-language': 'ar',
        'dir': 'rtl',
        'format-detection': 'telephone=no',
        'mobile-web-app-capable': 'yes',
        'application-name': globalData.siteName || 'شروع',
      },
    };
  }

  // Fallback to static metadata if Strapi is not available
  return {
    title: {
      default: 'شروع - منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال',
      template: '%s | شروع',
    },
    description: 'منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال والقيادة والتحول الرقمي والتقنيات الناشئة والشركات الناشئة والاستثمار والتطوير المؤسسي',
    keywords: [
      'شروع',
      'ريادة الأعمال',
      'الابتكار',
      'القيادة',
      'التحول الرقمي',
      'التقنيات الناشئة',
      'الشركات الناشئة',
      'الاستثمار',
      'التطوير المؤسسي',
      'إدارة المشاريع',
      'الحوكمة',
      'الاستراتيجية',
      'التميز المؤسسي',
      'منصة عربية',
      'إعلام متخصص',
    ],
    authors: [{ name: 'شروع للنشر الرقمي' }],
    creator: 'شروع للنشر الرقمي',
    publisher: 'شروع للنشر الرقمي',
    category: 'business',
    classification: 'Business & Professional',

    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url: 'https://www.shurumag.com',
      siteName: 'شروع',
      title: 'شروع - منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال',
      description: 'منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال والقيادة والتحول الرقمي والتقنيات الناشئة والشركات الناشئة والاستثمار والتطوير المؤسسي',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'شروع - منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'شروع - منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال',
      description: 'منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال والقيادة والتحول الرقمي والتقنيات الناشئة والشركات الناشئة والاستثمار والتطوير المؤسسي',
      images: ['/twitter-image.svg'],
      creator: '@shurumag',
      site: '@shurumag',
    },

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

    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },

    alternates: {
      canonical: 'https://www.shurumag.com',
      languages: {
        'ar': 'https://www.shurumag.com',
        'en': 'https://www.shurumag.com/en',
      },
    },

    manifest: '/manifest.json',

    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/logos/Shuru-black-logo.svg',
          color: '#000000',
        },
      ],
    },

    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'شروع',
      'msapplication-TileColor': '#ffffff',
      'msapplication-TileImage': '/icon-192x192.png',
      'theme-color': '#ffffff',
      'color-scheme': 'light',
      'revisit-after': '7 days',
      'content-language': 'ar',
      'dir': 'rtl',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'application-name': 'شروع',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch global data from Strapi
  const globalData = await getGlobal();

  if (!globalData || !globalData.footer) {
    return (
      <html lang="ar" suppressHydrationWarning dir="rtl">
        <body className="font-sans flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">عذراً</h1>
            <p className="text-gray-600">حدث خطأ في تحميل بيانات التذييل (Footer)</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html
      lang="ar"
      suppressHydrationWarning
      dir="rtl"
      className={`${ibmPlexSansArabic.variable} ${notoSansArabic.variable} ${tajawal.variable}`}
    >
      <head>
        {/* Additional meta tags that can't be set via Metadata API */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content={globalData?.siteName || "شروع"} />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-starturl" content="/" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for social media domains */}
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://twitter.com" />
        <link rel="dns-prefetch" href="https://www.linkedin.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512x512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/logos/Shuru-black-logo.svg" color="#000000" />

        {/* Structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": globalData?.siteName || "شروع",
              "alternateName": ["Shuru", "شروع للنشر الرقمي"],
              "description": globalData?.siteDescription || "منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال والقيادة والتحول الرقمي والتقنيات الناشئة والشركات الناشئة والاستثمار والتطوير المؤسسي",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.shurumag.com",
              "logo": globalData?.header?.logo?.logoImage?.url
                ? getStrapiMedia(globalData.header.logo.logoImage.url) || "https://www.shurumag.com/logos/Shuru-white-logo.svg"
                : "https://www.shurumag.com/logos/Shuru-white-logo.svg",
              "foundingDate": "2020",
              "industry": "Media and Publishing",
              "areaServed": {
                "@type": "Place",
                "name": "Middle East and North Africa"
              },
              "knowsAbout": [
                "ريادة الأعمال",
                "الابتكار",
                "القيادة",
                "التحول الرقمي",
                "التقنيات الناشئة",
                "إدارة المشاريع",
                "الاستثمار",
                "التطوير المؤسسي"
              ],
              "sameAs": globalData?.footer?.socialLinks?.map(social => social.link.href) || [
                "https://www.facebook.com/shurumag",
                "https://twitter.com/shurumag",
                "https://www.linkedin.com/company/shurumag",
                "https://www.instagram.com/shurumag"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "areaServed": ["SA", "AE", "EG", "JO", "LB"],
                "availableLanguage": ["Arabic", "English"]
              },
              "publisher": {
                "@type": "Organization",
                "name": "شروع للنشر الرقمي",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.shurumag.com/logos/Shuru-white-logo.svg"
                }
              }
            })
          }}
        />
      </head>
      <body className="font-sans" suppressHydrationWarning>
          <MainLayout globalData={globalData as GlobalData}>
            {children}
          </MainLayout>

      </body>
    </html>
  )
}