import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ContentRenderer } from '@/components/blocks/content/ContentRenderer';
import { getArticleForDetail, getArticleForSEO, getRelatedArticlesOptimized, getGlobalCached } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { SocialShare } from '@/components/custom/social-share';
import { TableOfContents } from '@/components/custom/table-of-contents';
import { formatDate } from '@/lib/utils';
import { Article, Block } from '@/lib/types';
import styles from '@/components/article-content.module.css';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for individual articles
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const { slug } = await params;

    // Fetch only SEO-related data in parallel
    const [article, globalData] = await Promise.all([
      getArticleForSEO(slug), // Minimal population for SEO
      getGlobalCached().catch(() => null) // Don't fail if global data is unavailable
    ]);

    if (!article) {
      return {
        title: 'المقال غير موجود | شروع',
        description: 'المقال المطلوب غير متوفر.',
        robots: { index: false, follow: false },
      };
    }

    const baseUrl = 'https://www.shuru.sa';
    const articleUrl = `${baseUrl}/articles/${article.slug}`;

    // Extract text content for description if not provided
    const extractedDescription = article.description ||
      article.blocks?.find((block: Block) => block.__component === 'content.rich-text')?.content?.substring(0, 160) ||
      'مقال في مجلة شروع للابتكار وريادة الأعمال';

    // Get SEO data from article or fallback
    const seoTitle = article.SEO?.meta_title ||
      `${article.title} | ${globalData?.siteName || 'شروع'}`;

    const seoDescription = article.SEO?.meta_description ||
      extractedDescription.substring(0, 160);

    const seoKeywords = article.SEO?.meta_keywords?.split(',').map((k: string) => k.trim()).filter(Boolean) || [
      article.category?.name,
      'شروع',
      'ريادة الأعمال',
      'الابتكار',
      'القيادة',
    ].filter(Boolean) as string[];

    // Article image for social sharing
    const articleImage = article.SEO?.og_image ?
      (getStrapiMedia(article.SEO.og_image.url) || `${baseUrl}/og-image.jpg`) :
      article.cover_image ?
      (getStrapiMedia(article.cover_image.url) || `${baseUrl}/og-image.jpg`) :
      `${baseUrl}/og-image.jpg`;

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: seoKeywords,
      authors: article.author ? [{ name: article.author.name }] : [{ name: globalData?.siteName || 'شروع' }],
      creator: article.author?.name || globalData?.siteName || 'شروع',
      publisher: globalData?.siteName || 'شروع للنشر الرقمي',
      category: article.category?.name || 'business',

      openGraph: {
        type: 'article',
        locale: 'ar_SA',
        url: articleUrl,
        siteName: globalData?.siteName || 'شروع',
        title: seoTitle,
        description: seoDescription,
        publishedTime: article.publish_date,
        modifiedTime: article.updatedAt,
        section: article.category?.name,
        authors: article.author ? [article.author.name] : [],
        tags: seoKeywords,
        images: [
          {
            url: articleImage,
            width: article.cover_image?.width || 1200,
            height: article.cover_image?.height || 630,
            alt: article.cover_image?.alternativeText || article.title,
          },
        ],
      },

      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: [articleImage],
        creator: '@shurumag',
        site: '@shurumag',
      },

      alternates: {
        canonical: articleUrl,
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

      other: {
        'article:published_time': article.publish_date,
        'article:modified_time': article.updatedAt,
        'article:section': article.category?.name || '',
        'article:author': article.author?.name || '',
        'article:tag': seoKeywords.join(','),
      },
    };
  } catch (error) {
    console.error('Error generating metadata for article:', error);
    return {
      title: 'خطأ في تحميل المقال | شروع',
      description: 'حدث خطأ في تحميل بيانات المقال.',
      robots: { index: false, follow: false },
    };
  }
}

