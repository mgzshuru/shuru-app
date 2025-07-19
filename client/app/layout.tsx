import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans_Arabic, Noto_Sans_Arabic, Tajawal } from "next/font/google"
import "./globals.css"
import { getGlobal } from '@/lib/strapi-client'
import MainLayout from '@/components/layout/MainLayout'
import Link from "next/link"
import type { GlobalData } from '@/lib/types';

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
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    
    return {
      title: {
        default: seo.meta_title || globalData.siteName || 'شروع - المنصة العربية الأولى في إدارة المشاريع',
        template: `%s | ${globalData.siteName || 'شروع'}`,
      },
      description: seo.meta_description || globalData.siteDescription || 'المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية',
      keywords: seo.meta_keywords?.split(',').map(k => k.trim()) || [
        'ريادة الأعمال',
        'الابتكار',
        'القيادة',
        'التحول الرقمي',
        'التقنيات الناشئة',
        'الشركات الناشئة',
        'الاستثمار',
        'التطوير',
      ],
      authors: [{ name: globalData.siteName || 'شروع للنشر الرقمي' }],
      creator: globalData.siteName || 'شروع للنشر الرقمي',
      publisher: globalData.siteName || 'شروع للنشر الرقمي',
      
      openGraph: {
        type: 'website',
        locale: 'ar_SA',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com',
        siteName: globalData.siteName || 'شروع',
        title: seo.meta_title || globalData.siteName || 'شروع - المنصة العربية الأولى في إدارة المشاريع',
        description: seo.meta_description || globalData.siteDescription || 'المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية',
        ...(seo.og_image && {
          images: [
            {
              url: strapiUrl + seo.og_image.url,
              width: seo.og_image.width || 1200,
              height: seo.og_image.height || 630,
              alt: seo.og_image.alternativeText || globalData.siteName || 'شروع',
            },
          ],
        }),
      },

      twitter: {
        card: 'summary_large_image',
        title: seo.meta_title || globalData.siteName || 'شروع - المنصة العربية الأولى في إدارة المشاريع',
        description: seo.meta_description || globalData.siteDescription || 'المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية',
        ...(seo.og_image && {
          images: [strapiUrl + seo.og_image.url],
        }),
      },

      icons: {
        icon: globalData.favicon?.url ? strapiUrl + globalData.favicon.url : [
          { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
          { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
          { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        ],
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

      alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com',
        languages: {
          'ar': process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com',
          'en': (process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com') + '/en',
        },
      },

      other: {
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'apple-mobile-web-app-title': globalData.siteName || 'شروع',
        'msapplication-TileColor': '#ffffff',
        'theme-color': '#ffffff',
        'content-language': 'ar',
        'dir': 'rtl',
      },
    };
  }

  // Fallback to static metadata if Strapi is not available
  return {
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
    
    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url: 'https://yoursite.com',
      siteName: 'شروع',
      title: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
      description: 'المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
      description: 'المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية',
      images: ['/twitter-image.jpg'],
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

    alternates: {
      canonical: 'https://yoursite.com',
      languages: {
        'ar': 'https://yoursite.com',
        'en': 'https://yoursite.com/en',
      },
    },

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

    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'شروع',
      'msapplication-TileColor': '#ffffff',
      'msapplication-TileImage': '/ms-icon-144x144.png',
      'theme-color': '#ffffff',
      'revisit-after': '7 days',
      'content-language': 'ar',
      'dir': 'rtl',
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
              "name": globalData?.siteName || "شروع",
              "description": globalData?.siteDescription || "المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com",
              "logo": globalData?.header?.logo?.logoImage?.url 
                ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${globalData.header.logo.logoImage.url}`
                : "https://yoursite.com/logo.png",
              "sameAs": globalData?.footer?.socialLinks?.map(social => social.link.href) || [
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
          <MainLayout globalData={globalData as GlobalData}>
            {children}
          </MainLayout>

      </body>
    </html>
  )
}