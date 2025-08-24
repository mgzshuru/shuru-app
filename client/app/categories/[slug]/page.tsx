import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getArticlesOptimized, getGlobalCached } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { SaveButton } from '@/components/custom/save-button';
import { formatDate } from '@/lib/utils';
import { Article, Category } from '@/lib/types';
import { CategoryStructuredData } from '@/components/seo/StructuredData';
import { LatestArticles } from '@/components/custom/latest-articles';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

// Generate metadata for category page
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const [category, globalData] = await Promise.all([
      getCategoryBySlug(slug),
      getGlobalCached().catch(() => null)
    ]);

    if (!category) {
      return {
        title: 'الفئة غير موجودة | شروع',
        description: 'الفئة التي تبحث عنها غير موجودة',
        robots: { index: false, follow: false },
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const categoryUrl = `${baseUrl}/categories/${slug}`;
    const defaultImage = globalData?.defaultSeo?.og_image ?
      (getStrapiMedia(globalData.defaultSeo.og_image.url) || `${baseUrl}/og-image.jpg`) :
      `${baseUrl}/og-image.jpg`;
    // Check if category has SEO data
    if (category.SEO) {
      const seo = category.SEO;
      return {
        metadataBase: new URL(baseUrl),
        title: seo.meta_title || `${category.name}`,
        description: seo.meta_description || category.description || `تصفح مقالات فئة ${category.name} في مجلة شروع`,
        keywords: seo.meta_keywords?.split(',').map((k: string) => k.trim()) || undefined,
        openGraph: {
          title: seo.meta_title || `${category.name} | شروع`,
          description: seo.meta_description || category.description || `تصفح مقالات فئة ${category.name} في مجلة شروع`,
          url: categoryUrl,
          type: 'website',
          locale: 'ar_SA',
          siteName: 'شروع',
          ...(seo.og_image && {
            images: [{
              url: getStrapiMedia(seo.og_image.url) || defaultImage,
              width: seo.og_image.width || 1200,
              height: seo.og_image.height || 630,
              alt: seo.og_image.alternativeText || category.name,
            }],
          }),
        },
        twitter: {
          card: 'summary_large_image',
          title: seo.meta_title || `${category.name} | شروع`,
          description: seo.meta_description || category.description || `تصفح مقالات فئة ${category.name} في مجلة شروع`,
          ...(seo.og_image && {
            images: [getStrapiMedia(seo.og_image.url) || defaultImage],
          }),
        },
        alternates: {
          canonical: categoryUrl,
        },
      };
    }

    // Fallback metadata if no SEO data
    return {
      metadataBase: new URL(baseUrl),
      title: `${category.name} | شروع`,
      description: category.description || `تصفح مقالات فئة ${category.name} في مجلة شروع للابتكار وريادة الأعمال`,
      openGraph: {
        title: `${category.name} | شروع`,
        description: category.description || `تصفح مقالات فئة ${category.name} في مجلة شروع للابتكار وريادة الأعمال`,
        url: categoryUrl,
        type: 'website',
        locale: 'ar_SA',
        siteName: 'شروع',
        images: [{ url: defaultImage }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.name} | شروع`,
        description: category.description || `تصفح مقالات فئة ${category.name} في مجلة شروع للابتكار وريادة الأعمال`,
        images: [defaultImage],
      },
      alternates: {
        canonical: categoryUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for category:', error);
    return {
      title: 'خطأ | شروع',
      description: 'حدث خطأ أثناء تحميل الفئة',
    };
  }
}

// Article Card Component
function ArticleCard({ article }: { article: Article }) {
  const coverImageUrl = article.cover_image ? getStrapiMedia(article.cover_image.url) : null;

  return (
    <article className="bg-white border border-gray-200 overflow-hidden">
      <Link href={`/articles/${article.slug}`} className="block">
        {coverImageUrl && (
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
            <Image
              src={coverImageUrl}
              alt={article.cover_image?.alternativeText || article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {article.is_featured && (
              <div className="absolute top-4 right-4">
                <span className="bg-gray-900 text-white px-3 py-1 text-xs font-semibold">
                  مميز
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-6" dir="rtl">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            {article.categories && article.categories.length > 0 && (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  {article.categories.map((category) => (
                    <span key={category.id} className="text-gray-700 font-medium text-xs uppercase tracking-wide border border-gray-300 px-2 py-1">
                      {category.name}
                    </span>
                  ))}
                </div>
                <span className="text-gray-300">•</span>
              </>
            )}
            <time dateTime={article.publish_date} className="text-gray-500">
              {formatDate(article.publish_date)}
            </time>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3  leading-tight text-right">
            {article.title}
          </h3>

          {article.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed text-right">
              {article.description}
            </p>
          )}

          {article.author && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              {article.author.avatar && (
                <div className="relative w-10 h-10 overflow-hidden bg-gray-200">
                  <Image
                    src={getStrapiMedia(article.author.avatar.url) || ''}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="text-sm text-right flex-1">
                <p className="font-semibold text-gray-900">{article.author.name}</p>
                {article.author.jobTitle && (
                  <p className="text-gray-500 text-xs">{article.author.jobTitle}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                <SaveButton
                  articleId={article.documentId}
                  articleTitle={article.title}
                  size="sm"
                />
              </div>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

// Category Header Component
function CategoryHeader({ category }: { category: Category }) {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center" dir="rtl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Breadcrumbs Component
function Breadcrumbs({ category }: { category: Category }) {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
            الرئيسية
          </Link>
          <svg className="w-4 h-4 mx-3 text-gray-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/categories" className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
            الفئات
          </Link>
          <svg className="w-4 h-4 mx-3 text-gray-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </div>
      </div>
    </nav>
  );
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page = '1' } = await searchParams;

  try {
    // Fetch category data and global data in parallel
    const [categoryResponse, globalData] = await Promise.all([
      getCategoryBySlug(slug),
      getGlobalCached().catch(() => null)
    ]);
    const category = categoryResponse as Category;

    if (!category) {
      notFound();
    }

    // Fetch articles for this category with pagination
    const currentPage = parseInt(page, 10);
    const pageSize = 12;

    const articlesResponse = await getArticlesOptimized({
      categorySlug: slug,
      pageSize,
      page: currentPage
    });
    const articles = (articlesResponse?.data || []) as Article[];
    const pagination = articlesResponse?.meta?.pagination;

    return (
      <div className="min-h-screen bg-white">
        <CategoryStructuredData category={category} globalData={globalData} />
        <Breadcrumbs category={category} />
        <CategoryHeader category={category} />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Articles Section */}
          <section>
            <div className="flex items-center justify-between mb-8" dir="rtl">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gray-600"></div>
                <h2 className="text-2xl font-bold text-gray-900">المقالات</h2>
              </div>
            </div>

            {articles.length > 0 ? (
              <>
                {/* Articles Grid with Featured Layout */}
                <div className="grid grid-cols-1 gap-10 px-5 md:grid-cols-2 md:px-10 lg:grid-cols-3 xl:grid-cols-[minmax(42%,532px)_repeat(2,1fr)] xl:px-0">
                  {/* Featured Article - Large */}
                  {articles.length > 0 && (
                    <div className="space-y-4 md:col-span-2 lg:col-span-1 lg:row-span-2">
                      <article className="flex flex-col gap-1 md:col-span-2 lg:col-span-1 lg:row-span-2">
                        <div className="flex flex-col-reverse">
                          <div className="w-full space-y-3">
                            <Link href={`/articles/${articles[0].slug}`}>
                              <p className="font-bold text-black text-[25px] leading-[28px] md:text-[36px] md:leading-10 text-right">
                                {articles[0].title}
                              </p>
                              {articles[0].description && (
                                <p className="text-base font-normal leading-5 tracking-[0.2px] text-gray-600 text-right">
                                  {articles[0].description}
                                </p>
                              )}
                            </Link>
                          </div>
                          <Link className="pb-5" href={`/articles/${articles[0].slug}`}>
                            {articles[0].cover_image && (
                              <Image
                                alt={articles[0].cover_image?.alternativeText || articles[0].title}
                                loading="lazy"
                                width={825}
                                height={541}
                                decoding="async"
                                className="aspect-video w-full object-cover"
                                src={getStrapiMedia(articles[0].cover_image.url) || ''}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 42vw"
                                priority
                              />
                            )}
                          </Link>
                        </div>
                      </article>
                    </div>
                  )}

                  {/* Regular Articles - Smaller Grid Items */}
                  {articles.slice(1, 5).map((article) => (
                    <article key={article.id} className="flex flex-col gap-1">
                      <div className="flex flex-col-reverse">
                        <div className="w-full space-y-3">
                          <Link href={`/articles/${article.slug}`}>
                            <p className="font-bold text-black text-[25px] md:text-[16px] leading-[28px] md:leading-[19px] text-right">
                              {article.title}
                            </p>
                            {article.description && (
                              <p className="text-base font-normal leading-5 tracking-[0.2px] text-gray-600 text-right">
                                {article.description}
                              </p>
                            )}
                          </Link>
                        </div>
                        <Link className="pb-5" href={`/articles/${article.slug}`}>
                          {article.cover_image && (
                            <Image
                              alt={article.cover_image?.alternativeText || article.title}
                              loading="lazy"
                              width={825}
                              height={541}
                              decoding="async"
                              className="aspect-video w-full object-cover"
                              src={getStrapiMedia(article.cover_image.url) || ''}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          )}
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Additional Articles if more than 5 */}
                {articles.length > 5 && (
                  <div className="mt-16 pt-16 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {articles.slice(5).map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {pagination && pagination.pageCount > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-gray-200">
                    {pagination.page > 1 && (
                      <Link href={`/categories/${slug}?page=${pagination.page - 1}`}>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                          السابق
                        </button>
                      </Link>
                    )}

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, pagination.pageCount) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(pagination.pageCount - 4, pagination.page - 2)) + i;

                        if (pageNum <= pagination.pageCount) {
                          return (
                            <Link key={pageNum} href={`/categories/${slug}?page=${pageNum}`}>
                              <button
                                className={`w-10 h-10 border font-medium ${
                                  pageNum === pagination.page
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            </Link>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {pagination.page < pagination.pageCount && (
                      <Link href={`/categories/${slug}?page=${pagination.page + 1}`}>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                          التالي
                        </button>
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 border border-gray-200 bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4">لا توجد مقالات</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  لم يتم نشر أي مقالات في هذه الفئة حتى الآن
                </p>
                <Link href="/articles">
                  <button className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 font-medium">
                    تصفح جميع المقالات
                  </button>
                </Link>
              </div>
            )}
          </section>

          {/* Latest Articles Section */}
          <LatestArticles
            articles={articles}
            title={`أحدث مقالات ${category.name}`}
            categoryName={category.name}
            showMore={false}
          />

          {/* Related Categories */}
          {category.children_categories && category.children_categories.length > 0 && (
            <div className="mt-24 pt-16 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-8" dir="rtl">
                <div className="w-1 h-8 bg-gray-600"></div>
                <h3 className="text-2xl font-bold text-gray-900">فئات فرعية</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.children_categories.map((childCategory: any) => (
                  <Link
                    key={childCategory.id}
                    href={`/categories/${childCategory.slug}`}
                    className="block p-8 border border-gray-200 hover:bg-gray-50"
                  >
                    <div dir="rtl">
                      <h4 className="font-bold text-gray-900 mb-4 text-lg text-right">
                        {childCategory.name}
                      </h4>
                      {childCategory.description && (
                        <p className="text-gray-600 leading-relaxed line-clamp-3 text-right">
                          {childCategory.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading category page:', error);

    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-24 border border-gray-200 bg-gray-50 max-w-md mx-auto px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            حدث خطأ أثناء تحميل الصفحة
          </h1>
          <p className="text-gray-600 mb-8">
            نعتذر، حدث خطأ أثناء تحميل بيانات الفئة
          </p>
          <Link href="/categories">
            <button className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 font-medium">
              العودة إلى الفئات
            </button>
          </Link>
        </div>
      </div>
    );
  }
}
