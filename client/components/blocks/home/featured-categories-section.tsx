"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { getStrapiMedia } from '@/components/custom/strapi-image';

interface FeaturedCategoriesSectionData {
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  categories?: Category[];
  maxCategories?: number;
  articlesPerCategory?: number;
  layout?: 'grid' | 'carousel' | 'list';
  showCategoryDescription?: boolean;
  showArticleCount?: boolean;
  backgroundStyle?: 'white' | 'gray' | 'gradient';
}

interface FeaturedCategoriesSectionProps {
  data: FeaturedCategoriesSectionData;
}

export function FeaturedCategoriesSection({ data }: FeaturedCategoriesSectionProps) {
  const {
    title = "التصنيفات المميزة",
    subtitle,
    showTitle = true,
    categories = [],
    maxCategories = 6,
    layout = 'grid',
    showCategoryDescription = false,
    showArticleCount = true,
    backgroundStyle = 'white',
  } = data;

  const displayCategories = categories.slice(0, maxCategories);

  const getBackgroundClass = () => {
    switch (backgroundStyle) {
      case 'gray':
        return 'bg-gray-50';
      case 'gradient':
        return 'bg-gradient-to-br from-gray-50 via-white to-gray-50';
      default:
        return 'bg-white';
    }
  };

  const getGridClass = () => {
    switch (layout) {
      case 'list':
        return 'grid-cols-1';
      case 'carousel':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 overflow-x-auto';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (!displayCategories.length) {
    return (
      <section className={`py-16 ${getBackgroundClass()}`}>
        <div className="max-w-screen-xl mx-auto px-5">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m0 0h14" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد تصنيفات متاحة</h3>
            <p className="text-gray-500">يرجى إضافة التصنيفات من لوحة الإدارة</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${getBackgroundClass()}`} aria-label="featured-categories-section">
      <div className="max-w-screen-xl mx-auto px-5">
        {/* Section Header */}
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Categories Grid */}
        <div className={`grid ${getGridClass()} gap-6`}>
          {displayCategories.map((category) => (
            <div
              key={category.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Category Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    <Link href={`/categories/${category.slug}`}>
                      {category.name}
                    </Link>
                  </h3>
                  {showArticleCount && category.articles && (
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {category.articles.length} مقال
                    </span>
                  )}
                </div>

                {showCategoryDescription && category.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Latest Articles from Category */}
              <div className="p-6">
                {category.articles && category.articles.length > 0 ? (
                  <div className="space-y-4">
                    {category.articles.slice(0, 3).map((article) => (
                      <article key={article.id} className="group/article">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="flex gap-3 items-start hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          {/* Article Thumbnail */}
                          {article.cover_image && getStrapiMedia(article.cover_image.url) ? (
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                alt={article.cover_image.alternativeText || article.title}
                                loading="lazy"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-lg"
                                src={getStrapiMedia(article.cover_image.url)!}
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}

                          {/* Article Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 group-hover/article:text-primary transition-colors line-clamp-2 mb-1">
                              {article.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {new Date(article.publishedAt).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm">لا توجد مقالات</p>
                  </div>
                )}

                {/* View All Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    عرض جميع المقالات
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Categories */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            عرض جميع التصنيفات
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
