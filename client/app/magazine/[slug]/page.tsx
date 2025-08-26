import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMagazineIssueBySlug, getAllMagazineIssues } from '@/lib/strapi-client';
import { getGlobalCached, getMagazineIssueBySlugOptimized, getMagazineIssuesOptimized } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { SaveButton } from '@/components/custom/save-button';
import { formatDate, safeBuildTimeApiCall } from '@/lib/utils';
import { MagazineIssue, Article } from '@/lib/types';
import { MagazineStructuredData } from '@/components/seo/StructuredData';

// Generate static params for all magazine issues
export async function generateStaticParams() {
  const fallbackResult: { slug: string }[] = [];

  const result = await safeBuildTimeApiCall(
    () => getMagazineIssuesOptimized().catch(() => getAllMagazineIssues()),
    { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } } as any,
    8000 // 8 second timeout
  );

  const issues = result?.data || [];

  if (Array.isArray(issues)) {
    return issues.map((issue: any) => ({
      slug: issue.slug,
    }));
  }

  return fallbackResult;
}

interface MagazineIssuePageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for magazine issue page
export async function generateMetadata({ params }: MagazineIssuePageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const [issue, globalData] = await Promise.all([
      getMagazineIssueBySlugOptimized(slug).catch(() => getMagazineIssueBySlug(slug)),
      getGlobalCached().catch(() => null)
    ]);

    if (!issue) {
      return {
        title: 'العدد غير موجود | شروع',
        description: 'العدد المطلوب غير موجود',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const issueUrl = `${baseUrl}/magazine/${slug}`;

    const title = issue.SEO?.meta_title || `${issue.title} - العدد ${issue.issue_number}`;
    const description = issue.SEO?.meta_description ||
      (issue.description ? issue.description.substring(0, 160) + '...' : `العدد ${issue.issue_number} من مجلة شروع`);

    const fullTitle = globalData?.siteName
      ? `${title} | ${globalData.siteName}`
      : title;

    const defaultImage = globalData?.defaultSeo?.og_image ?
      (getStrapiMedia(globalData.defaultSeo.og_image.url) || `${baseUrl}/og-image.jpg`) :
      `${baseUrl}/og-image.jpg`;

    return {
      metadataBase: new URL(baseUrl),
      title: fullTitle,
      description,
      keywords: issue.SEO?.meta_keywords?.split(',').map((k: string) => k.trim()),
      openGraph: {
        title: fullTitle,
        description,
        url: issueUrl,
        type: 'article',
        locale: 'ar_SA',
        siteName: globalData?.siteName || 'شروع',
        images: issue.cover_image && getStrapiMedia(issue.cover_image.url) ? [
          {
            url: getStrapiMedia(issue.cover_image.url)!,
            width: issue.cover_image.width || 800,
            height: issue.cover_image.height || 1000,
            alt: issue.cover_image.alternativeText || issue.title,
          },
        ] : [
          {
            url: defaultImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        publishedTime: issue.publish_date,
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        images: issue.cover_image && getStrapiMedia(issue.cover_image.url)
          ? [getStrapiMedia(issue.cover_image.url)!]
          : [defaultImage],
      },
      alternates: {
        canonical: issueUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'مجلة شروع',
      description: 'مجلة شروع',
    };
  }
}

export default async function MagazineIssuePage({ params }: MagazineIssuePageProps) {
  try {
    const { slug } = await params;
    const issue = await getMagazineIssueBySlugOptimized(slug).catch(() => getMagazineIssueBySlug(slug));

    if (!issue) {
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

    // Cast the issue to MagazineIssue type
    const magazineIssue = issue as unknown as MagazineIssue;

    return (
      <div className="min-h-screen bg-white">
        <MagazineStructuredData issue={magazineIssue} globalData={globalData} />
        {/* Breadcrumb */}
        <nav className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600 font-['IBM_Plex_Sans_Arabic']">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                الرئيسية
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/magazine" className="hover:text-blue-600 transition-colors">
                المجلة
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">العدد {magazineIssue.issue_number}</span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-16 items-start">
              {/* Cover Image */}
              <div className="lg:top-8">
                <div className="aspect-[3/4] relative bg-gray-100 shadow-2xl max-w-sm mx-auto">
                  <Image
                    src={getStrapiMedia(magazineIssue.cover_image?.url) || '/placeholder-magazine.jpg'}
                    alt={magazineIssue.cover_image?.alternativeText || magazineIssue.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Issue Details */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-orange-500 text-black text-sm font-bold mb-6 font-['IBM_Plex_Sans_Arabic']">
                    العدد {magazineIssue.issue_number}
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight font-['IBM_Plex_Sans_Arabic']">
                    {magazineIssue.title}
                  </h1>

                  <div className="flex items-center text-gray-600 mb-8 font-['IBM_Plex_Sans_Arabic']">
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    تاريخ النشر: {formatDate(magazineIssue.publish_date)}
                  </div>

                  {magazineIssue.description && (
                    <div
                      className="prose prose-xl max-w-none text-gray-700 leading-relaxed font-['IBM_Plex_Sans_Arabic']"
                      dangerouslySetInnerHTML={{ __html: magazineIssue.description }}
                    />
                  )}
                </div>

                {/* Download Buttons Section */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="space-y-4">
                    {magazineIssue.pdf_attachment && getStrapiMedia(magazineIssue.pdf_attachment.url) && (
                      <a
                        href={getStrapiMedia(magazineIssue.pdf_attachment.url)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-6 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
                      >
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        تحميل المجلة PDF
                      </a>
                    )}
                  </div>
                </div>

                {/* Share Section */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-xl font-bold text-black mb-6 font-['IBM_Plex_Sans_Arabic']">
                    شارك هذا العدد
                  </h3>
                  <div className="flex space-x-4 rtl:space-x-reverse">
                    <ShareButton
                      platform="twitter"
                      url={`${process.env.NEXT_PUBLIC_SITE_URL}/magazine/${magazineIssue.slug}`}
                      title={magazineIssue.title}
                    />
                    <ShareButton
                      platform="facebook"
                      url={`${process.env.NEXT_PUBLIC_SITE_URL}/magazine/${magazineIssue.slug}`}
                      title={magazineIssue.title}
                    />
                    <ShareButton
                      platform="linkedin"
                      url={`${process.env.NEXT_PUBLIC_SITE_URL}/magazine/${magazineIssue.slug}`}
                      title={magazineIssue.title}
                    />
                    <ShareButton
                      platform="whatsapp"
                      url={`${process.env.NEXT_PUBLIC_SITE_URL}/magazine/${magazineIssue.slug}`}
                      title={magazineIssue.title}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles in this Issue Section */}
        {magazineIssue.articles && magazineIssue.articles.length > 0 && (
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-black mb-12 text-center font-['IBM_Plex_Sans_Arabic']">
                مقالات هذا العدد
              </h2>
              <div className="space-y-8">
                {magazineIssue.articles.map((article: any) => (
                  <ArticleCard key={article.id} article={article as Article} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Navigation to other issues */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-8 font-['IBM_Plex_Sans_Arabic']">
                استكشف أعداد أخرى
              </h2>
              <Link
                href="/magazine"
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
              >
                تصفح جميع الأعداد
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error in MagazineIssuePage:', error);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
            حدث خطأ في تحميل العدد
          </h1>
          <p className="text-gray-600 font-['IBM_Plex_Sans_Arabic']">
            نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى لاحقاً.
          </p>
        </div>
      </div>
    );
  }
}

// Article Card Component
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <article className="flex gap-6 p-6 border border-gray-300 bg-white">
        {article.cover_image && getStrapiMedia(article.cover_image.url) && (
          <div className="flex-shrink-0 w-32 h-32 relative overflow-hidden">
            <Image
              src={getStrapiMedia(article.cover_image.url)!}
              alt={article.cover_image.alternativeText || article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-black mb-3  font-['IBM_Plex_Sans_Arabic']">
            {article.title}
          </h3>
          {article.description && (
            <p className="text-gray-600 text-sm  mb-3 font-['IBM_Plex_Sans_Arabic']">
              {article.description}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500 font-['IBM_Plex_Sans_Arabic']">
            <div className="flex items-center">
              {article.author && (
                <>
                  <span>{article.author.name}</span>
                  <span className="mx-2">•</span>
                </>
              )}
              <span>{formatDate(article.publish_date)}</span>
            </div>
            <SaveButton
              articleId={article.documentId}
              articleTitle={article.title}
              size="sm"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

// Share Button Component
function ShareButton({ platform, url, title }: { platform: string; url: string; title: string }) {
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
  };

  const iconMap = {
    twitter: '/icons/x.svg',
    facebook: '/icons/facebook.svg',
    linkedin: '/icons/linkedin.svg',
    whatsapp: null, // WhatsApp icon not available in icons folder
  };

  // Fallback WhatsApp SVG since it's not in the icons folder
  const whatsappIcon = (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
  );

  return (
    <a
      href={shareUrls[platform as keyof typeof shareUrls]}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition-colors duration-200 group"
      aria-label={`مشاركة عبر ${platform}`}
    >
      {platform === 'whatsapp' ? (
        whatsappIcon
      ) : iconMap[platform as keyof typeof iconMap] ? (
        <Image
          src={iconMap[platform as keyof typeof iconMap]!}
          alt={`${platform} icon`}
          width={20}
          height={20}
          className="w-5 h-5 filter group-hover:invert group-hover:brightness-0 transition-all duration-200"
        />
      ) : (
        // Fallback for unknown platforms
        <div className="w-5 h-5 bg-gray-400 rounded-full group-hover:bg-white transition-colors duration-200"></div>
      )}
    </a>
  );
}
