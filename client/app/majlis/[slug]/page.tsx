import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGlobalCached, getMajlisBySlugOptimized, getMajlisesOptimized } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate, safeBuildTimeApiCall } from '@/lib/utils';
import { Majlis } from '@/lib/types';
import { RichText } from '@/components/blocks/content/rich-text';
import { SocialShare } from '@/components/custom/social-share';
import { GuestDisplay } from '@/components/custom/guest-display';

// Generate static params for all majlises
export async function generateStaticParams() {
  const fallbackResult: { slug: string }[] = [];

  const result = await safeBuildTimeApiCall(
    () => getMajlisesOptimized(),
    { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } } as any,
    8000 // 8 second timeout
  );

  const majlises = result?.data || [];

  if (Array.isArray(majlises)) {
    return majlises.map((majlis: any) => ({
      slug: majlis.slug,
    }));
  }

  return fallbackResult;
}

interface MajlisPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for majlis page
export async function generateMetadata({ params }: MajlisPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const [majlis, globalData] = await Promise.all([
      getMajlisBySlugOptimized(slug),
      getGlobalCached().catch(() => null)
    ]);

    if (!majlis) {
      return {
        title: 'الجلسة غير موجودة',
        description: 'الجلسة المطلوبة غير موجودة',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const majlisUrl = `${baseUrl}/majlis/${slug}`;

    const title = majlis.SEO?.meta_title || `${majlis.title}`;
    const description = majlis.SEO?.meta_description ||
      (majlis.description ? majlis.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : `جلسة من شروع`);

    const fullTitle = title;

    const defaultImage = globalData?.defaultSeo?.og_image ?
      (getStrapiMedia(globalData.defaultSeo.og_image.url) || `${baseUrl}/og-image.jpg`) :
      `${baseUrl}/og-image.jpg`;

    return {
      metadataBase: new URL(baseUrl),
      title: fullTitle,
      description,
      keywords: majlis.SEO?.meta_keywords?.split(',').map((k: string) => k.trim()),
      openGraph: {
        title: fullTitle,
        description,
        url: majlisUrl,
        type: 'article',
        locale: 'ar_SA',
        siteName: globalData?.siteName || 'شروع',
        images: majlis.cover_image && getStrapiMedia(majlis.cover_image.url) ? [
          {
            url: getStrapiMedia(majlis.cover_image.url)!,
            width: majlis.cover_image.width || 1200,
            height: majlis.cover_image.height || 630,
            alt: majlis.cover_image.alternativeText || majlis.title,
          },
        ] : [
          {
            url: defaultImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        publishedTime: majlis.majlis_date,
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        images: majlis.cover_image && getStrapiMedia(majlis.cover_image.url)
          ? [getStrapiMedia(majlis.cover_image.url)!]
          : [defaultImage],
      },
      alternates: {
        canonical: majlisUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'جلسة شروع',
      description: 'جلسة شروع',
    };
  }
}

export default async function MajlisPage({ params }: MajlisPageProps) {
  try {
    const { slug } = await params;
    const majlis = await getMajlisBySlugOptimized(slug);

    if (!majlis) {
      notFound();
    }

    // Cast the majlis to Majlis type
    const majlisData = majlis as unknown as Majlis;

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
              <Link href="/majlis" className="hover:text-blue-600 transition-colors">
                 الجلسات
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{majlisData.title}</span>
            </div>
          </div>
        </nav>

        {/* Content Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-8 leading-tight font-['IBM_Plex_Sans_Arabic']">
                  {majlisData.title}
                </h1>

                <div className="flex flex-col gap-4 text-gray-600 mb-8 font-['IBM_Plex_Sans_Arabic']">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    تاريخ الجلسة: {formatDate(majlisData.majlis_date)}
                  </div>

                  {majlisData.guests && majlisData.guests.length > 0 && (
                    <GuestDisplay guests={majlisData.guests} />
                  )}
                </div>

                {majlisData.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
                      نبذة عن الجلسة
                    </h2>
                    <div
                      className="prose prose-xl max-w-none text-gray-700 leading-relaxed font-['IBM_Plex_Sans_Arabic']"
                      dangerouslySetInnerHTML={{ __html: majlisData.description }}
                    />
                  </div>
                )}

                {/* Featured Image */}
                {majlisData.cover_image && (
                  <div className="mb-8">
                    <div className="relative aspect-[4/3] md:aspect-[16/9] bg-gray-100 overflow-hidden">
                      <Image
                        src={getStrapiMedia(majlisData.cover_image?.url) || ''}
                        alt={majlisData.cover_image?.alternativeText || majlisData.title}
                        width={majlisData.cover_image?.width || 1200}
                        height={majlisData.cover_image?.height || 675}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                    {majlisData.cover_image?.alternativeText && (
                      <p className="text-xs md:text-sm text-gray-500 mt-2 md:mt-3 text-center italic">
                        {majlisData.cover_image.alternativeText}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              {majlisData.video_url && (
                <div className="pt-8 border-t border-gray-200">
                  <a
                    href={meetingData.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
                  >
                    <svg className="w-6 h-6 ml-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    مشاهدة الفيديو
                  </a>
                </div>
              )}

              {/* Meeting Content */}
              {meetingData.content && (
                <div className="pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['IBM_Plex_Sans_Arabic']">
                    محتوى الجلسة
                  </h2>
                  <RichText content={meetingData.content} />
                </div>
              )}

              {/* Video Embed Section */}
              {meetingData.video_url && (
                <div className="pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['IBM_Plex_Sans_Arabic']">
                    مشاهدة الجلسة
                  </h2>
                  <div className="aspect-video overflow-hidden shadow-lg">
                    {meetingData.video_url.includes('youtube.com') || meetingData.video_url.includes('youtu.be') ? (
                      <iframe
                        src={meetingData.video_url.replace('watch?v=', 'embed/')}
                        title={meetingData.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <video
                        controls
                        className="w-full h-full"
                        poster={getStrapiMedia(meetingData.cover_image?.url) || ''}
                      >
                        <source src={meetingData.video_url} type="video/mp4" />
                        متصفحك لا يدعم تشغيل الفيديو.
                      </video>
                    )}
                  </div>
                </div>
              )}

              {/* Social Share */}
              <div className="pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 md:p-8 border border-gray-200">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 text-right font-['IBM_Plex_Sans_Arabic']">شارك هذه الجلسة</h3>
                  <SocialShare
                    title={meetingData.title}
                    slug={meetingData.slug}
                    description={meetingData.description}
                    type="meeting"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error rendering meeting page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
            عذراً، حدث خطأ
          </h1>
          <p className="text-gray-600 font-['IBM_Plex_Sans_Arabic']">
            لم نتمكن من تحميل تفاصيل الجلسة. يرجى المحاولة مرة أخرى لاحقاً.
          </p>
          <Link
            href="/meeting"
            className="inline-block mt-6 px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors font-['IBM_Plex_Sans_Arabic']"
          >
            العودة إلى اللقاءات
          </Link>
        </div>
      </div>
    );
  }
}
