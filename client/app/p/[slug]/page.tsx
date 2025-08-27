import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ContentRenderer } from '@/components/blocks/content/ContentRenderer';
import { getPageBySlug, getAllPages, getGlobalCached } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate, safeBuildTimeApiCall, extractTextFromRichContent } from '@/lib/utils';
import { Block, Page } from '@/lib/types';
import styles from '@/components/article-content.module.css';
import { PageStructuredData } from '@/components/seo/StructuredData';
// Use the Page type from types.ts with additional fields
interface PageData extends Omit<Page, 'blocks'> {
  description?: string;
  featured_image?: {
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
  };
  blocks?: Block[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fetch page data from Strapi using the service
async function getPageData(slug: string): Promise<PageData | null> {
  try {
    // Add timeout for runtime page data fetching as well
    const page = await safeBuildTimeApiCall(
      () => getPageBySlug(slug),
      null,
      15000 // 15 second timeout for runtime
    );

    if (!page) return null;

    // Map the Strapi response to PageData
    return {
      id: page.id,
      documentId: page.documentId,
      title: page.title,
      slug: page.slug,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      publishedAt: page.publishedAt,
      description: page.description,
      featured_image: page.featured_image
        ? {
            url: page.featured_image.url,
            alternativeText: page.featured_image.alternativeText,
            width: page.featured_image.width,
            height: page.featured_image.height,
          }
        : undefined,
      blocks: page.blocks || [], // Changed from 'content' to 'blocks'
      SEO: page.SEO, // Changed from 'seo' to 'SEO'
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageData(slug);
  console.log('DEBUG page:', page);
  // Try to get global data, but don't fail if it's not available
  let globalData;
  try {
    globalData = await getGlobalCached();
  } catch (error) {
    console.error('Error fetching global data for metadata:', error);
    globalData = null;
  }

  if (!page) {
    return {
      title: 'الصفحة غير موجودة | شروع',
      description: 'الصفحة المطلوبة غير متوفرة.',
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
  const pageUrl = `${baseUrl}/p/${page.slug}`;

  // Extract text content for description if not provided
  const richTextBlock = page.blocks?.find(block => block.__component === 'content.rich-text');
  const extractedDescription = page.description ||
    (richTextBlock?.content ? extractTextFromRichContent(richTextBlock.content, 160) : '') ||
    'صفحة في موقع شروع للابتكار وريادة الأعمال';

  // Get SEO data from page or fallback
  const seoTitle = page.SEO?.meta_title ||
    `${page.title} | 'شروع'`;

  const seoDescription = page.SEO?.meta_description ||
    extractedDescription.substring(0, 160);

  const seoKeywords = page.SEO?.meta_keywords?.split(',').map(k => k.trim()).filter(Boolean);

  // Page image for social sharing
  const defaultImage = globalData?.defaultSeo?.og_image ?
    (getStrapiMedia(globalData.defaultSeo.og_image.url) || `${baseUrl}/og-image.jpg`) :
    `${baseUrl}/og-image.jpg`;


  const pageImage = page.SEO?.og_image
    ? getStrapiMedia(page.SEO.og_image.url) || page.SEO.og_image.url
    : page.featured_image
    ? getStrapiMedia(page.featured_image.url) || page.featured_image.url
    : defaultImage;

  // Debug: print the pageImage value
  console.log('DEBUG pageImage:', page.SEO?.og_image?.url);

  return {
    metadataBase: new URL(baseUrl),
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    creator: globalData?.siteName || 'شروع',
    publisher: globalData?.siteName || 'شروع للنشر الرقمي',

    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url: pageUrl,
      siteName: globalData?.siteName || 'شروع',
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: pageImage,
          width: page.featured_image?.width || 1200,
          height: page.featured_image?.height || 630,
          alt: page.featured_image?.alternativeText || page.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: pageImage ? [pageImage] : undefined,
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
      canonical: pageUrl,
    },
  };
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  const fallbackResult: { slug: string }[] = [];

  const result = await safeBuildTimeApiCall(
    () => getAllPages(),
    { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } } as any,
    8000 // 8 second timeout
  );

  if (result?.data && Array.isArray(result.data)) {
    return result.data.map((page: any) => ({
      slug: page.slug,
    }));
  }

  return fallbackResult;
}

export default async function PageComponent({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    notFound();
  }

  // Get global data for structured data
  let globalData;
  try {
    globalData = await getGlobalCached();
  } catch (error) {
    console.error('Error fetching global data for structured data:', error);
    globalData = null;
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <PageStructuredData page={page} globalData={globalData} />
      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200 top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center text-sm" dir="rtl">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
              الرئيسية
            </Link>
            <svg className="w-4 h-4 mx-2 sm:mx-3 text-gray-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium truncate">{page.title}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="px-4 sm:px-6 pt-8 sm:pt-16 pb-8 sm:pb-12 border-b border-gray-200">
          <div className="max-w-4xl mx-auto" dir="rtl">
            {/* Page Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight mb-6 sm:mb-8 tracking-normal text-right" dir="rtl" style={{ lineHeight: '1.2', wordSpacing: '0.1em' }}>
              {page.title}
            </h1>

            {/* Page Description */}
            {page.description && (
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 sm:mb-12 max-w-4xl font-light text-right">
                {page.description}
              </p>
            )}

          </div>
        </header>

        {/* Featured Image */}
        {page.featured_image && (
          <div className="px-4 sm:px-6 mb-8 sm:mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden rounded-lg">
                <Image
                  src={getStrapiMedia(page.featured_image.url) || page.featured_image.url}
                  alt={page.featured_image.alternativeText || page.title}
                  width={page.featured_image.width || 1200}
                  height={page.featured_image.height || 675}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {page.featured_image.alternativeText && (
                <p className="text-sm text-gray-500 mt-3 text-center italic px-2">
                  {page.featured_image.alternativeText}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Page Content */}
            <main dir="rtl">
              <div id="page-content" className={styles.articleContent}>
                {page.blocks && page.blocks.length > 0 ? (
                  <ContentRenderer blocks={page.blocks} />
                ) : (
                  <div className="text-center py-16 sm:py-24 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">لا يوجد محتوى متاح</h3>
                    <p className="text-gray-500 text-sm sm:text-base px-4">
                      المحتوى غير متوفر لهذه الصفحة في الوقت الحالي.
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Structured Data for Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": page.title,
            "description": page.description,
            "image": page.featured_image ? getStrapiMedia(page.featured_image.url) : undefined,
            "datePublished": page.publishedAt,
            "dateModified": page.updatedAt,
            "url": `https://www.shuru.sa/p/${page.slug}`,
            "publisher": {
              "@type": "Organization",
              "name": "شروع",
              "url": "https://www.shuru.sa"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://www.shuru.sa/p/${page.slug}`
            }
          })
        }}
      />
    </div>
  );
}