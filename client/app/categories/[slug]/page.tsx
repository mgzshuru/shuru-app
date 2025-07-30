import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getArticlesOptimized, getGlobalCached } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate } from '@/lib/utils';
import { Article, Category } from '@/lib/types';

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
    const category = await getCategoryBySlug(slug);

    if (!category) {
      return {
        title: 'الفئة غير موجودة | شروع',
        description: 'الفئة التي تبحث عنها غير موجودة',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const categoryUrl = `${baseUrl}/categories/${slug}`;

    // Check if category has SEO data
    if (category.SEO) {
      const seo = category.SEO;
      return {
        title: seo.meta_title || `${category.name} | شروع`,
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
              url: getStrapiMedia(seo.og_image.url) || '',
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
            images: [getStrapiMedia(seo.og_image.url) || ''],
          }),
        },
        alternates: {
          canonical: categoryUrl,
        },
      };
    }

    // Fallback metadata if no SEO data
    return {
      title: `${category.name} | شروع`,
      description: category.description || `تصفح مقالات فئة ${category.name} في مجلة شروع للابتكار وريادة الأعمال`,
      openGraph: {
        title: `${category.name} | شروع`,
        description: category.description || `تصفح مقالات فئة ${category.name} في مجلة شروع للابتكار وريادة الأعمال`,
        url: categoryUrl,
        type: 'website',
        locale: 'ar_SA',
        siteName: 'شروع',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.name} | شروع`,
        description: category.description || `تصفح مقالات فئة ${category.name} في مجلة شروع للابتكار وريادة الأعمال`,
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
            {article.category && (
              <>
                <span className="text-gray-700 font-medium text-xs uppercase tracking-wide border border-gray-300 px-2 py-1">
                  {article.category.name}
                </span>
                <span className="text-gray-300">•</span>
              </>
            )}
            <time dateTime={article.publish_date} className="text-gray-500">
              {formatDate(article.publish_date)}
            </time>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight text-right">
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
    // Fetch category data
    const categoryResponse = await getCategoryBySlug(slug);
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
        <Breadcrumbs category={category} />
        <CategoryHeader category={category} />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Articles Section */}
          <section>
            <div className="flex items-center justify-between mb-8" dir="rtl">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gray-600"></div>
                <h2 className="text-2xl font-bold text-gray-900">المقالات</h2>
                {pagination?.total && (
                  <span className="text-base font-normal text-gray-500">
                    ({pagination.total} مقال)
                  </span>
                )}
              </div>
            </div>

            {articles.length > 0 ? (
              <>
                {/* Featured Article - First Article Large */}
                {articles.length > 0 && (
                  <div className="mb-16 pb-16 border-b border-gray-200">
                    <Link href={`/articles/${articles[0].slug}`} className="block">
                      <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {articles[0].cover_image && (
                          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                            <Image
                              src={getStrapiMedia(articles[0].cover_image.url) || ''}
                              alt={articles[0].cover_image?.alternativeText || articles[0].title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              priority
                            />
                            {articles[0].is_featured && (
                              <div className="absolute top-4 right-4">
                                <span className="bg-gray-900 text-white px-3 py-1 text-xs font-semibold">
                                  مميز
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="space-y-6" dir="rtl">
                          {articles[0].category && (
                            <span className="text-gray-700 font-medium text-xs uppercase tracking-wide border border-gray-300 px-2 py-1">
                              {articles[0].category.name}
                            </span>
                          )}
                          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-right">
                            {articles[0].title}
                          </h3>
                          {articles[0].description && (
                            <p className="text-gray-600 text-lg leading-relaxed text-right">
                              {articles[0].description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 justify-end" dir="rtl">
                            {articles[0].author && (
                              <>
                                <span className="font-medium text-gray-700">{articles[0].author.name}</span>
                                <span>•</span>
                              </>
                            )}
                            <time dateTime={articles[0].publish_date}>
                              {formatDate(articles[0].publish_date)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Regular Articles Grid */}
                {articles.length > 1 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.slice(1).map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
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
