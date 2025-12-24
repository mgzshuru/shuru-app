import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGlobalCached, getNewsBySlugOptimized, getNewsOptimized } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate, safeBuildTimeApiCall } from '@/lib/utils';
import { News } from '@/lib/types';
import { RichText } from '@/components/blocks/content/rich-text';
import { SocialShare } from '@/components/custom/social-share';

// Generate static params for all news
export async function generateStaticParams() {
  const fallbackResult: { slug: string }[] = [];

  const result = await safeBuildTimeApiCall(
    () => getNewsOptimized(),
    { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } } as any,
    8000 // 8 second timeout
  );

  const news = result?.data || [];

  if (Array.isArray(news)) {
    return news.map((item: any) => ({
      slug: item.slug,
    }));
  }

  return fallbackResult;
}

interface NewsPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for news page
export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const [news, globalData] = await Promise.all([
      getNewsBySlugOptimized(slug),
      getGlobalCached().catch(() => null)
    ]);

    if (!news) {
      return {
        title: 'الخبر غير موجود',
        description: 'الخبر المطلوب غير موجود',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const newsUrl = `${baseUrl}/news/${slug}`;

    const title = news.SEO?.meta_title || `${news.title}`;
    const description = news.SEO?.meta_description ||
      (news.description ? news.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : `خبر من شروع`);

    const fullTitle = title;

    const defaultImage = globalData?.defaultSeo?.og_image ?
      (getStrapiMedia(globalData.defaultSeo.og_image.url) || `${baseUrl}/og-image.jpg`) :
      `${baseUrl}/og-image.jpg`;

    return {
      metadataBase: new URL(baseUrl),
      title: fullTitle,
      description,
      keywords: news.SEO?.meta_keywords?.split(',').map((k: string) => k.trim()),
      openGraph: {
        title: fullTitle,
        description,
        url: newsUrl,
        type: 'article',
        locale: 'ar_SA',
        siteName: globalData?.siteName || 'شروع',
        images: news.cover_image && getStrapiMedia(news.cover_image.url) ? [
          {
            url: getStrapiMedia(news.cover_image.url)!,
            width: news.cover_image.width || 1200,
            height: news.cover_image.height || 630,
            alt: news.cover_image.alternativeText || news.title,
          },
        ] : [
          {
            url: defaultImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        publishedTime: news.news_date,
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        images: news.cover_image && getStrapiMedia(news.cover_image.url)
          ? [getStrapiMedia(news.cover_image.url)!]
          : [defaultImage],
      },
      alternates: {
        canonical: newsUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'خبر شروع',
      description: 'خبر شروع',
    };
  }
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  try {
    const { slug } = await params;
    const news = await getNewsBySlugOptimized(slug);

    if (!news) {
      notFound();
    }

    // Cast the news to News type
    const newsData = news as unknown as News;

    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <nav className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600 font-['IBM_Plex_Sans_Arabic']">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                الرئيسية
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/news" className="hover:text-blue-600 transition-colors">
                الأخبار
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{newsData.title}</span>
            </div>
          </div>
        </nav>

        {/* Content Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-8 leading-tight font-['IBM_Plex_Sans_Arabic']">
                  {newsData.title}
                </h1>

                <div className="flex flex-col gap-4 text-gray-600 mb-8 font-['IBM_Plex_Sans_Arabic']">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    تاريخ الخبر: {formatDate(newsData.news_date)}
                  </div>
                </div>

                {newsData.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
                      نبذة عن الخبر
                    </h2>
                    <div
                      className="prose prose-xl max-w-none text-gray-700 leading-relaxed font-['IBM_Plex_Sans_Arabic']"
                      dangerouslySetInnerHTML={{ __html: newsData.description }}
                    />
                  </div>
                )}

                {/* Featured Image */}
                {newsData.cover_image && (
                  <div className="mb-8">
                    <div className="relative aspect-[4/3] md:aspect-[16/9] bg-gray-100 overflow-hidden">
                      <Image
                        src={getStrapiMedia(newsData.cover_image?.url) || ''}
                        alt={newsData.cover_image?.alternativeText || newsData.title}
                        width={newsData.cover_image?.width || 1200}
                        height={newsData.cover_image?.height || 675}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                    {newsData.cover_image?.alternativeText && (
                      <p className="text-xs md:text-sm text-gray-500 mt-2 md:mt-3 text-center italic">
                        {newsData.cover_image.alternativeText}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* News Content */}
              {newsData.content && (
                <div className="pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['IBM_Plex_Sans_Arabic']">
                    تفاصيل الخبر
                  </h2>
                  <RichText content={newsData.content} />
                </div>
              )}

              {/* Social Share */}
              <div className="pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 md:p-8 border border-gray-200">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 text-right font-['IBM_Plex_Sans_Arabic']">شارك هذا الخبر</h3>
                  <SocialShare
                    title={newsData.title}
                    slug={newsData.slug}
                    description={newsData.description}
                    type="news"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error rendering news page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
            عذراً، حدث خطأ
          </h1>
          <p className="text-gray-600 font-['IBM_Plex_Sans_Arabic']">
            لم نتمكن من تحميل تفاصيل الخبر. يرجى المحاولة مرة أخرى لاحقاً.
          </p>
          <Link
            href="/news"
            className="inline-block mt-6 px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors font-['IBM_Plex_Sans_Arabic']"
          >
            العودة إلى الأخبار
          </Link>
        </div>
      </div>
    );
  }
}
