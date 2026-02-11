import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllMagazineIssues, getFeaturedMagazineIssues } from '@/lib/strapi-client';
import { getGlobalCached, getMagazineIssuesOptimized, getFeaturedMagazineIssuesOptimized } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { DownloadPdfButton } from '@/components/custom/download-pdf-button';
import { formatDate } from '@/lib/utils';
import { MagazineIssue } from '@/lib/types';

// Force dynamic rendering to support search and pagination
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

interface MagazinePageProps {
  searchParams: {
    page?: string;
  };
}

// Generate metadata for magazine page
export async function generateMetadata({ searchParams }: MagazinePageProps): Promise<Metadata> {
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
    const magazineUrl = `${baseUrl}/magazine`;

    // Dynamic title based on page
    let title = 'المجلة';
    let description = 'تصفح جميع أعداد مجلة شروع';

    if (page && parseInt(page) > 1) {
      title = `المجلة - الصفحة ${page}`;
      description = `أعداد مجلة شروع - الصفحة ${page}`;
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
        url: magazineUrl,
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
        canonical: magazineUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'المجلة | شروع',
      description: 'تصفح جميع أعداد مجلة شروع',
    };
  }
}

export default async function MagazinePage({ searchParams }: MagazinePageProps) {
  try {
    // Fetch magazine issues and featured issues using optimized functions
    const [allIssuesResponse, featuredIssuesResponse] = await Promise.all([
      getMagazineIssuesOptimized().catch(() => getAllMagazineIssues()),
      getFeaturedMagazineIssuesOptimized(3).catch(() => getFeaturedMagazineIssues(3))
    ]);

    const allIssues = allIssuesResponse?.data || [];
    const featuredIssues = featuredIssuesResponse?.data || [];

    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section with Latest Issue */}
        <section className="bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              {allIssues.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-['IBM_Plex_Sans_Arabic']">
                      {allIssues[0].title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-['IBM_Plex_Sans_Arabic']">
                      {allIssues[0].description}
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-orange-500 text-black px-3 py-1 text-sm font-bold font-['IBM_Plex_Sans_Arabic']">
                        أحدث إصدار
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 font-['IBM_Plex_Sans_Arabic']">
                      العدد {allIssues[0].issue_number} • {formatDate(allIssues[0].publish_date)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {allIssues[0].pdf_attachment && getStrapiMedia(allIssues[0].pdf_attachment.url) && (
                        <DownloadPdfButton
                          pdfUrl={getStrapiMedia(allIssues[0].pdf_attachment.url)!}
                          fileName={`${allIssues[0].title}-العدد-${allIssues[0].issue_number}.pdf`}
                          className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold hover:bg-gray-100 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic'] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          تحميل PDF
                        </DownloadPdfButton>
                      )}
                      <Link
                        href={`/magazine/${allIssues[0].slug}`}
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
                      >
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        معاينة العدد
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Latest Issue Cover */}
              {allIssues.length > 0 && (
                <div className="relative">
                  <div className="aspect-[3/4] relative bg-gray-900 shadow-xl max-w-sm mx-auto">
                    <Image
                      src={getStrapiMedia(allIssues[0].cover_image?.url) || '/placeholder-magazine.jpg'}
                      alt={allIssues[0].cover_image?.alternativeText || allIssues[0].title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Issues Section */}
        {featuredIssues.length > 0 && (
          <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-16">
                <h2 className="text-4xl font-bold text-black mb-4 font-['IBM_Plex_Sans_Arabic']">
                  الأعداد المميزة
                </h2>
                <div className="w-20 h-1 bg-orange-500"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {featuredIssues.map((issue: any, index: number) => (
                  <FeaturedMagazineCard key={issue.id} issue={issue as MagazineIssue} priority={index === 0} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Issues Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-black mb-4 font-['IBM_Plex_Sans_Arabic']">
                جميع الأعداد
              </h2>
              <div className="w-20 h-1 bg-gray-900"></div>
            </div>

            {allIssues.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {allIssues.map((issue: any) => (
                  <MagazineCard key={issue.id} issue={issue as MagazineIssue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-['IBM_Plex_Sans_Arabic']">
                  لا توجد أعداد متاحة حالياً
                </h3>
                <p className="text-gray-600 font-['IBM_Plex_Sans_Arabic']">
                  ستتم إضافة أعداد جديدة قريباً
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Subscription CTA */}
        {/* <section className="py-24 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-['IBM_Plex_Sans_Arabic']">
              اشترك في نشرتنا الإخبارية
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-['IBM_Plex_Sans_Arabic']">
              احصل على آخر الأخبار والمقالات المتخصصة في ريادة الأعمال والابتكار
            </p>
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-black font-bold hover:bg-orange-400 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
            >
              اشترك الآن
            </Link>
          </div>
        </section> */}
      </div>
    );
  } catch (error) {
    console.error('Error in MagazinePage:', error);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
            حدث خطأ في تحميل المجلة
          </h1>
          <p className="text-gray-600 font-['IBM_Plex_Sans_Arabic']">
            نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى لاحقاً.
          </p>
        </div>
      </div>
    );
  }
}

// Featured Magazine Card Component
function FeaturedMagazineCard({ issue, priority = false }: { issue: MagazineIssue; priority?: boolean }) {
  return (
    <Link href={`/magazine/${issue.slug}`} className="group block">
      <article className="bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-[3/4] relative overflow-hidden">
          <Image
            src={getStrapiMedia(issue.cover_image?.url) || '/placeholder-magazine.jpg'}
            alt={issue.cover_image?.alternativeText || issue.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
          <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-sm font-bold">
            العدد {issue.issue_number}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-black mb-3 group-hover:text-gray-600 transition-colors font-['IBM_Plex_Sans_Arabic'] ">
            {issue.title}
          </h3>
          <div className="text-sm text-gray-500 mb-3 font-['IBM_Plex_Sans_Arabic']">
            {formatDate(issue.publish_date)}
          </div>
          <div
            className="text-gray-600 text-sm line-clamp-3 font-['IBM_Plex_Sans_Arabic']"
            dangerouslySetInnerHTML={{ __html: issue.description?.substring(0, 150) + '...' || '' }}
          />
        </div>
      </article>
    </Link>
  );
}

// Regular Magazine Card Component
function MagazineCard({ issue }: { issue: MagazineIssue }) {
  return (
    <Link href={`/magazine/${issue.slug}`} className="group block">
      <article className="bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-[3/4] relative overflow-hidden">
          <Image
            src={getStrapiMedia(issue.cover_image?.url) || '/placeholder-magazine.jpg'}
            alt={issue.cover_image?.alternativeText || issue.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-black bg-opacity-90 text-white px-2 py-1 text-xs font-bold">
            العدد {issue.issue_number}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-black mb-2 group-hover:text-gray-600 transition-colors font-['IBM_Plex_Sans_Arabic'] ">
            {issue.title}
          </h3>
          <div className="text-sm text-gray-500 font-['IBM_Plex_Sans_Arabic']">
            {formatDate(issue.publish_date)}
          </div>
        </div>
      </article>
    </Link>
  );
}
