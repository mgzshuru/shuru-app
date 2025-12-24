import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPodcastsOptimized, getFeaturedPodcastsOptimized, getGlobalCached } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate } from '@/lib/utils';
import { Podcast } from '@/lib/types';

// Force dynamic rendering to support search and pagination
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

interface PodcastPageProps {
  searchParams: {
    page?: string;
  };
}

// Generate metadata for podcast page
export async function generateMetadata({ searchParams }: PodcastPageProps): Promise<Metadata> {
  try {
    const resolvedSearchParams = await searchParams;
    const { page } = resolvedSearchParams;
    let globalData;

    try {
      globalData = await getGlobalCached();
    } catch (error) {
      console.error('Error fetching global data for metadata:', error);
      globalData = null;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const podcastUrl = `${baseUrl}/podcast`;

    // Dynamic title based on page
    let title = 'البودكاست';
    let description = 'تصفح جميع حلقات البودكاست من شروع';

    if (page && parseInt(page) > 1) {
      title = `البودكاست - الصفحة ${page}`;
      description = `حلقات البودكاست من شروع - الصفحة ${page}`;
    }

    const fullTitle = title;

    const defaultImage = globalData?.defaultSeo?.og_image ?
      (getStrapiMedia(globalData.defaultSeo.og_image.url) || `${baseUrl}/og-image.jpg`) :
      `${baseUrl}/og-image.jpg`;
    return {
      metadataBase: new URL(baseUrl),
      title: fullTitle,
      description,
      keywords: globalData?.defaultSeo?.meta_keywords?.split(',').map((k: string) => k.trim()),
      openGraph: {
        title: fullTitle,
        description,
        url: podcastUrl,
        type: 'website',
        locale: 'ar_SA',
        siteName: globalData?.siteName || 'شروع',
        images: [
          {
            url: defaultImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        images: [defaultImage],
      },
      alternates: {
        canonical: podcastUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'البودكاست | شروع',
      description: 'تصفح جميع حلقات البودكاست من شروع',
    };
  }
}

export default async function PodcastPage({ searchParams }: PodcastPageProps) {
  try {
    // Fetch podcasts and featured podcasts using optimized functions
    const [allPodcastsResponse, featuredPodcastsResponse] = await Promise.all([
      getPodcastsOptimized(),
      getFeaturedPodcastsOptimized(3)
    ]);

    const allPodcasts = allPodcastsResponse?.data || [];
    const featuredPodcasts = featuredPodcastsResponse?.data || [];

    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section with Latest Podcast */}
        <section className="bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              {allPodcasts.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-['IBM_Plex_Sans_Arabic']">
                      {allPodcasts[0].title}
                    </h1>
                    <div
                      className="text-lg md:text-xl text-gray-300 leading-relaxed font-['IBM_Plex_Sans_Arabic']"
                      dangerouslySetInnerHTML={{ __html: allPodcasts[0].description }}
                    />
                  </div>

                  <div className="border-t border-gray-800 pt-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-orange-500 text-black px-3 py-1 text-sm font-bold font-['IBM_Plex_Sans_Arabic']">
                        أحدث حلقة
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 mb-4">
                      <p className="font-['IBM_Plex_Sans_Arabic']">
                        {formatDate(allPodcasts[0].podcast_date)}
                      </p>
                      {allPodcasts[0].duration && (
                        <p className="font-['IBM_Plex_Sans_Arabic']">
                          المدة: {allPodcasts[0].duration}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/podcast/${allPodcasts[0].slug}`}
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold font-['IBM_Plex_Sans_Arabic']"
                      >
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {allPodcasts[0].video_file || allPodcasts[0].video_url ? 'مشاهدة الحلقة' : 'استماع للحلقة'}
                      </Link>
                      {(allPodcasts[0].audio_url || allPodcasts[0].video_file || allPodcasts[0].video_url) && (
                        <a
                          href={allPodcasts[0].audio_url || allPodcasts[0].video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold font-['IBM_Plex_Sans_Arabic']"
                        >
                          <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          تشغيل الآن
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Hero Image */}
              {allPodcasts.length > 0 && allPodcasts[0].cover_image && (
                <div className="relative aspect-[4/3] overflow-hidden shadow-2xl">
                  <Image
                    src={getStrapiMedia(allPodcasts[0].cover_image.url) || '/placeholder.jpg'}
                    alt={allPodcasts[0].cover_image.alternativeText || allPodcasts[0].title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Podcasts Section */}
        {featuredPodcasts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 font-['IBM_Plex_Sans_Arabic']">
                  حلقات مميزة
                </h2>
                <div className="mt-2 h-1 w-20 bg-orange-500"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPodcasts.map((podcast: any) => (
                  <Link
                    key={podcast.id}
                    href={`/podcast/${podcast.slug}`}
                    className="group bg-white overflow-hidden shadow-md"
                  >
                    {podcast.cover_image && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={getStrapiMedia(podcast.cover_image.url) || '/placeholder.jpg'}
                          alt={podcast.cover_image.alternativeText || podcast.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 font-['IBM_Plex_Sans_Arabic']">
                        {podcast.title}
                      </h3>
                      <div className="flex items-center gap-3 text-gray-600 text-sm mb-4">
                        <p className="font-['IBM_Plex_Sans_Arabic']">
                          {formatDate(podcast.podcast_date)}
                        </p>
                        {podcast.duration && (
                          <p className="font-['IBM_Plex_Sans_Arabic']">
                            • {podcast.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Podcasts Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-['IBM_Plex_Sans_Arabic']">
                جميع الحلقات
              </h2>
              <div className="mt-2 h-1 w-20 bg-orange-500"></div>
            </div>

            {allPodcasts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500 font-['IBM_Plex_Sans_Arabic']">
                  لا توجد حلقات متاحة حالياً
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allPodcasts.map((podcast: any) => (
                  <Link
                    key={podcast.id}
                    href={`/podcast/${podcast.slug}`}
                    className="group bg-white overflow-hidden shadow-md border border-gray-100"
                  >
                    {podcast.cover_image && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={getStrapiMedia(podcast.cover_image.url) || '/placeholder.jpg'}
                          alt={podcast.cover_image.alternativeText || podcast.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 font-['IBM_Plex_Sans_Arabic']">
                        {podcast.title}
                      </h3>
                      <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <p className="font-['IBM_Plex_Sans_Arabic']">
                          {formatDate(podcast.podcast_date)}
                        </p>
                        {podcast.duration && (
                          <p className="font-['IBM_Plex_Sans_Arabic']">
                            • {podcast.duration}
                          </p>
                        )}
                      </div>
                      {podcast.guests && (
                        <p className="text-gray-500 text-sm mt-2 line-clamp-1 font-['IBM_Plex_Sans_Arabic']">
                          الضيوف: {podcast.guests}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error rendering podcast page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
            عذراً، حدث خطأ
          </h1>
          <p className="text-gray-600 font-['IBM_Plex_Sans_Arabic']">
            لم نتمكن من تحميل صفحة البودكاست. يرجى المحاولة مرة أخرى لاحقاً.
          </p>
        </div>
      </div>
    );
  }
}
