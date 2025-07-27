import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticlesPaginated, getFeaturedArticles, getAllCategories, getGlobal } from '@/lib/strapi-client';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate } from '@/lib/utils';
import { Article, Category } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

    try {
      globalData = await getGlobal();
    } catch (error) {
      console.error('Error fetching global data for metadata:', error);
      globalData = null;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const articlesUrl = `${baseUrl}/articles`;

    // Dynamic title based on search parameters
    let title = 'المقالات';
    let description = 'تصفح جميع المقالات في مجلة شروع للابتكار وريادة الأعمال';

    if (search) {
      title = `البحث: ${search} - المقالات`;
      description = `نتائج البحث عن "${search}" في مقالات مجلة شروع`;
    } else if (category) {
      title = `${category} - المقالات`;
      description = `مقالات فئة ${category} في مجلة شروع`;
    } else if (page && parseInt(page) > 1) {
      title = `المقالات - الصفحة ${page}`;
    }

    const siteName = globalData?.siteName || 'شروع';
    const fullTitle = `${title} | ${siteName}`;

    return {
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
}// Article Card Component
function ArticleCard({ article }: { article: Article }) {
  const coverImageUrl = article.cover_image ? getStrapiMedia(article.cover_image.url) : null;

  return (
    <Card className="overflow-hidden border-gray-200 rounded-none">
      <Link href={`/articles/${article.slug}`} className="block">
        {coverImageUrl && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={article.cover_image?.alternativeText || article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {article.is_featured && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-yellow-500 text-black">
                  مميز
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            {article.category && (
              <>
                <Badge variant="outline" className="text-xs">
                  {article.category.name}
                </Badge>
                <span>•</span>
              </>
            )}
            <time dateTime={article.publish_date}>
              {formatDate(article.publish_date)}
            </time>
          </div>

          <h3 className="text-lg font-semibold line-clamp-2">
            {article.title}
          </h3>

          {article.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mt-2">
              {article.description}
            </p>
          )}
        </CardHeader>

        {article.author && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              {article.author.avatar && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={getStrapiMedia(article.author.avatar.url) || ''}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="text-sm">
                <p className="font-medium text-gray-900">{article.author.name}</p>
                {article.author.jobTitle && (
                  <p className="text-gray-600 text-xs">{article.author.jobTitle}</p>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Link>
    </Card>
  );
}

// Featured Articles Section
function FeaturedArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">المقالات المميزة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

// Search and Filter Component
function SearchAndFilter({
  categories,
  currentSearch,
  currentCategory
}: {
  categories: Category[];
  currentSearch?: string;
  currentCategory?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">البحث والتصفية</h2>
      <form method="GET" className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="ابحث في المقالات..."
            defaultValue={currentSearch}
            name="search"
            className="w-full border border-gray-300 rounded-none p-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            name="category"
            defaultValue={currentCategory}
            className="w-full p-2 border border-gray-300 rounded-none"
          >
            <option value="">جميع الفئات</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" className="w-full md:w-auto">
          بحث
        </Button>
      </form>
    </div>
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
    <div className="flex justify-center items-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link href={createPageUrl(currentPage - 1)}>
          <Button variant="outline">السابق</Button>
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
              <Button
                variant={pageNum === currentPage ? "default" : "outline"}
                size="sm"
                className="w-10"
              >
                {pageNum}
              </Button>
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages && (
        <Link href={createPageUrl(currentPage + 1)}>
          <Button variant="outline">التالي</Button>
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

    // Fetch data in parallel
    const [articlesResponse, featuredArticlesResponse, categoriesResponse] = await Promise.all([
      getArticlesPaginated(currentPage, pageSize),
      getFeaturedArticles(3), // Get top 3 featured articles
      getAllCategories(),
    ]);

    if (!articlesResponse || !articlesResponse.data) {
      throw new Error('Failed to fetch articles');
    }

    const articles = articlesResponse.data as Article[];
    const pagination = articlesResponse.meta?.pagination;
    const totalPages = pagination?.pageCount || 1;

    const featuredArticles = (featuredArticlesResponse?.data as Article[]) || [];
    const categories = (categoriesResponse?.data as Category[]) || [];

    // Show featured articles only on first page when no search/filter
    const showFeatured = currentPage === 1 && !search && !category && featuredArticles.length > 0;

    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              المقالات
            </h1>
            <p className="text-lg text-gray-600">
              اكتشف أحدث المقالات والأفكار في عالم الابتكار وريادة الأعمال
            </p>
          </div>

          {/* Search and Filter */}
          <SearchAndFilter
            categories={categories}
            currentSearch={search}
            currentCategory={category}
          />

          {/* Featured Articles (only on first page without filters) */}
          {showFeatured && (
            <FeaturedArticles articles={featuredArticles} />
          )}

          {/* Articles Grid */}
          <section>
            {articles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  لا توجد مقالات
                </h3>
                <p className="text-gray-600 mb-6">
                  {search || category
                    ? 'لم نجد مقالات تطابق معايير البحث الخاصة بك'
                    : 'لا توجد مقالات متاحة حالياً'
                  }
                </p>
                {(search || category) && (
                  <Link href="/articles">
                    <Button variant="outline">
                      عرض جميع المقالات
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading articles page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">عذراً</h1>
          <p className="text-gray-600 mb-6">حدث خطأ في تحميل المقالات</p>
          <Link href="/">
            <Button>العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }
}
