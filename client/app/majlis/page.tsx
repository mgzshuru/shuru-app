import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getMajlisesOptimized, getFeaturedMajlisesOptimized, getGlobalCached } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate } from '@/lib/utils';
import { Majlis } from '@/lib/types';

// Force dynamic rendering to support search and pagination
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

interface MajlisPageProps {
  searchParams: {
    page?: string;
  };
}

// Generate metadata for majlis page
export async function generateMetadata({ searchParams }: MajlisPageProps): Promise<Metadata> {
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
    const majlisUrl = `${baseUrl}/majlis`;

    // Dynamic title based on page
    let title = 'الجلسات';
    let description = 'تصفح جميع جلسات شروع';

    if (page && parseInt(page) > 1) {
      title = `الجلسات - الصفحة ${page}`;
      description = `جلسات شروع - الصفحة ${page}`;
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
        url: majlisUrl,
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
        canonical: majlisUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'الجلسات | شروع',
      description: 'تصفح جميع جلسات شروع',
    };
  }
}

export default async function MajlisPage({ searchParams }: MajlisPageProps) {
  try {
    // Fetch majlises and featured majlises using optimized functions
    const [allMajlisesResponse, featuredMajlisesResponse] = await Promise.all([
      getMajlisesOptimized(),
      getFeaturedMajlisesOptimized(3)
    ]);

    const allMajlises = (allMajlisesResponse?.data || []) as Majlis[];
    const featuredMajlises = (featuredMajlisesResponse?.data || []) as Majlis[];

    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section with Latest Majlis */}
        <section className="bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              {allMajlises.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-['IBM_Plex_Sans_Arabic']">
                      {allMajlises[0].title}
                    </h1>
                    <div
                      className="text-lg md:text-xl text-gray-300 leading-relaxed font-['IBM_Plex_Sans_Arabic']"
                      dangerouslySetInnerHTML={{ __html: allMajlises[0].description }}
                    />
                  </div>

                  <div className="border-t border-gray-800 pt-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-orange-500 text-black px-3 py-1 text-sm font-bold font-['IBM_Plex_Sans_Arabic']">
                        أحدث مجلس
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 font-['IBM_Plex_Sans_Arabic']">
                      {formatDate(allMajlises[0].majlis_date)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/majlis/${allMajlises[0].slug}`}
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold font-['IBM_Plex_Sans_Arabic']"
                      >
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        مشاهدة المجلس
                      </Link>
                      {allMajlises[0].video_url && (
                        <a
                          href={allMajlises[0].video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold font-['IBM_Plex_Sans_Arabic']"
                        >
                          <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          مشاهدة الفيديو
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Hero Image */}
              {allMajlises.length > 0 && allMajlises[0].cover_image && (
                <div className="relative aspect-[16/9] overflow-hidden shadow-2xl">
                  <Image
                    src={getStrapiMedia(allMajlises[0].cover_image.url) || '/placeholder.jpg'}
                    alt={allMajlises[0].cover_image.alternativeText || allMajlises[0].title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Majliss Section */}
        {featuredMajlises.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 font-['IBM_Plex_Sans_Arabic']">
                  جلسات مميزة
                </h2>
                <div className="mt-2 h-1 w-20 bg-orange-500"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredMajlises.map((majlis: Majlis) => (
                  <Link
                    key={majlis.id}
                    href={`/majlis/${majlis.slug}`}
                    className="group bg-white overflow-hidden shadow-md"
                  >
                    {majlis.cover_image && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={getStrapiMedia(majlis.cover_image.url) || '/placeholder.jpg'}
                          alt={majlis.cover_image.alternativeText || majlis.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 font-['IBM_Plex_Sans_Arabic']">
                        {majlis.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 font-['IBM_Plex_Sans_Arabic']">
                        {formatDate(majlis.majlis_date)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Majlises Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-['IBM_Plex_Sans_Arabic']">
                جميع الجلسات
              </h2>
              <div className="mt-2 h-1 w-20 bg-orange-500"></div>
            </div>

            {allMajlises.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500 font-['IBM_Plex_Sans_Arabic']">
                  لا توجد جلسات متاحة حالياً
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allMajlises.map((majlis: Majlis) => (
                  <Link
                    key={majlis.id}
                    href={`/majlis/${majlis.slug}`}
                    className="group bg-white overflow-hidden shadow-md border border-gray-100">
                    {majlis.cover_image && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={getStrapiMedia(majlis.cover_image.url) || '/placeholder.jpg'}
                          alt={majlis.cover_image.alternativeText || majlis.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 font-['IBM_Plex_Sans_Arabic']">
                        {majlis.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-['IBM_Plex_Sans_Arabic']">
                        {formatDate(majlis.majlis_date)}
                      </p>
                      {majlis.guests && majlis.guests.length > 0 && (
                        <p className="text-gray-500 text-sm mt-2 line-clamp-1 font-['IBM_Plex_Sans_Arabic']">
                          الضيوف: {majlis.guests.map(g => g.name).join(', ')}
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
    console.error('Error rendering majlis page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
            عذراً، حدث خطأ
          </h1>
          <p className="text-gray-600 font-['IBM_Plex_Sans_Arabic']">
            لم نتمكن من تحميل صفحة الجلسات. يرجى المحاولة مرة أخرى لاحقاً.
          </p>
        </div>
      </div>
    );
  }
}
