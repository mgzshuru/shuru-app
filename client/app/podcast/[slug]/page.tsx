import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGlobalCached, getPodcastBySlugOptimized, getPodcastsOptimized } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate, safeBuildTimeApiCall } from '@/lib/utils';
import { Podcast } from '@/lib/types';
import { RichText } from '@/components/blocks/content/rich-text';
import { SocialShare } from '@/components/custom/social-share';
import { GuestDisplay } from '@/components/custom/guest-display';

// Generate static params for all podcasts
export async function generateStaticParams() {
  const fallbackResult: { slug: string }[] = [];

  const result = await safeBuildTimeApiCall(
    () => getPodcastsOptimized(),
    { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } } as any,
    8000 // 8 second timeout
  );

  const podcasts = result?.data || [];

  if (Array.isArray(podcasts)) {
    return podcasts.map((podcast: any) => ({
      slug: podcast.slug,
    }));
  }

  return fallbackResult;
}

interface PodcastPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for podcast page
export async function generateMetadata({ params }: PodcastPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const [podcast, globalData] = await Promise.all([
      getPodcastBySlugOptimized(slug),
      getGlobalCached().catch(() => null)
    ]);

    if (!podcast) {
      return {
        title: 'الحلقة غير موجودة',
        description: 'حلقة البودكاست المطلوبة غير موجودة',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const podcastUrl = `${baseUrl}/podcast/${slug}`;

    const title = podcast.SEO?.meta_title || `${podcast.title}`;
    const description = podcast.SEO?.meta_description ||
      (podcast.description ? podcast.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : `حلقة بودكاست من شروع`);

    const fullTitle = title;

    const defaultImage = globalData?.defaultSeo?.og_image ?
      (getStrapiMedia(globalData.defaultSeo.og_image.url) || `${baseUrl}/og-image.jpg`) :
      `${baseUrl}/og-image.jpg`;

    return {
      metadataBase: new URL(baseUrl),
      title: fullTitle,
      description,
      keywords: podcast.SEO?.meta_keywords?.split(',').map((k: string) => k.trim()),
      openGraph: {
        title: fullTitle,
        description,
        url: podcastUrl,
        type: 'article',
        locale: 'ar_SA',
        siteName: globalData?.siteName || 'شروع',
        images: podcast.cover_image && getStrapiMedia(podcast.cover_image.url) ? [
          {
            url: getStrapiMedia(podcast.cover_image.url)!,
            width: podcast.cover_image.width || 1200,
            height: podcast.cover_image.height || 630,
            alt: podcast.cover_image.alternativeText || podcast.title,
          },
        ] : [
          {
            url: defaultImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        publishedTime: podcast.podcast_date,
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        images: podcast.cover_image && getStrapiMedia(podcast.cover_image.url)
          ? [getStrapiMedia(podcast.cover_image.url)!]
          : [defaultImage],
      },
      alternates: {
        canonical: podcastUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'حلقة بودكاست من شروع',
      description: 'حلقة بودكاست من شروع',
    };
  }
}

export default async function PodcastPage({ params }: PodcastPageProps) {
  try {
    const { slug } = await params;
    const podcast = await getPodcastBySlugOptimized(slug);

    if (!podcast) {
      notFound();
    }

    // Cast the podcast to Podcast type
    const podcastData = podcast as unknown as Podcast;

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
              <Link href="/podcast" className="hover:text-blue-600 transition-colors">
                البودكاست
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{podcastData.title}</span>
            </div>
          </div>
        </nav>

        {/* Content Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-8 leading-tight font-['IBM_Plex_Sans_Arabic']">
                  {podcastData.title}
                </h1>

                <div className="flex flex-col gap-4 text-gray-600 mb-8 font-['IBM_Plex_Sans_Arabic']">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      تاريخ النشر: {formatDate(podcastData.podcast_date)}
                    </div>
                    {podcastData.duration && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        المدة: {podcastData.duration}
                      </div>
                    )}
                  </div>

                  {podcastData.guests && podcastData.guests.length > 0 && (
                    <GuestDisplay guests={podcastData.guests} />
                  )}
                </div>

                {podcastData.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
                      نبذة عن الحلقة
                    </h2>
                    <div
                      className="prose prose-xl max-w-none text-gray-700 leading-relaxed font-['IBM_Plex_Sans_Arabic']"
                      dangerouslySetInnerHTML={{ __html: podcastData.description }}
                    />
                  </div>
                )}

                {/* Featured Image */}
                {podcastData.cover_image && (
                  <div className="mb-8">
                    <div className="relative aspect-[4/3] md:aspect-[16/9] bg-gray-100 overflow-hidden">
                      <Image
                        src={getStrapiMedia(podcastData.cover_image?.url) || ''}
                        alt={podcastData.cover_image?.alternativeText || podcastData.title}
                        width={podcastData.cover_image?.width || 1200}
                        height={podcastData.cover_image?.height || 675}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                    {podcastData.cover_image?.alternativeText && (
                      <p className="text-xs md:text-sm text-gray-500 mt-2 md:mt-3 text-center italic">
                        {podcastData.cover_image.alternativeText}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Video Player Section */}
              {(podcastData.video_file || podcastData.video_url) && (
                <div className="pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['IBM_Plex_Sans_Arabic']">
                    مشاهدة الحلقة
                  </h2>
                  <div className="aspect-video overflow-hidden shadow-lg">
                    {podcastData.video_url && (podcastData.video_url.includes('youtube.com') || podcastData.video_url.includes('youtu.be')) ? (
                      <iframe
                        src={podcastData.video_url.replace('watch?v=', 'embed/')}
                        title={podcastData.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : podcastData.video_file ? (
                      <video
                        controls
                        className="w-full h-full"
                        poster={getStrapiMedia(podcastData.cover_image?.url) || ''}
                      >
                        <source src={getStrapiMedia(podcastData.video_file.url) || ''} type={podcastData.video_file.mime || 'video/mp4'} />
                        متصفحك لا يدعم تشغيل الفيديو.
                      </video>
                    ) : podcastData.video_url ? (
                      <video
                        controls
                        className="w-full h-full"
                        poster={getStrapiMedia(podcastData.cover_image?.url) || ''}
                      >
                        <source src={podcastData.video_url} type="video/mp4" />
                        متصفحك لا يدعم تشغيل الفيديو.
                      </video>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Audio Player Section */}
              {podcastData.audio_url && (
                <div className="pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['IBM_Plex_Sans_Arabic']">
                    استماع للحلقة
                  </h2>
                  <div className="bg-gray-50 p-6 border border-gray-200">
                    <audio
                      controls
                      className="w-full"
                      preload="metadata"
                    >
                      <source src={podcastData.audio_url} type="audio/mpeg" />
                      <source src={podcastData.audio_url} type="audio/wav" />
                      <source src={podcastData.audio_url} type="audio/ogg" />
                      متصفحك لا يدعم تشغيل الصوت.
                    </audio>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                      <span className="font-['IBM_Plex_Sans_Arabic']">
                        استمع الآن أو حمل الحلقة
                      </span>
                      <a
                        href={podcastData.audio_url}
                        download
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors font-['IBM_Plex_Sans_Arabic']"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        تحميل الحلقة
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Podcast Content */}
              {podcastData.content && (
                <div className="pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['IBM_Plex_Sans_Arabic']">
                    محتوى الحلقة
                  </h2>
                  <RichText content={podcastData.content} />
                </div>
              )}

              {/* Social Share */}
              <div className="pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 md:p-8 border border-gray-200">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 text-right font-['IBM_Plex_Sans_Arabic']">شارك هذه الحلقة</h3>
                  <SocialShare
                    title={podcastData.title}
                    slug={podcastData.slug}
                    description={podcastData.description}
                    type="podcast"
                  />
                </div>
              </div>
            </div>
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
            لم نتمكن من تحميل تفاصيل حلقة البودكاست. يرجى المحاولة مرة أخرى لاحقاً.
          </p>
          <Link
            href="/podcast"
            className="inline-block mt-6 px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors font-['IBM_Plex_Sans_Arabic']"
          >
            العودة إلى البودكاست
          </Link>
        </div>
      </div>
    );
  }
}
