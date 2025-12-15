import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans_Arabic, Noto_Sans_Arabic, Tajawal } from "next/font/google"
import "./globals.css"
import { getGlobalCached } from '@/lib/strapi-optimized'
import MainLayout from '@/components/layout/MainLayout'
import type { GlobalData, SocialLink } from '@/lib/types';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import Script from 'next/script'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";

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
  const globalData = await getGlobalCached();

  // Only use Strapi data for metadata
  if (!globalData?.defaultSeo) {
    throw new Error('Strapi SEO data is required for metadata generation.');
  }
  const seo = globalData.defaultSeo;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa'),
    title: {
      default: seo.meta_title || globalData.siteName,
      template: `%s | ${globalData.siteName || 'شروع'}`,
    },
    description: seo.meta_description || globalData.siteDescription,
    keywords: seo.meta_keywords?.split(',').map((k: string) => k.trim()),
    authors: [{ name: globalData.siteName || 'شروع للنشر الرقمي' }],
    creator: globalData.siteName || 'شروع للنشر الرقمي',
    publisher: globalData.siteName || 'شروع للنشر الرقمي',
    category: 'business',
    classification: 'Business & Professional',

    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa',
      siteName: globalData.siteName || 'شروع',
      title: seo.meta_title || globalData.siteName ,
      description: seo.meta_description || globalData.siteDescription,
      ...(seo.og_image && {
        images: [
          {
            url: getStrapiMedia(seo.og_image.url) || '/og-image.jpg',
            width: seo.og_image.width || 1200,
            height: seo.og_image.height || 630,
            alt: seo.og_image.alternativeText || globalData.siteName || 'شروع',
          },
        ],
      }) || {
        images: [
          {
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: globalData.siteName || 'شروع',
          },
        ],
      },
    },

    twitter: {
      card: 'summary_large_image',
      title: seo.meta_title || globalData.siteName,
      description: seo.meta_description || globalData.siteDescription,
      ...(seo.og_image && {
        images: [getStrapiMedia(seo.og_image.url) || '/twitter-image.jpg'],
      }) || {
        images: ['/twitter-image.jpg'],
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
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'your-google-verification-code',
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || 'your-yandex-verification-code',
    },

    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa',
      languages: {
        'ar': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa',
        'en': (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa'),
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch global data from Strapi
  const globalData = await getGlobalCached();
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  if (!globalData || !globalData.footer) {
    return (
      <html lang="ar" suppressHydrationWarning dir="rtl">
        <body className="font-sans flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">عذراً</h1>
            <p className="text-gray-600">حدث خطأ في تحميل البيانات</p>
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
        {/* Preconnect to CDN for faster image loading */}
        <link rel="preconnect" href="https://shuru-bkt.s3.eu-west-3.amazonaws.com" />
        <link rel="dns-prefetch" href="https://shuru-bkt.s3.eu-west-3.amazonaws.com" />

        {/* Preconnect to CMS API */}
        <link rel="preconnect" href="https://cms.shuru.sa" />
        <link rel="dns-prefetch" href="https://cms.shuru.sa" />

        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  custom_map: {
                    'dimension1': 'language'
                  }
                });
              `}
            </Script>
          </>
        )}

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
              "description": globalData?.siteDescription,
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.shuru.sa",
              "logo": globalData?.header?.logo?.logoImage?.url
                ? getStrapiMedia(globalData.header.logo.logoImage.url) || "https://www.shuru.sa/logo.png"
                : "https://www.shuru.sa/logo.png",
              "foundingDate": "2020",
              "industry": "Media and Publishing",
              "areaServed": {
                "@type": "Place",
                "name": "Middle East and North Africa"
              },
              "knowsAbout": globalData?.defaultSeo?.meta_keywords?.split(',').map((k: string) => k.trim()),
              "sameAs": globalData?.footer?.socialLinks?.map((social: SocialLink) => social.link.href),
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
                  "url": "https://www.shuru.sa/logo.png"
                }
              }
            })
          }}
        />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        {GA_MEASUREMENT_ID &&
          <Suspense fallback={null}>
            <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
          </Suspense>
        }

        <MainLayout globalData={globalData as GlobalData}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {children}
        </MainLayout>
      </body>
    </html>
  )
}