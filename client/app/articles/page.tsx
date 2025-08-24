import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getArticlesOptimized, getGlobalCached } from '@/lib/strapi-optimized';
import { getAllCategories, getCategoryBySlug } from '@/lib/strapi-client';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { SaveButton } from '@/components/custom/save-button';
import { formatDate } from '@/lib/utils';
import { Article, Category } from '@/lib/types';
import { SearchAndFilterClient } from '../../components/custom/search-and-filter-client';

// Force dynamic rendering for search functionality
export const dynamic = 'force-dynamic';

interface ArticlesPageProps {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
  };
}

// Generate metadata for articles page
export async function generateMetadata({ searchParams }: ArticlesPageProps): Promise<Metadata> {
  try {
    const { page, search, category } = await searchParams;
    let globalData;
    let categoryName = category;

    try {
      globalData = await getGlobalCached();

      // If we have a category slug, fetch the specific category to get the name
      if (category) {
        const categoryData = await getCategoryBySlug(category) as unknown as Category | null;
        categoryName = categoryData?.name || category;
      }
    } catch (error) {
      console.error('Error fetching global data for metadata:', error);
      globalData = null;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const articlesUrl = `${baseUrl}/articles`;

    // Dynamic title based on search parameters
    let title = 'المقالات';
    let description = 'تصفح جميع المقالات في مجلة شروع للابتكار وريادة الأعمال';
    const defaultImage = globalData?.defaultSeo?.og_image ?
          (getStrapiMedia(globalData.defaultSeo.og_image.url) || `${baseUrl}/og-image.jpg`) :
          `${baseUrl}/og-image.jpg`;
    if (search) {
      title = `البحث: ${search} - المقالات`;
      description = `نتائج البحث عن "${search}" في مقالات مجلة شروع`;
    } else if (categoryName) {
      title = `${categoryName} - المقالات`;
      description = `مقالات فئة ${categoryName} في مجلة شروع`;
    } else if (page && parseInt(page) > 1) {
      title = `المقالات - الصفحة ${page}`;
    }

    const siteName = globalData?.siteName || 'شروع';
    const fullTitle = `${title} | ${siteName}`;

    return {
      metadataBase: new URL(baseUrl),
      title: fullTitle,
      description: description,
      keywords: [
        'شروع',
        'مقالات',
        'ريادة الأعمال',
        'الابتكار',
        'التقنية',
        'الاستثمار',
        'القيادة'
      ],
      openGraph: {
        title: fullTitle,
        description: description,
        images: [{url: defaultImage}],
        url: articlesUrl,
        siteName: siteName,
        type: 'website',
        locale: 'ar_SA',
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description: description,
      },
      alternates: {
        canonical: articlesUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for articles page:', error);
    return {
      title: 'المقالات | شروع',
      description: 'تصفح جميع المقالات في مجلة شروع للابتكار وريادة الأعمال',
    };
  }
}

// Breadcrumbs Component
function Breadcrumbs({ search, category }: { search?: string; category?: string }) {
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
          <span className="text-gray-900 font-medium">
            {search ? `البحث: ${search}` : category ? `فئة: ${category}` : 'المقالات'}
          </span>
        </div>
      </div>
    </nav>
  );
}

// Page Header Component
function PageHeader({ search, category }: { search?: string; category?: string }) {
  let title = 'المقالات';
  let description = 'اكتشف أحدث المقالات والأفكار في عالم الابتكار وريادة الأعمال والتقنيات الناشئة';

  if (search) {
    title = `نتائج البحث: ${search}`;
    description = `نتائج البحث عن "${search}" في مقالات مجلة شروع`;
  } else if (category) {
    title = `مقالات فئة: ${category}`;
    description = `تصفح مقالات فئة ${category} في مجلة شروع`;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center" dir="rtl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
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

          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight text-right">
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

          {/* Save Button - Always show */}
          <div className={`flex ${article.author ? 'justify-end pt-2' : 'justify-end pt-4 border-t border-gray-100'}`}>
            <SaveButton
              articleId={article.documentId}
              articleTitle={article.title}
              size="sm"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}

// Featured Articles Section
function FeaturedArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="mb-16 border-b border-gray-200 pb-16">
      <div className="flex items-center gap-3 mb-8" dir="rtl">
        <div className="w-1 h-8 bg-gray-600"></div>
        <h2 className="text-2xl font-bold text-gray-900">المقالات المميزة</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  searchParams
}: {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    return `/articles${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-gray-200">
      {currentPage > 1 && (
        <Link href={createPageUrl(currentPage - 1)}>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            السابق
          </button>
        </Link>
      )}

      <div className="flex gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage > totalPages - 3) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <Link key={pageNum} href={createPageUrl(pageNum)}>
              <button
                className={`w-10 h-10 border font-medium ${
                  pageNum === currentPage
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages && (
        <Link href={createPageUrl(currentPage + 1)}>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            التالي
          </button>
        </Link>
      )}
    </div>
  );
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  try {
    const { page = '1', search, category } = await searchParams;
    const currentPage = parseInt(page);
    const pageSize = 12;

    // Prepare parallel data fetching
    const [articlesResponse, featuredArticlesResponse, categoriesResponse] = await Promise.all([
      getArticlesOptimized({ page: currentPage, pageSize }),
      getArticlesOptimized({ featured: true, pageSize: 3 }), // Get top 3 featured articles
      getAllCategories(), // Still need all categories for SearchAndFilterClient
    ]);

    if (!articlesResponse || !articlesResponse.data) {
      throw new Error('Failed to fetch articles');
    }

    const articles = articlesResponse.data as Article[];
    const pagination = articlesResponse.meta?.pagination;
    const totalPages = pagination?.pageCount || 1;

    const featuredArticles = (featuredArticlesResponse?.data as Article[]) || [];
    const categories = (categoriesResponse?.data as Category[]) || [];

    // Find category name from the specific category if needed
    let categoryName: string | undefined;
    if (category) {
      try {
        const categoryData = await getCategoryBySlug(category) as unknown as Category | null;
        categoryName = categoryData?.name || category;
      } catch (error) {
        console.error('Error fetching category:', error);
        categoryName = category;
      }
    }

    // Show featured articles only on first page when no search/filter
    const showFeatured = currentPage === 1 && !search && !category && featuredArticles.length > 0;

    return (
      <div className="min-h-screen bg-white">
        <Breadcrumbs search={search} category={categoryName} />
        <PageHeader search={search} category={categoryName} />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Search and Filter */}
          <SearchAndFilterClient
            categories={categories}
            currentSearch={search}
            currentCategory={category}
          />

          {/* Featured Articles (only on first page without filters) */}
          {showFeatured && (
            <FeaturedArticles articles={featuredArticles} />
          )}

          {/* Articles Section */}
          <section>
            <div className="flex items-center justify-between mb-8" dir="rtl">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gray-600"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {search ? 'نتائج البحث' : categoryName ? 'المقالات' : 'جميع المقالات'}
                </h2>
              </div>
            </div>

            {articles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  searchParams={{ page, search, category } as Record<string, string>}
                />
              </>
            ) : (
              <div className="text-center py-24 border border-gray-200 bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  لا توجد مقالات
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {search || category
                    ? 'لم نجد مقالات تطابق معايير البحث الخاصة بك'
                    : 'لا توجد مقالات متاحة حالياً'
                  }
                </p>
                {(search || category) && (
                  <Link href="/articles">
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                      عرض جميع المقالات
                    </button>
                  </Link>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    );

  } catch (error) {
    console.error('Error loading articles page:', error);

    return (
      <div className="min-h-screen bg-white">
        <Breadcrumbs />
        <PageHeader />

        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-24 border border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              حدث خطأ أثناء تحميل المقالات
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              نعتذر، حدث خطأ أثناء تحميل بيانات المقالات
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/categories">
                <button className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                  تصفح الفئات
                </button>
              </Link>
              <Link href="/">
                <button className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 font-medium">
                  العودة للرئيسية
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
