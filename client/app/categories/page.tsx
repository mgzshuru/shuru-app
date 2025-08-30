import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllCategories, getGlobalCached } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { Category } from '@/lib/types';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

// Generate metadata for categories page
export async function generateMetadata(): Promise<Metadata> {
  try {
    const globalData = await getGlobalCached();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const categoriesUrl = `${baseUrl}/categories`;

    const title = 'الفئات';
    const description = 'تصفح جميع فئات المقالات في شروع';

    const defaultImage = globalData?.defaultSeo?.og_image ?
      (getStrapiMedia(globalData.defaultSeo.og_image.url) || `${baseUrl}/og-image.jpg`) :
      `${baseUrl}/og-image.jpg`;
    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      openGraph: {
        title,
        description,
        url: categoriesUrl,
        type: 'website',
        locale: 'ar_SA',
        siteName: globalData?.siteName || 'شروع',
        images: [{ url: defaultImage }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [defaultImage],
      },
      alternates: {
        canonical: categoriesUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for categories:', error);
    return {
      title: 'الفئات | شروع',
      description: 'تصفح جميع فئات المقالات في شروع',
    };
  }
}

// Category Card Component
function CategoryCard({ category }: { category: Category }) {
  const articlesCount = category.articles?.length || 0;

  return (
    <article className="bg-white border border-gray-200 overflow-hidden">
      <Link href={`/categories/${category.slug}`} className="block">
        <div className="p-6" dir="rtl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 text-right flex-1">
              {category.name}
            </h3>
            <span >
            </span>
          </div>

          {category.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed text-right">
              {category.description}
            </p>
          )}

          {/* Show recent articles if available */}
          {category.articles && category.articles.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 text-right">
                أحدث المقالات:
              </h4>
              <div className="space-y-3">
                {category.articles.slice(0, 3).map((article: any) => (
                  <div key={article.id} className="flex items-center gap-3">
                    {article.cover_image && (
                      <div className="relative w-12 h-8 overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={getStrapiMedia(article.cover_image.url) || ''}
                          alt={article.cover_image.alternativeText || article.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700  font-medium text-right">
                        {article.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

// Breadcrumbs Component
function Breadcrumbs() {
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
          <span className="text-gray-900 font-medium">الفئات</span>
        </div>
      </div>
    </nav>
  );
}

// Page Header Component
function PageHeader() {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center" dir="rtl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            فئات المقالات
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            تصفح مقالاتنا المصنفة حسب المواضيع المختلفة
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function CategoriesPage() {
  try {
    // Fetch all categories with their articles
    const categoriesResponse = await getAllCategories();
    const allCategories = (categoriesResponse?.data || []) as Category[];

    // Process categories to filter articles and sort them
    const processedCategories = allCategories.map(category => {
      if (category.articles && category.articles.length > 0) {
        // Filter out future articles and sort by publish_date desc
        const currentDate = new Date();
        const filteredArticles = category.articles
          .filter(article => {
            if (!article.publish_date) return true; // Include articles without publish_date
            return new Date(article.publish_date) <= currentDate;
          })
          .sort((a, b) => {
            if (!a.publish_date || !b.publish_date) return 0;
            return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
          })
          .slice(0, 3); // Limit to 3 recent articles

        return {
          ...category,
          articles: filteredArticles
        };
      }
      return category;
    });

    // Filter to only include categories that have articles
    const categories = processedCategories.filter((category) =>
      category.articles && category.articles.length > 0
    );

    // Separate root categories from child categories
    const rootCategories = categories.filter((category) =>
      !category.parent_category
    );

    const childCategories = categories.filter((category) =>
      category.parent_category
    );

    // Group child categories by parent (only include parents that also have articles)
    const categoriesByParent = childCategories.reduce((acc: any, category) => {
      const parentId = category.parent_category?.id;
      if (parentId) {
        // Only group if the parent category also has articles and is in our filtered list
        const parentExists = rootCategories.find(root => root.id === parentId);
        if (parentExists) {
          if (!acc[parentId]) {
            acc[parentId] = [];
          }
          acc[parentId].push(category);
        }
      }
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-white">
        <Breadcrumbs />
        <PageHeader />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {rootCategories.length > 0 ? (
            <div className="space-y-16">
              {/* Root Categories */}
              <section>
                <div className="flex items-center gap-3 mb-8" dir="rtl">
                  <div className="w-1 h-8 bg-gray-600"></div>
                  <h2 className="text-2xl font-bold text-gray-900">الفئات الرئيسية</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rootCategories.map((category) => (
                    <div key={category.id}>
                      <CategoryCard category={category} />

                      {/* Show child categories if any */}
                      {categoriesByParent[category.id] && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-4" dir="rtl">
                            <div className="w-1 h-4 bg-gray-400"></div>
                            <h4 className="text-sm font-semibold text-gray-700">فئات فرعية:</h4>
                          </div>
                          <div className="space-y-3">
                            {categoriesByParent[category.id].map((childCategory: Category) => (
                              <Link
                                key={childCategory.id}
                                href={`/categories/${childCategory.slug}`}
                                className="block p-4 border border-gray-200 hover:bg-gray-50"
                              >
                                <div className="flex items-center justify-between" dir="rtl">
                                  <span className="text-sm font-medium text-gray-800 text-right flex-1">
                                    {childCategory.name}
                                  </span>
                                </div>
                                {childCategory.description && (
                                  <p className="text-xs text-gray-600 mt-2  text-right">
                                    {childCategory.description}
                                  </p>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Standalone Child Categories (child categories whose parents don't have articles) */}
              {childCategories.some((cat) => !rootCategories.find(root => root.id === cat.parent_category?.id)) && (
                <section>
                  <div className="flex items-center gap-3 mb-8" dir="rtl">
                    <div className="w-1 h-8 bg-gray-600"></div>
                    <h2 className="text-2xl font-bold text-gray-900">فئات أخرى</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {childCategories
                      .filter((cat) => !rootCategories.find(root => root.id === cat.parent_category?.id))
                      .map((category) => (
                        <CategoryCard key={category.id} category={category} />
                      ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-24 border border-gray-200 bg-gray-50">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  لا توجد فئات متاحة حالياً
                </h3>
                <p className="text-gray-600 mb-8">
                  سنقوم بإضافة فئات جديدة قريباً لتسهيل تصفح المحتوى
                </p>
                <Link href="/articles">
                  <button className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 font-medium">
                    تصفح جميع المقالات
                  </button>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading categories page:', error);

    return (
      <div className="min-h-screen bg-white">
        <Breadcrumbs />
        <PageHeader />

        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-24 border border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              حدث خطأ أثناء تحميل الفئات
            </h2>
            <p className="text-gray-600 mb-8">
              نعتذر، حدث خطأ أثناء تحميل بيانات الفئات
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/articles">
                <button className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                  تصفح المقالات
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