// Fetch article data with full population
async function getArticleData(slug: string): Promise<Article | null> {
  try {
    const article = await getArticleForDetail(slug);
    return article as Article | null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Fetch related articles
async function getRelatedArticlesData(articleId: string, categorySlug: string): Promise<Article[]> {
  try {
    const relatedResponse = await getRelatedArticlesOptimized(articleId, categorySlug, 3);
    return (relatedResponse?.data || []) as Article[];
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

// Magazine issues component (if article is featured in magazine)
function MagazineIssues({ issues }: { issues: Article['magazine_issues'] }) {
  if (!issues?.length) return null;

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-none border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          نُشر هذا المقال ضمن إصدارات مجلة شروع
        </h3>
      </div>
      <div className="space-y-3">
        {issues.map((issue) => (
          <Link
            key={issue.id}
            href={`/magazine/${issue.slug}`}
            className="flex items-center space-x-4 rtl:space-x-reverse p-3 hover:bg-white rounded-lg transition-colors border border-gray-200"
          >
            {issue.cover_image && (
              <div className="flex-shrink-0">
                <Image
                  src={getStrapiMedia(issue.cover_image.url) || ''}
                  alt={issue.cover_image.alternativeText || issue.title}
                  width={40}
                  height={56}
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1" dir="rtl">
              <p className="font-medium text-black hover:text-gray-700 transition-colors mb-1 text-right">
                {issue.title}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2 justify-end">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                  العدد {issue.issue_number}
                </span>
                <span>•</span>
                <span>{formatDate(issue.publish_date)}</span>
              </p>
            </div>
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleData(slug);

  if (!article) {
    notFound();
  }

  // Fetch related articles if category exists
  const relatedArticles = article.category
    ? await getRelatedArticlesData(article.documentId, article.category.slug)
    : [];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
              الرئيسية
            </Link>
            <svg className="w-4 h-4 mx-3 text-gray-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/articles" className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
              المقالات
            </Link>
            {article.category && (
              <>
                <svg className="w-4 h-4 mx-3 text-gray-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link
                  href={`/categories/${article.category.slug}`}
                  className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
                >
                  {article.category.name}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        {/* Article Header */}
        <header className="px-6 pt-16 pb-12">
          <div className="max-w-4xl mx-auto" dir="rtl">
            {/* Category Badge */}
            {article.category && (
              <div className="mb-8 text-right">
                <Link
                  href={`/categories/${article.category.slug}`}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold uppercase tracking-wider hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  {article.category.name}
                </Link>
              </div>
            )}

            {/* Article Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1] mb-8 tracking-normal text-right" dir="rtl" style={{ lineHeight: '1.8', wordSpacing: '0.1em' }}>
              {article.title}
            </h1>

            {/* Article Description */}
            {article.description && (
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12 max-w-4xl font-light text-right">
                {article.description}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-8 pb-8 border-b border-gray-200 justify-end" dir="rtl">
              {/* Author */}
              {article.author && (
                <div className="flex items-center gap-4">
                  {article.author.avatar && (
                    <div className="relative">
                      <Image
                        src={getStrapiMedia(article.author.avatar.url) || ''}
                        alt={article.author.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border-2 border-gray-100"
                      />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-lg">{article.author.name}</p>
                    {(article.author.jobTitle || article.author.organization) && (
                      <p className="text-sm text-gray-500">
                        {[article.author.jobTitle, article.author.organization].filter(Boolean).join(' • ')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Publication Date */}
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={article.publish_date} className="font-medium">
                  {formatDate(article.publish_date)}
                </time>
              </div>

              {/* Featured Badge */}
              {article.is_featured && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  مقال مميز
                </div>
              )}

              {/* Reading Time Estimate */}
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">
                  {article.blocks ? Math.max(1, Math.ceil(article.blocks.reduce((acc, block) => {
                    if (block.__component === 'content.rich-text') {
                      return acc + (block.content?.split(' ').length || 0);
                    }
                    return acc;
                  }, 0) / 200)) : 5} دقائق للقراءة
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.cover_image && (
          <div className="px-6 mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                <Image
                  src={getStrapiMedia(article.cover_image.url) || ''}
                  alt={article.cover_image.alternativeText || article.title}
                  width={article.cover_image.width || 1200}
                  height={article.cover_image.height || 675}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {article.cover_image.alternativeText && (
                <p className="text-sm text-gray-500 mt-3 text-center italic">
                  {article.cover_image.alternativeText}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-16">
            {/* Article Content */}
            <main className="lg:col-span-8" dir="rtl">
              {/* Social Share */}
              <div className="mb-12">
                <SocialShare
                  title={article.title}
                  slug={article.slug}
                  description={article.description}
                />
              </div>

              {/* Article Content */}
              <div id="article-content" className={styles.articleContent}>
                {article.blocks && article.blocks.length > 0 ? (
                  <ContentRenderer blocks={article.blocks} />
                ) : (
                  <div className="text-center py-24 bg-gray-50">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">لا يوجد محتوى متاح</h3>
                    <p className="text-gray-500">
                      المحتوى غير متوفر لهذا المقال في الوقت الحالي.
                    </p>
                  </div>
                )}
              </div>

              {/* Article Tags */}
              {article.SEO?.meta_keywords && (
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">الكلمات المفتاحية</h3>
                  <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                    {article.SEO.meta_keywords.split(',').map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer border border-gray-200 hover:border-gray-300"
                      >
                        #{keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Magazine Issues */}
              <MagazineIssues issues={article.magazine_issues} />

              {/* Social Share - Bottom */}
              <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">شارك هذا المقال</h3>
                  <SocialShare
                    title={article.title}
                    slug={article.slug}
                    description={article.description}
                  />
                </div>
              </div>

              {/* Related Articles in Main Content */}
              {relatedArticles.length > 0 && (
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 bg-gray-600"></div>
                    <h3 className="text-2xl font-bold text-gray-900">مقالات ذات صلة</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {relatedArticles.slice(0, 4).map((relatedArticle) => (
                      <Link
                        key={relatedArticle.id}
                        href={`/articles/${relatedArticle.slug}`}
                        className="group block"
                      >
                        <article className="bg-white hover:bg-gray-50 transition-colors duration-200 rounded-none overflow-hidden border border-gray-200 ">
                          {relatedArticle.cover_image && (
                            <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                              <Image
                                src={getStrapiMedia(relatedArticle.cover_image.url) || ''}
                                alt={relatedArticle.title}
                                width={400}
                                height={225}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-6" dir="rtl">
                            <h4 className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2 text-lg mb-3 text-right">
                              {relatedArticle.title}
                            </h4>
                            {relatedArticle.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-4 text-right">
                                {relatedArticle.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <time>{formatDate(relatedArticle.publish_date)}</time>
                              {relatedArticle.category && (
                                <span className="text-gray-600 font-medium">
                                  {relatedArticle.category.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </main>

            {/* Enhanced Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Author Card */}
              {article.author && (
                <div className="bg-white p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-2 h-16 bg-gray-600"></div>
                    <h3 className="text-xl font-bold text-gray-900">عن الكاتب</h3>
                  </div>
                  <div className="flex items-start gap-6" dir="rtl">
                    {article.author.avatar && (
                      <div className="relative flex-shrink-0">
                        <Image
                          src={getStrapiMedia(article.author.avatar.url) || ''}
                          alt={article.author.name}
                          width={80}
                          height={80}
                          className="rounded-full object-cover border-3 border-gray-100"
                        />
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gray-600 rounded-full border-3 border-white flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="flex-1 text-right">
                      <h4 className="font-bold text-gray-900 text-lg mb-2">
                        {article.author.name}
                      </h4>
                      {(article.author.jobTitle || article.author.organization) && (
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {[article.author.jobTitle, article.author.organization].filter(Boolean).join(' • ')}
                        </p>
                      )}
                      <div className="flex gap-2 justify-end">
                        {article.author.linkedin_url && (
                          <a
                            href={article.author.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 text-white p-8">
                <h3 className="text-xl font-bold mb-4 text-right">اشترك في النشرة الإخبارية</h3>
                <p className="text-gray-200 mb-6 leading-relaxed text-right">
                  احصل على أحدث المقالات والتحديثات مباشرة في بريدك الإلكتروني
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    className="w-full px-4 py-3 text-gray-900 border-0 focus:ring-2 focus:ring-white/50 outline-none text-right"
                    dir="rtl"
                  />
                  <button className="w-full bg-white text-gray-700 font-semibold py-3 px-4 hover:bg-gray-50 transition-colors">
                    اشترك الآن
                  </button>
                </div>
              </div>

              {/* Sticky Table of Contents */}
              <div className="sticky top-24">
                <TableOfContents articleContentId="article-content" />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Structured Data for Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.description,
            "image": article.cover_image ? getStrapiMedia(article.cover_image.url) : undefined,
            "datePublished": article.publish_date,
            "dateModified": article.updatedAt,
            "author": article.author ? {
              "@type": "Person",
              "name": article.author.name,
              "jobTitle": article.author.jobTitle,
              "worksFor": article.author.organization ? {
                "@type": "Organization",
                "name": article.author.organization
              } : undefined,
              "image": article.author.avatar ? getStrapiMedia(article.author.avatar.url) : undefined
            } : {
              "@type": "Organization",
              "name": "شروع للنشر الرقمي"
            },
            "publisher": {
              "@type": "Organization",
              "name": "شروع",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.shuru.sa/logos/Shuru-white-logo.svg",
                "width": 200,
                "height": 60
              },
              "url": "https://www.shuru.sa"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://www.shuru.sa/articles/${article.slug}`
            },
            "articleSection": article.category?.name,
            "keywords": article.SEO?.meta_keywords || [article.category?.name, 'شروع', 'ريادة الأعمال'].filter(Boolean).join(','),
            "wordCount": article.blocks?.reduce((count, block) => {
              if (block.__component === 'content.rich-text') {
                return count + (block.content?.split(' ').length || 0);
              }
              return count;
            }, 0),
            "inLanguage": "ar",
            "about": article.category ? {
              "@type": "Thing",
              "name": article.category.name
            } : undefined,
            "isPartOf": {
              "@type": "WebSite",
              "name": "شروع",
              "url": "https://www.shuru.sa"
            },
            "potentialAction": {
              "@type": "ReadAction",
              "target": `https://www.shuru.sa/articles/${article.slug}`
            }
          })
        }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "الرئيسية",
                "item": "https://www.shuru.sa"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "المقالات",
                "item": "https://www.shuru.sa/articles"
              },
              ...(article.category ? [{
                "@type": "ListItem",
                "position": 3,
                "name": article.category.name,
                "item": `https://www.shuru.sa/categories/${article.category.slug}`
              }] : []),
              {
                "@type": "ListItem",
                "position": article.category ? 4 : 3,
                "name": article.title,
                "item": `https://www.shuru.sa/articles/${article.slug}`
              }
            ]
          })
        }}
      />
    </div>
  );
}